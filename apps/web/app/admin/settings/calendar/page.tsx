'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import { Breadcrumbs, Alert } from '@acts29/admin-ui';
import {
  ArrowLeft,
  Calendar,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Plus,
  QrCode,
  Eye,
  EyeOff,
} from 'lucide-react';
import { mockTeams, type CalendarFeedToken } from '@acts29/database';

// Mock current user (in production, from auth context)
const currentUserId = '660e8400-e29b-41d4-a716-446655440004'; // Jennifer Martinez

// Mock feed tokens for this user
const mockUserFeedTokens: CalendarFeedToken[] = [
  {
    id: 'feed-001',
    user_id: currentUserId,
    token: 'jennifer-personal-feed-token',
    feed_type: 'personal',
    scope_id: null,
    name: 'My Calendar',
    include_events: true,
    include_shifts: true,
    include_private_events: false,
    is_active: true,
    last_accessed_at: '2024-12-20T14:30:00Z',
    created_at: '2024-12-01T00:00:00Z',
    expires_at: null,
  },
  {
    id: 'feed-002',
    user_id: currentUserId,
    token: 'jennifer-shifts-only-token',
    feed_type: 'personal',
    scope_id: null,
    name: 'My Volunteer Shifts',
    include_events: false,
    include_shifts: true,
    include_private_events: false,
    is_active: true,
    last_accessed_at: null,
    created_at: '2024-12-15T00:00:00Z',
    expires_at: null,
  },
];

interface CalendarAppButton {
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  getUrl: (feedUrl: string, calendarName: string) => string;
}

const calendarApps: CalendarAppButton[] = [
  {
    name: 'Google Calendar',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zM12 18.75a6.75 6.75 0 110-13.5 6.75 6.75 0 010 13.5z" />
      </svg>
    ),
    bgColor: 'bg-blue-500 hover:bg-blue-600',
    getUrl: (feedUrl, _name) => {
      const webcalUrl = feedUrl.replace(/^https?:/, 'webcal:');
      return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl)}`;
    },
  },
  {
    name: 'Apple Calendar',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
    bgColor: 'bg-gray-800 hover:bg-gray-900',
    getUrl: (feedUrl, _name) => {
      return feedUrl.replace(/^https?:/, 'webcal:');
    },
  },
  {
    name: 'Outlook',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.153-.352.229-.58.229h-8.547v-6.959l1.6 1.229c.103.077.226.115.369.115.143 0 .266-.038.369-.115l6.9-5.317v-.236h-.012L17.635 12.5 13.723 9.5l3.912-3V7.387H24zM12.979 3.83h10.203c.226 0 .42.077.582.231.161.154.236.346.236.576v.787L13.635 13.5l-.656-.5V3.83z" />
        <path d="M0 6.109V19.89c0 .109.035.199.106.27a.36.36 0 00.27.109h11.572a.36.36 0 00.27-.109.36.36 0 00.109-.27V6.11a.36.36 0 00-.11-.27.36.36 0 00-.269-.109H.376a.36.36 0 00-.27.109.36.36 0 00-.106.27zm6.193 10.688c-1.16 0-2.09-.37-2.788-1.106-.699-.737-1.048-1.735-1.048-2.993 0-1.286.36-2.306 1.082-3.06.722-.755 1.688-1.132 2.899-1.132 1.16 0 2.073.364 2.737 1.092.664.729.996 1.737.996 3.024 0 1.313-.352 2.334-1.057 3.063-.705.729-1.66 1.093-2.868 1.093z" />
      </svg>
    ),
    bgColor: 'bg-[#0078d4] hover:bg-[#106ebe]',
    getUrl: (feedUrl, name) => {
      return `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(feedUrl)}&name=${encodeURIComponent(name)}`;
    },
  },
];

export default function CalendarSettingsPage() {
  const router = useRouter();
  const [feedTokens, setFeedTokens] = React.useState<CalendarFeedToken[]>(mockUserFeedTokens);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [showTokenId, setShowTokenId] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showQRModal, setShowQRModal] = React.useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://acts29ministry.org';

  const getFeedUrl = (token: string) => `${baseUrl}/api/calendar/feed/${token}`;

  const handleCopyUrl = async (token: string, feedId: string) => {
    const url = getFeedUrl(token);
    await navigator.clipboard.writeText(url);
    setCopiedId(feedId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerateToken = async (feedId: string) => {
    // In production, this would call an API to regenerate the token
    const newToken = `regenerated-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    setFeedTokens((prev) =>
      prev.map((t) => (t.id === feedId ? { ...t, token: newToken } : t))
    );
    setSuccess('Feed token regenerated. Update your calendar subscriptions with the new URL.');
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleDeleteFeed = async (feedId: string) => {
    if (!confirm('Are you sure you want to delete this calendar feed? Any subscribed calendars will no longer sync.')) {
      return;
    }
    setFeedTokens((prev) => prev.filter((t) => t.id !== feedId));
    setSuccess('Calendar feed deleted.');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCreateFeed = async (feedData: Partial<CalendarFeedToken>) => {
    setIsCreating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newFeed: CalendarFeedToken = {
      id: `feed-${Date.now()}`,
      user_id: currentUserId,
      token: `new-feed-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      feed_type: feedData.feed_type || 'personal',
      scope_id: feedData.scope_id || null,
      name: feedData.name || 'New Calendar Feed',
      include_events: feedData.include_events ?? true,
      include_shifts: feedData.include_shifts ?? true,
      include_private_events: feedData.include_private_events ?? false,
      is_active: true,
      last_accessed_at: null,
      created_at: new Date().toISOString(),
      expires_at: null,
    };

    setFeedTokens((prev) => [...prev, newFeed]);
    setShowCreateModal(false);
    setIsCreating(false);
    setSuccess('New calendar feed created!');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Calendar' },
        ]}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Calendar Settings</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your calendar feeds and subscriptions
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Feed
        </Button>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Quick Subscribe - Public Events */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
            <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Public Events Calendar</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Subscribe to all public ministry events. This feed is available to anyone.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {calendarApps.map((app) => (
                <a
                  key={app.name}
                  href={app.getUrl(`${baseUrl}/api/calendar/feed.ics`, 'Acts 29 Ministry Events')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${app.bgColor}`}
                >
                  {app.icon}
                  {app.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Calendar Feeds */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Your Calendar Feeds</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Private feeds that include your volunteer shifts and events. Keep these URLs secret.
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {feedTokens.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-4 font-medium text-gray-900 dark:text-gray-100">No calendar feeds</h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Create a personal feed to sync your shifts and events.
              </p>
              <Button className="mt-4" onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Feed
              </Button>
            </div>
          ) : (
            feedTokens.map((feed) => (
              <div key={feed.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{feed.name}</h4>
                      {feed.feed_type === 'team' && (
                        <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                          Team
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {feed.include_events && (
                        <span className="rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5">Events</span>
                      )}
                      {feed.include_shifts && (
                        <span className="rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5">Shifts</span>
                      )}
                      {feed.include_private_events && (
                        <span className="rounded bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-amber-700 dark:text-amber-300">
                          Private Events
                        </span>
                      )}
                    </div>

                    {/* Feed URL */}
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-300 overflow-hidden">
                          {showTokenId === feed.id ? (
                            getFeedUrl(feed.token)
                          ) : (
                            <span className="text-gray-400">••••••••••••••••••••</span>
                          )}
                        </div>
                        <button
                          onClick={() => setShowTokenId(showTokenId === feed.id ? null : feed.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
                          title={showTokenId === feed.id ? 'Hide URL' : 'Show URL'}
                        >
                          {showTokenId === feed.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleCopyUrl(feed.token, feed.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Copy URL"
                        >
                          {copiedId === feed.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setShowQRModal(feed.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Show QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subscribe buttons */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {calendarApps.map((app) => (
                        <a
                          key={app.name}
                          href={app.getUrl(getFeedUrl(feed.token), feed.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors ${app.bgColor}`}
                        >
                          {app.icon}
                          {app.name}
                        </a>
                      ))}
                    </div>

                    {/* Last accessed */}
                    {feed.last_accessed_at && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Last synced: {new Date(feed.last_accessed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleRegenerateToken(feed.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Regenerate token"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFeed(feed.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete feed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">How to Subscribe</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Google Calendar</h4>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>Click the &quot;Google Calendar&quot; button</li>
              <li>Review the calendar name</li>
              <li>Click &quot;Add calendar&quot;</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Apple Calendar</h4>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>Click the &quot;Apple Calendar&quot; button</li>
              <li>Confirm the subscription</li>
              <li>Choose refresh frequency</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Outlook</h4>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>Click the &quot;Outlook&quot; button</li>
              <li>Sign in if prompted</li>
              <li>Click &quot;Import&quot;</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Create Feed Modal */}
      {showCreateModal && (
        <CreateFeedModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateFeed}
          isCreating={isCreating}
          teams={mockTeams}
        />
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <QRCodeModal
          feedUrl={getFeedUrl(feedTokens.find((f) => f.id === showQRModal)?.token || '')}
          feedName={feedTokens.find((f) => f.id === showQRModal)?.name || ''}
          onClose={() => setShowQRModal(null)}
        />
      )}
    </div>
  );
}

interface CreateFeedModalProps {
  onClose: () => void;
  onCreate: (data: Partial<CalendarFeedToken>) => void;
  isCreating: boolean;
  teams: typeof mockTeams;
}

function CreateFeedModal({ onClose, onCreate, isCreating, teams }: CreateFeedModalProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    feed_type: 'personal' as 'personal' | 'team',
    scope_id: '',
    include_events: true,
    include_shifts: true,
    include_private_events: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name: formData.name,
      feed_type: formData.feed_type,
      scope_id: formData.feed_type === 'team' ? formData.scope_id : null,
      include_events: formData.include_events,
      include_shifts: formData.include_shifts,
      include_private_events: formData.include_private_events,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Create Calendar Feed</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure a new calendar subscription feed
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Feed Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., My Volunteer Schedule"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Feed Type
            </label>
            <select
              value={formData.feed_type}
              onChange={(e) => setFormData({ ...formData, feed_type: e.target.value as 'personal' | 'team' })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="personal">Personal (my events & shifts)</option>
              <option value="team">Team Calendar</option>
            </select>
          </div>

          {formData.feed_type === 'team' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Team
              </label>
              <select
                required
                value={formData.scope_id}
                onChange={(e) => setFormData({ ...formData, scope_id: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Choose a team...</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Include
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.include_events}
                onChange={(e) => setFormData({ ...formData, include_events: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Events</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.include_shifts}
                onChange={(e) => setFormData({ ...formData, include_shifts: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Volunteer Shifts</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.include_private_events}
                onChange={(e) => setFormData({ ...formData, include_private_events: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Private Events</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreating}>
              Create Feed
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface QRCodeModalProps {
  feedUrl: string;
  feedName: string;
  onClose: () => void;
}

function QRCodeModal({ feedUrl, feedName, onClose }: QRCodeModalProps) {
  // Generate QR code URL using a public API
  const webcalUrl = feedUrl.replace(/^https?:/, 'webcal:');
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(webcalUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{feedName}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Scan with your phone to subscribe
        </p>

        <div className="mt-4 flex justify-center">
          <img
            src={qrCodeUrl}
            alt="Calendar subscription QR code"
            className="rounded-lg"
            width={200}
            height={200}
          />
        </div>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Works with iPhone Calendar, Google Calendar, and other calendar apps
        </p>

        <Button className="mt-4 w-full" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
