'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  FormSection,
  FormField,
  FormActions,
  Select,
  DatePicker,
  CurrencyInput,
  Textarea,
  Alert,
} from '@acts29/admin-ui';

type DonationType = 'monetary' | 'goods' | 'time';

export default function NewDonationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    type: 'monetary' as DonationType,
    amount: 0,
    description: '',
    donorName: '',
    donorEmail: '',
    isAnonymous: false,
    coverFees: true,
    date: new Date().toISOString().split('T')[0],
    // Goods specific
    category: '',
    quantity: '',
    estimatedValue: 0,
    // Time specific
    hoursOffered: 0,
    skills: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => router.push('/admin/donations'), 1500);
    } catch {
      setError('Failed to record donation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const feeAmount = formData.coverFees ? formData.amount * 0.05 : 0;
  const totalAmount = formData.amount + feeAmount;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Donations', href: '/admin/donations' },
          { label: 'Record Donation' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Record New Donation</h1>
        <p className="mt-1 text-sm text-gray-600">
          Record a new donation from a donor or anonymous contributor
        </p>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          Donation recorded successfully! Redirecting...
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-xl border bg-white p-6">
          <FormSection title="Donation Type" description="Select the type of donation being made">
            <Select
              label="Donation Type"
              options={[
                { value: 'monetary', label: 'Monetary Donation' },
                { value: 'goods', label: 'Goods / In-Kind Donation' },
                { value: 'time', label: 'Time / Volunteer Hours' },
              ]}
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value as DonationType })}
            />
          </FormSection>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <FormSection title="Donor Information" description="Enter the donor's contact information">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600"
              />
              <label htmlFor="isAnonymous" className="text-sm text-gray-700">
                Anonymous donation
              </label>
            </div>

            {!formData.isAnonymous && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Donor Name">
                  <input
                    type="text"
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    placeholder="John Doe"
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </FormField>
                <FormField label="Donor Email">
                  <input
                    type="email"
                    value={formData.donorEmail}
                    onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                    placeholder="john@example.com"
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </FormField>
              </div>
            )}

            <DatePicker
              label="Donation Date"
              value={formData.date}
              onChange={(value) => setFormData({ ...formData, date: value })}
              max={new Date().toISOString().split('T')[0]}
            />
          </FormSection>
        </div>

        {/* Monetary Donation Fields */}
        {formData.type === 'monetary' && (
          <div className="rounded-xl border bg-white p-6">
            <FormSection title="Donation Amount" description="Enter the monetary donation details">
              <CurrencyInput
                label="Donation Amount"
                value={formData.amount}
                onChange={(value) => setFormData({ ...formData, amount: value })}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="coverFees"
                  checked={formData.coverFees}
                  onChange={(e) => setFormData({ ...formData, coverFees: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600"
                />
                <label htmlFor="coverFees" className="text-sm text-gray-700">
                  Donor covered processing fees (5%)
                </label>
              </div>

              {formData.amount > 0 && (
                <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Donation Amount</span>
                    <span className="font-medium">${formData.amount.toFixed(2)}</span>
                  </div>
                  {formData.coverFees && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Processing Fee (5%)</span>
                      <span className="font-medium">${feeAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold border-t pt-2">
                    <span>Total Received</span>
                    <span className="text-primary-600">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Textarea
                label="Notes / Purpose"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter any notes about the donation purpose..."
                rows={3}
              />
            </FormSection>
          </div>
        )}

        {/* Goods Donation Fields */}
        {formData.type === 'goods' && (
          <div className="rounded-xl border bg-white p-6">
            <FormSection title="Goods Details" description="Describe the donated items">
              <Select
                label="Category"
                options={[
                  { value: 'clothing', label: 'Clothing' },
                  { value: 'food', label: 'Food' },
                  { value: 'household', label: 'Household Items' },
                  { value: 'toys', label: 'Toys / Games' },
                  { value: 'electronics', label: 'Electronics' },
                  { value: 'furniture', label: 'Furniture' },
                  { value: 'other', label: 'Other' },
                ]}
                value={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
              />

              <FormField label="Quantity">
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g., 50 coats, 3 boxes"
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </FormField>

              <CurrencyInput
                label="Estimated Value (for tax purposes)"
                value={formData.estimatedValue}
                onChange={(value) => setFormData({ ...formData, estimatedValue: value })}
              />

              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the donated items in detail..."
                rows={3}
              />
            </FormSection>
          </div>
        )}

        {/* Time Donation Fields */}
        {formData.type === 'time' && (
          <div className="rounded-xl border bg-white p-6">
            <FormSection title="Volunteer Time" description="Record volunteer hours offered">
              <FormField label="Hours Offered">
                <input
                  type="number"
                  value={formData.hoursOffered}
                  onChange={(e) =>
                    setFormData({ ...formData, hoursOffered: parseFloat(e.target.value) || 0 })
                  }
                  min={0}
                  step={0.5}
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </FormField>

              <FormField label="Skills / Services Provided">
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g., Meal service, tutoring, transportation"
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </FormField>

              <Textarea
                label="Notes"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Any additional details about the volunteer work..."
                rows={3}
              />
            </FormSection>
          </div>
        )}

        <FormActions>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            Record Donation
          </Button>
        </FormActions>
      </form>
    </div>
  );
}
