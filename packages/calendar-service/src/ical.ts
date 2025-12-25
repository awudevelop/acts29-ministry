/**
 * iCalendar (RFC 5545) generation utilities
 * Generates .ics files for calendar subscriptions
 */

import type { Event } from '@acts29/database';

const CRLF = '\r\n';

/**
 * Escape special characters for iCalendar format
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Format a date to iCalendar format (YYYYMMDDTHHMMSSZ)
 */
function formatICalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Generate a unique identifier for an event
 */
function generateUID(eventId: string, domain: string = 'acts29ministry.org'): string {
  return `${eventId}@${domain}`;
}

/**
 * Fold lines longer than 75 characters per RFC 5545
 */
function foldLine(line: string): string {
  const maxLength = 75;
  if (line.length <= maxLength) {
    return line;
  }

  const result: string[] = [];
  let remaining = line;

  // First line can be full length
  result.push(remaining.slice(0, maxLength));
  remaining = remaining.slice(maxLength);

  // Subsequent lines start with a space and have max 74 chars of content
  while (remaining.length > 0) {
    result.push(' ' + remaining.slice(0, maxLength - 1));
    remaining = remaining.slice(maxLength - 1);
  }

  return result.join(CRLF);
}

export interface ICalEventOptions {
  event: Event;
  organizerName?: string;
  organizerEmail?: string;
  url?: string;
}

/**
 * Generate a VEVENT component for an event
 */
export function generateVEvent(options: ICalEventOptions): string {
  const { event, organizerName, organizerEmail, url } = options;

  const lines: string[] = [
    'BEGIN:VEVENT',
    `UID:${generateUID(event.id)}`,
    `DTSTAMP:${formatICalDate(new Date())}`,
    `DTSTART:${formatICalDate(new Date(event.start_time))}`,
    `DTEND:${formatICalDate(new Date(event.end_time))}`,
    `SUMMARY:${escapeICalText(event.title)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICalText(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICalText(event.location)}`);
  }

  if (organizerName && organizerEmail) {
    lines.push(`ORGANIZER;CN=${escapeICalText(organizerName)}:mailto:${organizerEmail}`);
  }

  if (url) {
    lines.push(`URL:${url}`);
  }

  // Add categories based on event attributes
  const categories: string[] = [];
  if (event.accepts_food) categories.push('FOOD');
  if (event.accepts_clothing) categories.push('CLOTHING');
  if (categories.length > 0) {
    lines.push(`CATEGORIES:${categories.join(',')}`);
  }

  // Add status
  const statusMap: Record<string, string> = {
    upcoming: 'CONFIRMED',
    completed: 'CONFIRMED',
    cancelled: 'CANCELLED',
  };
  lines.push(`STATUS:${statusMap[event.status] || 'CONFIRMED'}`);

  // Add transparency (busy/free)
  lines.push('TRANSP:OPAQUE');

  lines.push('END:VEVENT');

  return lines.map(foldLine).join(CRLF);
}

export interface ICalendarOptions {
  calendarName?: string;
  calendarDescription?: string;
  refreshInterval?: number; // in hours
  organizerName?: string;
  organizerEmail?: string;
  baseUrl?: string;
}

/**
 * Generate a complete iCalendar feed from events
 */
export function generateICalendar(
  events: Event[],
  options: ICalendarOptions = {}
): string {
  const {
    calendarName = 'Acts 29 Ministry Events',
    calendarDescription = 'Community events and volunteer opportunities',
    refreshInterval = 1,
    organizerName = 'Acts 29 Ministry',
    organizerEmail = 'events@acts29ministry.org',
    baseUrl = 'https://acts29ministry.org',
  } = options;

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Acts 29 Ministry//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICalText(calendarName)}`,
    `X-WR-CALDESC:${escapeICalText(calendarDescription)}`,
    `REFRESH-INTERVAL;VALUE=DURATION:PT${refreshInterval}H`,
    'X-PUBLISHED-TTL:PT1H',
  ];

  // Add timezone component for Central Time
  lines.push(
    'BEGIN:VTIMEZONE',
    'TZID:America/Chicago',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:-0600',
    'TZOFFSETTO:-0500',
    'TZNAME:CDT',
    'DTSTART:19700308T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0600',
    'TZNAME:CST',
    'DTSTART:19701101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'END:STANDARD',
    'END:VTIMEZONE'
  );

  // Add events
  for (const event of events) {
    if (event.is_public) {
      lines.push(
        generateVEvent({
          event,
          organizerName,
          organizerEmail,
          url: `${baseUrl}/calendar/${event.id}`,
        })
      );
    }
  }

  lines.push('END:VCALENDAR');

  return lines.join(CRLF);
}

/**
 * Generate an iCalendar for a single event (for download)
 */
export function generateSingleEventICalendar(
  event: Event,
  options: Omit<ICalendarOptions, 'calendarName' | 'calendarDescription'> = {}
): string {
  return generateICalendar([event], {
    ...options,
    calendarName: event.title,
    calendarDescription: event.description || undefined,
  });
}

/**
 * Generate calendar subscription URLs
 */
export interface CalendarSubscriptionUrls {
  ical: string;
  googleCalendar: string;
  outlookOnline: string;
  webcal: string;
}

export function generateSubscriptionUrls(
  baseUrl: string,
  feedPath: string = '/api/calendar/feed.ics'
): CalendarSubscriptionUrls {
  const icalUrl = `${baseUrl}${feedPath}`;
  const webcalUrl = icalUrl.replace(/^https?:/, 'webcal:');

  // Google Calendar subscription URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl)}`;

  // Outlook online subscription URL
  const outlookUrl = `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(icalUrl)}&name=${encodeURIComponent('Acts 29 Ministry Events')}`;

  return {
    ical: icalUrl,
    googleCalendar: googleCalendarUrl,
    outlookOnline: outlookUrl,
    webcal: webcalUrl,
  };
}

/**
 * Generate a single event add-to-calendar URL for Google Calendar
 */
export function generateGoogleCalendarEventUrl(event: Event): string {
  const startDate = formatICalDate(new Date(event.start_time)).replace('Z', '');
  const endDate = formatICalDate(new Date(event.end_time)).replace('Z', '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description || '',
    location: event.location || '',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate a single event add-to-calendar URL for Outlook
 */
export function generateOutlookEventUrl(event: Event): string {
  const startDate = new Date(event.start_time).toISOString();
  const endDate = new Date(event.end_time).toISOString();

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: startDate,
    enddt: endDate,
    body: event.description || '',
    location: event.location || '',
  });

  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}
