'use client';

import * as React from 'react';
import {
  DollarSign,
  UserCheck,
  UserX,
  Calendar,
  Briefcase,
  Heart,
  FileText,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn, formatDateTime, getInitials } from '../../lib/utils';
import type { Activity, ActivityType } from '@acts29/database';

const activityConfig: Record<
  ActivityType,
  { icon: LucideIcon; color: string; bgColor: string }
> = {
  donation_received: {
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  donation_refunded: {
    icon: DollarSign,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  volunteer_checked_in: {
    icon: UserCheck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  volunteer_checked_out: {
    icon: UserX,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  shift_scheduled: {
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  shift_completed: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  shift_cancelled: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  case_created: {
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  case_updated: {
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  case_closed: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  event_created: {
    icon: Calendar,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  event_registration: {
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  prayer_request: {
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  content_published: {
    icon: FileText,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  team_member_added: {
    icon: Users,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
  },
  resource_updated: {
    icon: MapPin,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
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

interface ActivityItemProps {
  activity: Activity;
  showAvatar?: boolean;
  onClick?: (activity: Activity) => void;
}

function ActivityItem({ activity, showAvatar = true, onClick }: ActivityItemProps) {
  const config = activityConfig[activity.type];
  const Icon = config?.icon ?? AlertCircle;

  return (
    <div
      className={cn(
        'flex gap-3 p-3 rounded-lg transition-colors',
        onClick && 'cursor-pointer hover:bg-gray-50',
        !activity.read && 'bg-blue-50/50'
      )}
      onClick={() => onClick?.(activity)}
    >
      {showAvatar && activity.actor ? (
        <div className="flex-shrink-0">
          {activity.actor.avatarUrl ? (
            <img
              src={activity.actor.avatarUrl}
              alt={activity.actor.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">
              {getInitials(activity.actor.name.split(' ')[0], activity.actor.name.split(' ')[1])}
            </div>
          )}
        </div>
      ) : (
        <div className={cn('flex-shrink-0 rounded-full p-2', config?.bgColor ?? 'bg-gray-100')}>
          <Icon className={cn('h-4 w-4', config?.color ?? 'text-gray-600')} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          {activity.actor && (
            <span className="font-medium">{activity.actor.name} </span>
          )}
          {activity.title}
        </p>
        {activity.description && (
          <p className="text-sm text-gray-500 truncate">{activity.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-400">
            {formatRelativeTime(activity.timestamp)}
          </span>
        </div>
      </div>

      {!activity.read && (
        <div className="flex-shrink-0">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
        </div>
      )}
    </div>
  );
}

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  emptyMessage?: string;
  showAvatars?: boolean;
  maxItems?: number;
  className?: string;
  onActivityClick?: (activity: Activity) => void;
  onViewAll?: () => void;
  isLoading?: boolean;
}

export function ActivityFeed({
  activities,
  title = 'Recent Activity',
  emptyMessage = 'No recent activity',
  showAvatars = true,
  maxItems,
  className,
  onActivityClick,
  onViewAll,
  isLoading = false,
}: ActivityFeedProps) {
  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities;

  if (isLoading) {
    return (
      <div className={cn('rounded-xl border bg-white shadow-sm', className)}>
        <div className="border-b px-4 py-3">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 p-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border bg-white shadow-sm', className)}>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {onViewAll && activities.length > 0 && (
          <button
            onClick={onViewAll}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View all
          </button>
        )}
      </div>

      {displayActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-8 w-8 text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="divide-y">
          {displayActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              showAvatar={showAvatars}
              onClick={onActivityClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Compact version for sidebars or smaller spaces
interface ActivityFeedCompactProps {
  activities: Activity[];
  maxItems?: number;
  className?: string;
  onActivityClick?: (activity: Activity) => void;
}

export function ActivityFeedCompact({
  activities,
  maxItems = 5,
  className,
  onActivityClick,
}: ActivityFeedCompactProps) {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className={cn('space-y-1', className)}>
      {displayActivities.map((activity) => {
        const config = activityConfig[activity.type];
        const Icon = config?.icon ?? AlertCircle;

        return (
          <div
            key={activity.id}
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg text-sm',
              onActivityClick && 'cursor-pointer hover:bg-gray-50'
            )}
            onClick={() => onActivityClick?.(activity)}
          >
            <Icon className={cn('h-4 w-4 flex-shrink-0', config?.color ?? 'text-gray-500')} />
            <span className="truncate text-gray-700">{activity.title}</span>
            <span className="flex-shrink-0 text-xs text-gray-400">
              {formatRelativeTime(activity.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
