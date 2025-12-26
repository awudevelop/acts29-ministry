'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Save,
  Mail,
  Smartphone,
  Bell,
  MessageSquare,
  Moon,
  ChevronDown,
  ChevronRight,
  Check,
  User,
  Heart,
  Calendar,
  Users,
  MessageCircle,
} from 'lucide-react';
import {
  getNotificationsByCategory,
  getExternalUserNotifications,
  mockNotificationSettings,
  type NotificationCategory,
  type NotificationChannel,
  type NotificationType,
} from '@acts29/database';

// Mock current external user (donor/volunteer)
const currentUserId = '660e8400-e29b-41d4-a716-446655440006';

// Category labels and icons for external users
const categoryConfig: Record<NotificationCategory, { label: string; description: string; icon: React.ReactNode }> = {
  donations: {
    label: 'Donations',
    description: 'Receipts and giving updates',
    icon: <Heart className="h-5 w-5" />,
  },
  volunteers: {
    label: 'Volunteering',
    description: 'Shift reminders and team updates',
    icon: <Users className="h-5 w-5" />,
  },
  events: {
    label: 'Events',
    description: 'Event reminders and registrations',
    icon: <Calendar className="h-5 w-5" />,
  },
  cases: {
    label: 'Support',
    description: 'Updates on your requests',
    icon: <User className="h-5 w-5" />,
  },
  prayer: {
    label: 'Prayer',
    description: 'Prayer request updates',
    icon: <MessageCircle className="h-5 w-5" />,
  },
  teams: {
    label: 'Teams',
    description: 'Team announcements',
    icon: <Users className="h-5 w-5" />,
  },
  system: {
    label: 'General',
    description: 'Ministry updates and announcements',
    icon: <Bell className="h-5 w-5" />,
  },
};

const channelIcons: Record<NotificationChannel, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  sms: <MessageSquare className="h-4 w-4" />,
  push: <Smartphone className="h-4 w-4" />,
  in_app: <Bell className="h-4 w-4" />,
};

const channelLabels: Record<NotificationChannel, string> = {
  email: 'Email',
  sms: 'Text',
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

export default function AccountNotificationsPage() {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<Set<NotificationCategory>>(
    new Set(['donations', 'volunteers', 'events'])
  );

  // Get external user notification types
  const externalUserNotifications = getExternalUserNotifications();

  // Global settings
  const userSettings = mockNotificationSettings.find((s) => s.user_id === currentUserId);
  const [globalSettings, setGlobalSettings] = React.useState({
    email_enabled: userSettings?.email_enabled ?? true,
    sms_enabled: userSettings?.sms_enabled ?? false,
    push_enabled: userSettings?.push_enabled ?? false,
    quiet_hours_enabled: userSettings?.quiet_hours_enabled ?? false,
    quiet_hours_start: userSettings?.quiet_hours_start ?? '22:00',
    quiet_hours_end: userSettings?.quiet_hours_end ?? '07:00',
    sms_phone_number: userSettings?.sms_phone_number ?? '',
    sms_opted_in: false,
  });

  // Build initial preferences from notification type configs
  const buildInitialPreferences = (): NotificationPreferenceState => {
    const prefs: NotificationPreferenceState = {};
    externalUserNotifications.forEach((config) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Get categories that have external user notifications
  const activeCategories = (['donations', 'volunteers', 'events', 'prayer', 'teams', 'system'] as NotificationCategory[])
    .filter((category) => {
      const categoryNotifications = getNotificationsByCategory(category).filter((n) => n.externalUser);
      return categoryNotifications.length > 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
              <Bell className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Notification Preferences
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Choose how you want to hear from Acts 29 Church for the Unsheltered
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {success && (
          <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-200">
                Your notification preferences have been saved!
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Global Channel Settings */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              How do you want to be notified?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Enable or disable notification channels
            </p>

            <div className="space-y-4">
              {/* Email Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2 text-blue-600 dark:text-blue-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Email</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receipts, reminders, and updates
                    </p>
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

              {/* SMS Toggle with Opt-in */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2 text-green-600 dark:text-green-400">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Text Messages</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Shift reminders and urgent updates
                      </p>
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

                {globalSettings.sms_enabled && (
                  <div className="mt-4 ml-12 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (217) 555-1234"
                        value={globalSettings.sms_phone_number}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({ ...prev, sms_phone_number: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={globalSettings.sms_opted_in}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({ ...prev, sms_opted_in: e.target.checked }))
                        }
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        I agree to receive text messages from Acts 29 Church for the Unsheltered.
                        Message and data rates may apply. Text STOP to opt out at any time.
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Push Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2 text-purple-600 dark:text-purple-400">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Browser notifications for real-time updates
                    </p>
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
          </div>

          {/* Quiet Hours */}
          {(globalSettings.sms_enabled || globalSettings.push_enabled) && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 dark:bg-indigo-900/30 p-2 text-indigo-600 dark:text-indigo-400">
                    <Moon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">Quiet Hours</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Pause texts and push notifications during these hours
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={globalSettings.quiet_hours_start}
                      onChange={(e) =>
                        setGlobalSettings((prev) => ({ ...prev, quiet_hours_start: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={globalSettings.quiet_hours_end}
                      onChange={(e) =>
                        setGlobalSettings((prev) => ({ ...prev, quiet_hours_end: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Per-Notification Preferences */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                What do you want to be notified about?
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Choose which types of notifications you&apos;d like to receive
              </p>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {activeCategories.map((category) => {
                const categoryNotifications = getNotificationsByCategory(category).filter(
                  (n) => n.externalUser
                );
                if (categoryNotifications.length === 0) return null;

                const isExpanded = expandedCategories.has(category);
                const config = categoryConfig[category];

                return (
                  <div key={category}>
                    {/* Category Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-100 dark:bg-gray-700 p-2 text-gray-600 dark:text-gray-400">
                          {config.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {config.label}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {config.description}
                          </p>
                        </div>
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
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                          {categoryNotifications.map((notifConfig) => (
                            <div
                              key={notifConfig.type}
                              className="flex items-center justify-between px-6 py-3"
                            >
                              <div className="flex-1 pr-4">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {notifConfig.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {notifConfig.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {(['email', 'sms', 'push'] as NotificationChannel[]).map((channel) => {
                                  const isAvailable = notifConfig.availableChannels.includes(channel);
                                  const isEnabled = preferences[notifConfig.type]?.[channel] ?? false;
                                  const isChannelGloballyEnabled =
                                    (channel === 'email' && globalSettings.email_enabled) ||
                                    (channel === 'sms' && globalSettings.sms_enabled) ||
                                    (channel === 'push' && globalSettings.push_enabled);

                                  if (!isAvailable) {
                                    return null;
                                  }

                                  return (
                                    <button
                                      key={channel}
                                      type="button"
                                      onClick={() => togglePreference(notifConfig.type, channel)}
                                      disabled={!isChannelGloballyEnabled}
                                      className={`flex h-8 items-center gap-1.5 rounded-lg border px-2 text-xs transition-colors ${
                                        !isChannelGloballyEnabled
                                          ? 'border-gray-200 dark:border-gray-600 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                          : isEnabled
                                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                          : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                                      }`}
                                      title={
                                        !isChannelGloballyEnabled
                                          ? `${channelLabels[channel]} is disabled globally`
                                          : `${isEnabled ? 'Disable' : 'Enable'} ${channelLabels[channel]}`
                                      }
                                    >
                                      {channelIcons[channel]}
                                      <span>{channelLabels[channel]}</span>
                                    </button>
                                  );
                                })}
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

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4">
            <Link
              href="/"
              className="text-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Return to homepage
            </Link>
            <Button type="submit" loading={isSaving} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </form>

        {/* Unsubscribe Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Want to unsubscribe from all notifications?{' '}
            <button
              type="button"
              className="text-primary-600 dark:text-primary-400 hover:underline"
              onClick={() => {
                setGlobalSettings({
                  email_enabled: false,
                  sms_enabled: false,
                  push_enabled: false,
                  quiet_hours_enabled: false,
                  quiet_hours_start: '22:00',
                  quiet_hours_end: '07:00',
                  sms_phone_number: '',
                  sms_opted_in: false,
                });
              }}
            >
              Unsubscribe from all
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
