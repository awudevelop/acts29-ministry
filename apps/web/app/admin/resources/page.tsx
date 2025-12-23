'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  StatCard,
  Badge,
} from '@acts29/admin-ui';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Home,
  Utensils,
  Stethoscope,
  Shirt,
  Briefcase,
  Heart,
  Church,
  MoreHorizontal,
  Filter,
  MoreVertical,
  ExternalLink,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { mockResources, type ResourceType } from '@acts29/database';

const resourceTypeConfig: Record<
  ResourceType,
  { label: string; icon: React.ReactNode; color: string; badgeVariant: 'info' | 'success' | 'warning' | 'danger' | 'default' }
> = {
  shelter: {
    label: 'Shelter',
    icon: <Home className="h-4 w-4" />,
    color: 'bg-blue-100 text-blue-700',
    badgeVariant: 'info',
  },
  food_bank: {
    label: 'Food Bank',
    icon: <Utensils className="h-4 w-4" />,
    color: 'bg-green-100 text-green-700',
    badgeVariant: 'success',
  },
  clinic: {
    label: 'Health Clinic',
    icon: <Stethoscope className="h-4 w-4" />,
    color: 'bg-red-100 text-red-700',
    badgeVariant: 'danger',
  },
  clothing: {
    label: 'Clothing',
    icon: <Shirt className="h-4 w-4" />,
    color: 'bg-purple-100 text-purple-700',
    badgeVariant: 'warning',
  },
  employment: {
    label: 'Employment',
    icon: <Briefcase className="h-4 w-4" />,
    color: 'bg-amber-100 text-amber-700',
    badgeVariant: 'warning',
  },
  counseling: {
    label: 'Counseling',
    icon: <Heart className="h-4 w-4" />,
    color: 'bg-pink-100 text-pink-700',
    badgeVariant: 'warning',
  },
  church: {
    label: 'Church',
    icon: <Church className="h-4 w-4" />,
    color: 'bg-indigo-100 text-indigo-700',
    badgeVariant: 'info',
  },
  other: {
    label: 'Other',
    icon: <MoreHorizontal className="h-4 w-4" />,
    color: 'bg-gray-100 text-gray-700',
    badgeVariant: 'default',
  },
};

export default function ResourcesAdminPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<ResourceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'inactive'>('all');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [showActionsMenu, setShowActionsMenu] = React.useState<string | null>(null);

  // Filter resources
  const filteredResources = React.useMemo(() => {
    let result = [...mockResources];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.address.toLowerCase().includes(query)
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter((r) => r.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter((r) =>
        statusFilter === 'active' ? r.is_active : !r.is_active
      );
    }

    // Sort by name
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, typeFilter, statusFilter]);

  // Calculate stats
  const stats = {
    total: mockResources.length,
    active: mockResources.filter((r) => r.is_active).length,
    shelters: mockResources.filter((r) => r.type === 'shelter').length,
    foodBanks: mockResources.filter((r) => r.type === 'food_bank').length,
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredResources.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredResources.map((r) => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    // In a real app, this would call the delete API
    console.log('Deleting resource:', id);
    setShowActionsMenu(null);
  };

  const handleBulkActivate = () => {
    console.log('Activating:', selectedItems);
    setSelectedItems([]);
  };

  const handleBulkDeactivate = () => {
    console.log('Deactivating:', selectedItems);
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    console.log('Deleting:', selectedItems);
    setSelectedItems([]);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Resources' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Resources</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage shelters, food banks, clinics, and other community resources
          </p>
        </div>
        <Link href="/admin/resources/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Resources" value={stats.total} icon={MapPin} />
        <StatCard title="Active" value={stats.active} icon={CheckCircle} />
        <StatCard title="Shelters" value={stats.shelters} icon={Home} />
        <StatCard title="Food Banks" value={stats.foodBanks} icon={Utensils} />
      </div>

      {/* Filters and Search */}
      <div className="rounded-xl border bg-white">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ResourceType | 'all')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            >
              <option value="all">All Types</option>
              <option value="shelter">Shelters</option>
              <option value="food_bank">Food Banks</option>
              <option value="clinic">Health Clinics</option>
              <option value="clothing">Clothing</option>
              <option value="employment">Employment</option>
              <option value="counseling">Counseling</option>
              <option value="church">Churches</option>
              <option value="other">Other</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              <Button variant="outline" size="sm" onClick={handleBulkActivate}>
                <CheckCircle className="mr-1 h-4 w-4" />
                Activate
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkDeactivate}>
                <XCircle className="mr-1 h-4 w-4" />
                Deactivate
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
                      filteredResources.length > 0 &&
                      selectedItems.length === filteredResources.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Resource</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Capacity</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredResources.map((resource) => {
                const typeConfig = resourceTypeConfig[resource.type];
                return (
                  <tr
                    key={resource.id}
                    className="text-sm hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/resources/${resource.id}`)}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(resource.id)}
                        onChange={() => toggleSelect(resource.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeConfig.color}`}
                        >
                          {typeConfig.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{resource.name}</p>
                          <p className="text-gray-500 text-xs max-w-xs truncate">
                            {resource.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${typeConfig.color}`}
                      >
                        {typeConfig.icon}
                        {typeConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {resource.is_active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="default">Inactive</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {resource.phone && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{resource.phone}</span>
                          </div>
                        )}
                        {resource.website && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Globe className="h-3 w-3" />
                            <span className="text-xs truncate max-w-[120px]">
                              {resource.website.replace(/^https?:\/\//, '')}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {resource.capacity ? (
                        <span>
                          {resource.current_availability ?? 0} / {resource.capacity}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActionsMenu(
                              showActionsMenu === resource.id ? null : resource.id
                            )
                          }
                          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showActionsMenu === resource.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setShowActionsMenu(null)}
                            />
                            <div className="absolute right-0 z-50 mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
                              <Link
                                href={`/admin/resources/${resource.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                              <Link
                                href={`/admin/resources/${resource.id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                              {resource.is_active && (
                                <Link
                                  href={`/resources/${resource.id}`}
                                  target="_blank"
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  View Public Page
                                </Link>
                              )}
                              <hr className="my-1" />
                              <button
                                onClick={() => handleDelete(resource.id)}
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

          {filteredResources.length === 0 && (
            <div className="py-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No resources found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by adding your first community resource.'}
              </p>
              {!searchQuery && typeFilter === 'all' && statusFilter === 'all' && (
                <Link href="/admin/resources/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Resource
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        {filteredResources.length > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-gray-500">
              Showing {filteredResources.length} of {mockResources.length} resources
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
