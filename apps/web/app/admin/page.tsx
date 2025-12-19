import Link from 'next/link';
import {
  DollarSign,
  Users,
  Briefcase,
  Clock,
  Heart,
  Calendar,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { StatCard, formatCurrency, formatDate } from '@acts29/admin-ui';
import { mockDonations, mockCases, mockVolunteerShifts, mockStats } from '@acts29/database';

// Recent donations component
function RecentDonations() {
  const recentDonations = mockDonations.slice(0, 5);

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h3 className="font-semibold text-gray-900">Recent Donations</h3>
        <Link href="/admin/donations" className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </div>
      <div className="divide-y">
        {recentDonations.map((donation) => (
          <div key={donation.id} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-medium text-gray-900">
                {donation.type === 'monetary'
                  ? formatCurrency(donation.amount ?? 0)
                  : donation.type === 'goods'
                  ? 'Goods Donation'
                  : 'Time Donation'}
              </p>
              <p className="text-sm text-gray-500">{donation.description?.slice(0, 50)}...</p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  donation.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : donation.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {donation.status}
              </span>
              <p className="mt-1 text-xs text-gray-500">{formatDate(donation.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Active cases component
function ActiveCases() {
  const activeCases = mockCases.filter((c) => c.status === 'active').slice(0, 5);

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h3 className="font-semibold text-gray-900">Active Cases</h3>
        <Link href="/admin/cases" className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </div>
      <div className="divide-y">
        {activeCases.map((caseItem) => (
          <div key={caseItem.id} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-medium text-gray-900">
                {caseItem.first_name} {caseItem.last_name}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {caseItem.needs.slice(0, 3).map((need) => (
                  <span
                    key={need}
                    className="inline-flex rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700"
                  >
                    {need.replace('_', ' ')}
                  </span>
                ))}
                {caseItem.needs.length > 3 && (
                  <span className="text-xs text-gray-500">+{caseItem.needs.length - 3} more</span>
                )}
              </div>
            </div>
            <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Upcoming shifts component
function UpcomingShifts() {
  const upcomingShifts = mockVolunteerShifts
    .filter((s) => new Date(s.start_time) > new Date())
    .slice(0, 5);

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h3 className="font-semibold text-gray-900">Upcoming Shifts</h3>
        <Link href="/admin/volunteers/shifts" className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </div>
      <div className="divide-y">
        {upcomingShifts.map((shift) => (
          <div key={shift.id} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-medium text-gray-900">{shift.role}</p>
              <p className="text-sm text-gray-500">
                {formatDate(shift.start_time)} at{' '}
                {new Date(shift.start_time).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                shift.volunteer_id
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {shift.volunteer_id ? 'Filled' : 'Needs Volunteers'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick actions component
function QuickActions() {
  const actions = [
    { label: 'Record Donation', href: '/admin/donations/new', icon: Heart },
    { label: 'Create Event', href: '/admin/calendar/new', icon: Calendar },
    { label: 'Add Case', href: '/admin/cases/new', icon: Briefcase },
    { label: 'Generate Receipts', href: '/admin/tax-receipts', icon: FileText },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="rounded-lg bg-primary-50 p-2">
            <action.icon className="h-5 w-5 text-primary-600" />
          </div>
          <span className="font-medium text-gray-900">{action.label}</span>
          <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
        </Link>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  // Calculate stats from mock data
  const totalDonations = mockDonations
    .filter((d) => d.type === 'monetary' && d.status === 'completed')
    .reduce((sum, d) => sum + (d.amount ?? 0), 0);

  const activeCasesCount = mockCases.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome back! Here&apos;s an overview of your ministry.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Donations (Month)"
          value={formatCurrency(totalDonations)}
          change={12.5}
          trend="up"
          changeLabel="vs last month"
          icon={DollarSign}
        />
        <StatCard
          title="Active Volunteers"
          value={mockStats.activeVolunteers}
          change={8}
          trend="up"
          changeLabel="new this month"
          icon={Users}
        />
        <StatCard
          title="Active Cases"
          value={activeCasesCount}
          icon={Briefcase}
        />
        <StatCard
          title="Volunteer Hours (Month)"
          value={mockStats.volunteerHours.toLocaleString()}
          change={5.2}
          trend="up"
          changeLabel="vs last month"
          icon={Clock}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
        <QuickActions />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentDonations />
        <ActiveCases />
      </div>

      {/* Upcoming Shifts */}
      <UpcomingShifts />
    </div>
  );
}
