'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { mockEvents, type Event } from '@acts29/database';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  const event = mockEvents.find((e) => e.id === eventId && e.is_public);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center lg:px-8">
          <AlertCircle className="mx-auto h-16 w-16 text-gray-400" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Event Not Found</h1>
          <p className="mt-2 text-gray-600">
            The event you're looking for doesn't exist or is not available.
          </p>
          <Link
            href="/calendar"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Calendar
          </Link>
        </div>
      </div>
    );
  }

  return <EventContent event={event} />;
}

function EventContent({ event }: { event: Event }) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    partySize: 1,
    notes: '',
  });

  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isMultiDay = startDate.toDateString() !== endDate.toDateString();
  const isFull = event.max_attendees && event.registered >= event.max_attendees;
  const spotsRemaining = event.max_attendees ? event.max_attendees - event.registered : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, this would submit to an API
    console.log('Registration submitted:', { eventId: event.id, ...formData });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center lg:px-8">
          <div className="rounded-full bg-green-100 p-4 inline-block">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Registration Successful!</h1>
          <p className="mt-4 text-lg text-gray-600">
            Thank you for registering for <span className="font-semibold">{event.title}</span>.
          </p>
          <p className="mt-2 text-gray-600">
            A confirmation email has been sent to <span className="font-semibold">{formData.email}</span>.
          </p>
          <div className="mt-8 rounded-xl bg-white p-6 shadow-md text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary-600" />
                <span>{formatFullDate(startDate)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary-600" />
                <span>{formatTime(startDate)} - {formatTime(endDate)}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary-600" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary-600" />
                <span>Party size: {formData.partySize}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/calendar"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              View More Events
            </Link>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setShowForm(false);
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  partySize: 1,
                  notes: '',
                });
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary-600 px-6 py-3 font-semibold text-primary-600 transition hover:bg-primary-50"
            >
              Register Another Person
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Link
            href="/calendar"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition mb-6"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Calendar
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-1.5 text-sm font-medium text-white">
              <Calendar className="h-4 w-4" />
              {formatFullDate(startDate)}
            </span>
            {event.status === 'completed' && (
              <span className="rounded-full bg-gray-500 px-3 py-1 text-sm font-medium text-white">
                Past Event
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{event.title}</h1>
          <p className="mt-4 text-lg text-primary-200">{event.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Details</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary-100 p-3">
                      <Calendar className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="font-semibold text-gray-900">
                        {isMultiDay
                          ? `${formatFullDate(startDate)} - ${formatFullDate(endDate)}`
                          : formatFullDate(startDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary-100 p-3">
                      <Clock className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <p className="font-semibold text-gray-900">
                        {formatTime(startDate)} - {formatTime(endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary-100 p-3">
                      <MapPin className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary-100 p-3">
                      <Users className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Registration</p>
                      <p className="font-semibold text-gray-900">
                        {event.registered} registered
                        {event.max_attendees && ` / ${event.max_attendees} capacity`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              {showForm && event.status === 'upcoming' && (
                <div className="rounded-xl bg-white p-6 shadow-md">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Registration Form</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="partySize" className="block text-sm font-medium text-gray-700 mb-1">
                        Party Size *
                      </label>
                      <select
                        id="partySize"
                        required
                        value={formData.partySize}
                        onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'person' : 'people'}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-sm text-gray-500">
                        How many people will be attending in your group?
                      </p>
                    </div>
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests or Notes
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Accessibility needs, dietary restrictions, etc."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition resize-none"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <div className="rounded-xl bg-white p-6 shadow-md">
                <h3 className="font-semibold text-gray-900 mb-4">Registration</h3>

                {/* Capacity Bar */}
                {event.max_attendees && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Spots filled</span>
                      <span className="font-medium">
                        {event.registered} / {event.max_attendees}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (event.registered / event.max_attendees) >= 0.9
                            ? 'bg-red-500'
                            : (event.registered / event.max_attendees) >= 0.7
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min((event.registered / event.max_attendees) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    {spotsRemaining !== null && spotsRemaining > 0 && (
                      <p className="mt-2 text-sm text-gray-600">
                        {spotsRemaining} spots remaining
                      </p>
                    )}
                  </div>
                )}

                {event.status === 'upcoming' ? (
                  isFull ? (
                    <div className="text-center">
                      <p className="text-red-600 font-medium mb-2">This event is full</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="w-full rounded-lg border-2 border-primary-600 px-4 py-3 font-semibold text-primary-600 transition hover:bg-primary-50"
                      >
                        Join Waitlist
                      </button>
                    </div>
                  ) : showForm ? (
                    <p className="text-sm text-gray-600 text-center">
                      Please complete the registration form below.
                    </p>
                  ) : (
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700"
                    >
                      Register Now
                    </button>
                  )
                ) : (
                  <p className="text-gray-600 text-center">
                    This event has ended. Registration is closed.
                  </p>
                )}
              </div>

              {/* Share Card */}
              <div className="rounded-xl bg-white p-6 shadow-md">
                <h3 className="font-semibold text-gray-900 mb-4">Share This Event</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Invite friends and family to join you at this event.
                </p>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        text: event.description,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Share Event
                </button>
              </div>

              {/* Contact Card */}
              <div className="rounded-xl bg-primary-50 p-6">
                <h3 className="font-semibold text-primary-900 mb-2">Questions?</h3>
                <p className="text-sm text-primary-700">
                  If you have any questions about this event, please contact us at{' '}
                  <a href="mailto:events@acts29ministry.org" className="underline">
                    events@acts29ministry.org
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
