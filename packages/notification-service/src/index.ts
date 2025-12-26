/**
 * @acts29/notification-service
 *
 * Unified notification service that orchestrates email, SMS, push, and in-app
 * notifications based on user preferences and organizational settings.
 */

// Types are defined locally since they may not be available in all build contexts
// In production, these would be imported from @acts29/database

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export type NotificationCategory =
  | 'donations'
  | 'volunteers'
  | 'events'
  | 'cases'
  | 'prayer'
  | 'teams'
  | 'system';

export type NotificationType =
  | 'donation_received'
  | 'donation_large'
  | 'donation_recurring_failed'
  | 'shift_reminder'
  | 'shift_assigned'
  | 'shift_cancelled'
  | 'shift_updated'
  | 'event_reminder'
  | 'event_registered'
  | 'event_cancelled'
  | 'case_assigned'
  | 'case_updated'
  | 'case_resolved'
  | 'prayer_received'
  | 'prayer_update'
  | 'team_announcement'
  | 'team_member_added'
  | 'team_member_removed'
  | 'weekly_summary'
  | 'system_announcement'
  | 'donor_receipt'
  | 'donor_annual_statement'
  | 'volunteer_hours_logged'
  | 'volunteer_milestone'
  | 'event_follow_up'
  | 'donation_thank_you'
  | 'prayer_answered';

export type NotificationStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled';

export interface NotificationSettings {
  id: string;
  user_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  quiet_hours_timezone: string;
  digest_frequency: 'immediate' | 'daily' | 'weekly' | 'none';
  digest_time: string;
  sms_opted_in: boolean;
  sms_phone_number?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  notification_type: NotificationType;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    in_app: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface QueuedNotification {
  id: string;
  user_id: string;
  organization_id: string;
  notification_type: NotificationType;
  channels: NotificationChannel[];
  payload: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
    action_url?: string;
  };
  status: NotificationStatus;
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
  retry_count: number;
  last_error?: string;
}

export interface NotificationLog {
  id: string;
  queued_notification_id: string;
  channel: NotificationChannel;
  status: 'delivered' | 'bounced' | 'failed' | 'opened' | 'clicked';
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  response_data?: Record<string, unknown>;
}


// ============================================
// Core Types
// ============================================

export interface NotificationRecipient {
  userId: string;
  email?: string;
  phone?: string;
  pushToken?: string;
  name?: string;
}

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  actionUrl?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface SendNotificationParams {
  recipient: NotificationRecipient;
  payload: NotificationPayload;
  organizationId: string;
  scheduledFor?: Date;
  channels?: NotificationChannel[]; // Override default channels
}

export interface NotificationResult {
  notificationId: string;
  channels: {
    email?: { success: boolean; messageId?: string; error?: string };
    sms?: { success: boolean; messageId?: string; error?: string };
    push?: { success: boolean; messageId?: string; error?: string };
    in_app?: { success: boolean; notificationId?: string; error?: string };
  };
  status: 'delivered' | 'partial' | 'failed';
}

export interface NotificationServiceConfig {
  defaultFromEmail?: string;
  defaultFromName?: string;
  enableDigest?: boolean;
  digestBatchSize?: number;
  maxRetries?: number;
  retryDelayMs?: number;
}

// ============================================
// Notification Queue (In-Memory for Demo)
// ============================================

// In production, this would be backed by Redis/database
const notificationQueue: Map<string, QueuedNotification> = new Map();
const notificationLogs: NotificationLog[] = [];

let queueIdCounter = 1;

function generateQueueId(): string {
  return `notif-${Date.now()}-${queueIdCounter++}`;
}

// ============================================
// User Preferences Cache
// ============================================

// In production, this would fetch from database
const preferencesCache: Map<string, {
  settings: NotificationSettings;
  preferences: NotificationPreference[];
  cachedAt: number;
}> = new Map();

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getUserPreferences(
  userId: string
): Promise<{ settings: NotificationSettings | null; preferences: NotificationPreference[] }> {
  const cached = preferencesCache.get(userId);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return { settings: cached.settings, preferences: cached.preferences };
  }

  // In production: fetch from database
  // const settings = await db.notificationSettings.findUnique({ where: { user_id: userId } });
  // const preferences = await db.notificationPreferences.findMany({ where: { user_id: userId } });

  // For demo, return null to use defaults
  return { settings: null, preferences: [] };
}

export function invalidatePreferencesCache(userId: string): void {
  preferencesCache.delete(userId);
}

// ============================================
// Channel Availability Check
// ============================================

export function isChannelAvailable(
  recipient: NotificationRecipient,
  channel: NotificationChannel,
  settings: NotificationSettings | null
): boolean {
  // Check if recipient has the necessary contact info
  switch (channel) {
    case 'email':
      if (!recipient.email) return false;
      return settings?.email_enabled ?? true;
    case 'sms':
      if (!recipient.phone) return false;
      return (settings?.sms_enabled ?? false) && (settings?.sms_opted_in ?? false);
    case 'push':
      if (!recipient.pushToken) return false;
      return settings?.push_enabled ?? false;
    case 'in_app':
      return true; // Always available for logged-in users
  }
}

// ============================================
// Quiet Hours Check
// ============================================

export function isInQuietHours(
  settings: NotificationSettings | null,
  channel: NotificationChannel
): boolean {
  if (!settings?.quiet_hours_enabled) return false;

  // Quiet hours only apply to SMS and push
  if (channel !== 'sms' && channel !== 'push') return false;

  const now = new Date();
  const timezone = settings.quiet_hours_timezone || 'America/Chicago';

  // Get current time in user's timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const currentTime = formatter.format(now);

  const start = settings.quiet_hours_start;
  const end = settings.quiet_hours_end;

  // Handle overnight quiet hours (e.g., 22:00 - 07:00)
  if (start > end) {
    return currentTime >= start || currentTime < end;
  }

  return currentTime >= start && currentTime < end;
}

// ============================================
// Channel-Specific Send Functions
// ============================================

async function sendEmailNotification(
  recipient: NotificationRecipient,
  payload: NotificationPayload,
  _organizationId: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // In production: use @acts29/email-service
  // For demo, simulate sending
  console.log(`[Email] Sending to ${recipient.email}: ${payload.title}`);

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));

  return { success: true, messageId: `email-${Date.now()}` };
}

async function sendSMSNotification(
  recipient: NotificationRecipient,
  payload: NotificationPayload,
  _organizationId: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // In production: use @acts29/sms-service
  // For demo, simulate sending
  console.log(`[SMS] Sending to ${recipient.phone}: ${payload.body}`);

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));

  return { success: true, messageId: `sms-${Date.now()}` };
}

async function sendPushNotification(
  recipient: NotificationRecipient,
  payload: NotificationPayload,
  _organizationId: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // In production: use web-push or Firebase Cloud Messaging
  // For demo, simulate sending
  console.log(`[Push] Sending to ${recipient.pushToken}: ${payload.title}`);

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));

  return { success: true, messageId: `push-${Date.now()}` };
}

async function createInAppNotification(
  recipient: NotificationRecipient,
  payload: NotificationPayload,
  _organizationId: string
): Promise<{ success: boolean; notificationId?: string; error?: string }> {
  // In production: store in database
  // For demo, simulate creating
  const notificationId = `inapp-${Date.now()}`;
  console.log(`[In-App] Creating for ${recipient.userId}: ${payload.title}`);

  // In production:
  // await db.inAppNotifications.create({
  //   data: {
  //     id: notificationId,
  //     user_id: recipient.userId,
  //     organization_id: organizationId,
  //     type: payload.type,
  //     title: payload.title,
  //     body: payload.body,
  //     data: payload.data,
  //     action_url: payload.actionUrl,
  //     read: false,
  //     created_at: new Date(),
  //   },
  // });

  return { success: true, notificationId };
}

// ============================================
// Main Send Function
// ============================================

export async function sendNotification(
  params: SendNotificationParams
): Promise<NotificationResult> {
  const { recipient, payload, organizationId, scheduledFor, channels: overrideChannels } = params;
  const notificationId = generateQueueId();

  // Get user preferences
  const { settings, preferences } = await getUserPreferences(recipient.userId);

  // Determine which channels to use
  let channelsToUse: NotificationChannel[];

  if (overrideChannels) {
    // Use specified channels (respecting user preferences)
    channelsToUse = overrideChannels.filter((channel) =>
      isChannelAvailable(recipient, channel, settings)
    );
  } else {
    // Use user preferences for this notification type
    const userPref = preferences.find((p) => p.notification_type === payload.type);

    if (userPref) {
      channelsToUse = Object.entries(userPref.channels)
        .filter(([_, enabled]) => enabled)
        .map(([channel]) => channel as NotificationChannel)
        .filter((channel) => isChannelAvailable(recipient, channel, settings));
    } else {
      // Fall back to notification type defaults
      // In production, would import notificationTypeConfigs
      channelsToUse = ['email', 'in_app'].filter((channel) =>
        isChannelAvailable(recipient, channel as NotificationChannel, settings)
      ) as NotificationChannel[];
    }
  }

  // Check for scheduled delivery
  if (scheduledFor && scheduledFor > new Date()) {
    // Queue for later delivery
    const queuedNotification: QueuedNotification = {
      id: notificationId,
      user_id: recipient.userId,
      organization_id: organizationId,
      notification_type: payload.type,
      channels: channelsToUse,
      payload: {
        title: payload.title,
        body: payload.body,
        data: payload.data,
        action_url: payload.actionUrl,
      },
      status: 'pending',
      scheduled_for: scheduledFor.toISOString(),
      created_at: new Date().toISOString(),
      retry_count: 0,
    };

    notificationQueue.set(notificationId, queuedNotification);

    return {
      notificationId,
      channels: {},
      status: 'partial', // Queued for later
    };
  }

  // Send immediately
  const results: NotificationResult['channels'] = {};

  for (const channel of channelsToUse) {
    // Skip if in quiet hours
    if (isInQuietHours(settings, channel)) {
      // Queue for after quiet hours
      console.log(`[${channel}] Skipping due to quiet hours`);
      continue;
    }

    try {
      switch (channel) {
        case 'email':
          results.email = await sendEmailNotification(recipient, payload, organizationId);
          break;
        case 'sms':
          results.sms = await sendSMSNotification(recipient, payload, organizationId);
          break;
        case 'push':
          results.push = await sendPushNotification(recipient, payload, organizationId);
          break;
        case 'in_app':
          results.in_app = await createInAppNotification(recipient, payload, organizationId);
          break;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results[channel] = { success: false, error: errorMessage };
    }
  }

  // Log the notification
  const log: NotificationLog = {
    id: notificationId,
    queued_notification_id: notificationId,
    channel: channelsToUse[0] || 'email', // Primary channel
    status: Object.values(results).some((r) => r?.success) ? 'delivered' : 'failed',
    sent_at: new Date().toISOString(),
    response_data: results,
  };
  notificationLogs.push(log);

  // Determine overall status
  const channelResults = Object.values(results).filter(Boolean);
  const successCount = channelResults.filter((r) => r?.success).length;
  let status: NotificationResult['status'];

  if (successCount === channelResults.length) {
    status = 'delivered';
  } else if (successCount > 0) {
    status = 'partial';
  } else {
    status = 'failed';
  }

  return {
    notificationId,
    channels: results,
    status,
  };
}

// ============================================
// Batch/Bulk Sending
// ============================================

export interface BulkNotificationParams {
  recipients: NotificationRecipient[];
  payload: NotificationPayload;
  organizationId: string;
}

export async function sendBulkNotification(
  params: BulkNotificationParams
): Promise<{ sent: number; failed: number; results: NotificationResult[] }> {
  const { recipients, payload, organizationId } = params;
  const results: NotificationResult[] = [];
  let sent = 0;
  let failed = 0;

  // Process in batches to avoid overwhelming services
  const BATCH_SIZE = 10;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map((recipient) =>
        sendNotification({ recipient, payload, organizationId })
      )
    );

    for (const result of batchResults) {
      results.push(result);
      if (result.status === 'delivered' || result.status === 'partial') {
        sent++;
      } else {
        failed++;
      }
    }
  }

  return { sent, failed, results };
}

// ============================================
// Digest Management
// ============================================

export interface DigestEntry {
  type: NotificationType;
  title: string;
  body: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

const digestQueue: Map<string, DigestEntry[]> = new Map();

export function queueForDigest(
  userId: string,
  entry: DigestEntry
): void {
  const existing = digestQueue.get(userId) || [];
  existing.push(entry);
  digestQueue.set(userId, existing);
}

export async function sendDigest(
  userId: string,
  recipient: NotificationRecipient,
  organizationId: string
): Promise<NotificationResult | null> {
  const entries = digestQueue.get(userId);
  if (!entries || entries.length === 0) {
    return null;
  }

  // Build digest content
  const digestBody = entries
    .map((e) => `${e.title}\n${e.body}`)
    .join('\n\n---\n\n');

  const result = await sendNotification({
    recipient,
    payload: {
      type: 'weekly_summary',
      title: `Your digest: ${entries.length} updates`,
      body: digestBody,
      priority: 'low',
    },
    organizationId,
    channels: ['email'], // Digest is email-only
  });

  // Clear the digest queue
  digestQueue.delete(userId);

  return result;
}

// ============================================
// Queue Processing (for scheduled notifications)
// ============================================

export async function processQueue(): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
}> {
  const now = new Date();
  let processed = 0;
  let succeeded = 0;
  let failed = 0;

  for (const [_id, notification] of notificationQueue.entries()) {
    if (notification.status !== 'pending') continue;

    const scheduledFor = new Date(notification.scheduled_for || now);
    if (scheduledFor > now) continue;

    processed++;

    try {
      // Mark as processing
      notification.status = 'processing';

      // In production, would fetch recipient from database
      const result = await sendNotification({
        recipient: {
          userId: notification.user_id,
          // Would fetch email/phone from profile
        },
        payload: {
          type: notification.notification_type,
          title: notification.payload.title,
          body: notification.payload.body,
          data: notification.payload.data,
          actionUrl: notification.payload.action_url,
        },
        organizationId: notification.organization_id,
      });

      if (result.status === 'delivered' || result.status === 'partial') {
        notification.status = 'sent';
        notification.sent_at = new Date().toISOString();
        succeeded++;
      } else {
        throw new Error('All channels failed');
      }
    } catch (error) {
      notification.retry_count++;
      notification.last_error = error instanceof Error ? error.message : 'Unknown error';

      if (notification.retry_count >= 3) {
        notification.status = 'failed';
      } else {
        notification.status = 'pending'; // Will retry
      }

      failed++;
    }
  }

  return { processed, succeeded, failed };
}

// ============================================
// Notification Templates
// ============================================

export interface NotificationTemplate {
  type: NotificationType;
  getEmailSubject: (data: Record<string, unknown>) => string;
  getEmailBody: (data: Record<string, unknown>) => string;
  getSMSBody: (data: Record<string, unknown>) => string;
  getPushTitle: (data: Record<string, unknown>) => string;
  getPushBody: (data: Record<string, unknown>) => string;
}

const templates: Map<NotificationType, NotificationTemplate> = new Map();

export function registerTemplate(template: NotificationTemplate): void {
  templates.set(template.type, template);
}

export function getTemplate(type: NotificationType): NotificationTemplate | undefined {
  return templates.get(type);
}

// ============================================
// Built-in Templates
// ============================================

// Donation received template
registerTemplate({
  type: 'donation_received',
  getEmailSubject: (data) => `Thank you for your donation of $${data.amount}!`,
  getEmailBody: (data) =>
    `Dear ${data.donorName},\n\nThank you for your generous donation of $${data.amount}. Your gift helps us serve those in need.\n\nGod bless you,\nActs 29 Ministry`,
  getSMSBody: (data) =>
    `Thank you, ${data.donorName}! Your gift of $${data.amount} has been received. God bless you! - Acts 29`,
  getPushTitle: () => 'Donation Received',
  getPushBody: (data) => `Thank you for your gift of $${data.amount}!`,
});

// Shift reminder template
registerTemplate({
  type: 'shift_reminder',
  getEmailSubject: (data) => `Reminder: Your shift "${data.shiftTitle}" is coming up`,
  getEmailBody: (data) =>
    `Hi ${data.volunteerName},\n\nThis is a reminder that you're scheduled for "${data.shiftTitle}" on ${data.shiftDate} at ${data.shiftTime}.\n\nLocation: ${data.shiftLocation}\n\nThank you for serving!\nActs 29 Ministry`,
  getSMSBody: (data) =>
    `Hi ${data.volunteerName}! Reminder: "${data.shiftTitle}" on ${data.shiftDate} at ${data.shiftTime}. Location: ${data.shiftLocation}. - Acts 29`,
  getPushTitle: () => 'Shift Reminder',
  getPushBody: (data) => `Your shift "${data.shiftTitle}" is tomorrow at ${data.shiftTime}`,
});

// Event reminder template
registerTemplate({
  type: 'event_reminder',
  getEmailSubject: (data) => `Reminder: ${data.eventTitle} is coming up`,
  getEmailBody: (data) =>
    `Hi ${data.recipientName},\n\nThis is a reminder about "${data.eventTitle}" on ${data.eventDate} at ${data.eventTime}.\n\nLocation: ${data.eventLocation}\n\nWe hope to see you there!\nActs 29 Ministry`,
  getSMSBody: (data) =>
    `Hi ${data.recipientName}! Don't forget: "${data.eventTitle}" on ${data.eventDate} at ${data.eventTime}. - Acts 29`,
  getPushTitle: () => 'Event Reminder',
  getPushBody: (data) => `"${data.eventTitle}" is coming up on ${data.eventDate}`,
});

// Prayer request update template
registerTemplate({
  type: 'prayer_update',
  getEmailSubject: () => 'Prayer Request Update',
  getEmailBody: (data) =>
    `Dear ${data.requesterName},\n\n${data.message}\n\nIn Christ,\nActs 29 Prayer Team`,
  getSMSBody: (data) => `Hi ${data.requesterName}, ${data.message} - Acts 29 Prayer Team`,
  getPushTitle: () => 'Prayer Update',
  getPushBody: (data) => data.message as string,
});

// ============================================
// Utility Functions
// ============================================

export function getQueueStats(): {
  pending: number;
  processing: number;
  sent: number;
  failed: number;
} {
  let pending = 0;
  let processing = 0;
  let sent = 0;
  let failed = 0;

  for (const notification of notificationQueue.values()) {
    switch (notification.status) {
      case 'pending':
        pending++;
        break;
      case 'processing':
        processing++;
        break;
      case 'sent':
        sent++;
        break;
      case 'failed':
        failed++;
        break;
    }
  }

  return { pending, processing, sent, failed };
}

export function getRecentLogs(limit: number = 50): NotificationLog[] {
  return notificationLogs.slice(-limit);
}

export function clearQueue(): void {
  notificationQueue.clear();
}

export function clearLogs(): void {
  notificationLogs.length = 0;
}
