import type { Metadata } from 'next';
import { PrayerContent } from './PrayerContent';

export const metadata: Metadata = {
  title: 'Prayer Wall',
  description:
    'Share your prayer requests and join the Acts29 Ministry community in lifting up the needs of those we serve. Together, we believe in the power of prayer.',
  openGraph: {
    title: 'Prayer Wall - Acts29 Ministry',
    description:
      'Share your prayer requests and join our community in lifting up the needs of those we serve.',
    images: ['/images/og-prayer.jpg'],
  },
  twitter: {
    title: 'Prayer Wall - Acts29 Ministry',
    description:
      'Share your prayer requests and join our community in lifting up the needs of those we serve.',
    images: ['/images/og-prayer.jpg'],
  },
};

export default function PrayerPage() {
  return <PrayerContent />;
}
