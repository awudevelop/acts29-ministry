'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Search, Eye, Edit, Trash2, Users, MapPin } from 'lucide-react';
import { Button } from '@acts29/ui';
import {
  DataTable,
  Pagination,
  Breadcrumbs,
  ShiftStatusBadge,
  Select,
  ConfirmDialog,
  LiveIndicator,
  formatDate,
} from '@acts29/admin-ui';
import { mockVolunteerShifts, mockResources, mockProfiles } from '@acts29/database';

interface Shift {
  id: string;
  role: string;
  start_time: string;
  end_time: string;
  status: string;
  volunteer_id: string | null;
  resource_id: string | null;
  notes: string | null;
}

const columnHelper = createColumnHelper<Shift>();

export default function ShiftsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedShift, setSelectedShift] = React.useState<Shift | null>(null);
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());
  const pageSize = 10;

  // Simulate real-time connection status
  const isLiveConnected = true;

  // Filter shifts
  const filteredShifts = React.useMemo(() => {
    let result = [...mockVolunteerShifts] as Shift[];

    if (searchQuery) {
      result = result.filter((s) =>
        s.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((s) => s.status === statusFilter);
    }

    // Sort by start time
    result.sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    return result;
  }, [searchQuery, statusFilter]);

  // Paginate
  const paginatedShifts = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredShifts.slice(start, start + pageSize);
  }, [filteredShifts, currentPage]);

  const totalPages = Math.ceil(filteredShifts.length / pageSize);

  const columns = [
    columnHelper.accessor('role', {
      header: 'Shift',
      cell: (info) => {
        const resource = mockResources.find(
          (r) => r.id === info.row.original.resource_id
        );
        return (
          <div>
            <p className="font-medium text-gray-900">{info.getValue()}</p>
            {resource && (
              <p className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                {resource.name}
              </p>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('start_time', {
      header: 'Date & Time',
      cell: (info) => {
        const startTime = new Date(info.getValue());
        const endTime = new Date(info.row.original.end_time);
        const duration =
          (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

        return (
          <div>
            <p className="font-medium">{formatDate(info.getValue())}</p>
            <p className="text-sm text-gray-500">
              {startTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}{' '}
              -{' '}
              {endTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}{' '}
              ({duration}h)
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor('volunteer_id', {
      header: 'Assigned To',
      cell: (info) => {
        const volunteer = info.getValue()
          ? mockProfiles.find((p) => p.id === info.getValue())
          : null;

        if (volunteer) {
          return (
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-600">
                {volunteer.first_name?.[0]}
                {volunteer.last_name?.[0]}
              </div>
              <span>
                {volunteer.first_name} {volunteer.last_name}
              </span>
            </div>
          );
        }

        return (
          <span className="text-yellow-600 flex items-center gap-1">
            <Users className="h-4 w-4" />
            Needs volunteers
          </span>
        );
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <ShiftStatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/volunteers/shifts/${info.row.original.id}`);
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Edit shift
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedShift(info.row.original);
              setDeleteDialogOpen(true);
            }}
            className="p-1 text-gray-400 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ];

  const handleDelete = async () => {
    console.log('Deleting shift:', selectedShift?.id);
    setDeleteDialogOpen(false);
    setSelectedShift(null);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Volunteers', href: '/admin/volunteers' },
          { label: 'Shifts' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Volunteer Shifts</h1>
            <LiveIndicator
              isConnected={isLiveConnected}
              lastUpdate={lastUpdate}
              onRefresh={() => setLastUpdate(new Date())}
            />
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage volunteer shift schedules
          </p>
        </div>
        <Link href="/admin/volunteers/shifts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Shift
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Upcoming Shifts</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {filteredShifts.filter((s) => new Date(s.start_time) > new Date()).length}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Needs Volunteers</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {filteredShifts.filter((s) => !s.volunteer_id).length}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Completed This Month</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {filteredShifts.filter((s) => s.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 rounded-lg border bg-white p-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search shifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        <Select
          options={[
            { value: '', label: 'All Status' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
            { value: 'no_show', label: 'No Show' },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status"
          className="w-40"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedShifts}
        onRowClick={(row) => router.push(`/admin/volunteers/shifts/${row.id}`)}
        emptyState={{
          title: 'No shifts found',
          description: 'No shifts match your current filters.',
          action: {
            label: 'Create Shift',
            onClick: () => router.push('/admin/volunteers/shifts/new'),
          },
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredShifts.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Shift"
        description="Are you sure you want to delete this shift? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
