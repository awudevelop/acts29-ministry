'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  StatCard,
  RoleBadge,
  Badge,
  formatDate,
  getInitials,
} from '@acts29/admin-ui';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Edit,
  UserX,
  Shield,
  Activity,
  Key,
} from 'lucide-react';
import { mockProfiles, mockVolunteerShifts, mockDonations, type VolunteerShift } from '@acts29/database';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const user = mockProfiles.find((p) => p.id === userId);

  // Get activity stats
  const userShifts = mockVolunteerShifts.filter((s: VolunteerShift) => s.volunteer_id === userId);
  const completedShifts = userShifts.filter((s: VolunteerShift) => s.status === 'completed').length;

  // Calculate volunteer hours
  const totalHours = userShifts.reduce((sum: number, shift: VolunteerShift) => {
    if (shift.status === 'completed') {
      const start = new Date(shift.start_time);
      const end = new Date(shift.end_time);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }
    return sum;
  }, 0);

  // Get recent donations (for donors)
  const userDonations = mockDonations.filter((d) => d.donor_id === userId);

  if (!user) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Users', href: '/admin/users' },
            { label: 'Not Found' },
          ]}
        />
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
          <p className="text-gray-500 mt-2">The user you're looking for doesn't exist.</p>
          <Link href="/admin/users">
            <Button className="mt-4">Back to Users</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Users', href: '/admin/users' },
          { label: `${user.first_name} ${user.last_name}` },
        ]}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-semibold text-primary-600">
            {getInitials(user.first_name, user.last_name)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h1>
              <RoleBadge role={user.role} />
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-gray-500">Member since {formatDate(user.created_at)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <UserX className="mr-2 h-4 w-4" />
            Deactivate
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Volunteer Hours"
          value={totalHours.toFixed(1)}
          icon={Clock}
        />
        <StatCard
          title="Shifts Completed"
          value={completedShifts}
          icon={Calendar}
        />
        <StatCard
          title="Donations"
          value={userDonations.length}
          icon={Activity}
        />
        <StatCard
          title="Last Active"
          value={formatDate(user.updated_at)}
          icon={Activity}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Info */}
        <div className="rounded-xl border bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            {user.phone && (
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2">
                <Mail className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">user@example.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & About */}
        <div className="lg:col-span-2 rounded-xl border bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">About</h3>
          <p className="text-gray-600">
            {user.bio || 'No bio provided.'}
          </p>
        </div>
      </div>

      {/* Role & Permissions */}
      <div className="rounded-xl border bg-white p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Role & Permissions</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Role
            </label>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Shield className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium capitalize">{user.role.replace('_', ' ')}</p>
                <p className="text-sm text-gray-500">
                  {user.role === 'super_admin'
                    ? 'Full access to all organizations and settings'
                    : user.role === 'org_admin'
                    ? 'Full access within their organization'
                    : user.role === 'staff'
                    ? 'Manage cases, donations, and volunteers'
                    : user.role === 'volunteer'
                    ? 'View shifts and log hours'
                    : 'View donation history and receipts'}
                </p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change Role
            </label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="super_admin">Super Admin</option>
              <option value="org_admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="volunteer">Volunteer</option>
              <option value="donor">Donor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border bg-white p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-3 mb-2">
              <Key className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Password</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">Last changed 30 days ago</p>
            <Button variant="outline" size="sm">
              Reset Password
            </Button>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Two-Factor Auth</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">Not enabled</p>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Login History</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">5 logins this month</p>
            <Button variant="outline" size="sm">
              View Logs
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-white p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Completed volunteer shift', date: '2024-12-15T10:00:00Z' },
            { action: 'Updated profile information', date: '2024-12-10T14:30:00Z' },
            { action: 'Signed up for Christmas Dinner event', date: '2024-12-05T09:15:00Z' },
            { action: 'Logged in', date: '2024-12-01T08:00:00Z' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary-500" />
              <span className="text-gray-900">{activity.action}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{formatDate(activity.date)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-700 mb-4">
          These actions are permanent and cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
            Deactivate Account
          </Button>
          <Button variant="destructive">
            Delete User
          </Button>
        </div>
      </div>
    </div>
  );
}
