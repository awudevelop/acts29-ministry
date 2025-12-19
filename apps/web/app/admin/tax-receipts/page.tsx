'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  StatCard,
  formatCurrency,
  formatDate,
} from '@acts29/admin-ui';
import { FileText, Mail, Calendar, Users, DollarSign, ArrowRight } from 'lucide-react';
import { mockDonations, mockProfiles } from '@acts29/database';

export default function TaxReceiptsPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  // Calculate stats
  const yearDonations = mockDonations.filter(
    (d) => new Date(d.created_at).getFullYear() === selectedYear && d.status === 'completed'
  );

  const monetaryDonations = yearDonations.filter((d) => d.type === 'monetary');
  const totalAmount = monetaryDonations.reduce((sum, d) => sum + (d.amount ?? 0), 0);

  // Get unique donors
  const uniqueDonorIds = new Set(yearDonations.filter((d) => d.donor_id).map((d) => d.donor_id));
  const registeredDonors = mockProfiles.filter((p) => uniqueDonorIds.has(p.id));
  const anonymousDonations = yearDonations.filter((d) => !d.donor_id);

  const years = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Tax Receipts' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Receipts</h1>
          <p className="mt-1 text-sm text-gray-600">
            Generate donation receipts for tax purposes
          </p>
        </div>
        <div className="flex gap-3">
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
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Donations"
          value={formatCurrency(totalAmount)}
          icon={DollarSign}
        />
        <StatCard
          title="Total Receipts Needed"
          value={yearDonations.length}
          icon={FileText}
        />
        <StatCard
          title="Registered Donors"
          value={registeredDonors.length}
          icon={Users}
        />
        <StatCard
          title="Anonymous Donations"
          value={anonymousDonations.length}
          icon={Calendar}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Individual Receipts */}
        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary-100 p-3">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Individual Donation Receipts
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Generate a receipt for a specific donation. Useful for one-time or special
                contributions.
              </p>
              <div className="mt-4 flex gap-3">
                <Link href="/admin/tax-receipts/generate">
                  <Button>
                    Generate Receipt
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Year-End Statements */}
        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-green-100 p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Year-End Statements
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Generate comprehensive annual contribution statements for all donors for the
                selected tax year.
              </p>
              <div className="mt-4 flex gap-3">
                <Link href={`/admin/tax-receipts/year-end?year=${selectedYear}`}>
                  <Button>
                    Generate {selectedYear} Statements
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Donations Needing Receipts */}
      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-semibold text-gray-900">
            Recent Donations ({selectedYear})
          </h3>
          <Link
            href="/admin/donations"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View All Donations
          </Link>
        </div>
        <div className="divide-y">
          {yearDonations.slice(0, 10).map((donation) => {
            const donor = donation.donor_id
              ? mockProfiles.find((p) => p.id === donation.donor_id)
              : null;

            return (
              <div
                key={donation.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-gray-900">
                      {donation.type === 'monetary'
                        ? formatCurrency(donation.amount ?? 0)
                        : donation.type === 'goods'
                        ? 'Goods'
                        : 'Time'}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        donation.type === 'monetary'
                          ? 'bg-green-100 text-green-800'
                          : donation.type === 'goods'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {donation.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {donor
                      ? `${donor.first_name} ${donor.last_name}`
                      : 'Anonymous'}{' '}
                    • {formatDate(donation.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/tax-receipts/generate?donation=${donation.id}`}>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-1 h-4 w-4" />
                      Receipt
                    </Button>
                  </Link>
                  {donor && (
                    <Button variant="outline" size="sm">
                      <Mail className="mr-1 h-4 w-4" />
                      Email
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {yearDonations.length === 0 && (
            <div className="px-6 py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">No donations found for {selectedYear}</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-xl border bg-gray-50 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Tax Receipt Guidelines</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            Individual receipts should be generated for donations over $250 per IRS requirements.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            Year-end statements provide a comprehensive summary of all donations for a tax year.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            Receipts include your organization&apos;s EIN and a statement that no goods or services were provided in exchange.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            Donors can use these receipts for their tax filings. Encourage them to consult their tax advisor.
          </li>
        </ul>
      </div>
    </div>
  );
}
