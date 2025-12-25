'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  StatCard,
  Badge,
  ConfirmDialog,
  formatDate,
} from '@acts29/admin-ui';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Calendar,
  Clock,
  MapPin,
  UserPlus,
  Plus,
  Eye,
  Crown,
  UserMinus,
} from 'lucide-react';
import {
  mockTeams,
  mockTeamMembers,
  mockProfiles,
  mockOrganizations,
  mockVolunteerShifts,
  mockResources,
  type TeamMember,
  type Profile,
} from '@acts29/database';

interface TeamMemberWithProfile extends TeamMember {
  profile: Profile | null;
}

export default function TeamDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = React.useState(false);
  const [memberToRemove, setMemberToRemove] = React.useState<string | null>(null);

  const team = mockTeams.find((t) => t.id === params.id);
  const organization = team
    ? mockOrganizations.find((o) => o.id === team.organization_id)
    : null;

  // Get team members with profiles
  const teamMembers: TeamMemberWithProfile[] = React.useMemo(() => {
    if (!team) return [];
    return mockTeamMembers
      .filter((m) => m.team_id === team.id)
      .map((m) => ({
        ...m,
        profile: mockProfiles.find((p) => p.id === m.profile_id) || null,
      }));
  }, [team]);

  const leads = teamMembers.filter((m) => m.role === 'lead');

  // Get team shifts
  const teamShifts = React.useMemo(() => {
    if (!team) return [];
    return mockVolunteerShifts.filter(
      (s) => (s as { team_id?: string }).team_id === team.id
    );
  }, [team]);

  const upcomingShifts = teamShifts.filter(
    (s) => new Date(s.start_time) > new Date() && s.status === 'scheduled'
  );

  // Get team resources
  const teamResources = React.useMemo(() => {
    if (!team) return [];
    return mockResources.filter(
      (r) => (r as { team_id?: string }).team_id === team.id
    );
  }, [team]);

  // Calculate hours this month
  const hoursThisMonth = React.useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const completedShifts = teamShifts.filter(
      (s) =>
        s.status === 'completed' && new Date(s.start_time) >= startOfMonth
    );
    return completedShifts.reduce((total, shift) => {
      const hours =
        (new Date(shift.end_time).getTime() -
          new Date(shift.start_time).getTime()) /
        (1000 * 60 * 60);
      return total + hours;
    }, 0);
  }, [teamShifts]);

  if (!team) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Teams', href: '/admin/teams' },
            { label: 'Not Found' },
          ]}
        />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Team Not Found</h1>
          <p className="mt-2 text-gray-600">
            The team you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/admin/teams">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Teams
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    console.log('Deleting team:', team.id);
    setDeleteDialogOpen(false);
    router.push('/admin/teams');
  };

  const handleRemoveMember = async () => {
    if (memberToRemove) {
      console.log('Removing member:', memberToRemove);
      setRemoveMemberDialogOpen(false);
      setMemberToRemove(null);
    }
  };

  const confirmRemoveMember = (memberId: string) => {
    setMemberToRemove(memberId);
    setRemoveMemberDialogOpen(true);
  };

  // Generate mock activity
  const recentActivity = [
    {
      id: '1',
      type: 'member_joined',
      description: 'Jennifer Martinez joined the team',
      timestamp: '2 days ago',
    },
    {
      id: '2',
      type: 'shift_completed',
      description: 'Evening Meal Service shift completed',
      timestamp: '3 days ago',
    },
    {
      id: '3',
      type: 'resource_assigned',
      description: 'Emergency Shelter assigned to team',
      timestamp: '1 week ago',
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Teams', href: '/admin/teams' },
          { label: team.name },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: team.color || '#6B7280' }}
            >
              <Users className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
                <Badge variant={team.is_active ? 'success' : 'default'}>
                  {team.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {organization?.name || 'Unknown Organization'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/admin/teams/${team.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Description */}
      {team.description && (
        <p className="text-gray-600 max-w-3xl">{team.description}</p>
      )}

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Team Members"
          value={teamMembers.length}
          icon={Users}
        />
        <StatCard
          title="Upcoming Shifts"
          value={upcomingShifts.length}
          icon={Calendar}
        />
        <StatCard
          title="Hours This Month"
          value={hoursThisMonth.toFixed(0)}
          icon={Clock}
        />
        <StatCard
          title="Resources"
          value={teamResources.length}
          icon={MapPin}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team Members */}
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Team Members ({teamMembers.length})
              </h2>
              <Link href={`/admin/teams/${team.id}/members`}>
                <Button variant="outline" size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </Link>
            </div>
            {teamMembers.length > 0 ? (
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-medium text-primary-600">
                        {member.profile?.first_name?.[0]}
                        {member.profile?.last_name?.[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {member.profile?.first_name} {member.profile?.last_name}
                          </p>
                          {member.role === 'lead' && (
                            <Crown className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Joined {formatDate(member.joined_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === 'lead' ? 'warning' : 'default'}>
                        {member.role === 'lead' ? 'Lead' : 'Member'}
                      </Badge>
                      <Link href={`/admin/volunteers/${member.profile_id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmRemoveMember(member.id)}
                      >
                        <UserMinus className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="mx-auto h-10 w-10 mb-2" />
                <p>No team members yet</p>
                <Link href={`/admin/teams/${team.id}/members`}>
                  <Button variant="outline" size="sm" className="mt-2">
                    Add First Member
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    {activity.type === 'member_joined' && (
                      <UserPlus className="h-4 w-4 text-green-600" />
                    )}
                    {activity.type === 'shift_completed' && (
                      <Calendar className="h-4 w-4 text-blue-600" />
                    )}
                    {activity.type === 'resource_assigned' && (
                      <MapPin className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Resources */}
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Team Resources ({teamResources.length})
              </h2>
            </div>
            {teamResources.length > 0 ? (
              <div className="space-y-3">
                {teamResources.map((resource) => (
                  <Link
                    key={resource.id}
                    href={`/admin/resources/${resource.id}`}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                      <MapPin className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{resource.name}</p>
                      <p className="text-sm text-gray-500">{resource.address}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="mx-auto h-10 w-10 mb-2" />
                <p>No resources assigned</p>
              </div>
            )}
          </div>

          {/* Upcoming Shifts */}
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Shifts ({upcomingShifts.length})
              </h2>
            </div>
            {upcomingShifts.length > 0 ? (
              <div className="space-y-3">
                {upcomingShifts.slice(0, 5).map((shift) => (
                  <Link
                    key={shift.id}
                    href={`/admin/volunteers/shifts/${shift.id}`}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{shift.role}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(shift.start_time)}
                      </p>
                    </div>
                    <Badge variant={shift.volunteer_id ? 'success' : 'warning'}>
                      {shift.volunteer_id ? 'Assigned' : 'Open'}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="mx-auto h-10 w-10 mb-2" />
                <p>No upcoming shifts</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href={`/admin/teams/${team.id}/members`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </Link>
              <Link href="/admin/volunteers/shifts/new" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Shift
                </Button>
              </Link>
            </div>
          </div>

          {/* Team Leads */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Team Leads</h3>
            {leads.length > 0 ? (
              <div className="space-y-3">
                {leads.map((lead) => (
                  <div key={lead.id} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-medium text-amber-600">
                      {lead.profile?.first_name?.[0]}
                      {lead.profile?.last_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {lead.profile?.first_name} {lead.profile?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {lead.profile?.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No lead assigned</p>
            )}
          </div>

          {/* Team Info */}
          <div className="rounded-xl border bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Team Info</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Team ID</dt>
                <dd className="font-mono text-gray-600">{team.id.slice(0, 8)}...</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Slug</dt>
                <dd className="text-gray-900">{team.slug}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900">{formatDate(team.created_at)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="text-gray-900">{formatDate(team.updated_at)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Organization</dt>
                <dd className="text-gray-900">{organization?.name}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Team"
        description={`Are you sure you want to delete "${team.name}"? All team members will be removed. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
      />

      {/* Remove Member Confirmation */}
      <ConfirmDialog
        open={removeMemberDialogOpen}
        onOpenChange={setRemoveMemberDialogOpen}
        title="Remove Member"
        description="Are you sure you want to remove this member from the team?"
        confirmLabel="Remove"
        variant="danger"
        onConfirm={handleRemoveMember}
      />
    </div>
  );
}
