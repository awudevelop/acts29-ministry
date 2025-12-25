import type { Metadata } from 'next';
import { ResourcesContent } from './ResourcesContent';

export const metadata: Metadata = {
  title: 'Resource Directory',
  description:
    'Find shelters, food banks, health services, and more resources for individuals experiencing homelessness in Springfield, IL and surrounding areas.',
  openGraph: {
    title: 'Resource Directory - Acts29 Ministry',
    description:
      'Find shelters, food banks, health services, and more resources for those in need.',
    images: ['/images/og-resources.jpg'],
  },
  twitter: {
    title: 'Resource Directory - Acts29 Ministry',
    description:
      'Find shelters, food banks, health services, and more resources for those in need.',
    images: ['/images/og-resources.jpg'],
  },
};

export default function ResourcesPage() {
  return <ResourcesContent />;
}
