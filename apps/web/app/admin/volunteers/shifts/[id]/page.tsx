'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  ShiftStatusBadge,
  ConfirmDialog,
  formatDate,
  formatDateTime,
} from '@acts29/admin-ui';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { mockVolunteerShifts, mockResources, mockProfiles, mockOrganizations } from '@acts29/database';

export default function ShiftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const shift = mockVolunteerShifts.find((s) => s.id === params.id);
  const volunteer = shift?.volunteer_id
    ? mockProfiles.find((p) => p.id === shift.volunteer_id)
    : null;
  const resource = shift?.resource_id
    ? mockResources.find((r) => r.id === shift.resource_id)
    : null;
  const organization = shift?.organization_id
    ? mockOrganizations.find((o) => o.id === shift.organization_id)
    : null;

  if (!shift) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Volunteers', href: '/admin/volunteers' },
            { label: 'Shifts', href: '/admin/volunteers/shifts' },
            { label: 'Not Found' },
          ]}
        />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Shift Not Found</h1>
          <p className="mt-2 text-gray-600">The shift you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/volunteers/shifts">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shifts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const startTime = new Date(shift.start_time);
  const endTime = new Date(shift.end_time);
  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const isUpcoming = startTime > new Date();
  const isPast = endTime < new Date();

  const handleDelete = async () => {
    // In a real app, this would call the delete API
    console.log('Deleting shift:', shift.id);
    setDeleteDialogOpen(false);
    router.push('/admin/volunteers/shifts');
  };

  const handleMarkCompleted = async () => {
    // In a real app, this would call the update API
    console.log('Marking shift as completed:', shift.id);
  };

  const handleMarkNoShow = async () => {
    // In a real app, this would call the update API
    console.log('Marking shift as no-show:', shift.id);
  };

  const handleCancelShift = async () => {
    // In a real app, this would call the update API
    console.log('Cancelling shift:', shift.id);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Volunteers', href: '/admin/volunteers' },
          { label: 'Shifts', href: '/admin/volunteers/shifts' },
          { label: shift.role },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{shift.role}</h1>
              <ShiftStatusBadge status={shift.status} />
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {formatDate(shift.start_time)} • {duration} hour{duration !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/admin/volunteers/shifts/${shift.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule Details */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(shift.start_time)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">
                    {startTime.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {endTime.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{duration} hour{duration !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <AlertCircle className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <ShiftStatusBadge status={shift.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          {resource && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary-100 p-3">
                  <MapPin className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{resource.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{resource.address}</p>
                  {resource.phone && (
                    <p className="text-sm text-gray-500">{resource.phone}</p>
                  )}
                  <Link
                    href={`/admin/resources/${resource.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
                  >
                    View Resource Details
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
              <p className="text-gray-700 whitespace-pre-wrap">
                {shift.notes || 'No notes provided for this shift.'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          {shift.status === 'scheduled' && isPast && (
            <div className="rounded-xl border bg-amber-50 p-6">
              <h2 className="text-lg font-semibold text-amber-800 mb-4">Update Shift Status</h2>
              <p className="text-sm text-amber-700 mb-4">
                This shift has ended. Please update the status to reflect the outcome.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleMarkCompleted}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Completed
                </Button>
                <Button variant="outline" onClick={handleMarkNoShow}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Mark No-Show
                </Button>
              </div>
            </div>
          )}

          {shift.status === 'scheduled' && isUpcoming && (
            <div className="rounded-xl border bg-gray-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleCancelShift}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Shift
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned Volunteer */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Volunteer</h2>
            {volunteer ? (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-medium">
                  {volunteer.first_name?.[0]}
                  {volunteer.last_name?.[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {volunteer.first_name} {volunteer.last_name}
                  </p>
                  {volunteer.phone && (
                    <p className="text-sm text-gray-500">{volunteer.phone}</p>
                  )}
                  <Link
                    href={`/admin/volunteers/${volunteer.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Users className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                <p className="text-yellow-600 font-medium">Needs Volunteer</p>
                <p className="text-sm text-gray-500 mt-1">
                  This shift has not been assigned yet.
                </p>
                <Button variant="outline" className="mt-4">
                  <User className="mr-2 h-4 w-4" />
                  Assign Volunteer
                </Button>
              </div>
            )}
          </div>

          {/* Organization */}
          {organization && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
              <div>
                <p className="font-medium text-gray-900">{organization.name}</p>
                <p className="text-sm text-gray-500 mt-1">{organization.type}</p>
                {organization.phone && (
                  <p className="text-sm text-gray-500">{organization.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Shift Info */}
          <div className="rounded-xl border bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shift Info</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Shift ID</dt>
                <dd className="font-mono text-gray-600">{shift.id.slice(0, 8)}...</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900">
                  {new Date(shift.created_at).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd className="capitalize">{shift.status.replace('_', ' ')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Shift"
        description={`Are you sure you want to delete this shift? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
