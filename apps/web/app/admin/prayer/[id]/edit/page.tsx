'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  Alert,
} from '@acts29/admin-ui';
import {
  Save,
  ArrowLeft,
  HandHeart,
} from 'lucide-react';
import { mockPrayerRequests, mockOrganizations } from '@acts29/database';

export default function EditPrayerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Find the prayer request
  const request = mockPrayerRequests.find((r) => r.id === id);

  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: request?.title || '',
    description: request?.description || '',
    organization_id: request?.organization_id || '',
    is_anonymous: request?.is_anonymous || false,
    is_answered: request?.is_answered || false,
  });

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
          <HandHeart className="mx-auto h-12 w-12 text-gray-400" />
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Updating prayer request:', formData);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/admin/prayer/${id}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating prayer request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Prayer Requests', href: '/admin/prayer' },
          { label: request.title, href: `/admin/prayer/${id}` },
          { label: 'Edit' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Prayer Request</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update the prayer request details
          </p>
        </div>
        <Link href={`/admin/prayer/${id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </Link>
      </div>

      {success && (
        <Alert variant="success">
          Prayer request updated successfully! Redirecting...
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    placeholder="Brief title for the prayer request"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={8}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    placeholder="Full details of the prayer request..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Share the details of what you&apos;d like prayer for
                  </p>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                    Organization
                  </label>
                  <select
                    id="organization"
                    value={formData.organization_id}
                    onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  >
                    <option value="">Select an organization (optional)</option>
                    {mockOrganizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.is_anonymous}
                    onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Anonymous</span>
                    <p className="text-xs text-gray-500">Hide submitter identity</p>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.is_answered}
                    onChange={(e) => setFormData({ ...formData, is_answered: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Answered</span>
                    <p className="text-xs text-gray-500">Mark this prayer as answered</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <Button type="submit" className="w-full" loading={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Link href={`/admin/prayer/${id}`} className="block">
                  <Button variant="outline" type="button" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border bg-gray-50 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Tips</h3>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Keep titles concise and descriptive</li>
                <li>Include relevant details in the description</li>
                <li>Mark as answered when God responds</li>
                <li>Use anonymous for sensitive requests</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
