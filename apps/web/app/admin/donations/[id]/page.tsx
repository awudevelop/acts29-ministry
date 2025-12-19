'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  DonationStatusBadge,
  DonationTypeBadge,
  ConfirmDialog,
  formatCurrency,
  formatDate,
  formatDateTime,
} from '@acts29/admin-ui';
import { Edit, Trash2, FileText, Mail, ArrowLeft, User, Calendar, DollarSign } from 'lucide-react';
import { mockDonations, mockProfiles } from '@acts29/database';

export default function DonationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const donation = mockDonations.find((d) => d.id === params.id);
  const donor = donation?.donor_id
    ? mockProfiles.find((p) => p.id === donation.donor_id)
    : null;

  if (!donation) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Donations', href: '/admin/donations' },
            { label: 'Not Found' },
          ]}
        />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Donation Not Found</h1>
          <p className="mt-2 text-gray-600">The donation you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/donations">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Donations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    // In a real app, this would call the delete API
    console.log('Deleting donation:', donation.id);
    setDeleteDialogOpen(false);
    router.push('/admin/donations');
  };

  const handleGenerateReceipt = () => {
    router.push(`/admin/tax-receipts/generate?donation=${donation.id}`);
  };

  const handleSendReceipt = () => {
    // In a real app, this would send the receipt via email
    alert('Receipt sent to donor!');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Donations', href: '/admin/donations' },
          { label: `Donation #${donation.id.slice(0, 8)}` },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {donation.type === 'monetary'
                ? formatCurrency(donation.amount ?? 0)
                : donation.type === 'goods'
                ? 'Goods Donation'
                : 'Time Donation'}
            </h1>
            <DonationStatusBadge status={donation.status} />
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Recorded on {formatDateTime(donation.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleGenerateReceipt}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Receipt
          </Button>
          {donor && (
            <Button variant="outline" onClick={handleSendReceipt}>
              <Mail className="mr-2 h-4 w-4" />
              Send Receipt
            </Button>
          )}
          <Link href={`/admin/donations/${donation.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Donation Information */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Donation Information</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">Type</dt>
                <dd className="mt-1">
                  <DonationTypeBadge type={donation.type} />
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Status</dt>
                <dd className="mt-1">
                  <DonationStatusBadge status={donation.status} />
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Date</dt>
                <dd className="mt-1 font-medium text-gray-900">
                  {formatDate(donation.created_at)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Donation ID</dt>
                <dd className="mt-1 font-mono text-sm text-gray-600">{donation.id}</dd>
              </div>
            </dl>
          </div>

          {/* Amount Details */}
          {donation.type === 'monetary' && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Base Amount</dt>
                  <dd className="font-medium">{formatCurrency(donation.amount ?? 0)}</dd>
                </div>
                {donation.cover_fees && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">
                      Processing Fee Coverage ({donation.fee_percentage}%)
                    </dt>
                    <dd className="font-medium">
                      {formatCurrency(donation.fee_amount ?? 0)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between border-t pt-3">
                  <dt className="font-semibold text-gray-900">Total Received</dt>
                  <dd className="text-lg font-bold text-primary-600">
                    {formatCurrency(donation.total_amount ?? donation.amount ?? 0)}
                  </dd>
                </div>
              </dl>
              {donation.stripe_payment_intent_id && (
                <div className="mt-4 pt-4 border-t">
                  <dt className="text-sm text-gray-500">Payment Reference</dt>
                  <dd className="mt-1 font-mono text-sm text-gray-600">
                    {donation.stripe_payment_intent_id}
                  </dd>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {donation.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Donor Information */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Donor</h2>
            {donor ? (
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-medium">
                  {donor.first_name?.[0]}
                  {donor.last_name?.[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {donor.first_name} {donor.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{donor.phone}</p>
                  <Link
                    href={`/admin/users/${donor.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-500">
                <User className="h-5 w-5" />
                <span>Anonymous Donor</span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fee Coverage</p>
                  <p className="font-medium">
                    {donation.cover_fees ? 'Donor covered fees' : 'Standard processing'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tax Year</p>
                  <p className="font-medium">
                    {new Date(donation.created_at).getFullYear()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Receipt Status</p>
                  <p className="font-medium">
                    {/* In a real app, check if receipt was generated */}
                    Not Generated
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Donation"
        description="Are you sure you want to delete this donation? This action cannot be undone and will affect reporting and tax records."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
