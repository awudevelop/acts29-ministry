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
  BookOpen,
  Video,
  Headphones,
  Heart,
  FileText,
  Filter,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';
import { mockContent, type ContentType } from '@acts29/database';

const contentTypeConfig: Record<
  ContentType,
  { label: string; icon: React.ReactNode; color: string; badgeVariant: 'info' | 'success' | 'warning' | 'danger' | 'default' }
> = {
  sermon: {
    label: 'Sermon',
    icon: <Headphones className="h-4 w-4" />,
    color: 'bg-purple-100 text-purple-700',
    badgeVariant: 'info',
  },
  devotional: {
    label: 'Devotional',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'bg-blue-100 text-blue-700',
    badgeVariant: 'info',
  },
  testimony: {
    label: 'Testimony',
    icon: <Heart className="h-4 w-4" />,
    color: 'bg-red-100 text-red-700',
    badgeVariant: 'warning',
  },
  article: {
    label: 'Article',
    icon: <FileText className="h-4 w-4" />,
    color: 'bg-green-100 text-green-700',
    badgeVariant: 'success',
  },
  video: {
    label: 'Video',
    icon: <Video className="h-4 w-4" />,
    color: 'bg-amber-100 text-amber-700',
    badgeVariant: 'warning',
  },
  audio: {
    label: 'Audio',
    icon: <Headphones className="h-4 w-4" />,
    color: 'bg-indigo-100 text-indigo-700',
    badgeVariant: 'default',
  },
};

export default function TeachingAdminPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<ContentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'published' | 'draft'>('all');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [showActionsMenu, setShowActionsMenu] = React.useState<string | null>(null);

  // Filter content
  const filteredContent = React.useMemo(() => {
    let result = [...mockContent];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query)
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter((c) => c.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter((c) =>
        statusFilter === 'published' ? c.is_published : !c.is_published
      );
    }

    // Sort by created_at descending
    return result.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [searchQuery, typeFilter, statusFilter]);

  // Calculate stats
  const stats = {
    total: mockContent.length,
    published: mockContent.filter((c) => c.is_published).length,
    drafts: mockContent.filter((c) => !c.is_published).length,
    sermons: mockContent.filter((c) => c.type === 'sermon').length,
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    // In a real app, this would call the delete API
    console.log('Deleting content:', id);
    setShowActionsMenu(null);
  };

  const handleBulkPublish = () => {
    console.log('Publishing:', selectedItems);
    setSelectedItems([]);
  };

  const handleBulkUnpublish = () => {
    console.log('Unpublishing:', selectedItems);
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    console.log('Deleting:', selectedItems);
    setSelectedItems([]);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Teaching' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teaching Content</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage sermons, devotionals, testimonies, and other teaching content
          </p>
        </div>
        <Link href="/admin/teaching/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Content" value={stats.total} icon={BookOpen} />
        <StatCard title="Published" value={stats.published} icon={Eye} />
        <StatCard title="Drafts" value={stats.drafts} icon={Edit} />
        <StatCard title="Sermons" value={stats.sermons} icon={Headphones} />
      </div>

      {/* Filters and Search */}
      <div className="rounded-xl border bg-white">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ContentType | 'all')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            >
              <option value="all">All Types</option>
              <option value="sermon">Sermons</option>
              <option value="devotional">Devotionals</option>
              <option value="testimony">Testimonies</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
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
              <Button variant="outline" size="sm" onClick={handleBulkPublish}>
                <Eye className="mr-1 h-4 w-4" />
                Publish
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkUnpublish}>
                <Edit className="mr-1 h-4 w-4" />
                Unpublish
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
                      filteredContent.length > 0 &&
                      selectedItems.length === filteredContent.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredContent.map((content) => {
                const typeConfig = contentTypeConfig[content.type];
                return (
                  <tr
                    key={content.id}
                    className="text-sm hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/teaching/${content.id}`)}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(content.id)}
                        onChange={() => toggleSelect(content.id)}
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
                          <p className="font-medium text-gray-900">{content.title}</p>
                          {content.description && (
                            <p className="text-gray-500 text-xs max-w-md truncate">
                              {content.description}
                            </p>
                          )}
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
                      {content.is_published ? (
                        <Badge variant="success">Published</Badge>
                      ) : (
                        <Badge variant="default">Draft</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {content.published_at ? formatDate(content.published_at) : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(content.created_at)}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActionsMenu(
                              showActionsMenu === content.id ? null : content.id
                            )
                          }
                          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showActionsMenu === content.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setShowActionsMenu(null)}
                            />
                            <div className="absolute right-0 z-50 mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
                              <Link
                                href={`/admin/teaching/${content.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                              <Link
                                href={`/admin/teaching/${content.id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                              {content.is_published && (
                                <Link
                                  href={`/teaching/${content.id}`}
                                  target="_blank"
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  View Public Page
                                </Link>
                              )}
                              <hr className="my-1" />
                              <button
                                onClick={() => handleDelete(content.id)}
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

          {filteredContent.length === 0 && (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No content found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by adding your first piece of teaching content.'}
              </p>
              {!searchQuery && typeFilter === 'all' && statusFilter === 'all' && (
                <Link href="/admin/teaching/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Content
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        {filteredContent.length > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-gray-500">
              Showing {filteredContent.length} of {mockContent.length} items
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
