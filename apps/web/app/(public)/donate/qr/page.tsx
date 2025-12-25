'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  Smartphone,
  CreditCard,
  Building2,
  ArrowLeft,
} from 'lucide-react';

export default function QRCodeDonatePage() {
  const [copied, setCopied] = React.useState(false);
  const donationUrl = 'https://acts29.org/donate';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(donationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Donate to Acts29 Ministry',
          text: 'Support those experiencing homelessness in Springfield',
          url: donationUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Donate
          </Link>
          <div className="mx-auto max-w-2xl text-center">
            <QrCode className="mx-auto h-12 w-12 text-white/80" />
            <h1 className="mt-4 text-3xl font-bold text-white">Scan to Donate</h1>
            <p className="mt-4 text-lg text-primary-100">
              Use your phone&apos;s camera to scan the QR code and donate instantly.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* QR Code Display */}
            <div className="rounded-2xl bg-white p-8 shadow-lg text-center">
              {/* Placeholder QR Code - In production, this would be generated dynamically */}
              <div className="mx-auto w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center border-4 border-gray-200">
                <div className="text-center">
                  <QrCode className="mx-auto h-32 w-32 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">QR Code</p>
                  <p className="text-xs text-gray-400">acts29.org/donate</p>
                </div>
              </div>

              <p className="mt-6 text-sm text-gray-600">
                Point your phone camera at this code to open the donation page
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900">How It Works</h2>
                <div className="mt-4 space-y-4">
                  <Step
                    number={1}
                    title="Scan the QR Code"
                    description="Open your phone camera and point it at the QR code above."
                  />
                  <Step
                    number={2}
                    title="Choose Your Amount"
                    description="Select a preset amount or enter a custom donation."
                  />
                  <Step
                    number={3}
                    title="Select Payment Method"
                    description="Pay with card (5% fee) or bank transfer (1% fee)."
                  />
                  <Step
                    number={4}
                    title="Complete Your Gift"
                    description="Securely complete your donation in seconds."
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900">Payment Options</h2>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">5% processing fee</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border-2 border-green-200 bg-green-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Bank Transfer (ACH)
                        <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Recommended
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">Only 1% fee (max $5)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-primary-200 bg-primary-50 p-6">
                <div className="flex gap-3">
                  <Smartphone className="h-6 w-6 flex-shrink-0 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-primary-900">Perfect for Events</h3>
                    <p className="mt-1 text-sm text-primary-700">
                      Display this QR code at your church, fundraiser, or community event
                      to accept donations quickly without cash or checks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Print-Ready Section */}
          <div className="mt-12 rounded-xl bg-white p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">Print for Your Event</h2>
            <p className="mt-2 text-gray-600">
              Download a print-ready version of this QR code for flyers, table tents, or posters.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <button className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                <Download className="mx-auto h-5 w-5 mb-1" />
                Table Tent (4x6)
              </button>
              <button className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                <Download className="mx-auto h-5 w-5 mb-1" />
                Flyer (8.5x11)
              </button>
              <button className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                <Download className="mx-auto h-5 w-5 mb-1" />
                Poster (11x17)
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
        {number}
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
