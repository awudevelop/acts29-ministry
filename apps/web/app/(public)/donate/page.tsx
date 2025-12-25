import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DonateContent } from './DonateContent';

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support Acts29 Ministry with a tax-deductible donation. Your generosity enables us to serve those experiencing homelessness with meals, shelter, and the love of Christ.',
  openGraph: {
    title: 'Donate to Acts29 Ministry',
    description:
      'Your generosity enables us to serve those experiencing homelessness with meals, shelter, and the love of Christ.',
    images: ['/images/og-donate.jpg'],
  },
  twitter: {
    title: 'Donate to Acts29 Ministry',
    description:
      'Your generosity enables us to serve those experiencing homelessness with meals, shelter, and the love of Christ.',
    images: ['/images/og-donate.jpg'],
  },
};

export default function DonatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      }
    >
      <DonateContent />
    </Suspense>
  );
}
