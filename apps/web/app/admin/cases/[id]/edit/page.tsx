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
import { mockCases, mockProfiles, type CaseStatus } from '@acts29/database';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'referred', label: 'Referred' },
  { value: 'closed', label: 'Closed' },
];

const needsOptions = [
  { value: 'housing', label: 'Housing' },
  { value: 'employment', label: 'Employment' },
  { value: 'food', label: 'Food Assistance' },
  { value: 'medical', label: 'Medical Care' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'substance_abuse', label: 'Substance Abuse' },
  { value: 'childcare', label: 'Childcare' },
  { value: 'identification', label: 'Identification' },
  { value: 'counseling', label: 'Counseling' },
  { value: 'legal', label: 'Legal Assistance' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'transportation', label: 'Transportation' },
];

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  status: CaseStatus;
  assignedTo: string;
  needs: string[];
  notes: string;
}

export default function EditCasePage() {
  const params = useParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const caseData = mockCases.find((c) => c.id === params.id);

  const staffOptions = [
    { value: '', label: 'Unassigned' },
    ...mockProfiles
      .filter((p) => p.role === 'staff' || p.role === 'org_admin')
      .map((p) => ({
        value: p.id,
        label: `${p.first_name} ${p.last_name}`,
      })),
  ];

  const [formData, setFormData] = React.useState<FormData>(() => {
    if (!caseData) {
      return {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        status: 'active',
        assignedTo: '',
        needs: [],
        notes: '',
      };
    }

    return {
      firstName: caseData.first_name,
      lastName: caseData.last_name,
      dateOfBirth: caseData.date_of_birth || '',
      status: caseData.status,
      assignedTo: caseData.assigned_to || '',
      needs: caseData.needs,
      notes: caseData.notes || '',
    };
  });

  if (!caseData) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Cases', href: '/admin/cases' },
            { label: 'Not Found' },
          ]}
        />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Case Not Found</h1>
          <p className="mt-2 text-gray-600">The case you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/cases">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cases
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
      if (!formData.firstName.trim()) {
        throw new Error('First name is required');
      }
      if (!formData.lastName.trim()) {
        throw new Error('Last name is required');
      }

      // In a real app, this would call the update API
      console.log('Updating case:', {
        id: caseData.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth || null,
        status: formData.status,
        assigned_to: formData.assignedTo || null,
        needs: formData.needs,
        notes: formData.notes || null,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('Case updated successfully!');
      setTimeout(() => {
        router.push(`/admin/cases/${caseData.id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update case');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleNeed = (need: string) => {
    setFormData((prev) => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter((n) => n !== need)
        : [...prev.needs, need],
    }));
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Cases', href: '/admin/cases' },
          { label: `${caseData.first_name} ${caseData.last_name}`, href: `/admin/cases/${caseData.id}` },
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Case</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update case for {caseData.first_name} {caseData.last_name}
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
            {/* Client Information */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Client Information"
                description="Basic information about the client"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    required
                    placeholder="First name"
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    required
                    placeholder="Last name"
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  />
                </div>
              </FormSection>
            </div>

            {/* Needs Assessment */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Needs Assessment"
                description="Select all needs that apply to this case"
              >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {needsOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        formData.needs.includes(option.value)
                          ? 'border-primary-500 bg-primary-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.needs.includes(option.value)}
                        onChange={() => toggleNeed(option.value)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FormSection>
            </div>

            {/* Notes */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Case Notes"
                description="General notes about this case"
              >
                <Textarea
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={6}
                  placeholder="Add any additional notes about this case..."
                />
              </FormSection>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Case Management */}
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Case Management"
                description="Status and assignment"
              >
                <div className="space-y-4">
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(value) => updateField('status', value as CaseStatus)}
                  />
                  <Select
                    label="Assigned To"
                    options={staffOptions}
                    value={formData.assignedTo}
                    onChange={(value) => updateField('assignedTo', value)}
                  />
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
                <Link href={`/admin/cases/${caseData.id}`} className="block">
                  <Button variant="outline" className="w-full" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>

            {/* Case Info */}
            <div className="rounded-xl border bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Case Info</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Case ID</dt>
                  <dd className="font-mono text-gray-600">{caseData.id.slice(0, 8)}...</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-900">
                    {new Date(caseData.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Last Updated</dt>
                  <dd className="text-gray-900">
                    {new Date(caseData.updated_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Privacy Note */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="font-semibold text-blue-800 mb-2">Privacy</h3>
              <p className="text-sm text-blue-700">
                Case information is confidential and should only be accessed by authorized staff members.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
