'use client';

import * as React from 'react';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Settings,
  DollarSign,
  UserCheck,
  Calendar,
  Briefcase,
  Heart,
  FileText,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn, formatDateTime } from '../../lib/utils';
import type { Activity, ActivityType } from '@acts29/database';

const activityConfig: Record<
  ActivityType,
  { icon: LucideIcon; color: string; bgColor: string }
> = {
  donation_received: { icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
  donation_refunded: { icon: DollarSign, color: 'text-red-600', bgColor: 'bg-red-100' },
  volunteer_checked_in: { icon: UserCheck, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  volunteer_checked_out: { icon: UserCheck, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  shift_scheduled: { icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  shift_completed: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  shift_cancelled: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
  case_created: { icon: Briefcase, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  case_updated: { icon: Briefcase, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  case_closed: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  event_created: { icon: Calendar, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  event_registration: { icon: Users, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  prayer_request: { icon: Heart, color: 'text-pink-600', bgColor: 'bg-pink-100' },
  content_published: { icon: FileText, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  team_member_added: { icon: Users, color: 'text-teal-600', bgColor: 'bg-teal-100' },
  resource_updated: { icon: MapPin, color: 'text-orange-600', bgColor: 'bg-orange-100' },
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateTime(timestamp);
}

interface NotificationItemProps {
  notification: Activity;
  onMarkRead?: (id: string) => void;
  onClick?: (notification: Activity) => void;
}

function NotificationItem({ notification, onMarkRead, onClick }: NotificationItemProps) {
  const config = activityConfig[notification.type];
  const Icon = config?.icon ?? AlertCircle;

  return (
    <div
      className={cn(
        'flex gap-3 p-3 transition-colors border-b last:border-b-0',
        onClick && 'cursor-pointer hover:bg-gray-50',
        !notification.read && 'bg-blue-50/50'
      )}
      onClick={() => onClick?.(notification)}
    >
      <div className={cn('flex-shrink-0 rounded-full p-2', config?.bgColor ?? 'bg-gray-100')}>
        <Icon className={cn('h-4 w-4', config?.color ?? 'text-gray-600')} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          {notification.actor && (
            <span className="font-medium">{notification.actor.name} </span>
          )}
          {notification.title}
        </p>
        {notification.description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{notification.description}</p>
        )}
        <span className="text-xs text-gray-400 mt-1 block">
          {formatRelativeTime(notification.timestamp)}
        </span>
      </div>

      {!notification.read && onMarkRead && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead(notification.id);
          }}
          className="flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors"
          title="Mark as read"
        >
          <Check className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}

interface NotificationCenterProps {
  notifications: Activity[];
  unreadCount?: number;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onNotificationClick?: (notification: Activity) => void;
  onSettingsClick?: () => void;
  onViewAllClick?: () => void;
  maxItems?: number;
  className?: string;
}

export function NotificationCenter({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onNotificationClick,
  onSettingsClick,
  onViewAllClick,
  maxItems = 5,
  className,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const displayNotifications = notifications.slice(0, maxItems);
  const actualUnreadCount = unreadCount ?? notifications.filter((n) => !n.read).length;

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape
  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div className={cn('relative', className)} ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="View notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="h-5 w-5 text-gray-600" aria-hidden="true" />
        {actualUnreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {actualUnreadCount > 9 ? '9+' : actualUnreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 rounded-xl border bg-white shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-1">
              {actualUnreadCount > 0 && onMarkAllRead && (
                <button
                  onClick={onMarkAllRead}
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-4 w-4 text-gray-500" />
                </button>
              )}
              {onSettingsClick && (
                <button
                  onClick={onSettingsClick}
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                  title="Notification settings"
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Notifications list */}
          <div className="max-h-[400px] overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  We&apos;ll notify you when something happens
                </p>
              </div>
            ) : (
              displayNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={onMarkRead}
                  onClick={(n) => {
                    onNotificationClick?.(n);
                    setIsOpen(false);
                  }}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > maxItems && onViewAllClick && (
            <div className="border-t px-4 py-2 bg-gray-50">
              <button
                onClick={() => {
                  onViewAllClick();
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-primary-600 hover:text-primary-700 py-1"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Hook for managing notification state
export function useNotifications(initialNotifications: Activity[] = []) {
  const [notifications, setNotifications] = React.useState<Activity[]>(initialNotifications);

  const addNotification = React.useCallback((notification: Activity) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const markRead = React.useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    addNotification,
    markRead,
    markAllRead,
    removeNotification,
    clearAll,
    setNotifications,
  };
}
