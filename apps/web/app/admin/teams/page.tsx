'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  DataTable,
  Pagination,
  StatCard,
  Badge,
  Select,
  ConfirmDialog,
} from '@acts29/admin-ui';
import {
  Plus,
  Search,
  UsersRound,
  CheckCircle,
  Users,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import {
  mockTeams,
  mockTeamMembers,
  mockProfiles,
  mockOrganizations,
  type Team,
} from '@acts29/database';

interface TeamWithMeta extends Team {
  memberCount: number;
  leadName: string | null;
  organizationName: string;
}

const columnHelper = createColumnHelper<TeamWithMeta>();

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function TeamsAdminPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedTeams, setSelectedTeams] = React.useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [teamToDelete, setTeamToDelete] = React.useState<string | null>(null);

  const pageSize = 10;

  // Enrich teams with member count, lead name, and organization name
  const teamsWithMeta: TeamWithMeta[] = React.useMemo(() => {
    return mockTeams.map((team) => {
      const members = mockTeamMembers.filter((m) => m.team_id === team.id);
      const lead = members.find((m) => m.role === 'lead');
      const leadProfile = lead
        ? mockProfiles.find((p) => p.id === lead.profile_id)
        : null;
      const organization = mockOrganizations.find(
        (o) => o.id === team.organization_id
      );

      return {
        ...team,
        memberCount: members.length,
        leadName: leadProfile
          ? `${leadProfile.first_name} ${leadProfile.last_name}`
          : null,
        organizationName: organization?.name || 'Unknown',
      };
    });
  }, []);

  // Filter teams
  const filteredTeams = React.useMemo(() => {
    let result = [...teamsWithMeta];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (team) =>
          team.name.toLowerCase().includes(query) ||
          team.description?.toLowerCase().includes(query) ||
          team.organizationName.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((team) =>
        statusFilter === 'active' ? team.is_active : !team.is_active
      );
    }

    return result;
  }, [teamsWithMeta, searchQuery, statusFilter]);

  // Pagination
  const paginatedTeams = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTeams.slice(start, start + pageSize);
  }, [filteredTeams, currentPage]);

  const totalPages = Math.ceil(filteredTeams.length / pageSize);

  // Stats
  const stats = React.useMemo(() => {
    const totalTeams = mockTeams.length;
    const activeTeams = mockTeams.filter((t) => t.is_active).length;
    const totalMembers = mockTeamMembers.length;
    const uniqueMembers = new Set(mockTeamMembers.map((m) => m.profile_id)).size;

    return { totalTeams, activeTeams, totalMembers, uniqueMembers };
  }, []);

  // Handlers
  const handleDelete = (teamId: string) => {
    setTeamToDelete(teamId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (teamToDelete) {
      console.log('Deleting team:', teamToDelete);
      setDeleteDialogOpen(false);
      setTeamToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    console.log('Bulk deleting teams:', selectedTeams);
    setSelectedTeams([]);
  };

  const handleBulkActivate = async () => {
    console.log('Activating teams:', selectedTeams);
    setSelectedTeams([]);
  };

  const handleBulkDeactivate = async () => {
    console.log('Deactivating teams:', selectedTeams);
    setSelectedTeams([]);
  };

  const columns = React.useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Team',
        cell: (info) => {
          const team = info.row.original;
          return (
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: team.color || '#6B7280' }}
              >
                <UsersRound className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{team.name}</p>
                <p className="text-sm text-gray-500">{team.organizationName}</p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: (info) => (
          <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
            {info.getValue() || 'No description'}
          </p>
        ),
      }),
      columnHelper.accessor('memberCount', {
        header: 'Members',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('leadName', {
        header: 'Team Lead',
        cell: (info) => (
          <span className="text-gray-700">
            {info.getValue() || 'No lead assigned'}
          </span>
        ),
      }),
      columnHelper.accessor('is_active', {
        header: 'Status',
        cell: (info) => (
          <Badge variant={info.getValue() ? 'success' : 'default'}>
            {info.getValue() ? 'Active' : 'Inactive'}
          </Badge>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => {
          const team = info.row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/admin/teams/${team.id}`}>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/admin/teams/${team.id}/edit`}>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(team.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          );
        },
      }),
    ],
    []
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Teams' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage teams for collaboration and scoped access control
          </p>
        </div>
        <Link href="/admin/teams/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Team
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Teams"
          value={stats.totalTeams}
          icon={UsersRound}
        />
        <StatCard
          title="Active Teams"
          value={stats.activeTeams}
          icon={CheckCircle}
          trend="up"
        />
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={Users}
        />
        <StatCard
          title="Unique Members"
          value={stats.uniqueMembers}
          icon={Users}
        />
      </div>

      {/* Filters and Table */}
      <div className="rounded-xl border bg-white">
        {/* Filters */}
        <div className="border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                />
              </div>
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(value) =>
                  setStatusFilter(value as 'all' | 'active' | 'inactive')
                }
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedTeams.length > 0 && (
            <div className="mt-4 flex items-center gap-4 rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-gray-600">
                {selectedTeams.length} team{selectedTeams.length > 1 ? 's' : ''}{' '}
                selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkActivate}>
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDeactivate}
                >
                  Deactivate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <DataTable
          data={paginatedTeams}
          columns={columns}
          onRowClick={(team) => router.push(`/admin/teams/${team.id}`)}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredTeams.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <UsersRound className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No teams found
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first team'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link href="/admin/teams/new">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Team"
        description="Are you sure you want to delete this team? All team members will be removed from the team. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
