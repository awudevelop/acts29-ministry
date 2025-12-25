import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Calendar,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { SubscribeButtons } from './SubscribeButtons';

export const metadata: Metadata = {
  title: 'Subscribe to Calendar',
  description:
    'Add Acts 29 Ministry events to your personal calendar. Subscribe with Google Calendar, Apple Calendar, Outlook, or any calendar app.',
};

export default function SubscribePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://acts29ministry.org';
  const icalUrl = `${baseUrl}/api/calendar/feed.ics`;
  const webcalUrl = icalUrl.replace(/^https?:/, 'webcal:');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <Calendar className="mx-auto h-12 w-12 text-primary-300" />
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Subscribe to Our Calendar
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Never miss an event! Add our calendar to your personal calendar app
            and stay up-to-date with all our community events and volunteer opportunities.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          {/* Quick Subscribe Buttons */}
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900">
              Quick Subscribe
            </h2>
            <p className="mt-2 text-gray-600">
              Click a button below to add our calendar to your preferred calendar app.
            </p>

            <SubscribeButtons icalUrl={icalUrl} webcalUrl={webcalUrl} />
          </div>

          {/* Manual Instructions */}
          <div className="mt-8 space-y-6">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Monitor className="h-5 w-5" />
                Desktop Instructions
              </h2>

              <div className="mt-6 space-y-6">
                {/* Google Calendar */}
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="font-semibold text-gray-900">Google Calendar</h3>
                  <ol className="mt-3 list-inside list-decimal space-y-2 text-gray-600">
                    <li>Open Google Calendar in your browser</li>
                    <li>
                      On the left sidebar, click the <strong>+</strong> next to
                      &quot;Other calendars&quot;
                    </li>
                    <li>Select &quot;From URL&quot;</li>
                    <li>Paste the calendar URL (shown below)</li>
                    <li>Click &quot;Add calendar&quot;</li>
                  </ol>
                </div>

                {/* Apple Calendar */}
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="font-semibold text-gray-900">Apple Calendar (Mac)</h3>
                  <ol className="mt-3 list-inside list-decimal space-y-2 text-gray-600">
                    <li>Open the Calendar app</li>
                    <li>
                      Go to <strong>File &gt; New Calendar Subscription...</strong>
                    </li>
                    <li>Paste the calendar URL</li>
                    <li>Click &quot;Subscribe&quot;</li>
                    <li>Adjust settings and click &quot;OK&quot;</li>
                  </ol>
                </div>

                {/* Outlook */}
                <div>
                  <h3 className="font-semibold text-gray-900">Outlook (Desktop)</h3>
                  <ol className="mt-3 list-inside list-decimal space-y-2 text-gray-600">
                    <li>Open Outlook and go to Calendar</li>
                    <li>
                      Right-click &quot;Other Calendars&quot; and select{' '}
                      <strong>&quot;Add Calendar&quot; &gt; &quot;From Internet...&quot;</strong>
                    </li>
                    <li>Paste the calendar URL</li>
                    <li>Click &quot;OK&quot;</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Smartphone className="h-5 w-5" />
                Mobile Instructions
              </h2>

              <div className="mt-6 space-y-6">
                {/* iPhone */}
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="font-semibold text-gray-900">iPhone / iPad</h3>
                  <ol className="mt-3 list-inside list-decimal space-y-2 text-gray-600">
                    <li>
                      Open <strong>Settings</strong> &gt; <strong>Calendar</strong> &gt;{' '}
                      <strong>Accounts</strong>
                    </li>
                    <li>Tap &quot;Add Account&quot; &gt; &quot;Other&quot;</li>
                    <li>Tap &quot;Add Subscribed Calendar&quot;</li>
                    <li>Paste the calendar URL and tap &quot;Next&quot;</li>
                    <li>Tap &quot;Save&quot;</li>
                  </ol>
                </div>

                {/* Android */}
                <div>
                  <h3 className="font-semibold text-gray-900">Android (Google Calendar)</h3>
                  <ol className="mt-3 list-inside list-decimal space-y-2 text-gray-600">
                    <li>
                      Calendar subscriptions must be added via{' '}
                      <a
                        href="https://calendar.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        calendar.google.com
                      </a>{' '}
                      on a web browser
                    </li>
                    <li>Follow the Google Calendar desktop instructions above</li>
                    <li>
                      Once added, the calendar will sync to your Android device automatically
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Calendar URL */}
            <div className="rounded-xl bg-primary-50 p-8">
              <h2 className="text-lg font-bold text-primary-900">Calendar URL</h2>
              <p className="mt-2 text-sm text-primary-700">
                Use this URL to subscribe from any calendar application:
              </p>
              <div className="mt-4 flex items-center gap-2">
                <code className="flex-1 overflow-x-auto rounded-lg bg-white px-4 py-3 text-sm text-gray-800 shadow-sm">
                  {icalUrl}
                </code>
                <SubscribeButtons icalUrl={icalUrl} webcalUrl={webcalUrl} copyOnly />
              </div>
            </div>
          </div>

          {/* Back to Calendar */}
          <div className="mt-8 text-center">
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <Calendar className="h-5 w-5" />
              Back to Calendar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
