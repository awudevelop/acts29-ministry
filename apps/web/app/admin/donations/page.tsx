'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Download, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@acts29/ui';
import {
  DataTable,
  Pagination,
  DonationStatusBadge,
  DonationTypeBadge,
  Breadcrumbs,
  Select,
  DateRangePicker,
  ConfirmDialog,
  formatCurrency,
  formatDate,
} from '@acts29/admin-ui';
import { mockDonations } from '@acts29/database';

interface Donation {
  id: string;
  type: string;
  amount: number | null;
  description: string | null;
  status: string;
  created_at: string;
  donor_id: string | null;
  cover_fees: boolean;
  fee_amount: number | null;
  total_amount: number | null;
}

const columnHelper = createColumnHelper<Donation>();

export default function DonationsPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedDonation, setSelectedDonation] = React.useState<Donation | null>(null);

  const pageSize = 10;

  // Filter donations
  const filteredDonations = React.useMemo(() => {
    let result = [...mockDonations] as Donation[];

    if (searchQuery) {
      result = result.filter((d) =>
        d.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter) {
      result = result.filter((d) => d.type === typeFilter);
    }

    if (statusFilter) {
      result = result.filter((d) => d.status === statusFilter);
    }

    if (startDate) {
      result = result.filter((d) => new Date(d.created_at) >= new Date(startDate));
    }

    if (endDate) {
      result = result.filter((d) => new Date(d.created_at) <= new Date(endDate));
    }

    return result;
  }, [searchQuery, typeFilter, statusFilter, startDate, endDate]);

  // Paginate
  const paginatedDonations = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDonations.slice(start, start + pageSize);
  }, [filteredDonations, currentPage]);

  const totalPages = Math.ceil(filteredDonations.length / pageSize);

  // Calculate totals
  const totalMonetary = filteredDonations
    .filter((d) => d.type === 'monetary' && d.status === 'completed')
    .reduce((sum, d) => sum + (d.amount ?? 0), 0);

  const columns = [
    columnHelper.accessor('created_at', {
      header: 'Date',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => <DonationTypeBadge type={info.getValue()} />,
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => {
        const donation = info.row.original;
        if (donation.type === 'monetary') {
          return (
            <div>
              <span className="font-medium">{formatCurrency(info.getValue() ?? 0)}</span>
              {donation.cover_fees && donation.fee_amount && (
                <span className="ml-1 text-xs text-gray-500">
                  (+{formatCurrency(donation.fee_amount)} fees)
                </span>
              )}
            </div>
          );
        }
        return <span className="text-gray-500">N/A</span>;
      },
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => (
        <span className="max-w-xs truncate block" title={info.getValue() ?? ''}>
          {info.getValue()?.slice(0, 50)}
          {(info.getValue()?.length ?? 0) > 50 ? '...' : ''}
        </span>
      ),
    }),
    columnHelper.accessor('donor_id', {
      header: 'Donor',
      cell: (info) => (
        <span className={info.getValue() ? '' : 'text-gray-500 italic'}>
          {info.getValue() ? 'Registered' : 'Anonymous'}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <DonationStatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/donations/${info.row.original.id}`);
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/donations/${info.row.original.id}/edit`);
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDonation(info.row.original);
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

  const handleExport = () => {
    // In a real app, this would generate a CSV/Excel file
    const csv = filteredDonations
      .map((d) =>
        [
          formatDate(d.created_at),
          d.type,
          d.amount ?? '',
          d.description ?? '',
          d.status,
        ].join(',')
      )
      .join('\n');

    const blob = new Blob([`Date,Type,Amount,Description,Status\n${csv}`], {
      type: 'text/csv',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleDelete = async () => {
    // In a real app, this would call the delete API
    console.log('Deleting donation:', selectedDonation?.id);
    setDeleteDialogOpen(false);
    setSelectedDonation(null);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Donations' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track all donations to your organization
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/admin/donations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Donation
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Total Monetary</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatCurrency(totalMonetary)}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Total Donations</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{filteredDonations.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Avg Donation</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatCurrency(
              filteredDonations.filter((d) => d.type === 'monetary').length > 0
                ? totalMonetary /
                    filteredDonations.filter((d) => d.type === 'monetary').length
                : 0
            )}
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
              placeholder="Search donations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        <Select
          options={[
            { value: '', label: 'All Types' },
            { value: 'monetary', label: 'Monetary' },
            { value: 'goods', label: 'Goods' },
            { value: 'time', label: 'Time' },
          ]}
          value={typeFilter}
          onChange={setTypeFilter}
          placeholder="Type"
          className="w-40"
        />
        <Select
          options={[
            { value: '', label: 'All Status' },
            { value: 'completed', label: 'Completed' },
            { value: 'pending', label: 'Pending' },
            { value: 'failed', label: 'Failed' },
            { value: 'refunded', label: 'Refunded' },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status"
          className="w-40"
        />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          label=""
          className="min-w-[280px]"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedDonations}
        onRowClick={(row) => router.push(`/admin/donations/${row.id}`)}
        emptyState={{
          title: 'No donations found',
          description: 'No donations match your current filters. Try adjusting your search criteria.',
          action: {
            label: 'Clear Filters',
            onClick: () => {
              setSearchQuery('');
              setTypeFilter('');
              setStatusFilter('');
              setStartDate('');
              setEndDate('');
            },
          },
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredDonations.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Donation"
        description="Are you sure you want to delete this donation? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
