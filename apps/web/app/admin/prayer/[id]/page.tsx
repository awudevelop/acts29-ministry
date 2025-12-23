'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  Badge,
  formatDate,
} from '@acts29/admin-ui';
import {
  Edit,
  Trash2,
  HeartHandshake,
  CheckCircle,
  Clock,
  Heart,
  User,
  UserX,
  Calendar,
  Building,
  ArrowLeft,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { mockPrayerRequests, mockProfiles, mockOrganizations } from '@acts29/database';

export default function PrayerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Find the prayer request
  const request = mockPrayerRequests.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Prayer Requests', href: '/admin/prayer' },
            { label: 'Not Found' },
          ]}
        />
        <div className="rounded-xl border bg-white p-12 text-center">
          <HeartHandshake className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Prayer Request Not Found</h2>
          <p className="mt-2 text-gray-600">
            The prayer request you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <Link href="/admin/prayer">
            <Button className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Prayer Requests
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get user info
  const user = request.user_id
    ? mockProfiles.find((p) => p.id === request.user_id)
    : null;

  // Get organization info
  const organization = request.organization_id
    ? mockOrganizations.find((o) => o.id === request.organization_id)
    : null;

  const handleDelete = () => {
    console.log('Deleting prayer request:', id);
    router.push('/admin/prayer');
  };

  const handleMarkAnswered = () => {
    console.log('Marking as answered:', id);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Prayer Requests', href: '/admin/prayer' },
          { label: request.title },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl ${
              request.is_answered
                ? 'bg-green-100 text-green-700'
                : 'bg-primary-100 text-primary-700'
            }`}
          >
            {request.is_answered ? (
              <CheckCircle className="h-7 w-7" />
            ) : (
              <HeartHandshake className="h-7 w-7" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
              {request.is_answered ? (
                <Badge variant="success">Answered</Badge>
              ) : (
                <Badge variant="warning">Pending</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Submitted {formatDate(request.created_at)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!request.is_answered && (
            <Button variant="outline" onClick={handleMarkAnswered}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Answered
            </Button>
          )}
          <Link href={`/admin/prayer/${id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prayer Request Content */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Prayer Request</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
          </div>

          {/* Prayer Stats */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Prayer Engagement</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <Heart className="mx-auto h-8 w-8 text-red-500" />
                <p className="mt-2 text-2xl font-bold text-gray-900">{request.prayer_count}</p>
                <p className="text-sm text-gray-600">People Praying</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <MessageCircle className="mx-auto h-8 w-8 text-blue-500" />
                <p className="mt-2 text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Comments</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center">
                <Share2 className="mx-auto h-8 w-8 text-purple-500" />
                <p className="mt-2 text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Shares</p>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <HeartHandshake className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Prayer request created</p>
                  <p className="text-xs text-gray-500">{formatDate(request.created_at)}</p>
                </div>
              </div>
              {request.is_answered && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Marked as answered</p>
                    <p className="text-xs text-gray-500">{formatDate(request.updated_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submitted By */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Submitted By</h3>
            {request.is_anonymous ? (
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <UserX className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-500 italic">Anonymous</p>
                  <p className="text-sm text-gray-400">Identity hidden</p>
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Unknown user</p>
            )}
          </div>

          {/* Organization */}
          {organization && (
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Organization</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{organization.name}</p>
                  <p className="text-sm text-gray-500">{organization.type}</p>
                </div>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500">Status</dt>
                <dd className="mt-1">
                  {request.is_answered ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Answered</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Pending</span>
                    </div>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Created</dt>
                <dd className="mt-1 flex items-center gap-2 text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(request.created_at)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Last Updated</dt>
                <dd className="mt-1 flex items-center gap-2 text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(request.updated_at)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Privacy</dt>
                <dd className="mt-1 text-gray-900">
                  {request.is_anonymous ? 'Anonymous' : 'Public'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href={`/prayer/${id}`}
                target="_blank"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Share2 className="h-4 w-4" />
                View Public Page
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Delete Prayer Request</h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this prayer request? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
