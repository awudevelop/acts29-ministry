'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Search, Eye, FileText, User } from 'lucide-react';
import { Button } from '@acts29/ui';
import {
  DataTable,
  Pagination,
  Breadcrumbs,
  StatCard,
  CaseStatusBadge,
  Select,
  formatDate,
} from '@acts29/admin-ui';
import { mockCases, mockProfiles } from '@acts29/database';

interface Case {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
  needs: string[];
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

const columnHelper = createColumnHelper<Case>();

export default function CasesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Filter cases
  const filteredCases = React.useMemo(() => {
    let result = [...mockCases] as Case[];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.first_name.toLowerCase().includes(query) ||
          c.last_name.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }

    return result;
  }, [searchQuery, statusFilter]);

  // Paginate
  const paginatedCases = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCases.slice(start, start + pageSize);
  }, [filteredCases, currentPage]);

  const totalPages = Math.ceil(filteredCases.length / pageSize);

  // Stats
  const activeCases = mockCases.filter((c) => c.status === 'active').length;
  const pendingCases = mockCases.filter((c) => c.status === 'pending').length;
  const closedCases = mockCases.filter((c) => c.status === 'closed').length;

  const columns = [
    columnHelper.accessor((row) => `${row.first_name} ${row.last_name}`, {
      id: 'name',
      header: 'Client',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600">
            {info.row.original.first_name[0]}
            {info.row.original.last_name[0]}
          </div>
          <div>
            <p className="font-medium text-gray-900">{info.getValue()}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <CaseStatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('needs', {
      header: 'Needs',
      cell: (info) => {
        const needs = info.getValue();
        return (
          <div className="flex flex-wrap gap-1">
            {needs.slice(0, 2).map((need) => (
              <span
                key={need}
                className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
              >
                {need.replace('_', ' ')}
              </span>
            ))}
            {needs.length > 2 && (
              <span className="text-xs text-gray-500">+{needs.length - 2}</span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('assigned_to', {
      header: 'Assigned To',
      cell: (info) => {
        const assignee = info.getValue()
          ? mockProfiles.find((p) => p.id === info.getValue())
          : null;

        if (assignee) {
          return (
            <span className="text-gray-700">
              {assignee.first_name} {assignee.last_name}
            </span>
          );
        }
        return <span className="text-gray-400">Unassigned</span>;
      },
    }),
    columnHelper.accessor('updated_at', {
      header: 'Last Updated',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/cases/${info.row.original.id}`);
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/cases/${info.row.original.id}/notes`);
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Notes"
          >
            <FileText className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Cases' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track and manage individuals receiving services
          </p>
        </div>
        <Link href="/admin/cases/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Case
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Cases" value={mockCases.length} icon={User} />
        <StatCard
          title="Active"
          value={activeCases}
          icon={User}
          change={activeCases}
          changeLabel="in progress"
          trend="neutral"
        />
        <StatCard title="Pending" value={pendingCases} icon={User} />
        <StatCard title="Closed" value={closedCases} icon={User} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 rounded-lg border bg-white p-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        <Select
          options={[
            { value: '', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'closed', label: 'Closed' },
            { value: 'referred', label: 'Referred' },
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
        data={paginatedCases}
        onRowClick={(row) => router.push(`/admin/cases/${row.id}`)}
        emptyState={{
          title: 'No cases found',
          description: 'No cases match your current filters.',
          action: {
            label: 'New Case',
            onClick: () => router.push('/admin/cases/new'),
          },
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCases.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Needs Legend */}
      <div className="rounded-xl border bg-gray-50 p-4">
        <h3 className="font-medium text-gray-900 mb-3">Common Needs Categories</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'housing',
            'food',
            'clothing',
            'medical',
            'mental_health',
            'substance_abuse',
            'employment',
            'childcare',
            'identification',
          ].map((need) => (
            <span
              key={need}
              className="inline-flex rounded-full bg-white border px-3 py-1 text-sm text-gray-700"
            >
              {need.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
