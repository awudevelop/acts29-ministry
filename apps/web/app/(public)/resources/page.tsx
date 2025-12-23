'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Home,
  Utensils,
  Stethoscope,
  Shirt,
  Briefcase,
  Heart,
  Church,
  MoreHorizontal,
  Filter,
} from 'lucide-react';
import { mockResources, type Resource } from '@acts29/database';

const resourceTypeConfig: Record<
  string,
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

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      searchQuery === '' ||
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === null || resource.type === selectedType;

    return matchesSearch && matchesType && resource.is_active;
  });

  const resourceTypes = Object.keys(resourceTypeConfig);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-700 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Resource Directory</h1>
          <p className="mt-2 text-primary-100">
            Find shelters, food banks, health services, and more in your area.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType(null)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedType === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Filter className="h-4 w-4" />
              All Types
            </button>
            {resourceTypes.map((type) => {
              const config = resourceTypeConfig[type];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type === selectedType ? null : type)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {config?.icon}
                  {config?.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <p className="mb-4 text-sm text-gray-600">
          Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
        </p>

        {/* Resource Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="py-12 text-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No resources found</h3>
            <p className="mt-2 text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType(null);
              }}
              className="mt-4 text-primary-600 hover:text-primary-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const typeConfig = resourceTypeConfig[resource.type] ?? resourceTypeConfig.other!;
  const hours = resource.hours as Record<string, string> | null;

  // Get today's hours
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayHours = hours?.[today] || 'Hours not available';

  return (
    <div className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeConfig.color}`}
          >
            {typeConfig.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{resource.name}</h3>
            <span className={`text-xs font-medium ${typeConfig.color} rounded-full px-2 py-0.5`}>
              {typeConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {resource.description && (
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">{resource.description}</p>
      )}

      {/* Details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
          <span>{resource.address}</span>
        </div>

        {resource.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <a href={`tel:${resource.phone}`} className="hover:text-primary-600">
              {resource.phone}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
          <span>Today: {todayHours}</span>
        </div>

        {/* Availability */}
        {resource.capacity && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-sm text-gray-600">Availability</span>
            <span className="text-sm font-medium text-gray-900">
              {resource.current_availability ?? 0} / {resource.capacity} spots
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Link
          href={`/resources/${resource.id}`}
          className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-primary-700"
        >
          View Details
        </Link>
        {resource.website && (
          <a
            href={resource.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-gray-700 transition hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}
