'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Filter,
  Shirt,
  Utensils,
  X,
  Bell,
  Download,
} from 'lucide-react';
import { mockEvents, type Event } from '@acts29/database';

type StatusFilter = 'all' | 'upcoming' | 'completed';
type DonationFilter = 'all' | 'clothing' | 'food';

export function CalendarContent() {
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('upcoming');
  const [donationFilter, setDonationFilter] = useState<DonationFilter>('all');

  // Read filter from URL on mount
  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter === 'clothing' || urlFilter === 'food') {
      setDonationFilter(urlFilter);
    }
  }, [searchParams]);

  // Only show public events on the public page
  const publicEvents = mockEvents.filter((event) => event.is_public);

  const filteredEvents = publicEvents.filter((event) => {
    // Status filter
    if (statusFilter !== 'all' && event.status !== statusFilter) {
      return false;
    }
    // Donation type filter
    if (donationFilter === 'clothing' && !event.accepts_clothing) {
      return false;
    }
    if (donationFilter === 'food' && !event.accepts_food) {
      return false;
    }
    return true;
  });

  // Sort events by start time
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  const upcomingCount = publicEvents.filter((e) => e.status === 'upcoming').length;
  const clothingCount = publicEvents.filter((e) => e.accepts_clothing && e.status === 'upcoming').length;
  const foodCount = publicEvents.filter((e) => e.accepts_food && e.status === 'upcoming').length;
  const totalRegistrations = publicEvents.reduce((sum, e) => sum + e.registered, 0);

  const clearDonationFilter = () => {
    setDonationFilter('all');
    // Update URL without the filter param
    window.history.replaceState({}, '', '/calendar');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <Calendar className="mx-auto h-12 w-12 text-primary-300" />
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Events Calendar
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Join us for community events, volunteer opportunities, and gatherings
            as we serve together and share the love of Christ.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/calendar/subscribe"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-primary-700 shadow-lg transition hover:bg-primary-50"
            >
              <Bell className="h-5 w-5" />
              Subscribe to Calendar
            </Link>
            <a
              href="/api/calendar/feed.ics"
              download="acts29-events.ics"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/50 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
            >
              <Download className="h-5 w-5" />
              Download Calendar
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-8 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4 sm:gap-8">
            <div>
              <p className="text-3xl font-bold text-primary-600">{upcomingCount}</p>
              <p className="text-sm text-gray-600">Upcoming Events</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">{totalRegistrations}</p>
              <p className="text-sm text-gray-600">People Registered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent-600">{clothingCount}</p>
              <p className="text-sm text-gray-600">Clothing Drop-offs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{foodCount}</p>
              <p className="text-sm text-gray-600">Food Drop-offs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Donation Filter Banner */}
      {donationFilter !== 'all' && (
        <section className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
            <div className={`flex items-center justify-between rounded-lg p-4 ${
              donationFilter === 'clothing' ? 'bg-accent-50' : 'bg-green-50'
            }`}>
              <div className="flex items-center gap-3">
                {donationFilter === 'clothing' ? (
                  <Shirt className="h-5 w-5 text-accent-600" />
                ) : (
                  <Utensils className="h-5 w-5 text-green-600" />
                )}
                <span className={`font-medium ${
                  donationFilter === 'clothing' ? 'text-accent-800' : 'text-green-800'
                }`}>
                  Showing events accepting {donationFilter} donations
                </span>
              </div>
              <button
                onClick={clearDonationFilter}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition ${
                  donationFilter === 'clothing'
                    ? 'text-accent-700 hover:bg-accent-100'
                    : 'text-green-700 hover:bg-green-100'
                }`}
              >
                <X className="h-4 w-4" />
                Clear filter
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Filters */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Status:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('upcoming')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  statusFilter === 'upcoming'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setStatusFilter('all')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  statusFilter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  statusFilter === 'completed'
                    ? 'bg-gray-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Past Events
              </button>
            </div>

            {/* Donation Type Filters */}
            <div className="ml-0 flex items-center gap-2 sm:ml-4">
              <span className="text-sm font-medium text-gray-700">Donations:</span>
              <button
                onClick={() => setDonationFilter(donationFilter === 'clothing' ? 'all' : 'clothing')}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition ${
                  donationFilter === 'clothing'
                    ? 'bg-accent-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-accent-50'
                }`}
              >
                <Shirt className="h-4 w-4" />
                Clothing
              </button>
              <button
                onClick={() => setDonationFilter(donationFilter === 'food' ? 'all' : 'food')}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition ${
                  donationFilter === 'food'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-50'
                }`}
              >
                <Utensils className="h-4 w-4" />
                Food
              </button>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {sortedEvents.length === 0 && (
            <div className="rounded-xl bg-white py-12 text-center shadow-md">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
              <p className="mt-2 text-gray-600">
                {donationFilter !== 'all'
                  ? `No ${statusFilter === 'upcoming' ? 'upcoming ' : ''}events accepting ${donationFilter} donations at this time.`
                  : statusFilter === 'upcoming'
                    ? 'No upcoming events at this time. Check back soon!'
                    : statusFilter === 'completed'
                      ? 'No past events to display.'
                      : 'No events available.'}
              </p>
              {donationFilter !== 'all' && (
                <button
                  onClick={clearDonationFilter}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all events
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-900 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h2 className="text-2xl font-bold text-white">Want to Get Involved?</h2>
          <p className="mt-4 text-primary-200">
            Volunteer at our events, donate to support our mission, or simply join us in prayer.
            Every act of service makes a difference.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 shadow-lg transition hover:bg-primary-50"
            >
              Volunteer With Us
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              href="/get-involved#give"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const isMultiDay =
    startDate.toDateString() !== endDate.toDateString();

  return (
    <div className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
      {/* Date Badge */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1">
          <Calendar className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">
            {formatDate(startDate)}
          </span>
        </div>

        {/* Status Badge */}
        {event.status === 'completed' && (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            Past Event
          </span>
        )}

        {/* Donation Type Badges */}
        {event.accepts_clothing && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2 py-1 text-xs font-medium text-accent-700">
            <Shirt className="h-3 w-3" />
            Clothing
          </span>
        )}
        {event.accepts_food && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            <Utensils className="h-3 w-3" />
            Food
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{event.description}</p>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>
            {isMultiDay
              ? `${formatDate(startDate)} - ${formatDate(endDate)}`
              : `${formatTime(startDate)} - ${formatTime(endDate)}`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span>
            {event.registered} registered
            {event.max_attendees && ` / ${event.max_attendees} spots`}
          </span>
        </div>
      </div>

      {event.status === 'upcoming' && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <Link
            href={`/calendar/${event.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Learn More & Register
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
