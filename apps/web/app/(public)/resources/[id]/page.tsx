'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  Home,
  Utensils,
  Stethoscope,
  Shirt,
  Briefcase,
  Heart,
  Church,
  MoreHorizontal,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { mockResources, type Resource, type ResourceType } from '@acts29/database';
import { ShareButtons } from '@/components';

const resourceTypeConfig: Record<
  ResourceType,
  { label: string; icon: React.ReactNode; color: string; bgColor: string }
> = {
  shelter: {
    label: 'Shelter',
    icon: <Home className="h-6 w-6" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  food_bank: {
    label: 'Food Bank',
    icon: <Utensils className="h-6 w-6" />,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  clinic: {
    label: 'Health Clinic',
    icon: <Stethoscope className="h-6 w-6" />,
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
  clothing: {
    label: 'Clothing',
    icon: <Shirt className="h-6 w-6" />,
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
  employment: {
    label: 'Employment',
    icon: <Briefcase className="h-6 w-6" />,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  counseling: {
    label: 'Counseling',
    icon: <Heart className="h-6 w-6" />,
    color: 'text-pink-700',
    bgColor: 'bg-pink-100',
  },
  church: {
    label: 'Church',
    icon: <Church className="h-6 w-6" />,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
  },
  other: {
    label: 'Other',
    icon: <MoreHorizontal className="h-6 w-6" />,
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
};

const daysOfWeek = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

export default function ResourceDetailPage() {
  const params = useParams();
  const resource = mockResources.find((r) => r.id === params.id && r.is_active);

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <MapPin className="mx-auto h-16 w-16 text-gray-400" />
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Resource Not Found</h1>
          <p className="mt-2 text-gray-600">
            The resource you&apos;re looking for doesn&apos;t exist or is no longer available.
          </p>
          <Link
            href="/resources"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-white transition hover:bg-primary-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const typeConfig = resourceTypeConfig[resource.type];
  const hours = resource.hours as Record<string, string> | null;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayHours = hours?.[today] || 'Hours not available';

  // Get related resources (same type, different resource)
  const relatedResources = mockResources.filter(
    (r) => r.type === resource.type && r.id !== resource.id && r.is_active
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-700 py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resources
          </Link>
          <div className="flex items-start gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${typeConfig.bgColor} ${typeConfig.color}`}>
              {typeConfig.icon}
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${typeConfig.bgColor} ${typeConfig.color} mb-2`}>
                {typeConfig.label}
              </span>
              <h1 className="text-3xl font-bold text-white">{resource.name}</h1>
              <div className="mt-3">
                <ShareButtons
                  url={`/resources/${resource.id}`}
                  title={resource.name}
                  description={resource.description || undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {resource.description && (
              <div className="rounded-xl bg-white p-6 shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{resource.description}</p>
              </div>
            )}

            {/* Hours */}
            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Hours of Operation</h2>
              </div>

              {/* Today's hours highlight */}
              <div className="mb-4 p-4 rounded-lg bg-primary-50 border border-primary-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary-700">Today ({today.charAt(0).toUpperCase() + today.slice(1)})</span>
                  <span className="text-primary-900 font-semibold">{todayHours}</span>
                </div>
              </div>

              {hours ? (
                <div className="grid gap-2">
                  {daysOfWeek.map((day) => {
                    const isToday = day.key === today;
                    return (
                      <div
                        key={day.key}
                        className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                          isToday ? 'bg-gray-100' : ''
                        }`}
                      >
                        <span className={`font-medium ${isToday ? 'text-primary-700' : 'text-gray-700'}`}>
                          {day.label}
                        </span>
                        <span className={isToday ? 'text-primary-900 font-semibold' : 'text-gray-600'}>
                          {hours[day.key] || 'Closed'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">Hours not specified. Please contact for availability.</p>
              )}
            </div>

            {/* Location */}
            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Location</h2>
              </div>
              <p className="text-gray-900 mb-4">{resource.address}</p>

              {/* Map placeholder */}
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MapPin className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Map would display here</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resource.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-flex items-center gap-1"
                  >
                    Open in Google Maps
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="rounded-xl bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-4">
                {resource.phone && (
                  <a
                    href={`tel:${resource.phone}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{resource.phone}</p>
                    </div>
                  </a>
                )}
                {resource.email && (
                  <a
                    href={`mailto:${resource.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 break-all">{resource.email}</p>
                    </div>
                  </a>
                )}
                {resource.website && (
                  <a
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <p className="font-medium text-gray-900 break-all">
                        {resource.website.replace(/^https?:\/\//, '')}
                      </p>
                    </div>
                  </a>
                )}
                {!resource.phone && !resource.email && !resource.website && (
                  <p className="text-gray-500 text-sm">No contact information available.</p>
                )}
              </div>
            </div>

            {/* Capacity */}
            {resource.capacity && (
              <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
                </div>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-primary-600">
                    {resource.current_availability ?? 0}
                  </p>
                  <p className="text-gray-500">spots available</p>
                  <p className="text-sm text-gray-400 mt-1">
                    of {resource.capacity} total capacity
                  </p>
                </div>
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (resource.current_availability ?? 0) > 0
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${
                          ((resource.current_availability ?? 0) / resource.capacity) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="rounded-xl bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {resource.phone && (
                  <a
                    href={`tel:${resource.phone}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition hover:bg-primary-700"
                  >
                    <Phone className="h-5 w-5" />
                    Call Now
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(resource.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <MapPin className="h-5 w-5" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        {relatedResources.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Similar {typeConfig.label} Resources
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedResources.map((related) => (
                <RelatedResourceCard key={related.id} resource={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RelatedResourceCard({ resource }: { resource: Resource }) {
  const typeConfig = resourceTypeConfig[resource.type];
  const hours = resource.hours as Record<string, string> | null;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayHours = hours?.[today] || 'Hours not available';

  return (
    <Link
      href={`/resources/${resource.id}`}
      className="block rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeConfig.bgColor} ${typeConfig.color}`}>
          {typeConfig.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{resource.name}</h3>
          <p className="text-sm text-gray-500 truncate">{resource.address}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <Clock className="h-4 w-4" />
        <span>Today: {todayHours}</span>
      </div>
      {resource.capacity && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{resource.current_availability ?? 0} / {resource.capacity} available</span>
        </div>
      )}
    </Link>
  );
}
