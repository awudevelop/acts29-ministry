'use client';

import { useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

type SubscriptionList = 'newsletter' | 'donor-updates' | 'event-reminders';

const listOptions: Array<{ id: SubscriptionList; label: string; description: string }> = [
  {
    id: 'newsletter',
    label: 'Monthly Newsletter',
    description: 'Stories, updates, and ministry highlights',
  },
  {
    id: 'donor-updates',
    label: 'Donor Updates',
    description: 'Impact reports and giving opportunities',
  },
  {
    id: 'event-reminders',
    label: 'Event Reminders',
    description: 'Upcoming events and volunteer opportunities',
  },
];

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedLists, setSelectedLists] = useState<SubscriptionList[]>(['newsletter']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleList = (listId: SubscriptionList) => {
    setSelectedLists((prev) =>
      prev.includes(listId)
        ? prev.filter((id) => id !== listId)
        : [...prev, listId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          lists: selectedLists,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Unable to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">You&apos;re Subscribed!</h3>
        <p className="text-gray-600">
          Thank you for joining our community. Check your inbox for a welcome email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-primary-500"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* Name Field (Optional) */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-primary-500"
          placeholder="John Smith"
        />
      </div>

      {/* Subscription Lists */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What would you like to receive?
        </label>
        <div className="space-y-3">
          {listOptions.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-start rounded-lg border-2 p-4 transition ${
                selectedLists.includes(option.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedLists.includes(option.id)}
                onChange={() => toggleList(option.id)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-3">
                <span className="font-medium text-gray-900">{option.label}</span>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || selectedLists.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Subscribing...
          </>
        ) : (
          'Subscribe'
        )}
      </button>
    </form>
  );
}
