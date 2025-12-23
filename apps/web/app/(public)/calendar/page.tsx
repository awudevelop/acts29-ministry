'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { mockEvents, type Event } from '@acts29/database';

export default function CalendarPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');

  // Only show public events on the public page
  const publicEvents = mockEvents.filter((event) => event.is_public);

  const filteredEvents = publicEvents.filter((event) => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  // Sort events by start time
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  const upcomingCount = publicEvents.filter((e) => e.status === 'upcoming').length;
  const totalRegistrations = publicEvents.reduce((sum, e) => sum + e.registered, 0);

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
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-8 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary-600">{publicEvents.length}</p>
              <p className="text-sm text-gray-600">Total Events</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">{upcomingCount}</p>
              <p className="text-sm text-gray-600">Upcoming Events</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">{totalRegistrations}</p>
              <p className="text-sm text-gray-600">People Registered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Filters */}
          <div className="mb-8 flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('upcoming')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === 'upcoming'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === 'completed'
                    ? 'bg-gray-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Past Events
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
                {filter === 'upcoming'
                  ? 'No upcoming events at this time. Check back soon!'
                  : filter === 'completed'
                    ? 'No past events to display.'
                    : 'No events available.'}
              </p>
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
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1">
        <Calendar className="h-4 w-4 text-primary-600" />
        <span className="text-sm font-medium text-primary-700">
          {formatDate(startDate)}
        </span>
      </div>

      {/* Status Badge */}
      {event.status === 'completed' && (
        <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
          Past Event
        </span>
      )}

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
