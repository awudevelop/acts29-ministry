'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  Badge,
  ConfirmDialog,
  Alert,
  Select,
} from '@acts29/admin-ui';
import {
  ArrowLeft,
  Plus,
  Crown,
  UserMinus,
  Shield,
  User,
  Search,
  Clock,
  Calendar,
} from 'lucide-react';
import {
  mockTeams,
  mockTeamMembers,
  mockProfiles,
  mockVolunteerShifts,
  type TeamRole,
} from '@acts29/database';

interface MemberWithProfile {
  id: string;
  teamId: string;
  profileId: string;
  role: TeamRole;
  joinedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  shiftsCompleted: number;
  totalHours: number;
}

export default function TeamMembersPage() {
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<'all' | TeamRole>('all');
  const [showAddMember, setShowAddMember] = React.useState(false);
  const [selectedProfileId, setSelectedProfileId] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<TeamRole>('member');
  const [memberToRemove, setMemberToRemove] = React.useState<string | null>(null);
  const [memberToChangeRole, setMemberToChangeRole] = React.useState<MemberWithProfile | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const team = mockTeams.find((t) => t.id === params.id);

  // Get team members with profile info
  const members: MemberWithProfile[] = React.useMemo(() => {
    if (!team) return [];

    return mockTeamMembers
      .filter((m) => m.team_id === team.id)
      .map((m) => {
        const profile = mockProfiles.find((p) => p.id === m.profile_id);
        const memberShifts = mockVolunteerShifts.filter(
          (s) => s.volunteer_id === m.profile_id && s.status === 'completed'
        );
        const totalHours = memberShifts.reduce((sum, s) => {
          const start = new Date(s.start_time);
          const end = new Date(s.end_time);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }, 0);

        return {
          id: m.id,
          teamId: m.team_id,
          profileId: m.profile_id,
          role: m.role,
          joinedAt: m.joined_at,
          firstName: profile?.first_name || 'Unknown',
          lastName: profile?.last_name || 'User',
          email: profile?.email || '',
          avatarUrl: profile?.avatar_url || null,
          shiftsCompleted: memberShifts.length,
          totalHours: Math.round(totalHours),
        };
      })
      .sort((a, b) => {
        // Leads first, then by name
        if (a.role === 'lead' && b.role !== 'lead') return -1;
        if (a.role !== 'lead' && b.role === 'lead') return 1;
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      });
  }, [team]);

  // Get available profiles (not already in team)
  const availableProfiles = React.useMemo(() => {
    const memberProfileIds = members.map((m) => m.profileId);
    return mockProfiles.filter((p) => !memberProfileIds.includes(p.id));
  }, [members]);

  // Filtered members
  const filteredMembers = React.useMemo(() => {
    let result = [...members];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.firstName.toLowerCase().includes(query) ||
          m.lastName.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query)
      );
    }

    if (roleFilter !== 'all') {
      result = result.filter((m) => m.role === roleFilter);
    }

    return result;
  }, [members, searchQuery, roleFilter]);

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'lead', label: 'Leads' },
    { value: 'member', label: 'Members' },
  ];

  const profileOptions = [
    { value: '', label: 'Select a person...' },
    ...availableProfiles.map((p) => ({
      value: p.id,
      label: `${p.first_name} ${p.last_name}`,
    })),
  ];

  const addRoleOptions = [
    { value: 'member', label: 'Member' },
    { value: 'lead', label: 'Lead' },
  ];

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
          <p className="mt-2 text-gray-600">The team you&apos;re looking for doesn&apos;t exist.</p>
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

  const handleAddMember = async () => {
    if (!selectedProfileId) {
      setError('Please select a person to add');
      return;
    }

    try {
      const profile = mockProfiles.find((p) => p.id === selectedProfileId);
      console.log('Adding member:', {
        team_id: team.id,
        profile_id: selectedProfileId,
        role: selectedRole,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSuccess(`${profile?.first_name} ${profile?.last_name} added to the team!`);
      setShowAddMember(false);
      setSelectedProfileId('');
      setSelectedRole('member');
    } catch (err) {
      setError('Failed to add member');
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    const member = members.find((m) => m.id === memberToRemove);
    console.log('Removing member:', memberToRemove);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSuccess(`${member?.firstName} ${member?.lastName} removed from the team`);
    setMemberToRemove(null);
  };

  const handleChangeRole = async (newRole: TeamRole) => {
    if (!memberToChangeRole) return;

    console.log('Changing role:', {
      member_id: memberToChangeRole.id,
      new_role: newRole,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSuccess(
      `${memberToChangeRole.firstName} ${memberToChangeRole.lastName} is now a ${newRole}`
    );
    setMemberToChangeRole(null);
  };

  const leadCount = members.filter((m) => m.role === 'lead').length;
  const memberCount = members.filter((m) => m.role === 'member').length;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Teams', href: '/admin/teams' },
          { label: team.name, href: `/admin/teams/${team.id}` },
          { label: 'Members' },
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: team.color || '#6B7280' }}
              >
                {team.name[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
                <p className="text-sm text-gray-600">
                  Manage members of {team.name}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowAddMember(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
              <p className="text-sm text-gray-600">Total Members</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Crown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{leadCount}</p>
              <p className="text-sm text-gray-600">Team Leads</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{memberCount}</p>
              <p className="text-sm text-gray-600">Team Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Panel */}
      {showAddMember && (
        <div className="rounded-xl border bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Add New Member</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Select
                label="Select Person"
                options={profileOptions}
                value={selectedProfileId}
                onChange={setSelectedProfileId}
              />
            </div>
            <Select
              label="Role"
              options={addRoleOptions}
              value={selectedRole}
              onChange={(value) => setSelectedRole(value as TeamRole)}
            />
          </div>
          <div className="mt-4 flex gap-3">
            <Button onClick={handleAddMember} disabled={!selectedProfileId}>
              <Plus className="mr-2 h-4 w-4" />
              Add to Team
            </Button>
            <Button variant="outline" onClick={() => setShowAddMember(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Filters and Members List */}
      <div className="rounded-xl border bg-white">
        {/* Filters */}
        <div className="border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
              />
            </div>
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={(value) => setRoleFilter(value as 'all' | TeamRole)}
            />
          </div>
        </div>

        {/* Members List */}
        <div className="divide-y">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {searchQuery || roleFilter !== 'all' ? 'No members found' : 'No members yet'}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {searchQuery || roleFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add members to get started'}
              </p>
              {!searchQuery && roleFilter === 'all' && (
                <Button className="mt-4" onClick={() => setShowAddMember(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Member
                </Button>
              )}
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium">
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </div>
                  )}

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </p>
                      {member.role === 'lead' ? (
                        <Badge variant="warning" className="gap-1">
                          <Crown className="h-3 w-3" />
                          Lead
                        </Badge>
                      ) : (
                        <Badge variant="default">Member</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center gap-6">
                  {/* Member Stats */}
                  <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{member.shiftsCompleted} shifts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{member.totalHours} hrs</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMemberToChangeRole(member)}
                      title="Change role"
                    >
                      {member.role === 'lead' ? (
                        <Shield className="h-4 w-4" />
                      ) : (
                        <Crown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMemberToRemove(member.id)}
                      title="Remove from team"
                    >
                      <UserMinus className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Remove Member Dialog */}
      <ConfirmDialog
        open={!!memberToRemove}
        onOpenChange={() => setMemberToRemove(null)}
        title="Remove Team Member"
        description={`Are you sure you want to remove ${
          members.find((m) => m.id === memberToRemove)?.firstName || 'this member'
        } from the team? They will lose access to team resources and shifts.`}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={handleRemoveMember}
      />

      {/* Change Role Dialog */}
      <ConfirmDialog
        open={!!memberToChangeRole}
        onOpenChange={() => setMemberToChangeRole(null)}
        title="Change Member Role"
        description={`Change ${memberToChangeRole?.firstName} ${memberToChangeRole?.lastName} from ${memberToChangeRole?.role} to ${memberToChangeRole?.role === 'lead' ? 'member' : 'lead'}?`}
        confirmLabel={memberToChangeRole?.role === 'lead' ? 'Make Member' : 'Make Lead'}
        variant="default"
        onConfirm={() =>
          handleChangeRole(memberToChangeRole?.role === 'lead' ? 'member' : 'lead')
        }
      />
    </div>
  );
}
