'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  StatCard,
  Badge,
  formatDate,
} from '@acts29/admin-ui';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  HandHeart,
  CheckCircle,
  Clock,
  Users,
  MoreVertical,
  Filter,
  Heart,
  MessageCircle,
  User,
  UserX,
} from 'lucide-react';
import { mockPrayerRequests, mockProfiles } from '@acts29/database';

type PrayerRequest = (typeof mockPrayerRequests)[number];

export default function PrayerAdminPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'pending' | 'answered'>('all');
  const [anonymousFilter, setAnonymousFilter] = React.useState<'all' | 'anonymous' | 'identified'>('all');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [showActionsMenu, setShowActionsMenu] = React.useState<string | null>(null);

  // Get user name helper
  const getUserName = (userId: string | null) => {
    if (!userId) return null;
    const profile = mockProfiles.find((p) => p.id === userId);
    return profile ? `${profile.first_name} ${profile.last_name}` : null;
  };

  // Filter prayer requests
  const filteredRequests = React.useMemo(() => {
    let result = [...mockPrayerRequests];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((r) =>
        statusFilter === 'answered' ? r.is_answered : !r.is_answered
      );
    }

    if (anonymousFilter !== 'all') {
      result = result.filter((r) =>
        anonymousFilter === 'anonymous' ? r.is_anonymous : !r.is_anonymous
      );
    }

    // Sort by date, newest first
    return result.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [searchQuery, statusFilter, anonymousFilter]);

  // Calculate stats
  const stats = {
    total: mockPrayerRequests.length,
    pending: mockPrayerRequests.filter((r) => !r.is_answered).length,
    answered: mockPrayerRequests.filter((r) => r.is_answered).length,
    totalPrayers: mockPrayerRequests.reduce((sum, r) => sum + r.prayer_count, 0),
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredRequests.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredRequests.map((r) => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    console.log('Deleting prayer request:', id);
    setShowActionsMenu(null);
  };

  const handleMarkAnswered = (id: string) => {
    console.log('Marking as answered:', id);
    setShowActionsMenu(null);
  };

  const handleBulkMarkAnswered = () => {
    console.log('Marking as answered:', selectedItems);
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    console.log('Deleting:', selectedItems);
    setSelectedItems([]);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Prayer Requests' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prayer Requests</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and respond to community prayer requests
          </p>
        </div>
        <Link href="/admin/prayer/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Request
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Requests" value={stats.total} icon={HandHeart} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} />
        <StatCard title="Answered" value={stats.answered} icon={CheckCircle} />
        <StatCard title="Total Prayers" value={stats.totalPrayers.toLocaleString()} icon={Heart} />
      </div>

      {/* Filters and Search */}
      <div className="rounded-xl border bg-white">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search prayer requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'answered')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="answered">Answered</option>
            </select>
            <select
              value={anonymousFilter}
              onChange={(e) => setAnonymousFilter(e.target.value as 'all' | 'anonymous' | 'identified')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            >
              <option value="all">All Users</option>
              <option value="anonymous">Anonymous</option>
              <option value="identified">Identified</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-4 bg-primary-50 px-4 py-3 border-b">
            <span className="text-sm font-medium text-primary-700">
              {selectedItems.length} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleBulkMarkAnswered}>
                <CheckCircle className="mr-1 h-4 w-4" />
                Mark Answered
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                <th className="px-4 py-3 font-medium">
                  <input
                    type="checkbox"
                    checked={
                      filteredRequests.length > 0 &&
                      selectedItems.length === filteredRequests.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Request</th>
                <th className="px-4 py-3 font-medium">Submitted By</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Prayers</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRequests.map((request) => {
                const userName = getUserName(request.user_id);
                return (
                  <tr
                    key={request.id}
                    className="text-sm hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/prayer/${request.id}`)}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(request.id)}
                        onChange={() => toggleSelect(request.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            request.is_answered
                              ? 'bg-green-100 text-green-700'
                              : 'bg-primary-100 text-primary-700'
                          }`}
                        >
                          {request.is_answered ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <HandHeart className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-xs">
                            {request.title}
                          </p>
                          <p className="text-gray-500 text-xs truncate max-w-xs">
                            {request.description.slice(0, 80)}
                            {request.description.length > 80 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {request.is_anonymous ? (
                          <>
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                              <UserX className="h-3 w-3 text-gray-500" />
                            </div>
                            <span className="text-gray-500 italic">Anonymous</span>
                          </>
                        ) : userName ? (
                          <>
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                              <User className="h-3 w-3 text-primary-600" />
                            </div>
                            <span className="text-gray-900">{userName}</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Unknown</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {request.is_answered ? (
                        <Badge variant="success">Answered</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Heart className="h-4 w-4 text-red-400" />
                        <span>{request.prayer_count}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(request.created_at)}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActionsMenu(
                              showActionsMenu === request.id ? null : request.id
                            )
                          }
                          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showActionsMenu === request.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setShowActionsMenu(null)}
                            />
                            <div className="absolute right-0 z-50 mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
                              <Link
                                href={`/admin/prayer/${request.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                              <Link
                                href={`/admin/prayer/${request.id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                              {!request.is_answered && (
                                <button
                                  onClick={() => handleMarkAnswered(request.id)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Mark Answered
                                </button>
                              )}
                              <hr className="my-1" />
                              <button
                                onClick={() => handleDelete(request.id)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredRequests.length === 0 && (
            <div className="py-12 text-center">
              <HandHeart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No prayer requests found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || statusFilter !== 'all' || anonymousFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by adding your first prayer request.'}
              </p>
              {!searchQuery && statusFilter === 'all' && anonymousFilter === 'all' && (
                <Link href="/admin/prayer/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Request
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        {filteredRequests.length > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-gray-500">
              Showing {filteredRequests.length} of {mockPrayerRequests.length} prayer requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
