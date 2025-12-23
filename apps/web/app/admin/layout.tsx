'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@acts29/admin-ui';
import { ErrorBoundary } from '../../components';
import { useAuth } from '@/lib/auth';

// Loading skeleton for admin layout
function AdminLoadingSkeleton() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-900" />
      <div className="flex-1 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-300 rounded" />
          <div className="h-4 w-96 bg-gray-200 rounded" />
          <div className="grid grid-cols-4 gap-4 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-lg shadow" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, logout, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  // Don't render admin if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return <AdminLoadingSkeleton />;
  }

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <AdminLayout
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
      }}
      organizationName={user.organization}
      onSignOut={handleSignOut}
    >
      <ErrorBoundary>{children}</ErrorBoundary>
    </AdminLayout>
  );
}
