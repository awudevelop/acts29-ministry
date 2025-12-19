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
import { ArrowLeft, Send, UserPlus, Copy, Check } from 'lucide-react';

export default function InviteUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [inviteLink, setInviteLink] = React.useState('');

  const [formData, setFormData] = React.useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'volunteer',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate fake invite link
    const token = Math.random().toString(36).substring(2, 15);
    setInviteLink(`https://acts29.org/invite/${token}`);
    setSuccess(true);
    setIsSubmitting(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const roleDescriptions: Record<string, string> = {
    org_admin: 'Full access to manage the organization, users, and all settings',
    staff: 'Can manage cases, donations, and coordinate volunteers',
    volunteer: 'Can view and sign up for shifts, log hours',
    donor: 'Can view donation history and download tax receipts',
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Users', href: '/admin/users' },
          { label: 'Invite User' },
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
          <h1 className="text-2xl font-bold text-gray-900">Invite User</h1>
          <p className="mt-1 text-sm text-gray-600">
            Send an invitation to join your organization
          </p>
        </div>
      </div>

      {success ? (
        <div className="space-y-6">
          <Alert variant="success">
            Invitation sent successfully to {formData.email}!
          </Alert>

          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-green-100 p-2">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Invitation Sent</h3>
            </div>

            <p className="text-gray-600 mb-4">
              We've sent an email invitation to <strong>{formData.email}</strong>. They'll receive
              a link to create their account and join your organization as a{' '}
              <strong className="capitalize">{formData.role.replace('_', ' ')}</strong>.
            </p>

            <div className="rounded-lg bg-gray-50 p-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invitation Link (expires in 7 days)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono"
                />
                <Button variant="outline" onClick={copyLink}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSuccess(false);
                  setFormData({
                    email: '',
                    first_name: '',
                    last_name: '',
                    role: 'volunteer',
                    message: '',
                  });
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Another
              </Button>
              <Button onClick={() => router.push('/admin/users')}>
                Back to Users
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="rounded-xl border bg-white p-6">
            <FormSection
              title="Contact Information"
              description="Enter the email address of the person you want to invite"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    placeholder="email@example.com"
                  />
                </div>
                <Input
                  label="First Name (Optional)"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  placeholder="John"
                />
                <Input
                  label="Last Name (Optional)"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </FormSection>
          </div>

          {/* Role Selection */}
          <div className="rounded-xl border bg-white p-6">
            <FormSection
              title="Role Assignment"
              description="Choose what this person will be able to do"
            >
              <div className="space-y-3">
                {(['org_admin', 'staff', 'volunteer', 'donor'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleChange('role', role)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      formData.role === role
                        ? 'border-primary-500 bg-primary-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium capitalize">
                          {role.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {roleDescriptions[role]}
                        </p>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-full border-2 ${
                          formData.role === role
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {formData.role === role && (
                          <Check className="h-full w-full text-white p-0.5" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </FormSection>
          </div>

          {/* Personal Message */}
          <div className="rounded-xl border bg-white p-6">
            <FormSection
              title="Personal Message (Optional)"
              description="Add a personal note to the invitation email"
            >
              <TextArea
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows={4}
                placeholder="Hi! We'd love to have you join our team at Helping Hands..."
              />
            </FormSection>
          </div>

          {/* Preview */}
          <div className="rounded-xl border bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Email Preview</h3>
            <div className="rounded-lg bg-white border p-4 text-sm">
              <p className="text-gray-600 mb-2">
                <strong>To:</strong> {formData.email || 'email@example.com'}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Subject:</strong> You've been invited to join Helping Hands of Springfield
              </p>
              <hr className="my-3" />
              <p className="mb-3">
                Hi{formData.first_name ? ` ${formData.first_name}` : ''},
              </p>
              <p className="mb-3">
                You've been invited to join <strong>Helping Hands of Springfield</strong> as a{' '}
                <strong className="capitalize">{formData.role.replace('_', ' ')}</strong>.
              </p>
              {formData.message && (
                <p className="mb-3 italic text-gray-600">"{formData.message}"</p>
              )}
              <p className="mb-3">
                Click the button below to create your account and get started.
              </p>
              <div className="bg-primary-600 text-white px-4 py-2 rounded inline-block">
                Accept Invitation
              </div>
            </div>
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
              <Send className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
