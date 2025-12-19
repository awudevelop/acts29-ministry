'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  FormSection,
  Select,
  Alert,
  Badge,
  formatDate,
} from '@acts29/admin-ui';
import { ArrowLeft, Save, Shield, Check, X } from 'lucide-react';

// Mock login history
const loginHistory = [
  { id: '1', user: 'Robert Gillespie', ip: '192.168.1.1', device: 'Chrome on macOS', date: '2024-12-19T10:30:00Z', success: true },
  { id: '2', user: 'Sarah Johnson', ip: '192.168.1.45', device: 'Safari on iPhone', date: '2024-12-19T09:15:00Z', success: true },
  { id: '3', user: 'Unknown', ip: '45.33.32.156', device: 'Firefox on Windows', date: '2024-12-18T23:45:00Z', success: false },
  { id: '4', user: 'Robert Gillespie', ip: '192.168.1.1', device: 'Chrome on macOS', date: '2024-12-18T08:00:00Z', success: true },
  { id: '5', user: 'Mike Williams', ip: '10.0.0.12', device: 'Chrome on Windows', date: '2024-12-17T14:30:00Z', success: true },
];

export default function SecuritySettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [settings, setSettings] = React.useState({
    require_2fa: false,
    session_timeout: '60',
    password_min_length: '8',
    password_require_uppercase: true,
    password_require_number: true,
    password_require_special: true,
    max_login_attempts: '5',
    lockout_duration: '30',
  });

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
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
          { label: 'Security' },
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
          <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Configure password policies and access controls
          </p>
        </div>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)}>
          Security settings saved successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Two-Factor Authentication */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Two-Factor Authentication"
            description="Add an extra layer of security to user accounts"
          >
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary-100 p-3">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Require 2FA for all users</p>
                  <p className="text-sm text-gray-500">
                    Users must set up two-factor authentication to access their accounts
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleChange('require_2fa', !settings.require_2fa)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.require_2fa ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.require_2fa ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </FormSection>
        </div>

        {/* Session Settings */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Session Settings"
            description="Control how long users stay logged in"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Session Timeout"
                options={[
                  { value: '30', label: '30 minutes' },
                  { value: '60', label: '1 hour' },
                  { value: '120', label: '2 hours' },
                  { value: '480', label: '8 hours' },
                  { value: '1440', label: '24 hours' },
                ]}
                value={settings.session_timeout}
                onChange={(value) => handleChange('session_timeout', value)}
              />
            </div>
          </FormSection>
        </div>

        {/* Password Policy */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Password Policy"
            description="Set requirements for user passwords"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Minimum Password Length"
                options={[
                  { value: '6', label: '6 characters' },
                  { value: '8', label: '8 characters' },
                  { value: '10', label: '10 characters' },
                  { value: '12', label: '12 characters' },
                ]}
                value={settings.password_min_length}
                onChange={(value) => handleChange('password_min_length', value)}
              />
            </div>
            <div className="mt-4 space-y-3">
              {[
                { id: 'password_require_uppercase', label: 'Require uppercase letter' },
                { id: 'password_require_number', label: 'Require number' },
                { id: 'password_require_special', label: 'Require special character (!@#$%^&*)' },
              ].map((option) => (
                <label key={option.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings[option.id as keyof typeof settings] as boolean}
                    onChange={(e) => handleChange(option.id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </FormSection>
        </div>

        {/* Lockout Settings */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Account Lockout"
            description="Prevent brute force attacks"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Max Login Attempts"
                options={[
                  { value: '3', label: '3 attempts' },
                  { value: '5', label: '5 attempts' },
                  { value: '10', label: '10 attempts' },
                ]}
                value={settings.max_login_attempts}
                onChange={(value) => handleChange('max_login_attempts', value)}
              />
              <Select
                label="Lockout Duration"
                options={[
                  { value: '15', label: '15 minutes' },
                  { value: '30', label: '30 minutes' },
                  { value: '60', label: '1 hour' },
                  { value: '1440', label: '24 hours' },
                ]}
                value={settings.lockout_duration}
                onChange={(value) => handleChange('lockout_duration', value)}
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
          <Button type="submit" loading={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>

      {/* Login History */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Login Activity</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">IP Address</th>
                <th className="pb-3 font-medium">Device</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loginHistory.map((entry) => (
                <tr key={entry.id} className="text-sm">
                  <td className="py-3 font-medium text-gray-900">{entry.user}</td>
                  <td className="py-3 text-gray-500 font-mono text-xs">{entry.ip}</td>
                  <td className="py-3 text-gray-500">{entry.device}</td>
                  <td className="py-3 text-gray-500">{formatDate(entry.date)}</td>
                  <td className="py-3">
                    {entry.success ? (
                      <Badge variant="success">
                        <Check className="mr-1 h-3 w-3" />
                        Success
                      </Badge>
                    ) : (
                      <Badge variant="danger">
                        <X className="mr-1 h-3 w-3" />
                        Failed
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
