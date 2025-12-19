'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import { Download, Search, Eye, Clock, Calendar, Users } from 'lucide-react';
import { Button } from '@acts29/ui';
import {
  DataTable,
  Pagination,
  Breadcrumbs,
  StatCard,
  RoleBadge,
  formatDate,
} from '@acts29/admin-ui';
import { mockProfiles, mockVolunteerShifts } from '@acts29/database';

interface Volunteer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  totalHours?: number;
  shiftsCompleted?: number;
}

const columnHelper = createColumnHelper<Volunteer>();

export default function VolunteersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Get volunteers from profiles
  const volunteers = mockProfiles
    .filter((p) => p.role === 'volunteer' || p.role === 'staff')
    .map((p) => ({
      ...p,
      totalHours: Math.floor(Math.random() * 100) + 10, // Demo data
      shiftsCompleted: Math.floor(Math.random() * 20) + 1,
    }));

  // Filter volunteers
  const filteredVolunteers = React.useMemo(() => {
    if (!searchQuery) return volunteers;
    const query = searchQuery.toLowerCase();
    return volunteers.filter(
      (v) =>
        v.first_name?.toLowerCase().includes(query) ||
        v.last_name?.toLowerCase().includes(query) ||
        v.phone?.toLowerCase().includes(query)
    );
  }, [searchQuery, volunteers]);

  // Paginate
  const paginatedVolunteers = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVolunteers.slice(start, start + pageSize);
  }, [filteredVolunteers, currentPage]);

  const totalPages = Math.ceil(filteredVolunteers.length / pageSize);

  // Calculate stats
  const totalHours = volunteers.reduce((sum, v) => sum + (v.totalHours ?? 0), 0);
  const upcomingShifts = mockVolunteerShifts.filter(
    (s) => new Date(s.start_time) > new Date()
  ).length;

  const columns = [
    columnHelper.accessor((row) => `${row.first_name} ${row.last_name}`, {
      id: 'name',
      header: 'Name',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 font-medium text-primary-600">
            {info.row.original.first_name?.[0]}
            {info.row.original.last_name?.[0]}
          </div>
          <div>
            <p className="font-medium text-gray-900">{info.getValue()}</p>
            <p className="text-sm text-gray-500">{info.row.original.phone}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: (info) => <RoleBadge role={info.getValue()} />,
    }),
    columnHelper.accessor('totalHours', {
      header: 'Total Hours',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{info.getValue()} hrs</span>
        </div>
      ),
    }),
    columnHelper.accessor('shiftsCompleted', {
      header: 'Shifts Completed',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('created_at', {
      header: 'Joined',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/volunteers/${info.row.original.id}`);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    }),
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Volunteers' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteers</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your volunteer team and track their contributions
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/volunteers/shifts">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Manage Shifts
            </Button>
          </Link>
          <Link href="/admin/volunteers/schedule">
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              View Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Volunteers"
          value={volunteers.length}
          icon={Users}
        />
        <StatCard
          title="Total Hours (All Time)"
          value={totalHours.toLocaleString()}
          icon={Clock}
        />
        <StatCard
          title="Upcoming Shifts"
          value={upcomingShifts}
          icon={Calendar}
        />
        <StatCard
          title="Avg Hours/Volunteer"
          value={Math.round(totalHours / volunteers.length)}
          icon={Clock}
        />
      </div>

      {/* Search */}
      <div className="flex gap-4 rounded-lg border bg-white p-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search volunteers by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedVolunteers}
        onRowClick={(row) => router.push(`/admin/volunteers/${row.id}`)}
        emptyState={{
          title: 'No volunteers found',
          description: 'No volunteers match your search criteria.',
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredVolunteers.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
