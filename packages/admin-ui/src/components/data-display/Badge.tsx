import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// Status badge helpers
export function DonationStatusBadge({ status }: { status: string }) {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    completed: 'success',
    pending: 'warning',
    failed: 'danger',
    refunded: 'default',
  };

  return (
    <Badge variant={variants[status] ?? 'default'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function CaseStatusBadge({ status }: { status: string }) {
  const variants: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
    active: 'info',
    pending: 'warning',
    closed: 'success',
    referred: 'default',
  };

  return (
    <Badge variant={variants[status] ?? 'default'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function ShiftStatusBadge({ status }: { status: string }) {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    scheduled: 'info',
    completed: 'success',
    cancelled: 'default',
    no_show: 'danger',
  };

  const labels: Record<string, string> = {
    scheduled: 'Scheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  };

  return (
    <Badge variant={variants[status] ?? 'default'}>
      {labels[status] ?? status}
    </Badge>
  );
}

export function DonationTypeBadge({ type }: { type: string }) {
  const variants: Record<string, 'primary' | 'success' | 'info'> = {
    monetary: 'success',
    goods: 'primary',
    time: 'info',
  };

  return (
    <Badge variant={variants[type] ?? 'default'}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const variants: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'default'> = {
    super_admin: 'primary',
    org_admin: 'primary',
    staff: 'info',
    volunteer: 'success',
    donor: 'warning',
    guest: 'default',
  };

  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    org_admin: 'Admin',
    staff: 'Staff',
    volunteer: 'Volunteer',
    donor: 'Donor',
    guest: 'Guest',
  };

  return (
    <Badge variant={variants[role] ?? 'default'}>
      {labels[role] ?? role}
    </Badge>
  );
}
