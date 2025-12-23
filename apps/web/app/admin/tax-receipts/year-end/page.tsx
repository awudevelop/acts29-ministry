'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  Alert,
  formatCurrency,
} from '@acts29/admin-ui';
import { FileText, Download, Mail, Check, ArrowLeft, Users, Calendar, Loader2, Send } from 'lucide-react';
import { mockDonations, mockProfiles, mockOrganizations } from '@acts29/database';

interface DonorSummary {
  id: string;
  name: string;
  email: string;
  donationCount: number;
  totalAmount: number;
  donations: typeof mockDonations;
  selected: boolean;
  generated: boolean;
  emailed: boolean;
}

export default function YearEndStatementsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const yearParam = searchParams.get('year');
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(
    yearParam ? parseInt(yearParam) : currentYear
  );

  const [donorSummaries, setDonorSummaries] = React.useState<DonorSummary[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [emailProgress, setEmailProgress] = React.useState(0);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const organization = mockOrganizations[0]!;
  const years = [currentYear, currentYear - 1, currentYear - 2];

  // Calculate donor summaries
  React.useEffect(() => {
    const yearDonations = mockDonations.filter(
      (d) =>
        new Date(d.created_at).getFullYear() === selectedYear &&
        d.status === 'completed' &&
        d.donor_id // Only registered donors for year-end statements
    );

    // Group by donor
    const donorMap = new Map<string, DonorSummary>();

    yearDonations.forEach((donation) => {
      if (!donation.donor_id) return;

      const donor = mockProfiles.find((p) => p.id === donation.donor_id);
      if (!donor) return;

      const existing = donorMap.get(donation.donor_id);
      const amount =
        donation.type === 'monetary'
          ? donation.total_amount ?? donation.amount ?? 0
          : 0;

      if (existing) {
        existing.donationCount++;
        existing.totalAmount += amount;
        existing.donations.push(donation);
      } else {
        // Generate mock email from donor name
        const mockEmail = `${donor.first_name.toLowerCase()}.${donor.last_name.toLowerCase()}@example.com`;
        donorMap.set(donation.donor_id, {
          id: donation.donor_id,
          name: `${donor.first_name} ${donor.last_name}`,
          email: mockEmail,
          donationCount: 1,
          totalAmount: amount,
          donations: [donation],
          selected: true,
          generated: false,
          emailed: false,
        });
      }
    });

    setDonorSummaries(Array.from(donorMap.values()));
  }, [selectedYear]);

  const selectedCount = donorSummaries.filter((d) => d.selected).length;
  const totalAmount = donorSummaries
    .filter((d) => d.selected)
    .reduce((sum, d) => sum + d.totalAmount, 0);

  const toggleDonor = (id: string) => {
    setDonorSummaries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, selected: !d.selected } : d))
    );
  };

  const toggleAll = (selected: boolean) => {
    setDonorSummaries((prev) => prev.map((d) => ({ ...d, selected })));
  };

  const handleGenerateAll = async () => {
    const selected = donorSummaries.filter((d) => d.selected);
    if (selected.length === 0) return;

    setIsGenerating(true);
    setProgress(0);
    setError(null);

    try {
      for (let i = 0; i < selected.length; i++) {
        // Simulate generating each statement
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProgress(((i + 1) / selected.length) * 100);

        setDonorSummaries((prev) =>
          prev.map((d) => (d.id === selected[i]!.id ? { ...d, generated: true } : d))
        );
      }

      setSuccess(`Successfully generated ${selected.length} year-end statements!`);
    } catch {
      setError('Failed to generate statements. Please try again.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleEmailAll = async () => {
    const selected = donorSummaries.filter((d) => d.selected && d.generated);
    if (selected.length === 0) {
      setError('Please generate statements first before sending emails.');
      return;
    }

    setIsSending(true);
    setEmailProgress(0);
    setError(null);

    try {
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < selected.length; i++) {
        const donor = selected[i]!;

        try {
          const response = await fetch('/api/receipts/annual', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              donorEmail: donor.email,
              donorName: donor.name,
              organization: {
                name: organization.name,
                address: organization.address,
                phone: organization.phone,
                email: organization.email || 'info@acts29ministry.org',
                ein: '47-1234567',
              },
              donations: donor.donations,
              taxYear: selectedYear,
            }),
          });

          if (response.ok) {
            successCount++;
            setDonorSummaries((prev) =>
              prev.map((d) => (d.id === donor.id ? { ...d, emailed: true } : d))
            );
          } else {
            failCount++;
          }
        } catch {
          failCount++;
        }

        setEmailProgress(((i + 1) / selected.length) * 100);
      }

      if (failCount === 0) {
        setSuccess(`Successfully emailed ${successCount} year-end statements!`);
      } else {
        setSuccess(`Sent ${successCount} emails. ${failCount} failed.`);
      }
    } catch {
      setError('Failed to send emails. Please try again.');
    } finally {
      setIsSending(false);
      setEmailProgress(0);
    }
  };

  const handleEmailSingle = async (donor: DonorSummary) => {
    if (!donor.generated) {
      setError('Please generate the statement first before sending email.');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch('/api/receipts/annual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorEmail: donor.email,
          donorName: donor.name,
          organization: {
            name: organization.name,
            address: organization.address,
            phone: organization.phone,
            email: organization.email || 'info@acts29ministry.org',
            ein: '47-1234567',
          },
          donations: donor.donations,
          taxYear: selectedYear,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setDonorSummaries((prev) =>
        prev.map((d) => (d.id === donor.id ? { ...d, emailed: true } : d))
      );
      setSuccess(`Statement sent to ${donor.name} (${donor.email})!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Tax Receipts', href: '/admin/tax-receipts' },
          { label: 'Year-End Statements' },
        ]}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Year-End Statements</h1>
          <p className="mt-1 text-sm text-gray-600">
            Generate comprehensive annual contribution statements for all donors
          </p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary-100 p-2">
              <Users className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Donors Selected</p>
              <p className="text-2xl font-bold">
                {selectedCount} / {donorSummaries.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tax Year</p>
              <p className="text-2xl font-bold">{selectedYear}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {(isGenerating || isSending) && (
        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-center gap-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>{isGenerating ? 'Generating statements...' : 'Sending emails...'}</span>
                <span>{Math.round(isGenerating ? progress : emailProgress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${isGenerating ? progress : emailProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Donor List */}
      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={donorSummaries.length > 0 && donorSummaries.every((d) => d.selected)}
              onChange={(e) => toggleAll(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600"
            />
            <span className="font-semibold text-gray-900">Donors with {selectedYear} Donations</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleGenerateAll}
              loading={isGenerating}
              disabled={selectedCount === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Generate Selected ({selectedCount})
            </Button>
            <Button
              onClick={handleEmailAll}
              loading={isSending}
              disabled={donorSummaries.filter((d) => d.selected && d.generated).length === 0}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Generated
            </Button>
          </div>
        </div>

        {donorSummaries.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">
              No registered donors with donations in {selectedYear}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {donorSummaries.map((donor) => (
              <div
                key={donor.id}
                className={`flex items-center justify-between px-6 py-4 ${
                  donor.selected ? 'bg-primary-50/30' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={donor.selected}
                    onChange={() => toggleDonor(donor.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{donor.name}</p>
                    <p className="text-sm text-gray-500">
                      {donor.donationCount} donation{donor.donationCount !== 1 ? 's' : ''} •{' '}
                      {formatCurrency(donor.totalAmount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {donor.emailed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      <Send className="h-3 w-3" />
                      Emailed
                    </span>
                  )}
                  {donor.generated && !donor.emailed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      <Check className="h-3 w-3" />
                      Generated
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // View/download individual statement
                      }}
                      title="View Statement"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    {donor.generated && !donor.emailed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEmailSingle(donor)}
                        disabled={isSending}
                        title={`Email to ${donor.email}`}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="rounded-xl border bg-gray-50 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">About Year-End Statements</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            Year-end statements include all completed donations for the selected tax year.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            Statements are only generated for registered donors (not anonymous donations).
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            Each statement includes a summary of monetary and in-kind donations.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            Donors receive statements via email with PDF attachments.
          </li>
        </ul>
      </div>
    </div>
  );
}
