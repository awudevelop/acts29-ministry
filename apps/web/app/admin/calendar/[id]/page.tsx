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
} from 'lucide-react';

// Mock events data (same as list page)
const mockEvents = [
  {
    id: '1',
    title: 'Christmas Eve Community Dinner',
    description: 'Annual Christmas Eve dinner serving 500+ community members with a full holiday meal, live music, and gift distribution for children.',
    location: 'Helping Hands Community Center',
    start_time: '2024-12-24T16:00:00Z',
    end_time: '2024-12-24T21:00:00Z',
    max_attendees: 500,
    registered: 423,
    is_public: true,
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'New Year Volunteer Orientation',
    description: 'Training session for new volunteers covering policies, procedures, and best practices for serving our community.',
    location: 'Inner City Mission Chapel',
    start_time: '2025-01-04T09:00:00Z',
    end_time: '2025-01-04T12:00:00Z',
    max_attendees: 50,
    registered: 32,
    is_public: false,
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Monthly Food Distribution',
    description: 'Partner with Central Illinois Foodbank for monthly food distribution to families in need.',
    location: 'Washington Street Mission',
    start_time: '2025-01-15T08:00:00Z',
    end_time: '2025-01-15T14:00:00Z',
    max_attendees: null,
    registered: 156,
    is_public: true,
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Winter Coat Drive Kickoff',
    description: 'Launch of annual winter coat drive. Collection points throughout Springfield.',
    location: 'Multiple Locations',
    start_time: '2024-11-01T00:00:00Z',
    end_time: '2024-12-15T00:00:00Z',
    max_attendees: null,
    registered: 89,
    is_public: true,
    status: 'completed',
  },
];

// Mock registrations
const mockRegistrations = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phone: '(555) 123-4567', registered_at: '2024-12-01T10:00:00Z', status: 'confirmed' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '(555) 234-5678', registered_at: '2024-12-02T14:30:00Z', status: 'confirmed' },
  { id: '3', name: 'Mike Williams', email: 'mike@example.com', phone: '(555) 345-6789', registered_at: '2024-12-03T09:15:00Z', status: 'waitlist' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', phone: '(555) 456-7890', registered_at: '2024-12-04T16:45:00Z', status: 'confirmed' },
  { id: '5', name: 'Robert Brown', email: 'robert@example.com', phone: '(555) 567-8901', registered_at: '2024-12-05T11:20:00Z', status: 'cancelled' },
];

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const event = mockEvents.find((e) => e.id === eventId);

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

  const confirmedCount = mockRegistrations.filter((r) => r.status === 'confirmed').length;
  const waitlistCount = mockRegistrations.filter((r) => r.status === 'waitlist').length;
  const capacityPercent = event.max_attendees
    ? Math.round((event.registered / event.max_attendees) * 100)
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Registered"
          value={event.registered}
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
                <span className="font-medium">{event.registered} / {event.max_attendees}</span>
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
        </div>

        {/* Registrations List */}
        <div className="lg:col-span-2 rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Registrations</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email All
              </Button>
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
                  <th className="pb-3 font-medium">Registered</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockRegistrations.map((reg) => (
                  <tr key={reg.id} className="text-sm">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-600">
                          {reg.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="font-medium text-gray-900">{reg.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="text-gray-900">{reg.email}</p>
                      <p className="text-gray-500">{reg.phone}</p>
                    </td>
                    <td className="py-3 text-gray-500">
                      {formatDate(reg.registered_at)}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          reg.status === 'confirmed'
                            ? 'success'
                            : reg.status === 'waitlist'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {reg.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
