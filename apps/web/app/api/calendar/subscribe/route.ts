import { NextResponse } from 'next/server';
import { generateSubscriptionUrls } from '@acts29/calendar-service';

/**
 * GET /api/calendar/subscribe
 * Returns subscription URLs for various calendar providers
 */
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://acts29ministry.org';
    const urls = generateSubscriptionUrls(baseUrl);

    return NextResponse.json({
      success: true,
      urls,
      instructions: {
        ical:
          'Use this URL to subscribe from any calendar app that supports iCalendar format.',
        webcal:
          'Click this link to automatically add the calendar to your default calendar app.',
        googleCalendar:
          'Click this link to add the calendar to your Google Calendar.',
        outlookOnline:
          'Click this link to add the calendar to your Outlook.com calendar.',
      },
    });
  } catch (error) {
    console.error('Error generating subscription URLs:', error);
    return NextResponse.json(
      { error: 'Failed to generate subscription URLs' },
      { status: 500 }
    );
  }
}
