import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Acts29 Ministry - Serving the Homeless, Proclaiming the Gospel',
  description:
    'A nationwide platform connecting churches, volunteers, and donors to help solve the homeless crisis while sharing the Good News of Jesus Christ.',
  keywords: [
    'homeless ministry',
    'church outreach',
    'volunteer coordination',
    'faith-based services',
    'homeless resources',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
