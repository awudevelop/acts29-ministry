'use client';

import * as React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { cn } from '../../lib/utils';

// Feature module IDs that can be toggled
type FeatureModuleId =
  | 'case_management'
  | 'shelter_management'
  | 'resource_directory'
  | 'food_pantry'
  | 'medical_outreach'
  | 'transportation';

interface AdminLayoutProps {
  children: React.ReactNode;
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string;
    avatarUrl?: string | null;
    role?: string;
  };
  organizationName?: string;
  onSignOut?: () => void;
  notificationSlot?: React.ReactNode;
  themeToggleSlot?: React.ReactNode;
  enabledFeatures?: FeatureModuleId[];
}

export function AdminLayout({
  children,
  user,
  organizationName,
  onSignOut,
  notificationSlot,
  themeToggleSlot,
  enabledFeatures,
}: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Mobile sidebar backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar
          userRole={user?.role}
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          onSignOut={onSignOut}
          enabledFeatures={enabledFeatures}
        />
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar
          userRole={user?.role}
          onSignOut={onSignOut}
          enabledFeatures={enabledFeatures}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          user={user}
          organizationName={organizationName}
          onMenuClick={() => setMobileMenuOpen(true)}
          notificationSlot={notificationSlot}
          themeToggleSlot={themeToggleSlot}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
