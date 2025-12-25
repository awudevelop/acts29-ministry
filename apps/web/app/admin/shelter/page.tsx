'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import { Breadcrumbs, StatCard, Badge, EmptyState } from '@acts29/admin-ui';
import {
  Home,
  Bed,
  Users,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
} from 'lucide-react';

// Mock shelter data
const mockShelters = [
  {
    id: 'shelter-1',
    name: 'Main Shelter',
    address: '123 Hope Street, Springfield, IL',
    totalBeds: 50,
    occupiedBeds: 42,
    availableBeds: 6,
    maintenanceBeds: 2,
    type: 'overnight',
  },
  {
    id: 'shelter-2',
    name: 'Family Housing Center',
    address: '456 Faith Ave, Springfield, IL',
    totalBeds: 24,
    occupiedBeds: 18,
    availableBeds: 6,
    maintenanceBeds: 0,
    type: 'transitional',
  },
];

// Mock bed data
const mockBeds = [
  { id: 'bed-1', number: 'A-01', status: 'occupied', guestName: 'John D.', checkIn: '2024-12-20', shelterId: 'shelter-1' },
  { id: 'bed-2', number: 'A-02', status: 'occupied', guestName: 'Michael S.', checkIn: '2024-12-22', shelterId: 'shelter-1' },
  { id: 'bed-3', number: 'A-03', status: 'available', guestName: null, checkIn: null, shelterId: 'shelter-1' },
  { id: 'bed-4', number: 'A-04', status: 'maintenance', guestName: null, checkIn: null, shelterId: 'shelter-1' },
  { id: 'bed-5', number: 'A-05', status: 'reserved', guestName: 'Robert J.', checkIn: null, shelterId: 'shelter-1' },
  { id: 'bed-6', number: 'B-01', status: 'occupied', guestName: 'Sarah M.', checkIn: '2024-12-18', shelterId: 'shelter-2' },
];

// Mock recent activity
const mockActivity = [
  { id: '1', action: 'Check-in', guest: 'John D.', bed: 'A-01', time: '2 hours ago' },
  { id: '2', action: 'Check-out', guest: 'Mary K.', bed: 'B-03', time: '4 hours ago' },
  { id: '3', action: 'Reservation', guest: 'Robert J.', bed: 'A-05', time: '5 hours ago' },
];

const statusColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  available: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: CheckCircle },
  occupied: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Users },
  reserved: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: Clock },
  maintenance: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-400', icon: Wrench },
};

export default function ShelterPage() {
  const totalBeds = mockShelters.reduce((sum, s) => sum + s.totalBeds, 0);
  const occupiedBeds = mockShelters.reduce((sum, s) => sum + s.occupiedBeds, 0);
  const availableBeds = mockShelters.reduce((sum, s) => sum + s.availableBeds, 0);
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Shelter Management' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shelter Management</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage beds, guest check-ins, and shelter operations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Quick Check-in
          </Button>
          <Link href="/admin/shelter/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Shelter
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Beds"
          value={totalBeds}
          icon={Bed}
          changeLabel="Across all shelters"
        />
        <StatCard
          title="Occupied"
          value={occupiedBeds}
          icon={Users}
          change={-5}
          trend="down"
          changeLabel="Currently in use"
        />
        <StatCard
          title="Available"
          value={availableBeds}
          icon={CheckCircle}
          change={12}
          trend="up"
          changeLabel="Ready for guests"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={Home}
          changeLabel="Current capacity"
        />
      </div>

      {/* Capacity Alert */}
      {occupancyRate >= 85 && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/20 p-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-300">
              High Occupancy Alert
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Shelter capacity is at {occupancyRate}%. Consider activating overflow protocols.
            </p>
          </div>
        </div>
      )}

      {/* Shelters List */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Shelters</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {mockShelters.map((shelter) => {
            const rate = Math.round((shelter.occupiedBeds / shelter.totalBeds) * 100);
            return (
              <div key={shelter.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <Link
                    href={`/admin/shelter/${shelter.id}`}
                    className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {shelter.name}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{shelter.address}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={shelter.type === 'overnight' ? 'info' : 'success'}>
                    {shelter.type === 'overnight' ? 'Overnight' : 'Transitional'}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          rate >= 90 ? 'bg-red-500' : rate >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {shelter.occupiedBeds}/{shelter.totalBeds}
                    </span>
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {shelter.availableBeds} available
                  </span>
                  <Link href={`/admin/shelter/${shelter.id}`}>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bed Status Grid & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bed Status Overview */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Bed Status Overview
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(statusColors).map(([status, { bg, text, icon: Icon }]) => {
              const count = mockBeds.filter((b) => b.status === status).length;
              return (
                <div key={status} className={`rounded-lg ${bg} p-4 text-center`}>
                  <Icon className={`h-6 w-6 ${text} mx-auto mb-2`} />
                  <p className={`text-2xl font-bold ${text}`}>{count}</p>
                  <p className={`text-sm capitalize ${text}`}>{status}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {mockActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    activity.action === 'Check-in'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : activity.action === 'Check-out'
                        ? 'bg-red-100 dark:bg-red-900/30'
                        : 'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}
                >
                  {activity.action === 'Check-in' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : activity.action === 'Check-out' ? (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.action}: {activity.guest}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Bed {activity.bed} - {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/shelter/activity"
            className="mt-4 block text-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            View all activity
          </Link>
        </div>
      </div>

      {mockShelters.length === 0 && (
        <EmptyState
          icon={<Home className="h-12 w-12" />}
          title="No shelters configured"
          description="Add your first shelter to start managing beds and guests."
          actionHref="/admin/shelter/new"
          action={{ label: 'Add Shelter', onClick: () => {} }}
        />
      )}
    </div>
  );
}
