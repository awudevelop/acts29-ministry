'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout, NotificationCenter, useNotifications } from '@acts29/admin-ui';
import { ErrorBoundary } from '../../components';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/lib/auth';
import { mockActivities } from '@acts29/database';

// Loading skeleton for admin layout
function AdminLoadingSkeleton() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-64 bg-gray-900 dark:bg-gray-950" />
      <div className="flex-1 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="grid grid-cols-4 gap-4 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white dark:bg-gray-800 rounded-lg shadow" />
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

  // Initialize notifications with mock data
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
  } = useNotifications(mockActivities);

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markRead(notification.id);
    // Navigate based on notification type
    const metadata = notification.metadata as Record<string, unknown> | undefined;
    if (metadata?.donationId) {
      router.push(`/admin/donations/${metadata.donationId}`);
    } else if (metadata?.caseId) {
      router.push(`/admin/cases/${metadata.caseId}`);
    } else if (metadata?.shiftId) {
      router.push(`/admin/volunteers/shifts/${metadata.shiftId}`);
    } else if (metadata?.eventId) {
      router.push(`/admin/calendar/${metadata.eventId}`);
    }
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
      notificationSlot={
        <NotificationCenter
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
          onNotificationClick={handleNotificationClick}
          onSettingsClick={() => router.push('/admin/settings/notifications')}
        />
      }
      themeToggleSlot={<ThemeToggle variant="icon" />}
    >
      <ErrorBoundary>{children}</ErrorBoundary>
    </AdminLayout>
  );
}
