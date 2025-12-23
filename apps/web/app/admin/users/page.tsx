'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Search, Eye, Edit } from 'lucide-react';
import { Button } from '@acts29/ui';
import {
  DataTable,
  Pagination,
  Breadcrumbs,
  StatCard,
  RoleBadge,
  Select,
  formatDate,
  getInitials,
} from '@acts29/admin-ui';
import { mockProfiles } from '@acts29/database';

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  bio: string | null;
}

const columnHelper = createColumnHelper<User>();

export default function UsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const users = mockProfiles as User[];

  // Filter users
  const filteredUsers = React.useMemo(() => {
    let result = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.first_name?.toLowerCase().includes(query) ||
          u.last_name?.toLowerCase().includes(query) ||
          u.phone?.toLowerCase().includes(query)
      );
    }

    if (roleFilter) {
      result = result.filter((u) => u.role === roleFilter);
    }

    return result;
  }, [searchQuery, roleFilter, users]);

  // Paginate
  const paginatedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // Stats
  const adminCount = users.filter(
    (u) => u.role === 'super_admin' || u.role === 'org_admin'
  ).length;
  const staffCount = users.filter((u) => u.role === 'staff').length;
  const volunteerCount = users.filter((u) => u.role === 'volunteer').length;

  const columns = [
    columnHelper.accessor((row) => `${row.first_name} ${row.last_name}`, {
      id: 'name',
      header: 'User',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 font-medium text-primary-600">
            {getInitials(info.row.original.first_name, info.row.original.last_name)}
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
    columnHelper.accessor('bio', {
      header: 'Bio',
      cell: (info) => (
        <span className="text-gray-500 truncate max-w-[200px] block">
          {info.getValue()?.slice(0, 50) || 'No bio'}
          {(info.getValue()?.length ?? 0) > 50 ? '...' : ''}
        </span>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Joined',
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
              router.push(`/admin/users/${info.row.original.id}`);
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label={`View ${info.row.original.first_name} ${info.row.original.last_name}`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/users/${info.row.original.id}/edit`);
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label={`Edit ${info.row.original.first_name} ${info.row.original.last_name}`}
          >
            <Edit className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Users' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage staff, volunteers, and user roles
          </p>
        </div>
        <Link href="/admin/users/invite">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={users.length} icon={Plus} />
        <StatCard title="Admins" value={adminCount} icon={Plus} />
        <StatCard title="Staff" value={staffCount} icon={Plus} />
        <StatCard title="Volunteers" value={volunteerCount} icon={Plus} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 rounded-lg border bg-white p-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <label htmlFor="user-search" className="sr-only">
              Search users
            </label>
            <input
              id="user-search"
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        <Select
          options={[
            { value: '', label: 'All Roles' },
            { value: 'super_admin', label: 'Super Admin' },
            { value: 'org_admin', label: 'Admin' },
            { value: 'staff', label: 'Staff' },
            { value: 'volunteer', label: 'Volunteer' },
            { value: 'donor', label: 'Donor' },
          ]}
          value={roleFilter}
          onChange={setRoleFilter}
          placeholder="Role"
          className="w-40"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedUsers}
        onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
        emptyState={{
          title: 'No users found',
          description: 'No users match your current filters.',
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Role Descriptions */}
      <div className="rounded-xl border bg-gray-50 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Role Permissions</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-medium text-gray-900">Super Admin</p>
            <p className="text-sm text-gray-600">Full access to all organizations and settings</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Admin</p>
            <p className="text-sm text-gray-600">Full access within their organization</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Staff</p>
            <p className="text-sm text-gray-600">Manage cases, donations, and volunteers</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Volunteer</p>
            <p className="text-sm text-gray-600">View shifts and log hours</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Donor</p>
            <p className="text-sm text-gray-600">View donation history and receipts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
