'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  FormSection,
  Alert,
} from '@acts29/admin-ui';
import { ArrowLeft, Save, Mail, Smartphone } from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [settings, setSettings] = React.useState<NotificationSetting[]>([
    {
      id: 'new_donation',
      title: 'New Donation',
      description: 'When a new donation is received',
      email: true,
      push: true,
    },
    {
      id: 'large_donation',
      title: 'Large Donation Alert',
      description: 'When a donation exceeds $500',
      email: true,
      push: true,
    },
    {
      id: 'recurring_failed',
      title: 'Recurring Donation Failed',
      description: 'When a recurring donation payment fails',
      email: true,
      push: false,
    },
    {
      id: 'new_volunteer',
      title: 'New Volunteer Registration',
      description: 'When someone signs up to volunteer',
      email: true,
      push: false,
    },
    {
      id: 'shift_reminder',
      title: 'Shift Reminders',
      description: 'Remind volunteers about upcoming shifts',
      email: true,
      push: true,
    },
    {
      id: 'case_update',
      title: 'Case Updates',
      description: 'When a case status changes',
      email: false,
      push: false,
    },
    {
      id: 'event_registration',
      title: 'Event Registration',
      description: 'When someone registers for an event',
      email: true,
      push: false,
    },
    {
      id: 'weekly_summary',
      title: 'Weekly Summary',
      description: 'Weekly overview of donations and activity',
      email: true,
      push: false,
    },
  ]);

  const toggleSetting = (id: string, type: 'email' | 'push') => {
    setSettings((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [type]: !s[type] } : s
      )
    );
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
          { label: 'Notifications' },
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
          <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Choose how you want to be notified about important events
          </p>
        </div>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)}>
          Notification settings saved successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notification Preferences */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Notification Preferences"
            description="Choose which notifications you want to receive"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 pr-4 font-medium text-gray-700">Notification</th>
                    <th className="pb-3 px-4 text-center font-medium text-gray-700">
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                    </th>
                    <th className="pb-3 pl-4 text-center font-medium text-gray-700">
                      <div className="flex items-center justify-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span>Push</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {settings.map((setting) => (
                    <tr key={setting.id}>
                      <td className="py-4 pr-4">
                        <p className="font-medium text-gray-900">{setting.title}</p>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSetting(setting.id, 'email')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            setting.email ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              setting.email ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-4 pl-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSetting(setting.id, 'push')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            setting.push ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              setting.push ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormSection>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border bg-gray-50 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSettings((prev) => prev.map((s) => ({ ...s, email: true })))}
            >
              Enable All Email
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSettings((prev) => prev.map((s) => ({ ...s, email: false })))}
            >
              Disable All Email
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSettings((prev) => prev.map((s) => ({ ...s, push: true })))}
            >
              Enable All Push
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSettings((prev) => prev.map((s) => ({ ...s, push: false })))}
            >
              Disable All Push
            </Button>
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
          <Button type="submit" loading={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
