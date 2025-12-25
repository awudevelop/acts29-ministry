'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  StatCard,
  Badge,
  formatDate,
} from '@acts29/admin-ui';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  Share2,
  Mail,
  Download,
  UserPlus,
  ExternalLink,
} from 'lucide-react';
import { mockEvents, mockEventRegistrations } from '@acts29/database';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const event = mockEvents.find((e) => e.id === eventId);
  const registrations = mockEventRegistrations.filter((r) => r.event_id === eventId);

  if (!event) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Calendar', href: '/admin/calendar' },
            { label: 'Not Found' },
          ]}
        />
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Event not found</h2>
          <p className="text-gray-500 mt-2">The event you're looking for doesn't exist.</p>
          <Link href="/admin/calendar">
            <Button className="mt-4">Back to Calendar</Button>
          </Link>
        </div>
      </div>
    );
  }

  const confirmedCount = registrations.filter((r) => r.status === 'confirmed').length;
  const waitlistCount = registrations.filter((r) => r.status === 'waitlist').length;
  const totalGuests = registrations.reduce((sum, r) => sum + r.party_size, 0);
  const capacityPercent = event.max_attendees
    ? Math.round((totalGuests / event.max_attendees) * 100)
    : null;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Calendar', href: '/admin/calendar' },
          { label: event.title },
        ]}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
              {event.status === 'upcoming' ? (
                <Badge variant="info">Upcoming</Badge>
              ) : (
                <Badge variant="default">Completed</Badge>
              )}
              {!event.is_public && <Badge variant="warning">Private</Badge>}
            </div>
            <p className="text-gray-500 mt-1">{event.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {event.is_public && (
            <Link href={`/calendar/${eventId}`} target="_blank">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Public Page
              </Button>
            </Link>
          )}
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Link href={`/admin/calendar/${eventId}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Registrations"
          value={registrations.length}
          icon={Users}
        />
        <StatCard
          title="Total Guests"
          value={totalGuests}
          icon={Users}
        />
        <StatCard
          title="Confirmed"
          value={confirmedCount}
          icon={Users}
        />
        <StatCard
          title="Waitlist"
          value={waitlistCount}
          icon={Users}
        />
        <StatCard
          title="Capacity"
          value={capacityPercent ? `${capacityPercent}%` : 'Unlimited'}
          icon={Users}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Event Details */}
        <div className="rounded-xl border bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Event Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2">
                <Calendar className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(event.start_time)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2">
                <Clock className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">
                  {new Date(event.start_time).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(event.end_time).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2">
                <MapPin className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2">
                <Users className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="font-medium">
                  {event.max_attendees ? `${event.max_attendees} attendees` : 'Unlimited'}
                </p>
              </div>
            </div>
          </div>

          {/* Capacity Progress */}
          {event.max_attendees && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Registration Progress</span>
                <span className="font-medium">{totalGuests} / {event.max_attendees}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    capacityPercent && capacityPercent >= 90
                      ? 'bg-red-500'
                      : capacityPercent && capacityPercent >= 70
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(capacityPercent || 0, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* View Public Page Link */}
          {event.is_public && (
            <div className="mt-6 pt-4 border-t">
              <Link
                href={`/calendar/${eventId}`}
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
              >
                <ExternalLink className="h-4 w-4" />
                View Public Registration Page
              </Link>
            </div>
          )}
        </div>

        {/* Registrations List */}
        <div className="lg:col-span-2 rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Registrations</h3>
            <div className="flex gap-2">
              <Link href={`/admin/calendar/${eventId}/registrations`}>
                <Button variant="outline" size="sm">
                  View All ({registrations.length})
                </Button>
              </Link>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Party</th>
                  <th className="pb-3 font-medium">Registered</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No registrations yet
                    </td>
                  </tr>
                ) : (
                  registrations.slice(0, 5).map((reg) => (
                    <tr key={reg.id} className="text-sm">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-600">
                            {reg.first_name[0]}{reg.last_name[0]}
                          </div>
                          <span className="font-medium text-gray-900">
                            {reg.first_name} {reg.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <p className="text-gray-900">{reg.email}</p>
                        {reg.phone && <p className="text-gray-500">{reg.phone}</p>}
                      </td>
                      <td className="py-3 text-gray-600">{reg.party_size}</td>
                      <td className="py-3 text-gray-500">
                        {formatDate(reg.created_at)}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            reg.status === 'confirmed'
                              ? 'success'
                              : reg.status === 'registered'
                              ? 'info'
                              : reg.status === 'waitlist'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {reg.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {registrations.length > 5 && (
            <div className="mt-4 pt-4 border-t text-center">
              <Link
                href={`/admin/calendar/${eventId}/registrations`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all {registrations.length} registrations
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-gray-50 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Send Reminder Email
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Attendance Sheet
          </Button>
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Manage Volunteers
          </Button>
        </div>
      </div>
    </div>
  );
}
