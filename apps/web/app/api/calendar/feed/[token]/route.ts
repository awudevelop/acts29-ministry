import { NextRequest, NextResponse } from 'next/server';
import {
  mockEvents,
  mockVolunteerShifts,
  mockTeams,
  mockProfiles,
  mockOrganizations,
  mockResources,
  type CalendarFeedToken,
} from '@acts29/database';
import {
  generateCombinedCalendar,
  generateShiftCalendar,
  type VolunteerShiftCalendarItem,
} from '@acts29/calendar-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Mock calendar feed tokens for development
// In production, these would be stored in the database
const mockFeedTokens: CalendarFeedToken[] = [
  {
    id: 'feed-001',
    user_id: '660e8400-e29b-41d4-a716-446655440004', // Jennifer Martinez
    token: 'jennifer-personal-feed-token',
    feed_type: 'personal',
    scope_id: null,
    name: 'My Calendar',
    include_events: true,
    include_shifts: true,
    include_private_events: false,
    is_active: true,
    last_accessed_at: null,
    created_at: '2024-12-01T00:00:00Z',
    expires_at: null,
  },
  {
    id: 'feed-002',
    user_id: '660e8400-e29b-41d4-a716-446655440001', // Robert Gillespie
    token: 'robert-admin-feed-token',
    feed_type: 'personal',
    scope_id: null,
    name: 'My Calendar',
    include_events: true,
    include_shifts: true,
    include_private_events: true,
    is_active: true,
    last_accessed_at: null,
    created_at: '2024-12-01T00:00:00Z',
    expires_at: null,
  },
  {
    id: 'feed-003',
    user_id: '660e8400-e29b-41d4-a716-446655440001',
    token: 'outreach-team-feed-token',
    feed_type: 'team',
    scope_id: 'team-001', // Outreach Team
    name: 'Outreach Team Calendar',
    include_events: true,
    include_shifts: true,
    include_private_events: false,
    is_active: true,
    last_accessed_at: null,
    created_at: '2024-12-01T00:00:00Z',
    expires_at: null,
  },
  {
    id: 'feed-004',
    user_id: '660e8400-e29b-41d4-a716-446655440001',
    token: 'shifts-only-feed-token',
    feed_type: 'personal',
    scope_id: null,
    name: 'My Volunteer Shifts',
    include_events: false,
    include_shifts: true,
    include_private_events: false,
    is_active: true,
    last_accessed_at: null,
    created_at: '2024-12-01T00:00:00Z',
    expires_at: null,
  },
];

/**
 * GET /api/calendar/feed/[token]
 * Returns a personalized iCalendar feed based on the feed token
 * Supports: personal calendars, team calendars, shifts-only feeds
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Find the feed token
    const feedToken = mockFeedTokens.find((t) => t.token === token && t.is_active);

    if (!feedToken) {
      return NextResponse.json(
        { error: 'Invalid or expired calendar feed token' },
        { status: 404 }
      );
    }

    // Check if expired
    if (feedToken.expires_at && new Date(feedToken.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Calendar feed token has expired' },
        { status: 410 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://acts29ministry.org';

    // Get the user's profile for the calendar name
    const userProfile = mockProfiles.find((p) => p.id === feedToken.user_id);
    const userName = userProfile
      ? `${userProfile.first_name} ${userProfile.last_name}`
      : 'User';

    let calendarName = feedToken.name;
    let calendarDescription = '';
    let events: typeof mockEvents = [];
    let shifts: VolunteerShiftCalendarItem[] = [];

    // Build the feed based on type
    if (feedToken.feed_type === 'team' && feedToken.scope_id) {
      // Team calendar: get team shifts
      const team = mockTeams.find((t) => t.id === feedToken.scope_id);
      calendarName = team ? `${team.name} Calendar` : feedToken.name;
      calendarDescription = team?.description || 'Team calendar';

      if (feedToken.include_shifts) {
        const teamShifts = mockVolunteerShifts.filter(
          (s) => s.team_id === feedToken.scope_id
        );
        shifts = teamShifts.map((s) => ({
          id: s.id,
          start_time: s.start_time,
          end_time: s.end_time,
          role: s.role,
          status: s.status,
          notes: s.notes,
          location: getShiftLocation(s.resource_id),
          organizationName: getOrganizationName(s.organization_id),
          teamName: team?.name,
        }));
      }

      if (feedToken.include_events) {
        // Include events associated with the team's organization
        events = mockEvents.filter(
          (e) =>
            (e.is_public || feedToken.include_private_events) &&
            e.status !== 'cancelled'
        );
      }
    } else if (feedToken.feed_type === 'personal') {
      // Personal calendar: get user's shifts and registered events
      calendarName = feedToken.name || `${userName}'s Calendar`;
      calendarDescription = `Personal calendar for ${userName}`;

      if (feedToken.include_shifts) {
        const userShifts = mockVolunteerShifts.filter(
          (s) => s.volunteer_id === feedToken.user_id
        );
        shifts = userShifts.map((s) => {
          const team = mockTeams.find((t) => t.id === s.team_id);
          return {
            id: s.id,
            start_time: s.start_time,
            end_time: s.end_time,
            role: s.role,
            status: s.status,
            notes: s.notes,
            location: getShiftLocation(s.resource_id),
            organizationName: getOrganizationName(s.organization_id),
            teamName: team?.name,
          };
        });
      }

      if (feedToken.include_events) {
        events = mockEvents.filter(
          (e) =>
            (e.is_public || feedToken.include_private_events) &&
            e.status !== 'cancelled'
        );
      }
    } else if (feedToken.feed_type === 'organization' && feedToken.scope_id) {
      // Organization calendar
      const org = mockOrganizations.find((o) => o.id === feedToken.scope_id);
      calendarName = org ? `${org.name} Calendar` : feedToken.name;
      calendarDescription = org?.description || 'Organization calendar';

      if (feedToken.include_shifts) {
        const orgShifts = mockVolunteerShifts.filter(
          (s) => s.organization_id === feedToken.scope_id
        );
        shifts = orgShifts.map((s) => {
          const team = mockTeams.find((t) => t.id === s.team_id);
          return {
            id: s.id,
            start_time: s.start_time,
            end_time: s.end_time,
            role: s.role,
            status: s.status,
            notes: s.notes,
            location: getShiftLocation(s.resource_id),
            organizationName: org?.name,
            teamName: team?.name,
          };
        });
      }

      if (feedToken.include_events) {
        // For organization feeds, show public events (in production, would filter by org)
        events = mockEvents.filter(
          (e) =>
            (e.is_public || feedToken.include_private_events) &&
            e.status !== 'cancelled'
        );
      }
    }

    // Generate the calendar content
    let icalContent: string;

    if (feedToken.include_events && events.length > 0) {
      // Combined calendar with events and shifts
      icalContent = generateCombinedCalendar(events, shifts, {
        calendarName,
        calendarDescription,
        refreshInterval: 1,
        baseUrl,
        includePrivateEvents: feedToken.include_private_events,
      });
    } else if (shifts.length > 0) {
      // Shifts-only calendar
      icalContent = generateShiftCalendar(shifts, {
        calendarName,
        calendarDescription,
        refreshInterval: 1,
        baseUrl,
      });
    } else {
      // Empty calendar
      icalContent = generateShiftCalendar([], {
        calendarName,
        calendarDescription: 'No items scheduled',
        refreshInterval: 1,
        baseUrl,
      });
    }

    // Create a safe filename
    const safeFilename = calendarName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return new NextResponse(icalContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeFilename}.ics"`,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating calendar feed:', error);
    return NextResponse.json(
      { error: 'Failed to generate calendar feed' },
      { status: 500 }
    );
  }
}

// Helper functions
function getShiftLocation(resourceId: string | null): string | undefined {
  if (!resourceId) return undefined;
  const resource = mockResources.find((r) => r.id === resourceId);
  return resource?.address || undefined;
}

function getOrganizationName(orgId: string): string | undefined {
  const org = mockOrganizations.find((o) => o.id === orgId);
  return org?.name;
}
