import { NextResponse } from 'next/server';
import { mockEvents } from '@acts29/database';
import { generateICalendar } from '@acts29/calendar-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/calendar/feed.ics
 * Returns an iCalendar feed of all public events
 * Can be subscribed to from Google Calendar, Apple Calendar, Outlook, etc.
 */
export async function GET() {
  try {
    // Filter to only public, non-cancelled events
    const publicEvents = mockEvents.filter(
      (event) => event.is_public && event.status !== 'cancelled'
    );

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://acts29ministry.org';

    const icalContent = generateICalendar(publicEvents, {
      calendarName: 'Acts 29 Ministry Events',
      calendarDescription:
        'Community events, volunteer opportunities, and ministry gatherings in Springfield, IL',
      refreshInterval: 1,
      organizerName: 'Acts 29 Ministry',
      organizerEmail: 'events@acts29ministry.org',
      baseUrl,
    });

    return new NextResponse(icalContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="acts29-events.ics"',
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
