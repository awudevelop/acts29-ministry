'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  FormSection,
  Input,
  TextArea,
  Alert,
} from '@acts29/admin-ui';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { mockOrganizations } from '@acts29/database';

export default function OrganizationSettingsPage() {
  const router = useRouter();
  const organization = mockOrganizations[0]!;
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: organization.name,
    address: organization.address ?? '',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    phone: organization.phone ?? '',
    email: organization.email ?? '',
    website: 'https://helpinghands.org',
    mission: 'To serve those in need in our community with compassion and dignity.',
    description: 'Helping Hands of Springfield is a 501(c)(3) nonprofit organization dedicated to serving individuals and families experiencing hardship in the greater Springfield area.',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Organization' },
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
          <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your organization's profile and public information
          </p>
        </div>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)}>
          Organization settings saved successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Organization Logo"
            description="Upload your organization's logo for receipts and emails"
          >
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-primary-100 text-3xl font-bold text-primary-600">
                {formData.name[0]}
              </div>
              <div>
                <Button type="button" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG up to 2MB. Recommended size: 400x400px
                </p>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Basic Info */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Basic Information"
            description="Your organization's name and description"
          >
            <div className="grid gap-4">
              <Input
                label="Organization Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
              <TextArea
                label="Mission Statement"
                value={formData.mission}
                onChange={(e) => handleChange('mission', e.target.value)}
                rows={2}
              />
              <TextArea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />
            </div>
          </FormSection>
        </div>

        {/* Contact Information */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Contact Information"
            description="How people can reach your organization"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
              </div>
            </div>
          </FormSection>
        </div>

        {/* Address */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Physical Address"
            description="Your organization's mailing address"
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

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
