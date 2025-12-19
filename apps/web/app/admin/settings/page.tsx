'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import { Breadcrumbs, Alert } from '@acts29/admin-ui';
import {
  Building2,
  CreditCard,
  Bell,
  Mail,
  Shield,
  Database,
  ChevronRight,
} from 'lucide-react';
import { mockOrganizations } from '@acts29/database';

const settingsSections = [
  {
    title: 'Organization',
    description: 'Manage your organization profile, logo, and contact information',
    icon: Building2,
    href: '/admin/settings/organization',
  },
  {
    title: 'Payment Integration',
    description: 'Configure payment processing and donation settings',
    icon: CreditCard,
    href: '/admin/settings/payments',
  },
  {
    title: 'Notifications',
    description: 'Manage email and notification preferences',
    icon: Bell,
    href: '/admin/settings/notifications',
  },
  {
    title: 'Email Templates',
    description: 'Customize donation receipts and notification emails',
    icon: Mail,
    href: '/admin/settings/email-templates',
  },
  {
    title: 'Security',
    description: 'Password policies, two-factor authentication, and access logs',
    icon: Shield,
    href: '/admin/settings/security',
  },
  {
    title: 'Data Export',
    description: 'Export your data for backup or migration',
    icon: Database,
    href: '/admin/settings/export',
  },
];

export default function SettingsPage() {
  const organization = mockOrganizations[0]!;
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccess('Settings saved successfully!');
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Settings' }]} />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your organization settings and preferences
        </p>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Quick Organization Info */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 text-2xl font-bold text-primary-600">
            {organization.name[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{organization.name}</h2>
            <p className="text-gray-600">{organization.address}</p>
            <p className="text-sm text-gray-500">
              {organization.phone} • {organization.email}
            </p>
          </div>
          <Link href="/admin/settings/organization">
            <Button variant="outline">
              Edit Profile
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-xl border bg-white p-6 hover:border-primary-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-gray-100 p-3 group-hover:bg-primary-100 transition-colors">
                <section.icon className="h-6 w-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {section.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{section.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Tax Information */}
      <div className="rounded-xl border bg-white p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tax Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              EIN (Tax ID Number)
            </label>
            <input
              type="text"
              defaultValue="47-1234567"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              501(c)(3) Status
            </label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option>Yes - Tax Exempt</option>
              <option>Pending</option>
              <option>No</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Deductibility Statement (for receipts)
            </label>
            <textarea
              rows={3}
              defaultValue="Helping Hands of Springfield is a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code. No goods or services were provided in exchange for this contribution, making it fully tax-deductible to the extent allowed by law."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave} loading={isSaving}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-700 mb-4">
          These actions are destructive and cannot be undone. Please proceed with caution.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
            Export All Data
          </Button>
          <Button variant="destructive">
            Delete Organization
          </Button>
        </div>
      </div>
    </div>
  );
}
