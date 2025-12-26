// ============================================
// Unified Notification Center
// ============================================
// Central hub for all notification management

// ============================================
// Types
// ============================================

export type NotificationType =
  | 'donation_received'
  | 'donation_failed'
  | 'volunteer_signup'
  | 'shift_reminder'
  | 'shift_assigned'
  | 'shift_cancelled'
  | 'event_registration'
  | 'event_reminder'
  | 'event_cancelled'
  | 'case_created'
  | 'case_updated'
  | 'case_assigned'
  | 'prayer_request'
  | 'prayer_answered'
  | 'team_invite'
  | 'team_update'
  | 'system_alert'
  | 'broadcast';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface InAppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  icon?: string;
  color?: string;
  actionUrl?: string;
  actionLabel?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
  expiresAt?: Date;
  createdAt: Date;
  readAt?: Date;
  archivedAt?: Date;
}

export interface NotificationGroup {
  date: string; // YYYY-MM-DD
  notifications: InAppNotification[];
}

export interface NotificationSummary {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}

export interface BroadcastMessage {
  id: string;
  organizationId: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  targetAudience: {
    type: 'all' | 'role' | 'team' | 'segment';
    roleIds?: string[];
    teamIds?: string[];
    segmentIds?: string[];
  };
  channels: Array<'in_app' | 'email' | 'sms' | 'push'>;
  scheduledAt?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  stats?: {
    totalRecipients: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Notification Templates
// ============================================

export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  message: string;
  icon: string;
  color: string;
  defaultPriority: NotificationPriority;
  defaultChannels: Array<'in_app' | 'email' | 'sms' | 'push'>;
}

export const NOTIFICATION_TEMPLATES: Record<NotificationType, NotificationTemplate> = {
  donation_received: {
    type: 'donation_received',
    title: 'New Donation Received',
    message: '{{donorName}} donated {{amount}}',
    icon: '💚',
    color: '#10b981',
    defaultPriority: 'normal',
    defaultChannels: ['in_app', 'email'],
  },
  donation_failed: {
    type: 'donation_failed',
    title: 'Donation Payment Failed',
    message: 'Payment from {{donorName}} failed: {{reason}}',
    icon: '⚠️',
    color: '#ef4444',
    defaultPriority: 'high',
    defaultChannels: ['in_app', 'email'],
  },
  volunteer_signup: {
    type: 'volunteer_signup',
    title: 'New Volunteer Signup',
    message: '{{volunteerName}} signed up to volunteer',
    icon: '🙋',
    color: '#3b82f6',
    defaultPriority: 'normal',
    defaultChannels: ['in_app'],
  },
  shift_reminder: {
    type: 'shift_reminder',
    title: 'Upcoming Shift Reminder',
    message: 'Your shift "{{shiftTitle}}" starts in {{timeUntil}}',
    icon: '⏰',
    color: '#f59e0b',
    defaultPriority: 'high',
    defaultChannels: ['in_app', 'email', 'sms'],
  },
  shift_assigned: {
    type: 'shift_assigned',
    title: 'New Shift Assignment',
    message: 'You\'ve been assigned to "{{shiftTitle}}" on {{date}}',
    icon: '📋',
    color: '#3b82f6',
    defaultPriority: 'normal',
    defaultChannels: ['in_app', 'email'],
  },
  shift_cancelled: {
    type: 'shift_cancelled',
    title: 'Shift Cancelled',
    message: 'The shift "{{shiftTitle}}" on {{date}} has been cancelled',
    icon: '❌',
    color: '#ef4444',
    defaultPriority: 'high',
    defaultChannels: ['in_app', 'email', 'sms'],
  },
  event_registration: {
    type: 'event_registration',
    title: 'Event Registration Confirmed',
    message: 'You\'re registered for "{{eventTitle}}" on {{date}}',
    icon: '🎉',
    color: '#8b5cf6',
    defaultPriority: 'normal',
    defaultChannels: ['in_app', 'email'],
  },
  event_reminder: {
    type: 'event_reminder',
    title: 'Event Reminder',
    message: '"{{eventTitle}}" starts in {{timeUntil}}',
    icon: '📅',
    color: '#f59e0b',
    defaultPriority: 'normal',
    defaultChannels: ['in_app', 'email'],
  },
  event_cancelled: {
    type: 'event_cancelled',
    title: 'Event Cancelled',
    message: '"{{eventTitle}}" on {{date}} has been cancelled',
    icon: '❌',
    color: '#ef4444',
    defaultPriority: 'high',
    defaultChannels: ['in_app', 'email'],
  },
  case_created: {
    type: 'case_created',
    title: 'New Case Created',
    message: 'New case for {{clientName}} - {{priority}} priority',
    icon: '📁',
    color: '#3b82f6',
    defaultPriority: 'normal',
    defaultChannels: ['in_app'],
  },
  case_updated: {
    type: 'case_updated',
    title: 'Case Updated',
    message: 'Case for {{clientName}} updated: {{status}}',
    icon: '📝',
    color: '#3b82f6',
    defaultPriority: 'normal',
    defaultChannels: ['in_app'],
  },
  case_assigned: {
    type: 'case_assigned',
    title: 'Case Assigned to You',
    message: 'You\'ve been assigned the case for {{clientName}}',
    icon: '👤',
    color: '#3b82f6',
    defaultPriority: 'high',
    defaultChannels: ['in_app', 'email'],
  },
  prayer_request: {
    type: 'prayer_request',
    title: 'New Prayer Request',
    message: 'A new prayer request has been submitted',
    icon: '🙏',
    color: '#8b5cf6',
    defaultPriority: 'normal',
    defaultChannels: ['in_app'],
  },
  prayer_answered: {
    type: 'prayer_answered',
    title: 'Prayer Marked Answered',
    message: 'A prayer request has been marked as answered',
    icon: '✨',
    color: '#10b981',
    defaultPriority: 'normal',
    defaultChannels: ['in_app'],
  },
  team_invite: {
    type: 'team_invite',
    title: 'Team Invitation',
    message: 'You\'ve been invited to join {{teamName}}',
    icon: '👥',
    color: '#3b82f6',
    defaultPriority: 'normal',
    defaultChannels: ['in_app', 'email'],
  },
  team_update: {
    type: 'team_update',
    title: 'Team Update',
    message: '{{teamName}}: {{updateMessage}}',
    icon: '📢',
    color: '#3b82f6',
    defaultPriority: 'normal',
    defaultChannels: ['in_app'],
  },
  system_alert: {
    type: 'system_alert',
    title: 'System Alert',
    message: '{{message}}',
    icon: '⚙️',
    color: '#6b7280',
    defaultPriority: 'normal',
    defaultChannels: ['in_app'],
  },
  broadcast: {
    type: 'broadcast',
    title: 'Announcement',
    message: '{{message}}',
    icon: '📣',
    color: '#3b82f6',
    defaultPriority: 'normal',
    defaultChannels: ['in_app'],
  },
};

// ============================================
// Notification Store Interface
// ============================================

export interface NotificationStore {
  // Notifications
  createNotification(notification: Omit<InAppNotification, 'id' | 'createdAt'>): Promise<InAppNotification>;
  getNotifications(userId: string, options?: {
    status?: NotificationStatus[];
    types?: NotificationType[];
    limit?: number;
    offset?: number;
    since?: Date;
  }): Promise<InAppNotification[]>;
  getNotificationById(id: string): Promise<InAppNotification | null>;
  markAsRead(ids: string[]): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  archiveNotifications(ids: string[]): Promise<void>;
  deleteNotifications(ids: string[]): Promise<void>;
  getNotificationSummary(userId: string): Promise<NotificationSummary>;

  // Broadcasts
  createBroadcast(broadcast: Omit<BroadcastMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<BroadcastMessage>;
  getBroadcasts(organizationId: string, options?: {
    status?: BroadcastMessage['status'][];
    limit?: number;
    offset?: number;
  }): Promise<BroadcastMessage[]>;
  updateBroadcast(id: string, updates: Partial<BroadcastMessage>): Promise<BroadcastMessage>;
  deleteBroadcast(id: string): Promise<void>;
}

// ============================================
// Notification Center Class
// ============================================

export interface NotificationCenterConfig {
  store: NotificationStore;
  organizationId: string;
  onNotificationCreated?: (notification: InAppNotification) => void;
  onBroadcastSent?: (broadcast: BroadcastMessage) => void;
}

export class NotificationCenter {
  private store: NotificationStore;
  private organizationId: string;
  private onNotificationCreated?: (notification: InAppNotification) => void;
  private onBroadcastSent?: (broadcast: BroadcastMessage) => void;

  constructor(config: NotificationCenterConfig) {
    this.store = config.store;
    this.organizationId = config.organizationId;
    this.onNotificationCreated = config.onNotificationCreated;
    this.onBroadcastSent = config.onBroadcastSent;
  }

  /**
   * Create a notification from a template
   */
  async createNotification(params: {
    userId: string;
    type: NotificationType;
    data: Record<string, unknown>;
    priority?: NotificationPriority;
    actionUrl?: string;
    actionLabel?: string;
    expiresAt?: Date;
  }): Promise<InAppNotification> {
    const template = NOTIFICATION_TEMPLATES[params.type];
    const title = this.interpolate(template.title, params.data);
    const message = this.interpolate(template.message, params.data);

    const notification = await this.store.createNotification({
      userId: params.userId,
      type: params.type,
      priority: params.priority || template.defaultPriority,
      status: 'unread',
      title,
      message,
      icon: template.icon,
      color: template.color,
      actionUrl: params.actionUrl,
      actionLabel: params.actionLabel,
      metadata: params.data,
      expiresAt: params.expiresAt,
    });

    this.onNotificationCreated?.(notification);
    return notification;
  }

  /**
   * Create a custom notification (not from template)
   */
  async createCustomNotification(params: {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    priority?: NotificationPriority;
    icon?: string;
    color?: string;
    actionUrl?: string;
    actionLabel?: string;
    imageUrl?: string;
    metadata?: Record<string, unknown>;
    expiresAt?: Date;
  }): Promise<InAppNotification> {
    const notification = await this.store.createNotification({
      userId: params.userId,
      type: params.type || 'system_alert',
      priority: params.priority || 'normal',
      status: 'unread',
      title: params.title,
      message: params.message,
      icon: params.icon,
      color: params.color,
      actionUrl: params.actionUrl,
      actionLabel: params.actionLabel,
      imageUrl: params.imageUrl,
      metadata: params.metadata,
      expiresAt: params.expiresAt,
    });

    this.onNotificationCreated?.(notification);
    return notification;
  }

  /**
   * Get notifications for a user
   */
  async getNotifications(userId: string, options?: {
    status?: NotificationStatus[];
    types?: NotificationType[];
    limit?: number;
    offset?: number;
    since?: Date;
  }): Promise<InAppNotification[]> {
    return this.store.getNotifications(userId, options);
  }

  /**
   * Get notifications grouped by date
   */
  async getNotificationsGrouped(userId: string, options?: {
    status?: NotificationStatus[];
    types?: NotificationType[];
    limit?: number;
  }): Promise<NotificationGroup[]> {
    const notifications = await this.store.getNotifications(userId, options);

    const groups = new Map<string, InAppNotification[]>();
    for (const notification of notifications) {
      const date = notification.createdAt.toISOString().split('T')[0] || '';
      if (!groups.has(date)) {
        groups.set(date, []);
      }
      const group = groups.get(date);
      if (group) {
        group.push(notification);
      }
    }

    return Array.from(groups.entries())
      .map(([date, notifications]) => ({ date, notifications }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  /**
   * Get notification summary for a user
   */
  async getNotificationSummary(userId: string): Promise<NotificationSummary> {
    return this.store.getNotificationSummary(userId);
  }

  /**
   * Mark notifications as read
   */
  async markAsRead(ids: string[]): Promise<void> {
    return this.store.markAsRead(ids);
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    return this.store.markAllAsRead(userId);
  }

  /**
   * Archive notifications
   */
  async archiveNotifications(ids: string[]): Promise<void> {
    return this.store.archiveNotifications(ids);
  }

  /**
   * Delete notifications
   */
  async deleteNotifications(ids: string[]): Promise<void> {
    return this.store.deleteNotifications(ids);
  }

  /**
   * Create a broadcast message
   */
  async createBroadcast(params: {
    title: string;
    message: string;
    priority?: NotificationPriority;
    targetAudience: BroadcastMessage['targetAudience'];
    channels: BroadcastMessage['channels'];
    scheduledAt?: Date;
    createdBy: string;
  }): Promise<BroadcastMessage> {
    return this.store.createBroadcast({
      organizationId: this.organizationId,
      title: params.title,
      message: params.message,
      priority: params.priority || 'normal',
      targetAudience: params.targetAudience,
      channels: params.channels,
      scheduledAt: params.scheduledAt,
      status: params.scheduledAt ? 'scheduled' : 'draft',
      createdBy: params.createdBy,
    });
  }

  /**
   * Send a broadcast immediately
   */
  async sendBroadcast(broadcastId: string, recipientUserIds: string[]): Promise<void> {
    const broadcast = await this.store.updateBroadcast(broadcastId, {
      status: 'sending',
    });

    if (!broadcast) {
      throw new Error('Broadcast not found');
    }

    // Create in-app notifications for all recipients
    if (broadcast.channels.includes('in_app')) {
      for (const userId of recipientUserIds) {
        await this.createCustomNotification({
          userId,
          title: broadcast.title,
          message: broadcast.message,
          type: 'broadcast',
          priority: broadcast.priority,
        });
      }
    }

    // Update broadcast stats
    await this.store.updateBroadcast(broadcastId, {
      status: 'sent',
      sentAt: new Date(),
      stats: {
        totalRecipients: recipientUserIds.length,
        delivered: recipientUserIds.length,
        opened: 0,
        clicked: 0,
        failed: 0,
      },
    });

    this.onBroadcastSent?.(broadcast);
  }

  /**
   * Get broadcasts for the organization
   */
  async getBroadcasts(options?: {
    status?: BroadcastMessage['status'][];
    limit?: number;
    offset?: number;
  }): Promise<BroadcastMessage[]> {
    return this.store.getBroadcasts(this.organizationId, options);
  }

  /**
   * Interpolate template variables
   */
  private interpolate(template: string, data: Record<string, unknown>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = data[key];
      if (value === undefined || value === null) return match;
      return String(value);
    });
  }
}

// ============================================
// In-Memory Notification Store (for dev/testing)
// ============================================

export class InMemoryNotificationStore implements NotificationStore {
  private notifications: Map<string, InAppNotification> = new Map();
  private broadcasts: Map<string, BroadcastMessage> = new Map();
  private idCounter = 1;

  async createNotification(
    notification: Omit<InAppNotification, 'id' | 'createdAt'>
  ): Promise<InAppNotification> {
    const id = `notif_${this.idCounter++}`;
    const fullNotification: InAppNotification = {
      ...notification,
      id,
      createdAt: new Date(),
    };
    this.notifications.set(id, fullNotification);
    return fullNotification;
  }

  async getNotifications(
    userId: string,
    options?: {
      status?: NotificationStatus[];
      types?: NotificationType[];
      limit?: number;
      offset?: number;
      since?: Date;
    }
  ): Promise<InAppNotification[]> {
    let notifications = Array.from(this.notifications.values())
      .filter((n) => n.userId === userId);

    if (options?.status?.length) {
      notifications = notifications.filter((n) => options.status!.includes(n.status));
    }

    if (options?.types?.length) {
      notifications = notifications.filter((n) => options.types!.includes(n.type));
    }

    if (options?.since) {
      notifications = notifications.filter((n) => n.createdAt >= options.since!);
    }

    notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (options?.offset) {
      notifications = notifications.slice(options.offset);
    }

    if (options?.limit) {
      notifications = notifications.slice(0, options.limit);
    }

    return notifications;
  }

  async getNotificationById(id: string): Promise<InAppNotification | null> {
    return this.notifications.get(id) || null;
  }

  async markAsRead(ids: string[]): Promise<void> {
    for (const id of ids) {
      const notification = this.notifications.get(id);
      if (notification && notification.status === 'unread') {
        notification.status = 'read';
        notification.readAt = new Date();
      }
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    for (const notification of this.notifications.values()) {
      if (notification.userId === userId && notification.status === 'unread') {
        notification.status = 'read';
        notification.readAt = new Date();
      }
    }
  }

  async archiveNotifications(ids: string[]): Promise<void> {
    for (const id of ids) {
      const notification = this.notifications.get(id);
      if (notification) {
        notification.status = 'archived';
        notification.archivedAt = new Date();
      }
    }
  }

  async deleteNotifications(ids: string[]): Promise<void> {
    for (const id of ids) {
      this.notifications.delete(id);
    }
  }

  async getNotificationSummary(userId: string): Promise<NotificationSummary> {
    const notifications = Array.from(this.notifications.values())
      .filter((n) => n.userId === userId && n.status !== 'archived');

    const summary: NotificationSummary = {
      total: notifications.length,
      unread: notifications.filter((n) => n.status === 'unread').length,
      byType: {} as Record<NotificationType, number>,
      byPriority: {} as Record<NotificationPriority, number>,
    };

    for (const n of notifications) {
      summary.byType[n.type] = (summary.byType[n.type] || 0) + 1;
      summary.byPriority[n.priority] = (summary.byPriority[n.priority] || 0) + 1;
    }

    return summary;
  }

  async createBroadcast(
    broadcast: Omit<BroadcastMessage, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<BroadcastMessage> {
    const id = `broadcast_${this.idCounter++}`;
    const now = new Date();
    const fullBroadcast: BroadcastMessage = {
      ...broadcast,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.broadcasts.set(id, fullBroadcast);
    return fullBroadcast;
  }

  async getBroadcasts(
    organizationId: string,
    options?: {
      status?: BroadcastMessage['status'][];
      limit?: number;
      offset?: number;
    }
  ): Promise<BroadcastMessage[]> {
    let broadcasts = Array.from(this.broadcasts.values())
      .filter((b) => b.organizationId === organizationId);

    if (options?.status?.length) {
      broadcasts = broadcasts.filter((b) => options.status!.includes(b.status));
    }

    broadcasts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (options?.offset) {
      broadcasts = broadcasts.slice(options.offset);
    }

    if (options?.limit) {
      broadcasts = broadcasts.slice(0, options.limit);
    }

    return broadcasts;
  }

  async updateBroadcast(
    id: string,
    updates: Partial<BroadcastMessage>
  ): Promise<BroadcastMessage> {
    const broadcast = this.broadcasts.get(id);
    if (!broadcast) {
      throw new Error(`Broadcast ${id} not found`);
    }

    const updated = { ...broadcast, ...updates, updatedAt: new Date() };
    this.broadcasts.set(id, updated);
    return updated;
  }

  async deleteBroadcast(id: string): Promise<void> {
    this.broadcasts.delete(id);
  }
}

// ============================================
// Real-time Notification Helpers
// ============================================

export interface NotificationEvent {
  type: 'notification_created' | 'notification_read' | 'notification_deleted' | 'broadcast_sent';
  userId?: string;
  notification?: InAppNotification;
  notificationIds?: string[];
  broadcast?: BroadcastMessage;
  timestamp: Date;
}

/**
 * Format a notification for real-time display
 */
export function formatNotificationForDisplay(notification: InAppNotification): {
  id: string;
  title: string;
  message: string;
  icon: string;
  color: string;
  isUnread: boolean;
  timeAgo: string;
  actionUrl?: string;
} {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    icon: notification.icon || '🔔',
    color: notification.color || '#3b82f6',
    isUnread: notification.status === 'unread',
    timeAgo: formatTimeAgo(notification.createdAt),
    actionUrl: notification.actionUrl,
  };
}

/**
 * Format time ago for display
 */
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

/**
 * Group notifications by relative date
 */
export function groupNotificationsByRelativeDate(
  notifications: InAppNotification[]
): Array<{ label: string; notifications: InAppNotification[] }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());

  const groups: Map<string, InAppNotification[]> = new Map();
  groups.set('Today', []);
  groups.set('Yesterday', []);
  groups.set('This Week', []);
  groups.set('Earlier', []);

  for (const notification of notifications) {
    const notifDate = new Date(notification.createdAt);
    notifDate.setHours(0, 0, 0, 0);

    if (notifDate.getTime() === today.getTime()) {
      groups.get('Today')!.push(notification);
    } else if (notifDate.getTime() === yesterday.getTime()) {
      groups.get('Yesterday')!.push(notification);
    } else if (notifDate >= thisWeekStart) {
      groups.get('This Week')!.push(notification);
    } else {
      groups.get('Earlier')!.push(notification);
    }
  }

  return Array.from(groups.entries())
    .filter(([_, notifications]) => notifications.length > 0)
    .map(([label, notifications]) => ({ label, notifications }));
}
