'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  FormSection,
  Select,
  Alert,
  formatCurrency,
  formatDate,
} from '@acts29/admin-ui';
import { Download, Mail, ArrowLeft } from 'lucide-react';
import { mockDonations, mockProfiles, mockOrganizations } from '@acts29/database';

export default function GenerateReceiptPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const donationId = searchParams.get('donation');

  const [selectedDonationId, setSelectedDonationId] = React.useState(donationId ?? '');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const selectedDonation = mockDonations.find((d) => d.id === selectedDonationId);
  const donor = selectedDonation?.donor_id
    ? mockProfiles.find((p) => p.id === selectedDonation.donor_id)
    : null;
  const organization = mockOrganizations[0]!; // Use first org for demo

  // Get donation options
  const donationOptions = mockDonations
    .filter((d) => d.status === 'completed')
    .map((d) => {
      const donorProfile = d.donor_id
        ? mockProfiles.find((p) => p.id === d.donor_id)
        : null;
      const donorName = donorProfile
        ? `${donorProfile.first_name} ${donorProfile.last_name}`
        : 'Anonymous';

      return {
        value: d.id,
        label: `${formatDate(d.created_at)} - ${
          d.type === 'monetary' ? formatCurrency(d.amount ?? 0) : d.type
        } (${donorName})`,
      };
    });

  const handleGenerate = async () => {
    if (!selectedDonation) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Simulate PDF generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, this would:
      // 1. Call an API to generate the PDF using @acts29/pdf-service
      // 2. Store the PDF in Supabase Storage
      // 3. Return a download URL

      // For demo, create a simple text representation
      const receiptContent = `
DONATION RECEIPT
================

${organization.name}
${organization.address}
Phone: ${organization.phone}
EIN: 47-1234567

Receipt Number: RCP-${Date.now().toString(36).toUpperCase()}
Date Generated: ${formatDate(new Date().toISOString())}

DONOR INFORMATION
-----------------
Name: ${donor ? `${donor.first_name} ${donor.last_name}` : 'Anonymous Donor'}
${donor?.phone ? `Phone: ${donor.phone}` : ''}

DONATION DETAILS
----------------
Date: ${formatDate(selectedDonation.created_at)}
Type: ${selectedDonation.type}
${selectedDonation.type === 'monetary' ? `Amount: ${formatCurrency(selectedDonation.amount ?? 0)}` : ''}
${selectedDonation.cover_fees ? `Fee Coverage: ${formatCurrency(selectedDonation.fee_amount ?? 0)}` : ''}
${selectedDonation.total_amount ? `Total: ${formatCurrency(selectedDonation.total_amount)}` : ''}

Description: ${selectedDonation.description || 'N/A'}

TAX DEDUCTIBILITY STATEMENT
---------------------------
${organization.name} is a tax-exempt organization under Section 501(c)(3)
of the Internal Revenue Code. No goods or services were provided in
exchange for this contribution, making it fully tax-deductible to the
extent allowed by law.

Thank you for your generous support!
      `.trim();

      // Download as text file (in real app, this would be PDF)
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${selectedDonation.id.slice(0, 8)}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      setSuccess('Receipt generated and downloaded successfully!');
    } catch {
      setError('Failed to generate receipt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedDonation || !donor) return;

    setIsSending(true);
    setError(null);

    try {
      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(`Receipt sent to ${donor.first_name} ${donor.last_name}!`);
    } catch {
      setError('Failed to send receipt. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Tax Receipts', href: '/admin/tax-receipts' },
          { label: 'Generate Receipt' },
        ]}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generate Donation Receipt</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create a tax-deductible donation receipt for a specific contribution
          </p>
        </div>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Selection Form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-white p-6">
            <FormSection
              title="Select Donation"
              description="Choose the donation you want to generate a receipt for"
            >
              <Select
                label="Donation"
                options={donationOptions}
                value={selectedDonationId}
                onChange={setSelectedDonationId}
                placeholder="Select a donation..."
              />
            </FormSection>
          </div>

          {/* Preview */}
          {selectedDonation && (
            <div className="mt-6 rounded-xl border bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Receipt Preview</h3>

              <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 bg-gray-50">
                {/* Fake receipt preview */}
                <div className="text-center border-b pb-4 mb-4">
                  <h4 className="text-xl font-bold text-primary-600">{organization.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{organization.address}</p>
                  <p className="text-sm text-gray-600">EIN: 47-1234567</p>
                </div>

                <h5 className="text-center text-lg font-semibold mb-4">DONATION RECEIPT</h5>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Receipt Number:</span>
                    <span className="font-mono">RCP-{selectedDonation.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span>{formatDate(selectedDonation.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Donor:</span>
                    <span>
                      {donor
                        ? `${donor.first_name} ${donor.last_name}`
                        : 'Anonymous Donor'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="capitalize">{selectedDonation.type}</span>
                  </div>
                  {selectedDonation.type === 'monetary' && (
                    <>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600">Donation Amount:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedDonation.amount ?? 0)}
                        </span>
                      </div>
                      {selectedDonation.cover_fees && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fee Coverage:</span>
                          <span>{formatCurrency(selectedDonation.fee_amount ?? 0)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg border-t pt-3">
                        <span>Total Contribution:</span>
                        <span className="text-primary-600">
                          {formatCurrency(
                            selectedDonation.total_amount ?? selectedDonation.amount ?? 0
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 p-3 bg-gray-100 rounded text-xs text-gray-600">
                  No goods or services were provided in exchange for this contribution,
                  making it fully tax-deductible to the extent allowed by law.
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={handleGenerate} loading={isGenerating}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
                {donor && (
                  <Button
                    variant="outline"
                    onClick={handleSendEmail}
                    loading={isSending}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email to Donor
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organization Info */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Organization Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium">{organization.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Address</dt>
                <dd className="font-medium">{organization.address}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="font-medium">{organization.phone}</dd>
              </div>
              <div>
                <dt className="text-gray-500">EIN</dt>
                <dd className="font-mono font-medium">47-1234567</dd>
              </div>
            </dl>
          </div>

          {/* Help */}
          <div className="rounded-xl border bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Receipt Information</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Receipts are generated in PDF format</li>
              <li>• Each receipt includes a unique reference number</li>
              <li>• Receipts include IRS-required tax deductibility statements</li>
              <li>• Email receipts are sent from your organization&apos;s email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
