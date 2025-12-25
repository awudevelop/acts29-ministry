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
import { type ResourceType } from '@acts29/database';

const resourceTypeOptions = [
  { value: 'shelter', label: 'Shelter' },
  { value: 'food_bank', label: 'Food Bank' },
  { value: 'clinic', label: 'Health Clinic' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'employment', label: 'Employment' },
  { value: 'counseling', label: 'Counseling' },
  { value: 'church', label: 'Church' },
  { value: 'other', label: 'Other' },
];

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

interface FormData {
  name: string;
  type: ResourceType;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  phone: string;
  email: string;
  website: string;
  capacity: string;
  currentAvailability: string;
  isActive: boolean;
  hours: Record<string, string>;
}

export default function NewResourcePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    type: 'shelter',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    website: '',
    capacity: '',
    currentAvailability: '',
    isActive: true,
    hours: {},
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.address.trim()) {
        throw new Error('Address is required');
      }

      // In a real app, this would call the create API
      const newResource = {
        ...formData,
        id: crypto.randomUUID(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        currentAvailability: formData.currentAvailability
          ? parseInt(formData.currentAvailability)
          : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Creating resource:', newResource);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('Resource created successfully!');
      setTimeout(() => {
        router.push('/admin/resources');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resource');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateHours = (day: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      hours: { ...prev.hours, [day]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Resources', href: '/admin/resources' },
          { label: 'New Resource' },
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Resource</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create a new community resource to display in the public directory
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
                description="General information about the resource"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      label="Name"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      required
                      placeholder="e.g., Downtown Shelter"
                    />
                  </div>
                  <Select
                    label="Type"
                    options={resourceTypeOptions}
                    value={formData.type}
                    onChange={(value) => updateField('type', value as ResourceType)}
                  />
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => updateField('isActive', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Active (visible on public site)
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <Textarea
                      label="Description"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows={4}
                      placeholder="Describe the services offered..."
                    />
                  </div>
                </div>
              </FormSection>
            </div>

            {/* Location */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Location"
                description="Address and coordinates"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      label="Address"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      required
                      placeholder="123 Main St, Springfield, IL 62701"
                    />
                  </div>
                  <Input
                    label="Latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => updateField('latitude', e.target.value)}
                    placeholder="39.7817"
                  />
                  <Input
                    label="Longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => updateField('longitude', e.target.value)}
                    placeholder="-89.6501"
                  />
                </div>
              </FormSection>
            </div>

            {/* Contact */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Contact Information"
                description="How people can reach this resource"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(217) 555-1234"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="contact@example.org"
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => updateField('website', e.target.value)}
                      placeholder="https://example.org"
                    />
                  </div>
                </div>
              </FormSection>
            </div>

            {/* Hours */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Hours of Operation"
                description="When this resource is available"
              >
                <div className="space-y-3">
                  {daysOfWeek.map((day) => (
                    <div key={day.key} className="flex items-center gap-4">
                      <label className="w-24 text-sm font-medium text-gray-700">
                        {day.label}
                      </label>
                      <input
                        type="text"
                        value={formData.hours[day.key] || ''}
                        onChange={(e) => updateHours(day.key, e.target.value)}
                        placeholder="e.g., 9:00 AM - 5:00 PM or Closed"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </FormSection>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Capacity */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Capacity"
                description="For shelters and limited-capacity resources"
              >
                <div className="space-y-4">
                  <Input
                    label="Total Capacity"
                    type="number"
                    min="0"
                    value={formData.capacity}
                    onChange={(e) => updateField('capacity', e.target.value)}
                    placeholder="e.g., 50"
                  />
                  <Input
                    label="Current Availability"
                    type="number"
                    min="0"
                    value={formData.currentAvailability}
                    onChange={(e) => updateField('currentAvailability', e.target.value)}
                    placeholder="e.g., 12"
                  />
                </div>
              </FormSection>
            </div>

            {/* Actions */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button type="submit" className="w-full" loading={isSaving}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Resource
                </Button>
                <Link href="/admin/resources" className="block">
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
                  Active resources appear in the public directory immediately.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  Include detailed hours to help people plan their visits.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  Adding coordinates enables map functionality.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  Capacity tracking helps users find available spots.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
