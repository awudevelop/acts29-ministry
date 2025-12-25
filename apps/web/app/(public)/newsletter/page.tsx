import { Metadata } from 'next';
import { NewsletterSignup } from './NewsletterSignup';

export const metadata: Metadata = {
  title: 'Subscribe to Newsletter | Acts 29 Ministry',
  description: 'Stay updated on our ministry activities, upcoming events, and stories of hope. Subscribe to our newsletter.',
};

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Stay Connected</h1>
            <p className="text-lg text-gray-600">
              Join our community and receive updates on how you can make a difference in the lives
              of those experiencing homelessness in Springfield.
            </p>
          </div>

          {/* Signup Form */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <NewsletterSignup />
          </div>

          {/* What You'll Receive */}
          <div className="mt-12">
            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">
              What You&apos;ll Receive
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Monthly Updates</h3>
                <p className="text-sm text-gray-600">
                  Stories of transformation and impact from our ministry work.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Event Invites</h3>
                <p className="text-sm text-gray-600">
                  Be the first to know about upcoming events and volunteer opportunities.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Prayer Requests</h3>
                <p className="text-sm text-gray-600">
                  Join us in praying for those we serve and our ministry team.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="mt-10 text-center text-sm text-gray-500">
            We respect your privacy. You can unsubscribe at any time.
            <br />
            Read our{' '}
            <a href="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
