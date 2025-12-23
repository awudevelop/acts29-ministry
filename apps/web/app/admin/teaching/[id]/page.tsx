'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import { Breadcrumbs, Badge, formatDate } from '@acts29/admin-ui';
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  BookOpen,
  Video,
  Headphones,
  Heart,
  FileText,
  Calendar,
  User,
  Globe,
  Clock,
  Play,
} from 'lucide-react';
import { mockContent, mockProfiles, type ContentType } from '@acts29/database';

const contentTypeConfig: Record<
  ContentType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  sermon: {
    label: 'Sermon',
    icon: <Headphones className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-700',
  },
  devotional: {
    label: 'Devotional',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-700',
  },
  testimony: {
    label: 'Testimony',
    icon: <Heart className="h-5 w-5" />,
    color: 'bg-red-100 text-red-700',
  },
  article: {
    label: 'Article',
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-green-100 text-green-700',
  },
  video: {
    label: 'Video',
    icon: <Video className="h-5 w-5" />,
    color: 'bg-amber-100 text-amber-700',
  },
  audio: {
    label: 'Audio',
    icon: <Headphones className="h-5 w-5" />,
    color: 'bg-indigo-100 text-indigo-700',
  },
};

export default function TeachingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;

  const content = mockContent.find((c) => c.id === contentId);
  const author = content ? mockProfiles.find((p) => p.id === content.author_id) : null;

  if (!content) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Teaching', href: '/admin/teaching' },
            { label: 'Not Found' },
          ]}
        />
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Content not found</h2>
          <p className="text-gray-500 mt-2">
            The content you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/admin/teaching">
            <Button className="mt-4">Back to Teaching</Button>
          </Link>
        </div>
      </div>
    );
  }

  const typeConfig = contentTypeConfig[content.type];

  const handleDelete = () => {
    // In a real app, this would call the delete API
    if (confirm('Are you sure you want to delete this content?')) {
      console.log('Deleting content:', content.id);
      router.push('/admin/teaching');
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Teaching', href: '/admin/teaching' },
          { label: content.title },
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
              {content.is_published ? (
                <Badge variant="success">Published</Badge>
              ) : (
                <Badge variant="default">Draft</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${typeConfig.color}`}
              >
                {typeConfig.icon}
                {typeConfig.label}
              </span>
              {content.published_at && (
                <span className="text-sm text-gray-500">
                  Published {formatDate(content.published_at)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {content.is_published && (
            <Link href={`/teaching/${content.id}`} target="_blank">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Public
              </Button>
            </Link>
          )}
          <Link href={`/admin/teaching/${content.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Media Preview */}
          {content.media_url && (
            <div className="rounded-xl border bg-white overflow-hidden">
              <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 h-64">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-md">
                    <Play className="h-8 w-8 text-primary-600" />
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    {content.type === 'video' ? 'Video' : 'Audio'} Content
                  </p>
                  <p className="mt-1 text-xs text-gray-500 max-w-xs truncate">
                    {content.media_url}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {content.description && (
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600">{content.description}</p>
            </div>
          )}

          {/* Body Content */}
          {content.body && (
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Content</h3>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                {content.body}
              </div>
            </div>
          )}

          {/* No content message */}
          {!content.body && !content.media_url && (
            <div className="rounded-xl border bg-white p-6">
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No content yet</h3>
                <p className="mt-2 text-gray-500">
                  Add body text or media to this content.
                </p>
                <Link href={`/admin/teaching/${content.id}/edit`}>
                  <Button className="mt-4">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Content
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Author</p>
                  <p className="font-medium">
                    {author ? `${author.first_name} ${author.last_name}` : 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  {typeConfig.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{typeConfig.label}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <Globe className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {content.is_published ? 'Published' : 'Draft'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Published Date</p>
                  <p className="font-medium">
                    {content.published_at ? formatDate(content.published_at) : 'Not published'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(content.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href={`/admin/teaching/${content.id}/edit`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Content
                </Button>
              </Link>
              {content.is_published ? (
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="mr-2 h-4 w-4" />
                  Unpublish
                </Button>
              ) : (
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="mr-2 h-4 w-4" />
                  Publish Now
                </Button>
              )}
              {content.is_published && (
                <Link href={`/teaching/${content.id}`} target="_blank" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Public Page
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
