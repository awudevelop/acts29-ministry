'use client';

import { useState, useCallback, useEffect } from 'react';
import type {
  Activity,
  ActivityType,
  Donation,
  VolunteerShift,
  Case,
  Event,
  PrayerRequest,
  Content,
  Profile,
} from '@acts29/database';

// Helper to generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Convert a donation to an activity
export function donationToActivity(
  donation: Donation,
  donor?: Profile | null
): Activity {
  const type: ActivityType =
    donation.status === 'refunded' ? 'donation_refunded' : 'donation_received';

  const amount = donation.amount
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(donation.amount)
    : '';

  return {
    id: generateId(),
    type,
    title: type === 'donation_refunded'
      ? `refunded a ${amount} donation`
      : `donated ${amount}`,
    description: donation.description || undefined,
    actor: donor
      ? {
          id: donor.id,
          name: `${donor.first_name} ${donor.last_name}`,
          avatarUrl: donor.avatar_url,
        }
      : undefined,
    metadata: { donationId: donation.id, type: donation.type },
    timestamp: donation.created_at,
    read: false,
  };
}

// Convert a shift to an activity
export function shiftToActivity(
  shift: VolunteerShift,
  volunteer?: Profile | null,
  eventType?: 'scheduled' | 'completed' | 'cancelled' | 'check_in' | 'check_out'
): Activity {
  let type: ActivityType;
  let title: string;

  switch (eventType || shift.status) {
    case 'check_in':
      type = 'volunteer_checked_in';
      title = `checked in for ${shift.role} shift`;
      break;
    case 'check_out':
      type = 'volunteer_checked_out';
      title = `completed ${shift.role} shift`;
      break;
    case 'completed':
      type = 'shift_completed';
      title = `completed their ${shift.role} shift`;
      break;
    case 'cancelled':
      type = 'shift_cancelled';
      title = `shift was cancelled`;
      break;
    case 'scheduled':
    default:
      type = 'shift_scheduled';
      title = `scheduled for ${shift.role}`;
      break;
  }

  return {
    id: generateId(),
    type,
    title,
    description: shift.notes || undefined,
    actor: volunteer
      ? {
          id: volunteer.id,
          name: `${volunteer.first_name} ${volunteer.last_name}`,
          avatarUrl: volunteer.avatar_url,
        }
      : undefined,
    metadata: { shiftId: shift.id },
    timestamp: shift.created_at,
    read: false,
  };
}

// Convert a case to an activity
export function caseToActivity(
  caseData: Case,
  assignee?: Profile | null,
  eventType?: 'created' | 'updated' | 'closed'
): Activity {
  let type: ActivityType;
  let title: string;

  switch (eventType || (caseData.status === 'closed' ? 'closed' : 'updated')) {
    case 'created':
      type = 'case_created';
      title = `created a new case for ${caseData.first_name} ${caseData.last_name}`;
      break;
    case 'closed':
      type = 'case_closed';
      title = `closed case for ${caseData.first_name} ${caseData.last_name}`;
      break;
    default:
      type = 'case_updated';
      title = `updated case for ${caseData.first_name} ${caseData.last_name}`;
      break;
  }

  return {
    id: generateId(),
    type,
    title,
    description: caseData.notes || undefined,
    actor: assignee
      ? {
          id: assignee.id,
          name: `${assignee.first_name} ${assignee.last_name}`,
          avatarUrl: assignee.avatar_url,
        }
      : undefined,
    metadata: { caseId: caseData.id, status: caseData.status },
    timestamp: caseData.updated_at,
    read: false,
  };
}

// Convert an event to an activity
export function eventToActivity(event: Event, creator?: Profile | null): Activity {
  return {
    id: generateId(),
    type: 'event_created',
    title: `created event "${event.title}"`,
    description: event.description,
    actor: creator
      ? {
          id: creator.id,
          name: `${creator.first_name} ${creator.last_name}`,
          avatarUrl: creator.avatar_url,
        }
      : undefined,
    metadata: { eventId: event.id },
    timestamp: event.created_at,
    read: false,
  };
}

// Convert a prayer request to an activity
export function prayerToActivity(
  prayer: PrayerRequest,
  user?: Profile | null
): Activity {
  return {
    id: generateId(),
    type: 'prayer_request',
    title: prayer.is_anonymous ? 'submitted a prayer request' : `submitted a prayer request`,
    description: prayer.title,
    actor:
      user && !prayer.is_anonymous
        ? {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            avatarUrl: user.avatar_url,
          }
        : undefined,
    metadata: { prayerId: prayer.id },
    timestamp: prayer.created_at,
    read: false,
  };
}

// Convert content to an activity
export function contentToActivity(
  content: Content,
  author?: Profile | null
): Activity {
  const typeLabel = content.type.charAt(0).toUpperCase() + content.type.slice(1);

  return {
    id: generateId(),
    type: 'content_published',
    title: `published ${typeLabel.toLowerCase()} "${content.title}"`,
    description: content.description || undefined,
    actor: author
      ? {
          id: author.id,
          name: `${author.first_name} ${author.last_name}`,
          avatarUrl: author.avatar_url,
        }
      : undefined,
    metadata: { contentId: content.id, contentType: content.type },
    timestamp: content.published_at || content.created_at,
    read: false,
  };
}

interface UseActivityFeedOptions {
  maxActivities?: number;
  persistKey?: string;
}

export function useActivityFeed(options: UseActivityFeedOptions = {}) {
  const { maxActivities = 50, persistKey } = options;
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load from localStorage on mount if persistKey is provided
  useEffect(() => {
    if (persistKey && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`activity-feed-${persistKey}`);
      if (stored) {
        try {
          setActivities(JSON.parse(stored));
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [persistKey]);

  // Save to localStorage when activities change
  useEffect(() => {
    if (persistKey && typeof window !== 'undefined' && activities.length > 0) {
      localStorage.setItem(`activity-feed-${persistKey}`, JSON.stringify(activities));
    }
  }, [activities, persistKey]);

  const addActivity = useCallback(
    (activity: Activity) => {
      setActivities((prev) => {
        const updated = [activity, ...prev].slice(0, maxActivities);
        return updated;
      });
    },
    [maxActivities]
  );

  const addActivities = useCallback(
    (newActivities: Activity[]) => {
      setActivities((prev) => {
        const combined = [...newActivities, ...prev];
        // Sort by timestamp descending
        combined.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        return combined.slice(0, maxActivities);
      });
    },
    [maxActivities]
  );

  const markRead = useCallback((id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setActivities((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
    if (persistKey && typeof window !== 'undefined') {
      localStorage.removeItem(`activity-feed-${persistKey}`);
    }
  }, [persistKey]);

  const unreadCount = activities.filter((a) => !a.read).length;

  return {
    activities,
    unreadCount,
    addActivity,
    addActivities,
    markRead,
    markAllRead,
    clearActivities,
    setActivities,
  };
}
