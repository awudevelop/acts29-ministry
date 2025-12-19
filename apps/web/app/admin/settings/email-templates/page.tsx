'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  Alert,
} from '@acts29/admin-ui';
import { ArrowLeft, Save, Mail, Eye, Copy } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  lastModified: string;
}

const templates: EmailTemplate[] = [
  {
    id: 'donation_receipt',
    name: 'Donation Receipt',
    subject: 'Thank you for your donation to {{organization_name}}',
    description: 'Sent immediately after a donation is processed',
    lastModified: '2024-12-01',
  },
  {
    id: 'annual_statement',
    name: 'Annual Giving Statement',
    subject: 'Your {{year}} Giving Statement from {{organization_name}}',
    description: 'Sent for year-end tax purposes',
    lastModified: '2024-01-15',
  },
  {
    id: 'volunteer_welcome',
    name: 'Volunteer Welcome',
    subject: 'Welcome to the {{organization_name}} volunteer team!',
    description: 'Sent when a new volunteer signs up',
    lastModified: '2024-11-20',
  },
  {
    id: 'shift_reminder',
    name: 'Shift Reminder',
    subject: 'Reminder: Your volunteer shift is tomorrow',
    description: 'Sent 24 hours before a scheduled shift',
    lastModified: '2024-10-15',
  },
  {
    id: 'event_confirmation',
    name: 'Event Registration Confirmation',
    subject: 'You\'re registered for {{event_name}}',
    description: 'Sent when someone registers for an event',
    lastModified: '2024-12-10',
  },
  {
    id: 'user_invitation',
    name: 'User Invitation',
    subject: 'You\'ve been invited to join {{organization_name}}',
    description: 'Sent when inviting a new user',
    lastModified: '2024-09-01',
  },
];

export default function EmailTemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [editContent, setEditContent] = React.useState(`Dear {{donor_name}},

Thank you for your generous donation of {{amount}} to {{organization_name}}. Your support makes a real difference in our community.

DONATION DETAILS
----------------
Date: {{donation_date}}
Amount: {{amount}}
Receipt #: {{receipt_number}}

{{#if cover_fees}}
Thank you for covering the processing fee of {{fee_amount}}.
{{/if}}

TAX DEDUCTIBILITY
-----------------
{{organization_name}} is a 501(c)(3) tax-exempt organization.
EIN: {{ein}}

No goods or services were provided in exchange for this contribution, making it fully tax-deductible to the extent allowed by law.

With gratitude,
{{organization_name}}
{{organization_address}}
{{organization_phone}}`);

  const handleSave = async () => {
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
          { label: 'Email Templates' },
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
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="mt-1 text-sm text-gray-600">
            Customize the emails sent to donors, volunteers, and users
          </p>
        </div>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)}>
          Email template saved successfully!
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Template List */}
        <div className="space-y-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`w-full rounded-lg border p-4 text-left transition-colors ${
                selectedTemplate === template.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{template.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                </div>
                <Mail className={`h-5 w-5 ${
                  selectedTemplate === template.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Last modified: {template.lastModified}
              </p>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="rounded-xl border bg-white p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {templates.find((t) => t.id === selectedTemplate)?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {templates.find((t) => t.id === selectedTemplate)?.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={templates.find((t) => t.id === selectedTemplate)?.subject || ''}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Body
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={16}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-medium text-gray-900 mb-2">Available Variables</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    '{{donor_name}}',
                    '{{amount}}',
                    '{{donation_date}}',
                    '{{receipt_number}}',
                    '{{organization_name}}',
                    '{{organization_address}}',
                    '{{organization_phone}}',
                    '{{ein}}',
                  ].map((variable) => (
                    <code
                      key={variable}
                      className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 cursor-pointer hover:bg-gray-300"
                      onClick={() => {
                        navigator.clipboard.writeText(variable);
                      }}
                    >
                      {variable}
                    </code>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} loading={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border bg-gray-50 p-12 text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Select a template to edit
              </h3>
              <p className="mt-2 text-gray-500">
                Choose a template from the list to customize its content
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
