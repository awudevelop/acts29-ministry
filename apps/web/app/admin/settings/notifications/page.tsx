'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  FormSection,
  Alert,
  Input,
  Select,
} from '@acts29/admin-ui';
import {
  ArrowLeft,
  Save,
  Mail,
  Smartphone,
  Bell,
  MessageSquare,
  Moon,
  ChevronDown,
  ChevronRight,
  Check,
} from 'lucide-react';
import {
  notificationTypeConfigs,
  getNotificationsByCategory,
  mockNotificationSettings,
  type NotificationCategory,
  type NotificationChannel,
  type NotificationType,
} from '@acts29/database';

// Mock current user
const currentUserId = '660e8400-e29b-41d4-a716-446655440004';

// Category labels and icons
const categoryConfig: Record<NotificationCategory, { label: string; description: string }> = {
  donations: { label: 'Donations', description: 'Donation receipts and alerts' },
  volunteers: { label: 'Volunteers', description: 'Shift reminders and assignments' },
  events: { label: 'Events', description: 'Event registrations and reminders' },
  cases: { label: 'Cases', description: 'Case assignments and updates' },
  prayer: { label: 'Prayer', description: 'Prayer requests and updates' },
  teams: { label: 'Teams', description: 'Team announcements and changes' },
  system: { label: 'System', description: 'Reports and announcements' },
};

const channelIcons: Record<NotificationChannel, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  sms: <MessageSquare className="h-4 w-4" />,
  push: <Smartphone className="h-4 w-4" />,
  in_app: <Bell className="h-4 w-4" />,
};

const channelLabels: Record<NotificationChannel, string> = {
  email: 'Email',
  sms: 'SMS',
  push: 'Push',
  in_app: 'In-App',
};

interface NotificationPreferenceState {
  [key: string]: {
    email: boolean;
    sms: boolean;
    push: boolean;
    in_app: boolean;
  };
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<Set<NotificationCategory>>(
    new Set(['donations', 'volunteers'])
  );

  // Global settings
  const userSettings = mockNotificationSettings.find((s) => s.user_id === currentUserId);
  const [globalSettings, setGlobalSettings] = React.useState({
    email_enabled: userSettings?.email_enabled ?? true,
    sms_enabled: userSettings?.sms_enabled ?? true,
    push_enabled: userSettings?.push_enabled ?? true,
    quiet_hours_enabled: userSettings?.quiet_hours_enabled ?? false,
    quiet_hours_start: userSettings?.quiet_hours_start ?? '22:00',
    quiet_hours_end: userSettings?.quiet_hours_end ?? '07:00',
    digest_frequency: userSettings?.digest_frequency ?? 'immediate',
    digest_time: userSettings?.digest_time ?? '09:00',
    sms_phone_number: userSettings?.sms_phone_number ?? '',
  });

  // Build initial preferences from notification type configs (use defaults)
  const buildInitialPreferences = (): NotificationPreferenceState => {
    const prefs: NotificationPreferenceState = {};
    notificationTypeConfigs.forEach((config) => {
      prefs[config.type] = {
        email: config.defaultChannels.includes('email'),
        sms: config.defaultChannels.includes('sms'),
        push: config.defaultChannels.includes('push'),
        in_app: config.defaultChannels.includes('in_app'),
      };
    });
    return prefs;
  };

  const [preferences, setPreferences] = React.useState<NotificationPreferenceState>(
    buildInitialPreferences()
  );

  const toggleCategory = (category: NotificationCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const togglePreference = (type: NotificationType, channel: NotificationChannel) => {
    setPreferences((prev) => {
      const currentPref = prev[type] || { email: false, sms: false, push: false, in_app: false };
      return {
        ...prev,
        [type]: {
          ...currentPref,
          [channel]: !currentPref[channel],
        },
      };
    });
  };

  const toggleAllInCategory = (category: NotificationCategory, channel: NotificationChannel, enabled: boolean) => {
    const categoryNotifications = getNotificationsByCategory(category);
    setPreferences((prev) => {
      const updated: NotificationPreferenceState = { ...prev };
      categoryNotifications.forEach((config) => {
        if (config.availableChannels.includes(channel)) {
          const currentPref = updated[config.type] || { email: false, sms: false, push: false, in_app: false };
          updated[config.type] = {
            ...currentPref,
            [channel]: enabled,
          };
        }
      });
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  const categories = Object.keys(categoryConfig) as NotificationCategory[];

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
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notification Settings</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Choose how and when you want to be notified
          </p>
        </div>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)}>
          Notification settings saved successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Global Channel Settings */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <FormSection
            title="Notification Channels"
            description="Enable or disable entire notification channels"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Email Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2 text-blue-600 dark:text-blue-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Email</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive email notifications</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGlobalSettings((prev) => ({ ...prev, email_enabled: !prev.email_enabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    globalSettings.email_enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      globalSettings.email_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* SMS Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2 text-green-600 dark:text-green-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">SMS</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Text message alerts</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGlobalSettings((prev) => ({ ...prev, sms_enabled: !prev.sms_enabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    globalSettings.sms_enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      globalSettings.sms_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Push Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2 text-purple-600 dark:text-purple-400">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Push</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Browser notifications</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGlobalSettings((prev) => ({ ...prev, push_enabled: !prev.push_enabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    globalSettings.push_enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      globalSettings.push_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Quiet Hours */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <FormSection
            title="Quiet Hours"
            description="Pause SMS and push notifications during specific hours"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 dark:bg-indigo-900/30 p-2 text-indigo-600 dark:text-indigo-400">
                    <Moon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Enable Quiet Hours</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No SMS or push notifications during quiet hours
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setGlobalSettings((prev) => ({ ...prev, quiet_hours_enabled: !prev.quiet_hours_enabled }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    globalSettings.quiet_hours_enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      globalSettings.quiet_hours_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {globalSettings.quiet_hours_enabled && (
                <div className="ml-12 grid gap-4 sm:grid-cols-2">
                  <Input
                    type="time"
                    label="Start Time"
                    value={globalSettings.quiet_hours_start}
                    onChange={(e) =>
                      setGlobalSettings((prev) => ({ ...prev, quiet_hours_start: e.target.value }))
                    }
                  />
                  <Input
                    type="time"
                    label="End Time"
                    value={globalSettings.quiet_hours_end}
                    onChange={(e) =>
                      setGlobalSettings((prev) => ({ ...prev, quiet_hours_end: e.target.value }))
                    }
                  />
                </div>
              )}
            </div>
          </FormSection>
        </div>

        {/* Digest Settings */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <FormSection
            title="Email Digest"
            description="Batch non-urgent notifications into a single email"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Frequency"
                options={[
                  { value: 'immediate', label: 'Send immediately' },
                  { value: 'daily', label: 'Daily digest' },
                  { value: 'weekly', label: 'Weekly digest' },
                  { value: 'none', label: 'No digest (email only for urgent)' },
                ]}
                value={globalSettings.digest_frequency}
                onChange={(value) =>
                  setGlobalSettings((prev) => ({ ...prev, digest_frequency: value as typeof prev.digest_frequency }))
                }
              />
              {(globalSettings.digest_frequency === 'daily' ||
                globalSettings.digest_frequency === 'weekly') && (
                <Input
                  type="time"
                  label="Delivery Time"
                  value={globalSettings.digest_time}
                  onChange={(e) =>
                    setGlobalSettings((prev) => ({ ...prev, digest_time: e.target.value }))
                  }
                />
              )}
            </div>
          </FormSection>
        </div>

        {/* Per-Notification Preferences */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notification Types</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Configure which channels to use for each notification type
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((category) => {
              const categoryNotifications = getNotificationsByCategory(category).filter(
                (n) => n.adminOnly
              );
              if (categoryNotifications.length === 0) return null;

              const isExpanded = expandedCategories.has(category);

              return (
                <div key={category}>
                  {/* Category Header */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {categoryConfig[category].label}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {categoryConfig[category].description}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {/* Category Notifications */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      {/* Quick toggles for category */}
                      <div className="flex items-center justify-end gap-4 px-6 py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Quick toggle:</span>
                        {(['email', 'sms', 'push', 'in_app'] as NotificationChannel[]).map((channel) => (
                          <button
                            key={channel}
                            type="button"
                            onClick={() => toggleAllInCategory(category, channel, true)}
                            className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {channelIcons[channel]}
                            <span>All {channelLabels[channel]}</span>
                          </button>
                        ))}
                      </div>

                      {/* Individual notifications */}
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {categoryNotifications.map((config) => (
                          <div
                            key={config.type}
                            className="flex items-center justify-between px-6 py-3"
                          >
                            <div className="flex-1 pr-4">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {config.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {config.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {(['email', 'sms', 'push', 'in_app'] as NotificationChannel[]).map(
                                (channel) => {
                                  const isAvailable = config.availableChannels.includes(channel);
                                  const isEnabled = preferences[config.type]?.[channel] ?? false;

                                  if (!isAvailable) {
                                    return (
                                      <div
                                        key={channel}
                                        className="flex h-8 w-8 items-center justify-center text-gray-300 dark:text-gray-600"
                                        title={`${channelLabels[channel]} not available`}
                                      >
                                        {channelIcons[channel]}
                                      </div>
                                    );
                                  }

                                  return (
                                    <button
                                      key={channel}
                                      type="button"
                                      onClick={() => togglePreference(config.type, channel)}
                                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                                        isEnabled
                                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                          : 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-500'
                                      }`}
                                      title={`${isEnabled ? 'Disable' : 'Enable'} ${channelLabels[channel]}`}
                                    >
                                      {isEnabled ? (
                                        <Check className="h-4 w-4" />
                                      ) : (
                                        channelIcons[channel]
                                      )}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SMS Phone Number */}
        {globalSettings.sms_enabled && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <FormSection
              title="SMS Settings"
              description="Configure your phone number for text notifications"
            >
              <Input
                type="tel"
                label="Phone Number"
                placeholder="+1 (217) 555-1234"
                value={globalSettings.sms_phone_number}
                onChange={(e) =>
                  setGlobalSettings((prev) => ({ ...prev, sms_phone_number: e.target.value }))
                }
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Message and data rates may apply. Text STOP to opt out at any time.
              </p>
            </FormSection>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
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
