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
import { mockProfiles } from '@acts29/database';

const needsOptions = [
  { value: 'housing', label: 'Housing' },
  { value: 'food', label: 'Food' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'medical', label: 'Medical' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'substance_abuse', label: 'Substance Abuse' },
  { value: 'employment', label: 'Employment' },
  { value: 'childcare', label: 'Childcare' },
  { value: 'identification', label: 'Identification' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'legal', label: 'Legal' },
];

export default function NewCasePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [selectedNeeds, setSelectedNeeds] = React.useState<string[]>([]);

  const [formData, setFormData] = React.useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'IL',
    zip: '',
    date_of_birth: '',
    assigned_to: '',
    status: 'pending',
    notes: '',
    referral_source: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need)
        ? prev.filter((n) => n !== need)
        : [...prev, need]
    );
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
      router.push('/admin/cases');
    }, 1500);
  };

  // Get staff members for assignment
  const staffOptions = mockProfiles
    .filter((p) => p.role === 'staff' || p.role === 'org_admin')
    .map((p) => ({
      value: p.id,
      label: `${p.first_name} ${p.last_name}`,
    }));

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Cases', href: '/admin/cases' },
          { label: 'New Case' },
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
          <h1 className="text-2xl font-bold text-gray-900">New Case</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create a new case for an individual seeking assistance
          </p>
        </div>
      </div>

      {success && (
        <Alert variant="success">
          Case created successfully! Redirecting...
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Information */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Client Information"
            description="Basic information about the individual"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                required
              />
              <Input
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
              />
            </div>
          </FormSection>
        </div>

        {/* Address */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Address"
            description="Current or last known address"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Street Address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                />
                <Input
                  label="ZIP"
                  value={formData.zip}
                  onChange={(e) => handleChange('zip', e.target.value)}
                />
              </div>
            </div>
          </FormSection>
        </div>

        {/* Needs Assessment */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Needs Assessment"
            description="Select all areas where assistance is needed"
          >
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {needsOptions.map((need) => (
                <button
                  key={need.value}
                  type="button"
                  onClick={() => toggleNeed(need.value)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    selectedNeeds.includes(need.value)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{need.label}</span>
                </button>
              ))}
            </div>
            {selectedNeeds.length > 0 && (
              <p className="mt-3 text-sm text-gray-500">
                Selected: {selectedNeeds.length} area(s)
              </p>
            )}
          </FormSection>
        </div>

        {/* Case Details */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Case Details"
            description="Assignment and status information"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Assign To"
                options={[
                  { value: '', label: 'Unassigned' },
                  ...staffOptions,
                ]}
                value={formData.assigned_to}
                onChange={(value) => handleChange('assigned_to', value)}
              />
              <Select
                label="Initial Status"
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'active', label: 'Active' },
                ]}
                value={formData.status}
                onChange={(value) => handleChange('status', value)}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Referral Source"
                  value={formData.referral_source}
                  onChange={(e) => handleChange('referral_source', e.target.value)}
                  placeholder="How did they hear about us?"
                />
              </div>
              <div className="sm:col-span-2">
                <TextArea
                  label="Initial Notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                  placeholder="Any important details from intake..."
                />
              </div>
            </div>
          </FormSection>
        </div>

        {/* Emergency Contact */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Emergency Contact"
            description="Someone to contact in case of emergency"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Contact Name"
                value={formData.emergency_contact_name}
                onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
              />
              <Input
                label="Contact Phone"
                type="tel"
                value={formData.emergency_contact_phone}
                onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
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
            Create Case
          </Button>
        </div>
      </form>
    </div>
  );
}
