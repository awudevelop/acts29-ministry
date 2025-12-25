'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  Badge,
  ConfirmDialog,
} from '@acts29/admin-ui';
import {
  Edit,
  Trash2,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Home,
  Utensils,
  Stethoscope,
  Shirt,
  Briefcase,
  Heart,
  Church,
  MoreHorizontal,
  ExternalLink,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { mockResources, mockOrganizations, type ResourceType } from '@acts29/database';

const resourceTypeConfig: Record<
  ResourceType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  shelter: {
    label: 'Shelter',
    icon: <Home className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-700',
  },
  food_bank: {
    label: 'Food Bank',
    icon: <Utensils className="h-5 w-5" />,
    color: 'bg-green-100 text-green-700',
  },
  clinic: {
    label: 'Health Clinic',
    icon: <Stethoscope className="h-5 w-5" />,
    color: 'bg-red-100 text-red-700',
  },
  clothing: {
    label: 'Clothing',
    icon: <Shirt className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-700',
  },
  employment: {
    label: 'Employment',
    icon: <Briefcase className="h-5 w-5" />,
    color: 'bg-amber-100 text-amber-700',
  },
  counseling: {
    label: 'Counseling',
    icon: <Heart className="h-5 w-5" />,
    color: 'bg-pink-100 text-pink-700',
  },
  church: {
    label: 'Church',
    icon: <Church className="h-5 w-5" />,
    color: 'bg-indigo-100 text-indigo-700',
  },
  other: {
    label: 'Other',
    icon: <MoreHorizontal className="h-5 w-5" />,
    color: 'bg-gray-100 text-gray-700',
  },
};

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const resource = mockResources.find((r) => r.id === params.id);
  const organization = resource?.organization_id
    ? mockOrganizations.find((o) => o.id === resource.organization_id)
    : null;

  if (!resource) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Resources', href: '/admin/resources' },
            { label: 'Not Found' },
          ]}
        />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Resource Not Found</h1>
          <p className="mt-2 text-gray-600">The resource you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/resources">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const typeConfig = resourceTypeConfig[resource.type];
  const hours = resource.hours as Record<string, string> | null;

  const handleDelete = async () => {
    // In a real app, this would call the delete API
    console.log('Deleting resource:', resource.id);
    setDeleteDialogOpen(false);
    router.push('/admin/resources');
  };

  const handleToggleActive = async () => {
    // In a real app, this would call the API to toggle active status
    console.log('Toggling active status for:', resource.id);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Resources', href: '/admin/resources' },
          { label: resource.name },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl ${typeConfig.color}`}
          >
            {typeConfig.icon}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{resource.name}</h1>
              {resource.is_active ? (
                <Badge variant="success">Active</Badge>
              ) : (
                <Badge variant="default">Inactive</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600">{typeConfig.label}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {resource.is_active && (
            <Link href={`/resources/${resource.id}`} target="_blank">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Public Page
              </Button>
            </Link>
          )}
          <Button variant="outline" onClick={handleToggleActive}>
            {resource.is_active ? (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </Button>
          <Link href={`/admin/resources/${resource.id}/edit`}>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {resource.description || 'No description provided.'}
            </p>
          </div>

          {/* Hours */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hours of Operation</h2>
            {hours ? (
              <div className="grid gap-2">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <span className="font-medium text-gray-700 capitalize">{day}</span>
                    <span className="text-gray-600">{hours[day] || 'Closed'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Hours not specified.</p>
            )}
          </div>

          {/* Location */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-900">{resource.address}</p>
                {resource.latitude && resource.longitude && (
                  <p className="text-sm text-gray-500 mt-1">
                    Coordinates: {resource.latitude.toFixed(4)}, {resource.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
            {/* Map placeholder */}
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Map would display here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              {resource.phone && (
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a
                      href={`tel:${resource.phone}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {resource.phone}
                    </a>
                  </div>
                </div>
              )}
              {resource.email && (
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href={`mailto:${resource.email}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {resource.email}
                    </a>
                  </div>
                </div>
              )}
              {resource.website && (
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <Globe className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {resource.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
              {!resource.phone && !resource.email && !resource.website && (
                <p className="text-gray-500 text-sm">No contact information available.</p>
              )}
            </div>
          </div>

          {/* Capacity */}
          {resource.capacity && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacity</h2>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-100 p-2">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {resource.current_availability ?? 0} / {resource.capacity}
                  </p>
                  <p className="text-sm text-gray-500">Available spots</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full"
                    style={{
                      width: `${
                        ((resource.capacity - (resource.current_availability ?? 0)) /
                          resource.capacity) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(
                    ((resource.capacity - (resource.current_availability ?? 0)) /
                      resource.capacity) *
                      100
                  )}
                  % occupied
                </p>
              </div>
            </div>
          )}

          {/* Organization */}
          {organization && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
              <div>
                <p className="font-medium text-gray-900">{organization.name}</p>
                <p className="text-sm text-gray-500 mt-1">{organization.type}</p>
                {organization.phone && (
                  <p className="text-sm text-gray-500 mt-1">{organization.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Resource ID</dt>
                <dd className="font-mono text-gray-600">{resource.id.slice(0, 8)}...</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Type</dt>
                <dd className="text-gray-900">{typeConfig.label}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd>{resource.is_active ? 'Active' : 'Inactive'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900">
                  {new Date(resource.created_at).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="text-gray-900">
                  {new Date(resource.updated_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Resource"
        description={`Are you sure you want to delete "${resource.name}"? This action cannot be undone and will remove this resource from the public directory.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
