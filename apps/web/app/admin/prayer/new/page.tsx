'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { mockOrganizations } from '@acts29/database';

export default function NewPrayerPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    organization_id: '',
    is_anonymous: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Creating prayer request:', formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/prayer');
      }, 1500);
    } catch (error) {
      console.error('Error creating prayer request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Prayer Requests', href: '/admin/prayer' },
          { label: 'New Request' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Prayer Request</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create a new prayer request for the community
          </p>
        </div>
        <Link href="/admin/prayer">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </Link>
      </div>

      {success && (
        <Alert variant="success">
          Prayer request created successfully! Redirecting...
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
                  <p className="mt-1 text-xs text-gray-500">
                    A short, descriptive title (e.g., &quot;Healing for my father&quot;)
                  </p>
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
                    placeholder="Share the details of your prayer request..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Share the details of what you&apos;d like prayer for. Be as specific as you&apos;re comfortable with.
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
                  <p className="mt-1 text-xs text-gray-500">
                    Optionally associate this request with a partner organization
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.is_anonymous}
                    onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                    className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Submit Anonymously</span>
                    <p className="text-xs text-gray-500">
                      Your name will not be displayed with this prayer request
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <Button type="submit" className="w-full" loading={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  Create Prayer Request
                </Button>
                <Link href="/admin/prayer" className="block">
                  <Button variant="outline" type="button" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border bg-primary-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <HandHeart className="h-6 w-6 text-primary-600" />
                <h3 className="text-sm font-semibold text-primary-900">Prayer Request Tips</h3>
              </div>
              <ul className="text-xs text-primary-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>Be specific about what you need prayer for</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>Include relevant details to help others pray effectively</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>Consider including Scripture that encourages you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>Update the community when prayers are answered!</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border bg-gray-50 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Scripture</h3>
              <blockquote className="text-sm text-gray-600 italic">
                &quot;Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.&quot;
              </blockquote>
              <p className="mt-2 text-xs text-gray-500">— Mark 11:24</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
