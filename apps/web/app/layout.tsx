import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://acts29.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Acts29 Ministry - Serving the Homeless, Proclaiming the Gospel',
    template: '%s | Acts29 Ministry',
  },
  description:
    'A nationwide platform connecting churches, volunteers, and donors to help solve the homeless crisis while sharing the Good News of Jesus Christ.',
  keywords: [
    'homeless ministry',
    'church outreach',
    'volunteer coordination',
    'faith-based services',
    'homeless resources',
    'Springfield IL',
    'homeless shelter',
    'food assistance',
    'Christian ministry',
  ],
  authors: [{ name: 'Acts29 Ministry' }],
  creator: 'Acts29 Ministry',
  publisher: 'Acts29 Ministry',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Acts29 Ministry',
    title: 'Acts29 Ministry - Serving the Homeless, Proclaiming the Gospel',
    description:
      'Connecting churches, volunteers, and donors to help solve the homeless crisis while sharing the Good News of Jesus Christ.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Acts29 Ministry - Church for the Unsheltered',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acts29 Ministry - Serving the Homeless, Proclaiming the Gospel',
    description:
      'Connecting churches, volunteers, and donors to help solve the homeless crisis while sharing the Good News of Jesus Christ.',
    images: ['/images/og-image.jpg'],
    creator: '@acts29ministry',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

// Script to prevent theme flash on page load
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('acts29-theme');
    var theme = stored || 'system';
    var resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.add(resolved);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a2f44" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
