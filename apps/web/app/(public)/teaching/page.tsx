import type { Metadata } from 'next';
import { TeachingContent } from './TeachingContent';

export const metadata: Metadata = {
  title: 'Gospel Teaching',
  description:
    'Sermons, devotionals, testimonies, and faith resources from Acts29 Ministry. Grow in your walk with Christ through gospel-centered teaching.',
  openGraph: {
    title: 'Gospel Teaching - Acts29 Ministry',
    description:
      'Sermons, devotionals, testimonies, and faith resources to grow in your walk with Christ.',
    images: ['/images/og-teaching.jpg'],
  },
  twitter: {
    title: 'Gospel Teaching - Acts29 Ministry',
    description:
      'Sermons, devotionals, testimonies, and faith resources to grow in your walk with Christ.',
    images: ['/images/og-teaching.jpg'],
  },
};

export default function TeachingPage() {
  return <TeachingContent />;
}
