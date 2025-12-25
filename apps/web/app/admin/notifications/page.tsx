'use client';

import { useState } from 'react';
import { PageHeader } from '@acts29/admin-ui';
import {
  MessageSquare,
  Bell,
  AlertTriangle,
  Calendar,
  Heart,
  Send,
  CheckCircle,
  XCircle,
} from 'lucide-react';

type NotificationType =
  | 'shift_reminder'
  | 'emergency_alert'
  | 'event_reminder'
  | 'prayer_update';

interface NotificationTemplate {
  type: NotificationType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const templates: NotificationTemplate[] = [
  {
    type: 'shift_reminder',
    label: 'Shift Reminder',
    icon: Calendar,
    description: 'Remind volunteers about upcoming shifts',
  },
  {
    type: 'emergency_alert',
    label: 'Emergency Alert',
    icon: AlertTriangle,
    description: 'Send urgent alerts to volunteers or clients',
  },
  {
    type: 'event_reminder',
    label: 'Event Reminder',
    icon: Bell,
    description: 'Remind attendees about upcoming events',
  },
  {
    type: 'prayer_update',
    label: 'Prayer Update',
    icon: Heart,
    description: 'Send prayer request updates',
  },
];

export default function NotificationsPage() {
  const [selectedType, setSelectedType] = useState<NotificationType | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Form state for each type
  const [shiftForm, setShiftForm] = useState({
    volunteerName: '',
    volunteerPhone: '',
    shiftTitle: '',
    shiftDate: '',
    shiftTime: '',
    shiftLocation: '',
  });

  const [alertForm, setAlertForm] = useState({
    alertType: 'general' as 'weather' | 'safety' | 'resource' | 'general',
    title: '',
    message: '',
    actionRequired: '',
    recipients: '',
  });

  const [eventForm, setEventForm] = useState({
    recipientName: '',
    recipientPhone: '',
    eventTitle: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
  });

  const [prayerForm, setPrayerForm] = useState({
    requesterName: '',
    requesterPhone: '',
    updateType: 'received' as 'received' | 'praying' | 'answered',
  });

  const handleSend = async () => {
    setSending(true);
    setResult(null);

    try {
      let payload: Record<string, unknown>;

      switch (selectedType) {
        case 'shift_reminder':
          payload = { type: 'shift_reminder', ...shiftForm };
          break;
        case 'emergency_alert':
          payload = {
            type: 'emergency_alert',
            ...alertForm,
            recipients: alertForm.recipients.split(',').map((r) => r.trim()),
          };
          break;
        case 'event_reminder':
          payload = { type: 'event_reminder', ...eventForm };
          break;
        case 'prayer_update':
          payload = { type: 'prayer_update', ...prayerForm };
          break;
        default:
          throw new Error('Invalid notification type');
      }

      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setResult({ success: true, message: data.message || 'Notification sent successfully' });
      } else {
        setResult({ success: false, message: data.error || 'Failed to send notification' });
      }
    } catch {
      setResult({ success: false, message: 'An error occurred while sending the notification' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SMS Notifications"
        description="Send SMS notifications to volunteers, donors, and clients"
      />

      {/* Notification Type Selection */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedType === template.type;

          return (
            <button
              key={template.type}
              onClick={() => {
                setSelectedType(template.type);
                setResult(null);
              }}
              className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 text-left transition ${
                isSelected
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-primary-300'
              }`}
            >
              <Icon className={`h-8 w-8 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
              <div className="text-center">
                <p className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                  {template.label}
                </p>
                <p className="mt-1 text-sm text-gray-500">{template.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Notification Form */}
      {selectedType && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <MessageSquare className="h-5 w-5" />
            Compose {templates.find((t) => t.type === selectedType)?.label}
          </h3>

          {/* Shift Reminder Form */}
          {selectedType === 'shift_reminder' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Volunteer Name</label>
                <input
                  type="text"
                  value={shiftForm.volunteerName}
                  onChange={(e) => setShiftForm({ ...shiftForm, volunteerName: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={shiftForm.volunteerPhone}
                  onChange={(e) => setShiftForm({ ...shiftForm, volunteerPhone: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="+1 (555) 555-5555"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Shift Title</label>
                <input
                  type="text"
                  value={shiftForm.shiftTitle}
                  onChange={(e) => setShiftForm({ ...shiftForm, shiftTitle: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Food Distribution"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={shiftForm.shiftLocation}
                  onChange={(e) => setShiftForm({ ...shiftForm, shiftLocation: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="First Baptist Church"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="text"
                  value={shiftForm.shiftDate}
                  onChange={(e) => setShiftForm({ ...shiftForm, shiftDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Saturday, January 6th"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="text"
                  value={shiftForm.shiftTime}
                  onChange={(e) => setShiftForm({ ...shiftForm, shiftTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="9:00 AM - 12:00 PM"
                />
              </div>
            </div>
          )}

          {/* Emergency Alert Form */}
          {selectedType === 'emergency_alert' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Alert Type</label>
                <select
                  value={alertForm.alertType}
                  onChange={(e) =>
                    setAlertForm({
                      ...alertForm,
                      alertType: e.target.value as typeof alertForm.alertType,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="general">General Alert</option>
                  <option value="weather">Weather Alert</option>
                  <option value="safety">Safety Alert</option>
                  <option value="resource">Resource Alert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={alertForm.title}
                  onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Warming Center Open"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  value={alertForm.message}
                  onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Due to extreme cold, warming center is open at..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Action Required (optional)
                </label>
                <input
                  type="text"
                  value={alertForm.actionRequired}
                  onChange={(e) => setAlertForm({ ...alertForm, actionRequired: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Please share with anyone in need"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Recipients (comma-separated phone numbers)
                </label>
                <textarea
                  value={alertForm.recipients}
                  onChange={(e) => setAlertForm({ ...alertForm, recipients: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="+15555555555, +15555555556"
                />
              </div>
            </div>
          )}

          {/* Event Reminder Form */}
          {selectedType === 'event_reminder' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
                <input
                  type="text"
                  value={eventForm.recipientName}
                  onChange={(e) => setEventForm({ ...eventForm, recipientName: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={eventForm.recipientPhone}
                  onChange={(e) => setEventForm({ ...eventForm, recipientPhone: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="+1 (555) 555-5555"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  type="text"
                  value={eventForm.eventTitle}
                  onChange={(e) => setEventForm({ ...eventForm, eventTitle: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Community Dinner"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={eventForm.eventLocation}
                  onChange={(e) => setEventForm({ ...eventForm, eventLocation: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Community Center"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="text"
                  value={eventForm.eventDate}
                  onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Friday, January 5th"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="text"
                  value={eventForm.eventTime}
                  onChange={(e) => setEventForm({ ...eventForm, eventTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="6:00 PM"
                />
              </div>
            </div>
          )}

          {/* Prayer Update Form */}
          {selectedType === 'prayer_update' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Requester Name</label>
                <input
                  type="text"
                  value={prayerForm.requesterName}
                  onChange={(e) => setPrayerForm({ ...prayerForm, requesterName: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Mary Johnson"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={prayerForm.requesterPhone}
                  onChange={(e) => setPrayerForm({ ...prayerForm, requesterPhone: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="+1 (555) 555-5555"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Update Type</label>
                <select
                  value={prayerForm.updateType}
                  onChange={(e) =>
                    setPrayerForm({
                      ...prayerForm,
                      updateType: e.target.value as typeof prayerForm.updateType,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="received">Request Received</option>
                  <option value="praying">Currently Praying</option>
                  <option value="answered">Prayer Answered</option>
                </select>
              </div>
            </div>
          )}

          {/* Result Message */}
          {result && (
            <div
              className={`mt-4 flex items-center gap-2 rounded-lg p-4 ${
                result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {result.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              {result.message}
            </div>
          )}

          {/* Send Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2 font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </div>
      )}

      {/* Recent Notifications */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Recent Notifications</h3>
        <div className="text-center text-gray-500 py-8">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2">No recent notifications</p>
          <p className="text-sm">
            Sent notifications will appear here once the SMS service is connected.
          </p>
        </div>
      </div>
    </div>
  );
}
