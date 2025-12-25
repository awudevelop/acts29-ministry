'use client';

import { ThemeProvider } from '@/lib/theme';
import { FeaturesProvider } from '@/lib/features';
import { AuthProvider } from '@/lib/auth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FeaturesProvider>{children}</FeaturesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
