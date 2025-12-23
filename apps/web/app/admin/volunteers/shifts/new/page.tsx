'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import { ArrowLeft, Plus } from 'lucide-react';
import { mockResources, mockProfiles, mockOrganizations } from '@acts29/database';

interface FormData {
  role: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  organizationId: string;
  resourceId: string;
  volunteerId: string;
  notes: string;
}

export default function NewShiftPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const organizationOptions = [
    { value: '', label: 'Select Organization' },
    ...mockOrganizations.map((o) => ({
      value: o.id,
      label: o.name,
    })),
  ];

  const resourceOptions = [
    { value: '', label: 'Select Location (Optional)' },
    ...mockResources.map((r) => ({
      value: r.id,
      label: `${r.name} - ${r.address}`,
    })),
  ];

  const volunteerOptions = [
    { value: '', label: 'Unassigned (Open Shift)' },
    ...mockProfiles
      .filter((p) => p.role === 'volunteer' || p.role === 'staff')
      .map((p) => ({
        value: p.id,
        label: `${p.first_name} ${p.last_name}`,
      })),
  ];

  const [formData, setFormData] = React.useState<FormData>({
    role: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    organizationId: mockOrganizations[0]?.id || '',
    resourceId: '',
    volunteerId: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.role.trim()) {
        throw new Error('Shift role/title is required');
      }
      if (!formData.startDate || !formData.startTime) {
        throw new Error('Start date and time are required');
      }
      if (!formData.endDate || !formData.endTime) {
        throw new Error('End date and time are required');
      }
      if (!formData.organizationId) {
        throw new Error('Organization is required');
      }

      // Combine date and time
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      if (endDateTime <= startDateTime) {
        throw new Error('End time must be after start time');
      }

      // In a real app, this would call the create API
      const newShift = {
        id: crypto.randomUUID(),
        organization_id: formData.organizationId,
        volunteer_id: formData.volunteerId || null,
        resource_id: formData.resourceId || null,
        role: formData.role,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status: 'scheduled',
        notes: formData.notes || null,
        created_at: new Date().toISOString(),
      };

      console.log('Creating shift:', newShift);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('Shift created successfully!');
      setTimeout(() => {
        router.push('/admin/volunteers/shifts');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shift');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-set end date when start date changes
  React.useEffect(() => {
    if (formData.startDate && !formData.endDate) {
      updateField('endDate', formData.startDate);
    }
  }, [formData.startDate]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Volunteers', href: '/admin/volunteers' },
          { label: 'Shifts', href: '/admin/volunteers/shifts' },
          { label: 'New Shift' },
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
          <h1 className="text-2xl font-bold text-gray-900">Create Shift</h1>
          <p className="mt-1 text-sm text-gray-600">
            Schedule a new volunteer shift
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
            {/* Shift Details */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Shift Details"
                description="Basic information about the shift"
              >
                <div className="space-y-4">
                  <Input
                    label="Shift Role / Title"
                    value={formData.role}
                    onChange={(e) => updateField('role', e.target.value)}
                    required
                    placeholder="e.g., Evening Meal Service, Kitchen Help, Clothing Sorter"
                  />
                  <Select
                    label="Organization"
                    options={organizationOptions}
                    value={formData.organizationId}
                    onChange={(value) => updateField('organizationId', value)}
                  />
                  <Select
                    label="Location"
                    options={resourceOptions}
                    value={formData.resourceId}
                    onChange={(value) => updateField('resourceId', value)}
                  />
                </div>
              </FormSection>
            </div>

            {/* Date & Time */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Date & Time"
                description="When does this shift take place?"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    required
                  />
                  <Input
                    label="Start Time"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => updateField('startTime', e.target.value)}
                    required
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    required
                  />
                  <Input
                    label="End Time"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateField('endTime', e.target.value)}
                    required
                  />
                </div>
              </FormSection>
            </div>

            {/* Notes */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Notes"
                description="Additional information for volunteers"
              >
                <Textarea
                  label="Shift Notes"
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={4}
                  placeholder="Add any special instructions, requirements, or notes for this shift..."
                />
              </FormSection>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Assignment"
                description="Optionally assign a volunteer now"
              >
                <Select
                  label="Assign Volunteer"
                  options={volunteerOptions}
                  value={formData.volunteerId}
                  onChange={(value) => updateField('volunteerId', value)}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Leave unassigned to create an open shift that volunteers can sign up for.
                </p>
              </FormSection>
            </div>

            {/* Actions */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button type="submit" className="w-full" loading={isSaving}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Shift
                </Button>
                <Link href="/admin/volunteers/shifts" className="block">
                  <Button variant="outline" className="w-full" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-xl border bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  Create descriptive role names to help volunteers understand what they&apos;ll be doing.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  Link to a location so volunteers know where to go.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  Add notes with any special instructions or parking info.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  Open shifts can be claimed by volunteers from the schedule.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
