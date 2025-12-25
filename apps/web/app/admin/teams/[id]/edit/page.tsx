'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  FormSection,
  Input,
  Textarea,
  Select,
  Alert,
} from '@acts29/admin-ui';
import { ArrowLeft, Save } from 'lucide-react';
import { mockTeams, mockOrganizations } from '@acts29/database';

const colorOptions = [
  { value: '#3B82F6', label: 'Blue' },
  { value: '#10B981', label: 'Green' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EF4444', label: 'Red' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#6B7280', label: 'Gray' },
];

const iconOptions = [
  { value: 'Heart', label: 'Heart' },
  { value: 'Home', label: 'Home' },
  { value: 'Users', label: 'Users' },
  { value: 'Coffee', label: 'Coffee' },
  { value: 'Book', label: 'Book' },
  { value: 'Briefcase', label: 'Briefcase' },
  { value: 'Calendar', label: 'Calendar' },
  { value: 'Star', label: 'Star' },
];

interface FormData {
  name: string;
  slug: string;
  description: string;
  organizationId: string;
  color: string;
  icon: string;
  isActive: boolean;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function EditTeamPage() {
  const params = useParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const team = mockTeams.find((t) => t.id === params.id);

  const organizationOptions = [
    { value: '', label: 'Select Organization' },
    ...mockOrganizations.map((o) => ({
      value: o.id,
      label: o.name,
    })),
  ];

  const [formData, setFormData] = React.useState<FormData>(() => {
    if (!team) {
      return {
        name: '',
        slug: '',
        description: '',
        organizationId: mockOrganizations[0]?.id || '',
        color: '#3B82F6',
        icon: 'Users',
        isActive: true,
      };
    }

    return {
      name: team.name,
      slug: team.slug,
      description: team.description || '',
      organizationId: team.organization_id,
      color: team.color || '#3B82F6',
      icon: team.icon || 'Users',
      isActive: team.is_active,
    };
  });

  if (!team) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Teams', href: '/admin/teams' },
            { label: 'Not Found' },
          ]}
        />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Team Not Found</h1>
          <p className="mt-2 text-gray-600">The team you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/teams">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Teams
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Team name is required');
      }
      if (!formData.organizationId) {
        throw new Error('Organization is required');
      }

      // Generate slug if not provided
      const slug = formData.slug || generateSlug(formData.name);

      // In a real app, this would call the update API
      console.log('Updating team:', {
        id: team.id,
        name: formData.name,
        slug,
        description: formData.description || null,
        organization_id: formData.organizationId,
        color: formData.color,
        icon: formData.icon,
        is_active: formData.isActive,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('Team updated successfully!');
      setTimeout(() => {
        router.push(`/admin/teams/${team.id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug when name changes (only if slug was auto-generated)
      if (field === 'name' && typeof value === 'string') {
        const currentSlugIsAuto = prev.slug === generateSlug(prev.name);
        if (currentSlugIsAuto) {
          updated.slug = generateSlug(value);
        }
      }
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Teams', href: '/admin/teams' },
          { label: team.name, href: `/admin/teams/${team.id}` },
          { label: 'Edit' },
        ]}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Team</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update settings for {team.name}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Basic Information"
                description="General information about the team"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      label="Team Name"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      required
                      placeholder="e.g., Outreach Team"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Slug"
                      value={formData.slug}
                      onChange={(e) => updateField('slug', e.target.value)}
                      placeholder="auto-generated-from-name"
                    />
                    <p className="mt-1 text-sm text-gray-500">URL-friendly identifier</p>
                  </div>
                  <div className="sm:col-span-2">
                    <Select
                      label="Organization"
                      options={organizationOptions}
                      value={formData.organizationId}
                      onChange={(value) => updateField('organizationId', value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Textarea
                      label="Description"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows={4}
                      placeholder="Describe the team's purpose and responsibilities..."
                    />
                  </div>
                </div>
              </FormSection>
            </div>

            {/* Appearance */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Appearance"
                description="Customize how the team appears"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateField('color', option.value)}
                          className={`h-10 w-10 rounded-lg border-2 transition-all ${
                            formData.color === option.value
                              ? 'border-gray-900 scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: option.value }}
                          title={option.label}
                        />
                      ))}
                    </div>
                  </div>
                  <Select
                    label="Icon"
                    options={iconOptions}
                    value={formData.icon}
                    onChange={(value) => updateField('icon', value)}
                  />
                </div>
              </FormSection>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Status"
                description="Control team visibility"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => updateField('isActive', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Active teams are visible and can be assigned members and resources.
                </p>
              </FormSection>
            </div>

            {/* Preview */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: formData.color }}
                >
                  <span className="text-lg font-bold">
                    {formData.name.length > 0 ? formData.name.charAt(0).toUpperCase() : 'T'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {formData.name || 'Team Name'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.slug || 'team-slug'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button type="submit" className="w-full" loading={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Link href={`/admin/teams/${team.id}`} className="block">
                  <Button variant="outline" className="w-full" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>

            {/* Team Info */}
            <div className="rounded-xl border bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Team Info</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Team ID</dt>
                  <dd className="font-mono text-gray-600">{team.id.slice(0, 8)}...</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-900">
                    {new Date(team.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Last Updated</dt>
                  <dd className="text-gray-900">
                    {new Date(team.updated_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
