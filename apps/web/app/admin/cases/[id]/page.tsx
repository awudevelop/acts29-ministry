'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  CaseStatusBadge,
  Badge,
  formatDate,
  formatCurrency,
  getInitials,
} from '@acts29/admin-ui';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Edit,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Home,
  Utensils,
  Heart,
  Briefcase,
} from 'lucide-react';
import { mockCases, mockProfiles, mockDonations } from '@acts29/database';

// Need icons for different need types
const needIcons: Record<string, React.ElementType> = {
  housing: Home,
  food: Utensils,
  medical: Heart,
  employment: Briefcase,
  clothing: Package,
  default: AlertCircle,
};

// Mock case notes
const mockNotes = [
  {
    id: '1',
    content: 'Initial intake completed. Client is seeking assistance with housing and food security.',
    created_at: '2024-12-01T10:00:00Z',
    author: 'Robert Gillespie',
    type: 'intake',
  },
  {
    id: '2',
    content: 'Referred to Springfield Housing Authority for emergency housing assistance.',
    created_at: '2024-12-05T14:30:00Z',
    author: 'Sarah Johnson',
    type: 'referral',
  },
  {
    id: '3',
    content: 'Client received food assistance - 2 weeks of groceries provided.',
    created_at: '2024-12-10T09:15:00Z',
    author: 'Robert Gillespie',
    type: 'service',
  },
  {
    id: '4',
    content: 'Follow-up call completed. Client reports stable housing situation.',
    created_at: '2024-12-15T16:45:00Z',
    author: 'Sarah Johnson',
    type: 'follow-up',
  },
];

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const caseData = mockCases.find((c) => c.id === caseId);
  const assignee = caseData?.assigned_to
    ? mockProfiles.find((p) => p.id === caseData.assigned_to)
    : null;

  // Get related donations (for demo, just use some mock data)
  const relatedDonations = mockDonations.slice(0, 3);

  if (!caseData) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Cases', href: '/admin/cases' },
            { label: 'Not Found' },
          ]}
        />
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Case not found</h2>
          <p className="text-gray-500 mt-2">The case you're looking for doesn't exist.</p>
          <Link href="/admin/cases">
            <Button className="mt-4">Back to Cases</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Cases', href: '/admin/cases' },
          { label: `${caseData.first_name} ${caseData.last_name}` },
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
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-600">
            {caseData.first_name[0]}{caseData.last_name[0]}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {caseData.first_name} {caseData.last_name}
              </h1>
              <CaseStatusBadge status={caseData.status} />
            </div>
            <p className="text-gray-500 mt-1">
              Case opened {formatDate(caseData.created_at)} • Last updated {formatDate(caseData.updated_at)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/cases/${caseId}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Case
            </Button>
          </Link>
          <Link href={`/admin/cases/${caseId}/notes`}>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Needs Assessment */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Needs Assessment</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {caseData.needs.map((need) => {
                const Icon = needIcons[need] ?? needIcons.default!;
                return (
                  <div
                    key={need}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="rounded-lg bg-primary-100 p-2">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {need.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-500">In progress</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Case Notes / Timeline */}
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Case Notes</h3>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </div>
            <div className="space-y-4">
              {mockNotes.map((note, index) => (
                <div key={note.id} className="relative pl-6">
                  {/* Timeline line */}
                  {index < mockNotes.length - 1 && (
                    <div className="absolute left-[9px] top-6 h-full w-0.5 bg-gray-200" />
                  )}
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-1 h-[18px] w-[18px] rounded-full border-2 ${
                    note.type === 'intake'
                      ? 'border-blue-500 bg-blue-50'
                      : note.type === 'referral'
                      ? 'border-yellow-500 bg-yellow-50'
                      : note.type === 'service'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-400 bg-gray-50'
                  }`} />
                  <div className="rounded-lg border p-4 ml-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-900">{note.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <span>{note.author}</span>
                          <span>•</span>
                          <span>{formatDate(note.created_at)}</span>
                        </div>
                      </div>
                      <Badge variant={
                        note.type === 'intake' ? 'info' :
                        note.type === 'referral' ? 'warning' :
                        note.type === 'service' ? 'success' :
                        'default'
                      }>
                        {note.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assistance Provided */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Assistance Provided</h3>
            <div className="space-y-3">
              {relatedDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${
                      donation.type === 'monetary'
                        ? 'bg-green-100'
                        : donation.type === 'goods'
                        ? 'bg-blue-100'
                        : 'bg-purple-100'
                    }`}>
                      {donation.type === 'monetary' ? (
                        <DollarSign className="h-5 w-5 text-green-600" />
                      ) : donation.type === 'goods' ? (
                        <Package className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{donation.type}</p>
                      <p className="text-sm text-gray-500">{formatDate(donation.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {donation.type === 'monetary' && (
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(donation.amount ?? 0)}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">{donation.description || 'No description'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Client Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{caseData.first_name} {caseData.last_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">Springfield, IL</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Assignment</h3>
            {assignee ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-medium text-primary-600">
                  {getInitials(assignee.first_name, assignee.last_name)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {assignee.first_name} {assignee.last_name}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{assignee.role.replace('_', ' ')}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">This case is unassigned</p>
                <Button variant="outline" size="sm">
                  Assign Staff Member
                </Button>
              </div>
            )}
          </div>

          {/* Status Actions */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="space-y-2">
              {['active', 'pending', 'referred', 'closed'].map((status) => (
                <button
                  key={status}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    caseData.status === status
                      ? 'border-primary-500 bg-primary-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{status}</span>
                    {caseData.status === status && (
                      <CheckCircle className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Generate Case Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Record Assistance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Follow-up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
