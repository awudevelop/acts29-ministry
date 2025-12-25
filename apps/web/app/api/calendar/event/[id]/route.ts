import { NextResponse } from 'next/server';
import { mockEvents } from '@acts29/database';
import { generateSingleEventICalendar } from '@acts29/calendar-service';

/**
 * GET /api/calendar/event/[id]
 * Returns an iCalendar file for a single event (for downloading)
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = mockEvents.find((e) => e.id === id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (!event.is_public) {
      return NextResponse.json({ error: 'Event is not public' }, { status: 403 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://acts29ministry.org';

    const icalContent = generateSingleEventICalendar(event, {
      organizerName: 'Acts 29 Ministry',
      organizerEmail: 'events@acts29ministry.org',
      baseUrl,
    });

    // Create a safe filename from the event title
    const safeTitle = event.title
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 50);

    return new NextResponse(icalContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeTitle}.ics"`,
      },
    });
  } catch (error) {
    console.error('Error generating event calendar:', error);
    return NextResponse.json(
      { error: 'Failed to generate event calendar' },
      { status: 500 }
    );
  }
}
