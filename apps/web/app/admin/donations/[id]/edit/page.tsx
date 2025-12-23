'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  FormSection,
  Input,
  Textarea,
  Select,
  Alert,
  formatCurrency,
} from '@acts29/admin-ui';
import { ArrowLeft, Save } from 'lucide-react';
import { mockDonations, mockProfiles, type DonationType } from '@acts29/database';

const donationTypeOptions = [
  { value: 'monetary', label: 'Monetary' },
  { value: 'goods', label: 'Goods' },
  { value: 'time', label: 'Time/Service' },
];

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

interface FormData {
  type: DonationType;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: string;
  description: string;
  donorId: string;
  coverFees: boolean;
  feePercentage: string;
}

export default function EditDonationPage() {
  const params = useParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const donation = mockDonations.find((d) => d.id === params.id);

  const donorOptions = [
    { value: '', label: 'Anonymous Donor' },
    ...mockProfiles.map((p) => ({
      value: p.id,
      label: `${p.first_name} ${p.last_name}`,
    })),
  ];

  const [formData, setFormData] = React.useState<FormData>(() => {
    if (!donation) {
      return {
        type: 'monetary',
        status: 'pending',
        amount: '',
        description: '',
        donorId: '',
        coverFees: false,
        feePercentage: '5',
      };
    }

    return {
      type: donation.type,
      status: donation.status,
      amount: donation.amount?.toString() || '',
      description: donation.description || '',
      donorId: donation.donor_id || '',
      coverFees: donation.cover_fees,
      feePercentage: donation.fee_percentage.toString(),
    };
  });

  // Calculate fee amount and total
  const amount = parseFloat(formData.amount) || 0;
  const feePercentage = parseFloat(formData.feePercentage) || 0;
  const feeAmount = formData.coverFees ? amount * (feePercentage / 100) : 0;
  const totalAmount = amount + feeAmount;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Validate for monetary donations
      if (formData.type === 'monetary' && !formData.amount) {
        throw new Error('Amount is required for monetary donations');
      }

      // In a real app, this would call the update API
      console.log('Updating donation:', {
        id: donation.id,
        type: formData.type,
        status: formData.status,
        amount: formData.type === 'monetary' ? parseFloat(formData.amount) : null,
        description: formData.description,
        donor_id: formData.donorId || null,
        cover_fees: formData.coverFees,
        fee_percentage: parseFloat(formData.feePercentage),
        fee_amount: feeAmount,
        total_amount: totalAmount,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('Donation updated successfully!');
      setTimeout(() => {
        router.push(`/admin/donations/${donation.id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update donation');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Donations', href: '/admin/donations' },
          { label: `Donation #${donation.id.slice(0, 8)}`, href: `/admin/donations/${donation.id}` },
          { label: 'Edit' },
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Donation</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update donation record #{donation.id.slice(0, 8)}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donation Details */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Donation Details"
                description="Basic information about the donation"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="Donation Type"
                    options={donationTypeOptions}
                    value={formData.type}
                    onChange={(value) => updateField('type', value as DonationType)}
                  />
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(value) => updateField('status', value as FormData['status'])}
                  />
                  <div className="sm:col-span-2">
                    <Textarea
                      label="Description"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows={3}
                      placeholder="Describe the donation..."
                    />
                  </div>
                </div>
              </FormSection>
            </div>

            {/* Monetary Details */}
            {formData.type === 'monetary' && (
              <div className="rounded-xl border bg-white p-6">
                <FormSection
                  title="Payment Details"
                  description="Amount and fee information"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Amount ($)"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => updateField('amount', e.target.value)}
                      required
                      placeholder="0.00"
                    />
                    <Input
                      label="Fee Percentage (%)"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.feePercentage}
                      onChange={(e) => updateField('feePercentage', e.target.value)}
                      placeholder="5"
                    />
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="coverFees"
                        checked={formData.coverFees}
                        onChange={(e) => updateField('coverFees', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600"
                      />
                      <label htmlFor="coverFees" className="text-sm font-medium text-gray-700">
                        Donor covers processing fees
                      </label>
                    </div>
                  </div>

                  {/* Calculated Totals */}
                  <div className="mt-6 pt-4 border-t">
                    <dl className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-600">Base Amount</dt>
                        <dd className="font-medium">{formatCurrency(amount)}</dd>
                      </div>
                      {formData.coverFees && (
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-600">Fee Coverage ({feePercentage}%)</dt>
                          <dd className="font-medium">{formatCurrency(feeAmount)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <dt>Total</dt>
                        <dd className="text-primary-600">{formatCurrency(totalAmount)}</dd>
                      </div>
                    </dl>
                  </div>
                </FormSection>
              </div>
            )}

            {/* Donor Information */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Donor Information"
                description="Link to an existing donor profile"
              >
                <Select
                  label="Donor"
                  options={donorOptions}
                  value={formData.donorId}
                  onChange={(value) => updateField('donorId', value)}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Leave empty for anonymous donations. Selecting a donor allows sending receipts.
                </p>
              </FormSection>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button type="submit" className="w-full" loading={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Link href={`/admin/donations/${donation.id}`} className="block">
                  <Button variant="outline" className="w-full" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>

            {/* Record Info */}
            <div className="rounded-xl border bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Record Info</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Donation ID</dt>
                  <dd className="font-mono text-gray-600">{donation.id.slice(0, 8)}...</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-900">
                    {new Date(donation.created_at).toLocaleDateString()}
                  </dd>
                </div>
                {donation.stripe_payment_intent_id && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Stripe ID</dt>
                    <dd className="font-mono text-xs text-gray-600 truncate max-w-[100px]">
                      {donation.stripe_payment_intent_id}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Warning */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="font-semibold text-amber-800 mb-2">Note</h3>
              <p className="text-sm text-amber-700">
                Editing donation records may affect tax reporting and financial reconciliation.
                Ensure changes are properly documented.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
