'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Heart,
  FileText,
  Users,
  Calendar,
  Briefcase,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronDown,
  LogOut,
  BookOpen,
  MapPin,
  UsersRound,
  HeartHandshake,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
  children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['super_admin', 'org_admin', 'staff', 'volunteer'],
  },
  {
    name: 'Donations',
    href: '/admin/donations',
    icon: Heart,
    roles: ['super_admin', 'org_admin', 'staff'],
  },
  {
    name: 'Tax Receipts',
    href: '/admin/tax-receipts',
    icon: FileText,
    roles: ['super_admin', 'org_admin'],
  },
  {
    name: 'Volunteers',
    href: '/admin/volunteers',
    icon: Users,
    roles: ['super_admin', 'org_admin', 'staff'],
    children: [
      { name: 'All Volunteers', href: '/admin/volunteers' },
      { name: 'Shifts', href: '/admin/volunteers/shifts' },
      { name: 'Schedule', href: '/admin/volunteers/schedule' },
    ],
  },
  {
    name: 'Calendar',
    href: '/admin/calendar',
    icon: Calendar,
    roles: ['super_admin', 'org_admin', 'staff'],
  },
  {
    name: 'Teaching',
    href: '/admin/teaching',
    icon: BookOpen,
    roles: ['super_admin', 'org_admin', 'staff'],
  },
  {
    name: 'Prayer',
    href: '/admin/prayer',
    icon: HeartHandshake,
    roles: ['super_admin', 'org_admin', 'staff'],
  },
  {
    name: 'Resources',
    href: '/admin/resources',
    icon: MapPin,
    roles: ['super_admin', 'org_admin', 'staff'],
  },
  {
    name: 'Teams',
    href: '/admin/teams',
    icon: UsersRound,
    roles: ['super_admin', 'org_admin', 'staff'],
  },
  {
    name: 'Cases',
    href: '/admin/cases',
    icon: Briefcase,
    roles: ['super_admin', 'org_admin', 'staff'],
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: UserCog,
    roles: ['super_admin', 'org_admin'],
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['super_admin', 'org_admin'],
  },
];

interface SidebarProps {
  userRole?: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  onSignOut?: () => void;
}

export function Sidebar({ userRole = 'org_admin', collapsed = false, onCollapse, onSignOut }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800 dark:border-gray-900">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 font-bold">
              A
            </div>
            <span className="font-semibold">Acts29 Admin</span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 font-bold mx-auto">
            A
          </div>
        )}
        {onCollapse && !collapsed && (
          <button
            onClick={() => onCollapse(true)}
            className="p-1 rounded hover:bg-gray-800 dark:hover:bg-gray-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredNavigation.map((item) => {
            const active = isActive(item.href);
            const expanded = expandedItems.includes(item.name);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <li key={item.name}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'bg-gray-800 dark:bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white'
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 transition-transform',
                              expanded && 'rotate-180'
                            )}
                          />
                        </>
                      )}
                    </button>
                    {!collapsed && expanded && item.children && (
                      <ul className="mt-1 space-y-1 pl-10">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                'block rounded-lg px-3 py-2 text-sm transition-colors',
                                pathname === child.href
                                  ? 'bg-gray-800 dark:bg-gray-900 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white'
                              )}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-gray-800 dark:bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white'
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-800 dark:border-gray-900 p-4">
        {collapsed ? (
          <button
            onClick={() => onCollapse?.(false)}
            className="flex w-full items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5 rotate-180" />
          </button>
        ) : (
          <button
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}
