'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  StatCard,
  Badge,
  formatDate,
} from '@acts29/admin-ui';
import {
  ArrowLeft,
  Search,
  Download,
  Mail,
  UserPlus,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Filter,
} from 'lucide-react';
import {
  mockEvents,
  mockEventRegistrations,
  type RegistrationStatus,
} from '@acts29/database';

export default function EventRegistrationsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | 'all'>('all');
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([]);

  const event = mockEvents.find((e) => e.id === eventId);
  const registrations = mockEventRegistrations.filter((r) => r.event_id === eventId);

  if (!event) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Calendar', href: '/admin/calendar' },
            { label: 'Not Found' },
          ]}
        />
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Event not found</h2>
          <p className="text-gray-500 mt-2">The event you're looking for doesn't exist.</p>
          <Link href="/admin/calendar">
            <Button className="mt-4">Back to Calendar</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      searchQuery === '' ||
      `${reg.first_name} ${reg.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: registrations.length,
    confirmed: registrations.filter((r) => r.status === 'confirmed').length,
    registered: registrations.filter((r) => r.status === 'registered').length,
    waitlist: registrations.filter((r) => r.status === 'waitlist').length,
    cancelled: registrations.filter((r) => r.status === 'cancelled').length,
    totalGuests: registrations.reduce((sum, r) => sum + r.party_size, 0),
  };

  const toggleSelectAll = () => {
    if (selectedRegistrations.length === filteredRegistrations.length) {
      setSelectedRegistrations([]);
    } else {
      setSelectedRegistrations(filteredRegistrations.map((r) => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedRegistrations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'registered':
        return <Badge variant="info">Registered</Badge>;
      case 'waitlist':
        return <Badge variant="warning">Waitlist</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      case 'attended':
        return <Badge variant="success">Attended</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Calendar', href: '/admin/calendar' },
          { label: event.title, href: `/admin/calendar/${eventId}` },
          { label: 'Registrations' },
        ]}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Registrations</h1>
            <p className="text-gray-500 mt-1">{event.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email All
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Registration
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Registrations" value={stats.total} icon={Users} />
        <StatCard title="Confirmed" value={stats.confirmed} icon={CheckCircle} />
        <StatCard title="Pending" value={stats.registered} icon={Clock} />
        <StatCard title="Waitlist" value={stats.waitlist} icon={Clock} />
        <StatCard title="Total Guests" value={stats.totalGuests} icon={Users} />
      </div>

      {/* Filters and Search */}
      <div className="rounded-xl border bg-white">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RegistrationStatus | 'all')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="registered">Registered</option>
              <option value="waitlist">Waitlist</option>
              <option value="cancelled">Cancelled</option>
              <option value="attended">Attended</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRegistrations.length > 0 && (
          <div className="flex items-center gap-4 bg-primary-50 px-4 py-3 border-b">
            <span className="text-sm font-medium text-primary-700">
              {selectedRegistrations.length} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <CheckCircle className="mr-1 h-4 w-4" />
                Confirm
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-1 h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" size="sm">
                <XCircle className="mr-1 h-4 w-4" />
                Cancel
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
                      filteredRegistrations.length > 0 &&
                      selectedRegistrations.length === filteredRegistrations.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Party Size</th>
                <th className="px-4 py-3 font-medium">Registered</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="text-sm hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRegistrations.includes(reg.id)}
                      onChange={() => toggleSelect(reg.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-600">
                        {reg.first_name[0]}
                        {reg.last_name[0]}
                      </div>
                      <span className="font-medium text-gray-900">
                        {reg.first_name} {reg.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900">{reg.email}</p>
                    {reg.phone && <p className="text-gray-500">{reg.phone}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{reg.party_size}</span>
                    <span className="text-gray-500 ml-1">
                      {reg.party_size === 1 ? 'person' : 'people'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(reg.created_at)}</td>
                  <td className="px-4 py-3">{getStatusBadge(reg.status)}</td>
                  <td className="px-4 py-3">
                    {reg.notes ? (
                      <span className="text-gray-600 max-w-[200px] truncate block" title={reg.notes}>
                        {reg.notes}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRegistrations.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No registrations found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter.'
                  : 'No one has registered for this event yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination placeholder */}
        {filteredRegistrations.length > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-gray-500">
              Showing {filteredRegistrations.length} of {registrations.length} registrations
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
