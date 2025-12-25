'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Heart,
  DollarSign,
  CreditCard,
  Building2,
  CheckCircle,
  Shield,
  ArrowRight,
  Info,
  QrCode,
  Share2,
  Smartphone,
} from 'lucide-react';
import { mockStats } from '@acts29/database';

// HelloPayments fee structure
const FEES = {
  card: { percentage: 5.0, label: '5% processing fee' },
  ach: { percentage: 1.0, label: '1% processing fee (max $5)', maxCents: 500 },
};

const donationAmounts = [25, 50, 100, 250, 500, 1000];

/**
 * Calculate fee based on payment method
 */
function calculateFee(amountCents: number, method: 'card' | 'ach') {
  const feeConfig = FEES[method];
  let feeCents = Math.ceil((amountCents * feeConfig.percentage) / 100);

  // Apply max fee cap for ACH
  if (method === 'ach' && 'maxCents' in feeConfig && feeCents > feeConfig.maxCents) {
    feeCents = feeConfig.maxCents;
  }

  // Calculate total if donor covers fees
  const rate = feeConfig.percentage / 100;
  let totalWithCoverage = Math.ceil(amountCents / (1 - rate));

  if (method === 'ach' && 'maxCents' in feeConfig) {
    const coverageFee = Math.ceil((totalWithCoverage * feeConfig.percentage) / 100);
    if (coverageFee > feeConfig.maxCents) {
      totalWithCoverage = amountCents + feeConfig.maxCents;
    }
  }

  return {
    feeCents,
    netCents: amountCents - feeCents,
    totalWithCoverageCents: totalWithCoverage,
    coverageFeeCents: totalWithCoverage - amountCents,
  };
}

function formatCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function DonateContent() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaign');
  const presetAmount = searchParams.get('amount');

  const [selectedAmount, setSelectedAmount] = React.useState<number | null>(
    presetAmount ? parseInt(presetAmount, 10) : 100
  );
  const [customAmount, setCustomAmount] = React.useState('');
  const [donationType, setDonationType] = React.useState<'one-time' | 'monthly'>('one-time');
  const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'ach'>('card');
  const [coverFees, setCoverFees] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Calculate amount in cents
  const baseAmountDollars = customAmount ? parseInt(customAmount, 10) : selectedAmount;
  const baseAmountCents = baseAmountDollars ? baseAmountDollars * 100 : 0;

  // Calculate fees based on selected payment method
  const feeDetails = React.useMemo(() => {
    if (!baseAmountCents || baseAmountCents <= 0) return null;
    return calculateFee(baseAmountCents, paymentMethod);
  }, [baseAmountCents, paymentMethod]);

  // Final amount to charge
  const finalAmountCents = React.useMemo(() => {
    if (!feeDetails || !baseAmountCents) return 0;
    return coverFees ? feeDetails.totalWithCoverageCents : baseAmountCents;
  }, [feeDetails, baseAmountCents, coverFees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseAmountCents) return;

    setIsProcessing(true);

    try {
      // For one-time donations
      if (donationType === 'one-time') {
        const response = await fetch('/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: baseAmountCents,
            currency: 'USD',
            paymentMethod,
            coverFees,
            donationType,
            donor: {
              email: 'donor@example.com', // Would come from form input in production
            },
            campaignId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          window.location.href = `/donate/thank-you?id=${data.donation.id}`;
        } else {
          console.error('Donation failed:', data.error);
          alert('There was an error processing your donation. Please try again.');
        }
      } else {
        // For recurring donations
        const response = await fetch('/api/donations/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: baseAmountCents,
            currency: 'USD',
            interval: 'monthly',
            paymentMethod,
            coverFees,
            donor: {
              email: 'donor@example.com', // Would come from form input
            },
            paymentMethodToken: 'mock_token', // Would come from HelloPayments.js
          }),
        });

        const data = await response.json();

        if (data.success) {
          window.location.href = `/donate/thank-you?subscription=${data.subscription.id}`;
        } else {
          console.error('Subscription failed:', data.error);
          alert('There was an error setting up your recurring donation. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Heart className="mx-auto h-12 w-12 text-white/80" />
            <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Make a Donation
            </h1>
            <p className="mt-4 text-lg text-primary-100">
              Your generosity enables us to serve those experiencing homelessness
              with meals, shelter, and the love of Christ.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Donation Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900">Your Gift</h2>

                {/* Donation Type Toggle */}
                <div className="mt-6 flex rounded-lg bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setDonationType('one-time')}
                    className={`flex-1 rounded-md py-2.5 text-sm font-medium transition ${
                      donationType === 'one-time'
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    One-Time Gift
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationType('monthly')}
                    className={`flex-1 rounded-md py-2.5 text-sm font-medium transition ${
                      donationType === 'monthly'
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly Giving
                  </button>
                </div>

                {/* Amount Selection */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Amount
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {donationAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`rounded-lg border-2 py-3 text-center font-semibold transition ${
                          selectedAmount === amount && !customAmount
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>

                  <div className="relative mt-4">
                    <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose how you&apos;d like to pay. ACH has lower fees!
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {/* Card Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
                        paymentMethod === 'card'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          paymentMethod === 'card'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Credit/Debit Card</p>
                        <p className="mt-0.5 text-sm text-gray-500">{FEES.card.label}</p>
                      </div>
                      {paymentMethod === 'card' && (
                        <CheckCircle className="h-5 w-5 text-primary-600" />
                      )}
                    </button>

                    {/* ACH Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('ach')}
                      className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
                        paymentMethod === 'ach'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          paymentMethod === 'ach'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Bank Transfer (ACH)
                          <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Lower Fees
                          </span>
                        </p>
                        <p className="mt-0.5 text-sm text-gray-500">{FEES.ach.label}</p>
                      </div>
                      {paymentMethod === 'ach' && (
                        <CheckCircle className="h-5 w-5 text-primary-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Fee Coverage Option */}
                <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="coverFees"
                      checked={coverFees}
                      onChange={(e) => setCoverFees(e.target.checked)}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="coverFees"
                        className="block cursor-pointer font-medium text-gray-900"
                      >
                        Cover processing fees
                      </label>
                      <p className="mt-1 text-sm text-gray-600">
                        Add {FEES[paymentMethod].percentage}% so 100% of your gift goes to the ministry.
                      </p>
                      {feeDetails && baseAmountDollars && baseAmountDollars > 0 && (
                        <div className="mt-3 rounded-lg bg-white p-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Your donation</span>
                            <span className="font-medium">${baseAmountDollars}</span>
                          </div>
                          {coverFees && (
                            <div className="mt-1 flex items-center justify-between text-primary-600">
                              <span>Processing fee covered</span>
                              <span>+${formatCents(feeDetails.coverageFeeCents)}</span>
                            </div>
                          )}
                          <div className="mt-2 flex items-center justify-between border-t pt-2">
                            <span className="font-semibold text-gray-900">Total charge</span>
                            <span className="font-semibold text-gray-900">
                              ${formatCents(finalAmountCents)}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-green-600">
                            <span>Ministry receives</span>
                            <span className="font-medium">${baseAmountDollars}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!baseAmountDollars || baseAmountDollars <= 0 || isProcessing}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-4 text-lg font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5" />
                      {donationType === 'monthly' ? 'Give Monthly' : 'Give Now'}{' '}
                      {finalAmountCents > 0 && `$${formatCents(finalAmountCents)}`}
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4" />
                  <span>Secure donation powered by HelloPayments</span>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Impact */}
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900">Your Impact</h3>
                <div className="mt-4 space-y-3">
                  <ImpactItem amount={25} impact="10 meals for someone in need" />
                  <ImpactItem amount={50} impact="Hygiene kits for 5 people" />
                  <ImpactItem amount={100} impact="One night of emergency shelter" />
                  <ImpactItem amount={250} impact="Job training for one individual" />
                </div>
              </div>

              {/* Other Ways to Give */}
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900">Other Ways to Give</h3>
                <div className="mt-4 space-y-4">
                  <Link
                    href="/donate/qr"
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition hover:border-primary-300 hover:bg-primary-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                      <QrCode className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">QR Code</p>
                      <p className="text-sm text-gray-500">Scan to donate instantly</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                  </Link>

                  <Link
                    href="/donate/text"
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition hover:border-primary-300 hover:bg-primary-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Text to Give</p>
                      <p className="text-sm text-gray-500">Text GIVE to 555-123</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                  </Link>

                  <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 transition hover:border-primary-300 hover:bg-primary-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                      <Share2 className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Share Link</p>
                      <p className="text-sm text-gray-500">Copy donation link</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="rounded-xl bg-primary-900 p-6 text-white">
                <p className="text-sm font-medium uppercase tracking-wider text-primary-300">
                  Together We&apos;ve Raised
                </p>
                <p className="mt-2 text-3xl font-bold">
                  ${mockStats.totalDonations.toLocaleString()}
                </p>
                <p className="mt-2 text-primary-200">
                  Serving {mockStats.totalPeopleServed.toLocaleString()} people
                </p>
              </div>

              {/* Tax Info */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Tax Deductible</p>
                    <p className="mt-1">
                      Acts29 Ministry is a 501(c)(3) nonprofit. Your donation is
                      tax-deductible to the full extent allowed by law.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ImpactItem({ amount, impact }: { amount: number; impact: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <span className="text-gray-700">
        <span className="font-semibold text-gray-900">${amount}</span> — {impact}
      </span>
    </div>
  );
}
