'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  StatCard,
  Badge,
  formatDate,
} from '@acts29/admin-ui';
import { Plus, Calendar, Users, MapPin, Clock, Eye, Edit } from 'lucide-react';
import { mockEvents } from '@acts29/database';

export default function CalendarPage() {
  const [filter, setFilter] = React.useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredEvents = mockEvents.filter((event) => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const upcomingCount = mockEvents.filter((e) => e.status === 'upcoming').length;
  const totalRegistrations = mockEvents.reduce((sum, e) => sum + e.registered, 0);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Calendar' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage community events and activities
          </p>
        </div>
        <Link href="/admin/calendar/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Events" value={mockEvents.length} icon={Calendar} />
        <StatCard title="Upcoming Events" value={upcomingCount} icon={Clock} />
        <StatCard title="Total Registrations" value={totalRegistrations} icon={Users} />
        <StatCard title="Avg. Attendance" value={Math.round(totalRegistrations / mockEvents.length)} icon={Users} />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {(['all', 'upcoming', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              filter === tab
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="rounded-xl border bg-white p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  {event.status === 'upcoming' ? (
                    <Badge variant="info">Upcoming</Badge>
                  ) : (
                    <Badge variant="default">Completed</Badge>
                  )}
                  {!event.is_public && <Badge variant="warning">Private</Badge>}
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.start_time)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(event.start_time).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(event.end_time).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
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
                  {event.max_attendees && ` / ${event.max_attendees} max`}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t pt-4">
              <Link href={`/admin/calendar/${event.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Button>
              </Link>
              <Link href={`/admin/calendar/${event.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Link href={`/admin/calendar/${event.id}/registrations`}>
                <Button variant="outline" size="sm">
                  <Users className="mr-1 h-4 w-4" />
                  Registrations
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
          <p className="mt-2 text-gray-500">
            {filter === 'all'
              ? 'Create your first event to get started.'
              : `No ${filter} events at this time.`}
          </p>
          <Link href="/admin/calendar/new">
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
