'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  BookOpen,
  Heart,
  FileText,
  Video,
  Headphones,
  Calendar,
} from 'lucide-react';
import { mockContent, mockProfiles, mockOrganizations, type ContentType } from '@acts29/database';
import { ShareButtons } from '@/components';

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
  const params = useParams();
  const contentId = params.id as string;

  const content = mockContent.find((c) => c.id === contentId && c.is_published);
  const author = content ? mockProfiles.find((p) => p.id === content.author_id) : null;
  const organization = content
    ? mockOrganizations.find((o) => o.id === content.organization_id)
    : null;

  // Get related content (same type, excluding current)
  const relatedContent = content
    ? mockContent
        .filter((c) => c.is_published && c.type === content.type && c.id !== content.id)
        .slice(0, 3)
    : [];

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center lg:px-8">
          <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Content Not Found</h1>
          <p className="mt-2 text-gray-600">
            The content you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/teaching"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Teaching
          </Link>
        </div>
      </div>
    );
  }

  const typeConfig = contentTypeConfig[content.type];
  const publishedDate = content.published_at
    ? new Date(content.published_at).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Link
            href="/teaching"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teaching
          </Link>

          <div className="mt-6">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${typeConfig.color}`}
            >
              {typeConfig.icon}
              {typeConfig.label}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-white lg:text-4xl">{content.title}</h1>

          {content.description && (
            <p className="mt-4 text-lg text-primary-200">{content.description}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-primary-300">
            {publishedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {publishedDate}
              </span>
            )}
            {author && (
              <span>
                By {author.first_name} {author.last_name}
              </span>
            )}
            {organization && <span>• {organization.name}</span>}
          </div>

          <div className="mt-6">
            <ShareButtons
              url={`/teaching/${content.id}`}
              title={content.title}
              description={content.description || undefined}
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          {/* Media Player */}
          {content.media_url && (
            <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl">
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <button className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105">
                    <Play className="h-10 w-10 text-primary-600 ml-1" />
                  </button>
                  <p className="mt-4 text-sm text-gray-400">
                    {content.type === 'video' ? 'Play Video' : 'Play Audio'}
                  </p>
                  <p className="mt-2 text-xs text-gray-500 max-w-sm mx-auto break-all">
                    {content.media_url}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Body Content */}
          {content.body && (
            <div className="rounded-2xl bg-white p-8 shadow-md lg:p-12">
              <div className="prose prose-lg max-w-none">
                {content.body.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* No content message */}
          {!content.body && !content.media_url && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-md">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Content coming soon
              </h3>
              <p className="mt-2 text-gray-600">
                Check back later for the full content.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Related Content */}
      {relatedContent.length > 0 && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900">
              More {typeConfig.label}s
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedContent.map((item) => {
                const itemTypeConfig = contentTypeConfig[item.type];
                return (
                  <Link
                    key={item.id}
                    href={`/teaching/${item.id}`}
                    className="group flex flex-col rounded-xl border bg-white p-6 transition hover:shadow-lg"
                  >
                    <span
                      className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${itemTypeConfig.color}`}
                    >
                      {itemTypeConfig.icon}
                      {itemTypeConfig.label}
                    </span>
                    <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-primary-600">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/teaching"
                className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700"
              >
                View All Teaching Content
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary-900 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h2 className="text-2xl font-bold text-white">
            Want to receive new teaching content?
          </h2>
          <p className="mt-2 text-primary-200">
            Join our community and stay updated with the latest sermons, devotionals, and testimonies.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 transition hover:bg-primary-50"
            >
              Get Involved
            </Link>
            <Link
              href="/prayer"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-400 px-6 py-3 font-semibold text-white transition hover:bg-primary-800"
            >
              Submit Prayer Request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
