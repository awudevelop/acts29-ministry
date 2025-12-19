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
  getInitials,
} from '@acts29/admin-ui';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Edit,
  UserX,
  Award,
  CheckCircle,
} from 'lucide-react';
import { mockProfiles, mockVolunteerShifts, type VolunteerShift } from '@acts29/database';

export default function VolunteerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const volunteerId = params.id as string;

  const volunteer = mockProfiles.find((p) => p.id === volunteerId);

  // Get shifts for this volunteer
  const volunteerShifts = mockVolunteerShifts.filter((s: VolunteerShift) => s.volunteer_id === volunteerId);
  const completedShifts = volunteerShifts.filter((s: VolunteerShift) => s.status === 'completed');
  const upcomingShifts = volunteerShifts.filter((s: VolunteerShift) => s.status === 'scheduled');

  // Calculate total hours
  const totalHours = completedShifts.reduce((sum: number, shift: VolunteerShift) => {
    const start = new Date(shift.start_time);
    const end = new Date(shift.end_time);
    return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);

  if (!volunteer) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Volunteers', href: '/admin/volunteers' },
            { label: 'Not Found' },
          ]}
        />
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Volunteer not found</h2>
          <p className="text-gray-500 mt-2">The volunteer you're looking for doesn't exist.</p>
          <Link href="/admin/volunteers">
            <Button className="mt-4">Back to Volunteers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Volunteers', href: '/admin/volunteers' },
          { label: `${volunteer.first_name} ${volunteer.last_name}` },
        ]}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-semibold text-primary-600">
            {getInitials(volunteer.first_name, volunteer.last_name)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {volunteer.first_name} {volunteer.last_name}
              </h1>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-gray-500">Volunteer since {formatDate(volunteer.created_at)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <UserX className="mr-2 h-4 w-4" />
            Deactivate
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Hours"
          value={totalHours.toFixed(1)}
          icon={Clock}
        />
        <StatCard
          title="Shifts Completed"
          value={completedShifts.length}
          icon={CheckCircle}
        />
        <StatCard
          title="Upcoming Shifts"
          value={upcomingShifts.length}
          icon={Calendar}
        />
        <StatCard
          title="Achievements"
          value={totalHours >= 50 ? '🏆 50+ Hours' : totalHours >= 25 ? '🥈 25+ Hours' : '🥉 Starter'}
          icon={Award}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Info */}
        <div className="rounded-xl border bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            {volunteer.phone && (
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{volunteer.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2">
                <Mail className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">volunteer@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2">
                <MapPin className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">Springfield, IL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="lg:col-span-2 rounded-xl border bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">About</h3>
          <p className="text-gray-600">
            {volunteer.bio || 'No bio provided.'}
          </p>

          {/* Skills/Interests */}
          <h4 className="font-medium text-gray-900 mt-6 mb-3">Skills & Interests</h4>
          <div className="flex flex-wrap gap-2">
            {['Food Service', 'Event Setup', 'Client Intake', 'Transportation', 'Mentoring'].map((skill) => (
              <span
                key={skill}
                className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Shifts */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Upcoming Shifts</h3>
          <Link href="/admin/volunteers/schedule">
            <Button variant="outline" size="sm">
              View Schedule
            </Button>
          </Link>
        </div>

        {upcomingShifts.length > 0 ? (
          <div className="space-y-3">
            {upcomingShifts.slice(0, 5).map((shift: VolunteerShift) => (
              <div
                key={shift.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary-100 p-2">
                    <Calendar className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{shift.role}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(shift.start_time)} •{' '}
                      {new Date(shift.start_time).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {new Date(shift.end_time).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <Badge variant="info">Scheduled</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No upcoming shifts scheduled.</p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-white p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {completedShifts.slice(0, 5).map((shift: VolunteerShift) => (
            <div key={shift.id} className="flex items-start gap-3">
              <div className="rounded-full bg-green-100 p-1 mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-gray-900">
                  Completed <span className="font-medium">{shift.role}</span> shift
                </p>
                <p className="text-sm text-gray-500">{formatDate(shift.start_time)}</p>
              </div>
            </div>
          ))}
          {completedShifts.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}
