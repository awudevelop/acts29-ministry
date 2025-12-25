import type { Metadata } from 'next';
import { CalendarContent } from './CalendarContent';

export const metadata: Metadata = {
  title: 'Events Calendar',
  description:
    'Join Acts29 Ministry for community events, volunteer opportunities, and gatherings as we serve together and share the love of Christ.',
  openGraph: {
    title: 'Events Calendar - Acts29 Ministry',
    description:
      'Join us for community events, volunteer opportunities, and gatherings as we serve together.',
    images: ['/images/og-calendar.jpg'],
  },
  twitter: {
    title: 'Events Calendar - Acts29 Ministry',
    description:
      'Join us for community events, volunteer opportunities, and gatherings as we serve together.',
    images: ['/images/og-calendar.jpg'],
  },
};

export default function CalendarPage() {
  return <CalendarContent />;
}
