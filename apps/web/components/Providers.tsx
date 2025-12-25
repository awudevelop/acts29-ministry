'use client';

import { ThemeProvider } from '@/lib/theme';
import { FeaturesProvider } from '@/lib/features';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FeaturesProvider>{children}</FeaturesProvider>
    </ThemeProvider>
  );
}
