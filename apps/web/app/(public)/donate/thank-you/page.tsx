import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Heart, Mail, Calendar, Share2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thank You for Your Donation',
  description:
    'Thank you for your generous donation to Acts 29 Ministry. Your gift makes a real difference.',
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
            Thank You for Your Gift!
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-green-100">
            Your generosity is making a real difference in the lives of those
            experiencing homelessness in Springfield, IL.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4 lg:px-8">
          {/* Confirmation Card */}
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900">
              Donation Confirmed
            </h2>
            <p className="mt-2 text-gray-600">
              A confirmation email with your tax receipt has been sent to your
              email address.
            </p>

            <div className="mt-6 rounded-lg bg-green-50 p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">
                    Check Your Inbox
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    Your tax-deductible receipt is on its way. Keep it for your
                    records.
                  </p>
                </div>
              </div>
            </div>

            {/* Impact Message */}
            <div className="mt-8 border-t pt-8">
              <h3 className="font-semibold text-gray-900">
                What Your Gift Provides
              </h3>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary-600" />
                  <span>Hot meals for those in need</span>
                </li>
                <li className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary-600" />
                  <span>Emergency shelter and warmth</span>
                </li>
                <li className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary-600" />
                  <span>Case management and support services</span>
                </li>
                <li className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary-600" />
                  <span>Hope and the love of Christ</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/calendar"
              className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-lg transition hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Get Involved</p>
                <p className="text-sm text-gray-600">
                  Volunteer at an upcoming event
                </p>
              </div>
            </Link>

            <button className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-lg transition hover:shadow-xl text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
                <Share2 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Share the Mission</p>
                <p className="text-sm text-gray-600">
                  Help spread the word
                </p>
              </div>
            </button>
          </div>

          {/* Return Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
