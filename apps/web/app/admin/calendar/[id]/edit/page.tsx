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
  Alert,
  Toggle,
} from '@acts29/admin-ui';
import { ArrowLeft, Save, Shirt, Utensils } from 'lucide-react';
import { mockEvents } from '@acts29/database';

interface FormData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  maxAttendees: string;
  isPublic: boolean;
  acceptsClothing: boolean;
  acceptsFood: boolean;
}

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const event = mockEvents.find((e) => e.id === eventId);

  const [formData, setFormData] = React.useState<FormData>(() => {
    if (!event) {
      return {
        title: '',
        description: '',
        location: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        maxAttendees: '',
        isPublic: true,
        acceptsClothing: false,
        acceptsFood: false,
      };
    }

    const startDateTime = new Date(event.start_time);
    const endDateTime = new Date(event.end_time);

    return {
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: startDateTime.toISOString().split('T')[0] || '',
      startTime: startDateTime.toTimeString().slice(0, 5),
      endDate: endDateTime.toISOString().split('T')[0] || '',
      endTime: endDateTime.toTimeString().slice(0, 5),
      maxAttendees: event.max_attendees?.toString() || '',
      isPublic: event.is_public,
      acceptsClothing: event.accepts_clothing,
      acceptsFood: event.accepts_food,
    };
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Event Not Found</h1>
          <p className="mt-2 text-gray-600">The event you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/calendar">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Calendar
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
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.startDate || !formData.startTime) {
        throw new Error('Start date and time are required');
      }
      if (!formData.endDate || !formData.endTime) {
        throw new Error('End date and time are required');
      }
      if (!formData.location.trim()) {
        throw new Error('Location is required');
      }

      // Combine date and time
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      if (endDateTime <= startDateTime) {
        throw new Error('End time must be after start time');
      }

      // In a real app, this would call the update API
      console.log('Updating event:', {
        id: event.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        max_attendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        is_public: formData.isPublic,
        accepts_clothing: formData.acceptsClothing,
        accepts_food: formData.acceptsFood,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('Event updated successfully!');
      setTimeout(() => {
        router.push(`/admin/calendar/${event.id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Calendar', href: '/admin/calendar' },
          { label: event.title, href: `/admin/calendar/${event.id}` },
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update event details for {event.title}
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
                title="Event Details"
                description="Basic information about the event"
              >
                <div className="space-y-4">
                  <Input
                    label="Event Title"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    required
                    placeholder="e.g., Community Dinner"
                  />
                  <Textarea
                    label="Description"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={4}
                    placeholder="Describe the event..."
                  />
                  <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    required
                    placeholder="e.g., Community Center, 123 Main St"
                  />
                </div>
              </FormSection>
            </div>

            {/* Date & Time */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Date & Time"
                description="When the event takes place"
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Settings"
                description="Event visibility and capacity"
              >
                <div className="space-y-4">
                  <Input
                    label="Maximum Attendees"
                    type="number"
                    min="1"
                    value={formData.maxAttendees}
                    onChange={(e) => updateField('maxAttendees', e.target.value)}
                    placeholder="Leave empty for unlimited"
                  />
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => updateField('isPublic', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                      Public Event
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Public events are visible on the public calendar and allow open registration.
                  </p>
                </div>
              </FormSection>
            </div>

            {/* Donation Drop-off */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Donation Drop-off"
                description="Accept donations at this event"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
                        <Shirt className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Clothing</p>
                        <p className="text-xs text-gray-500">Accept clothing donations</p>
                      </div>
                    </div>
                    <Toggle
                      checked={formData.acceptsClothing}
                      onChange={(checked) => updateField('acceptsClothing', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                        <Utensils className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Food</p>
                        <p className="text-xs text-gray-500">Accept food donations</p>
                      </div>
                    </div>
                    <Toggle
                      checked={formData.acceptsFood}
                      onChange={(checked) => updateField('acceptsFood', checked)}
                    />
                  </div>
                </div>
              </FormSection>
            </div>

            {/* Actions */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button type="submit" className="w-full" loading={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Link href={`/admin/calendar/${event.id}`} className="block">
                  <Button variant="outline" className="w-full" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-xl border bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Event Stats</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Status</dt>
                  <dd className="font-medium capitalize">{event.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Registrations</dt>
                  <dd className="font-medium">{event.registered}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="font-medium">
                    {new Date(event.created_at).toLocaleDateString()}
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
