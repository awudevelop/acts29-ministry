'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import { Breadcrumbs } from '@acts29/admin-ui';
import {
  Save,
  ArrowLeft,
  QrCode,
  DollarSign,
  CreditCard,
  Building2,
  Info,
} from 'lucide-react';

export default function NewPaymentLinkPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form state
  const [description, setDescription] = React.useState('');
  const [shortCode, setShortCode] = React.useState('');
  const [amountType, setAmountType] = React.useState<'flexible' | 'fixed'>('flexible');
  const [fixedAmount, setFixedAmount] = React.useState('');
  const [allowCard, setAllowCard] = React.useState(true);
  const [allowAch, setAllowAch] = React.useState(true);
  const [coverFeesOption, setCoverFeesOption] = React.useState<'donor_choice' | 'always' | 'never'>(
    'donor_choice'
  );

  // Generate short code from description
  React.useEffect(() => {
    if (description && !shortCode) {
      const generated = description
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, '')
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.slice(0, 4))
        .join('')
        .slice(0, 8);
      setShortCode(generated || 'GIVE');
    }
  }, [description, shortCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Call HelloPayments API to create payment link
    console.log('Creating payment link:', {
      description,
      shortCode,
      amount: amountType === 'fixed' ? parseInt(fixedAmount, 10) * 100 : null,
      allowedPaymentMethods: [
        ...(allowCard ? ['card'] : []),
        ...(allowAch ? ['ach'] : []),
      ],
      coverFeesOption,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push('/admin/donations/payment-links');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Donations', href: '/admin/donations' },
          { label: 'Payment Links', href: '/admin/donations/payment-links' },
          { label: 'New Link' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/donations/payment-links"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Payment Link</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create a shareable link and QR code for donations
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

              <div className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="e.g., General Donation, Shelter Fund, Easter Campaign"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This will be shown to donors on the payment page
                  </p>
                </div>

                <div>
                  <label htmlFor="shortCode" className="block text-sm font-medium text-gray-700">
                    Short Code
                  </label>
                  <div className="mt-1 flex rounded-lg overflow-hidden border border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20">
                    <span className="bg-gray-50 px-3 py-2 text-gray-500 text-sm border-r border-gray-300">
                      acts29.org/donate/
                    </span>
                    <input
                      type="text"
                      id="shortCode"
                      value={shortCode}
                      onChange={(e) =>
                        setShortCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
                      }
                      maxLength={12}
                      placeholder="GIVE2024"
                      className="flex-1 px-3 py-2 outline-none"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Letters and numbers only. Auto-generated from description.
                  </p>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Donation Amount</h2>

              <div className="mt-4 space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="amountType"
                      checked={amountType === 'flexible'}
                      onChange={() => setAmountType('flexible')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Flexible (donor chooses)
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="amountType"
                      checked={amountType === 'fixed'}
                      onChange={() => setAmountType('fixed')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Fixed amount</span>
                  </label>
                </div>

                {amountType === 'fixed' && (
                  <div className="relative max-w-xs">
                    <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      value={fixedAmount}
                      onChange={(e) => setFixedAmount(e.target.value)}
                      placeholder="50"
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
              <p className="mt-1 text-sm text-gray-600">
                Select which payment methods donors can use
              </p>

              <div className="mt-4 space-y-3">
                <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={allowCard}
                    onChange={(e) => setAllowCard(e.target.checked)}
                    className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Credit/Debit Card</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">5% processing fee</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-lg border-2 border-green-200 bg-green-50 p-4 cursor-pointer hover:bg-green-100">
                  <input
                    type="checkbox"
                    checked={allowAch}
                    onChange={(e) => setAllowAch(e.target.checked)}
                    className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Bank Transfer (ACH)</span>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Recommended
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">Only 1% fee (max $5)</p>
                  </div>
                </label>
              </div>

              {!allowCard && !allowAch && (
                <p className="mt-3 text-sm text-red-600">
                  Please select at least one payment method
                </p>
              )}
            </div>

            {/* Fee Coverage */}
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Fee Coverage</h2>
              <p className="mt-1 text-sm text-gray-600">
                How should processing fees be handled?
              </p>

              <div className="mt-4 space-y-3">
                <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="coverFees"
                    checked={coverFeesOption === 'donor_choice'}
                    onChange={() => setCoverFeesOption('donor_choice')}
                    className="mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">
                      Donor&apos;s choice (recommended)
                    </span>
                    <p className="mt-1 text-sm text-gray-500">
                      Donors can choose whether to cover processing fees
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="coverFees"
                    checked={coverFeesOption === 'always'}
                    onChange={() => setCoverFeesOption('always')}
                    className="mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Always add fees</span>
                    <p className="mt-1 text-sm text-gray-500">
                      Processing fees are always added to the donation
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="coverFees"
                    checked={coverFeesOption === 'never'}
                    onChange={() => setCoverFeesOption('never')}
                    className="mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Never add fees</span>
                    <p className="mt-1 text-sm text-gray-500">
                      Fees are deducted from the donation amount
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">Preview</h3>
              <div className="mt-4 text-center">
                <div className="mx-auto w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
                <p className="mt-4 font-medium text-gray-900">
                  {description || 'Donation Link'}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {amountType === 'fixed' && fixedAmount
                    ? `$${fixedAmount}`
                    : 'Flexible amount'}
                </p>
                <div className="mt-3">
                  <code className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    acts29.org/donate/{shortCode || 'GIVE'}
                  </code>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">Actions</h3>
              <div className="mt-4 space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!description || (!allowCard && !allowAch) || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Payment Link
                    </>
                  )}
                </Button>
                <Link href="/admin/donations/payment-links" className="block">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Tips</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Use descriptive names for campaigns</li>
                    <li>ACH has lower fees than card</li>
                    <li>Print QR codes for events</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
