'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@acts29/admin-ui';
import { ErrorBoundary } from '../../components';

// Demo user data - no auth required
const demoUser = {
  firstName: 'Robert',
  lastName: 'Gillespie',
  email: 'robert@helpinghands.org',
  avatarUrl: null,
  role: 'org_admin',
};

const demoOrganization = 'Helping Hands of Springfield';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSignOut = () => {
    router.push('/login');
  };

  return (
    <AdminLayout
      user={demoUser}
      organizationName={demoOrganization}
      onSignOut={handleSignOut}
    >
      <ErrorBoundary>{children}</ErrorBoundary>
    </AdminLayout>
  );
}
