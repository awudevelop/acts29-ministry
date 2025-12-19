'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  FormSection,
  Input,
  TextArea,
  Select,
  Alert,
} from '@acts29/admin-ui';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    max_attendees: '',
    is_public: 'true',
    registration_deadline: '',
    contact_email: '',
    contact_phone: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSuccess(true);
    setIsSubmitting(false);

    // Redirect after short delay
    setTimeout(() => {
      router.push('/admin/calendar');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Calendar', href: '/admin/calendar' },
          { label: 'Create Event' },
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
          <p className="mt-1 text-sm text-gray-600">
            Schedule a new community event or activity
          </p>
        </div>
      </div>

      {success && (
        <Alert variant="success">
          Event created successfully! Redirecting...
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Event Information"
            description="Basic details about the event"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Event Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                  placeholder="e.g., Community Food Drive"
                />
              </div>
              <div className="sm:col-span-2">
                <TextArea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  placeholder="Describe the event, what attendees can expect, and any important information..."
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  required
                  placeholder="e.g., Helping Hands Community Center"
                />
              </div>
            </div>
          </FormSection>
        </div>

        {/* Date & Time */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Date & Time"
            description="When will this event take place?"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                required
              />
              <Input
                label="Start Time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleChange('start_time', e.target.value)}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                required
              />
              <Input
                label="End Time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleChange('end_time', e.target.value)}
                required
              />
            </div>
          </FormSection>
        </div>

        {/* Registration Settings */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Registration Settings"
            description="Configure how people can register for this event"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Event Visibility"
                options={[
                  { value: 'true', label: 'Public - Anyone can view and register' },
                  { value: 'false', label: 'Private - Invitation only' },
                ]}
                value={formData.is_public}
                onChange={(value) => handleChange('is_public', value)}
              />
              <Input
                label="Maximum Attendees"
                type="number"
                value={formData.max_attendees}
                onChange={(e) => handleChange('max_attendees', e.target.value)}
                placeholder="Leave blank for unlimited"
              />
              <Input
                label="Registration Deadline"
                type="date"
                value={formData.registration_deadline}
                onChange={(e) => handleChange('registration_deadline', e.target.value)}
              />
            </div>
          </FormSection>
        </div>

        {/* Contact Information */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Contact Information"
            description="Who should attendees contact for questions?"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Contact Email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="events@example.org"
              />
              <Input
                label="Contact Phone"
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </FormSection>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </form>
    </div>
  );
}
