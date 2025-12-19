'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  BookOpen,
  Heart,
  FileText,
  Video,
  Headphones,
  Filter,
  Clock,
} from 'lucide-react';
import { mockContent, type Content } from '@acts29/database';

const contentTypeConfig: Record<
  string,
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

export default function TeachingPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const publishedContent = mockContent.filter((c) => c.is_published);
  const filteredContent = selectedType
    ? publishedContent.filter((c) => c.type === selectedType)
    : publishedContent;

  const featuredContent = publishedContent[0];
  const contentTypes = Object.keys(contentTypeConfig);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-800 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Gospel Teaching</h1>
          <p className="mt-2 text-primary-200">
            Sermons, devotionals, testimonies, and resources to grow in faith.
          </p>
        </div>
      </section>

      {/* Featured Content */}
      {featuredContent && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary-600">
              Featured
            </h2>
            <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-700 to-primary-900 shadow-xl">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${contentTypeConfig[featuredContent.type]?.color}`}
                  >
                    {contentTypeConfig[featuredContent.type]?.icon}
                    {contentTypeConfig[featuredContent.type]?.label}
                  </span>
                  <h3 className="mt-4 text-2xl font-bold text-white lg:text-3xl">
                    {featuredContent.title}
                  </h3>
                  <p className="mt-4 text-primary-200">{featuredContent.description}</p>
                  <Link
                    href={`/teaching/${featuredContent.id}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 transition hover:bg-primary-50"
                  >
                    {featuredContent.type === 'video' || featuredContent.type === 'audio' ? (
                      <>
                        <Play className="h-5 w-5" />
                        Watch Now
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-5 w-5" />
                        Read Now
                      </>
                    )}
                  </Link>
                </div>
                <div className="hidden lg:flex items-center justify-center bg-primary-900/50 p-12">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10">
                    {contentTypeConfig[featuredContent.type]?.icon && (
                      <div className="text-white scale-[3]">
                        {contentTypeConfig[featuredContent.type]?.icon}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Library */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType(null)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedType === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Filter className="h-4 w-4" />
              All Content
            </button>
            {contentTypes.map((type) => {
              const config = contentTypeConfig[type];
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

          {/* Results */}
          <p className="mb-4 text-sm text-gray-600">
            {filteredContent.length} item{filteredContent.length !== 1 ? 's' : ''}
          </p>

          {/* Content Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredContent.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className="rounded-xl bg-white py-12 text-center shadow-md">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No content found</h3>
              <p className="mt-2 text-gray-600">
                Try selecting a different category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Scripture CTA */}
      <section className="bg-primary-900 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <blockquote className="text-xl italic text-primary-100 lg:text-2xl">
            &ldquo;All Scripture is God-breathed and is useful for teaching, rebuking, correcting
            and training in righteousness, so that the servant of God may be thoroughly equipped
            for every good work.&rdquo;
          </blockquote>
          <cite className="mt-4 block text-lg font-semibold text-white">
            — 2 Timothy 3:16-17
          </cite>
        </div>
      </section>
    </div>
  );
}

function ContentCard({ content }: { content: Content }) {
  const typeConfig = contentTypeConfig[content.type] ?? contentTypeConfig.article!;
  const publishedDate = content.published_at
    ? new Date(content.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <Link
      href={`/teaching/${content.id}`}
      className="group flex flex-col rounded-xl bg-white shadow-md transition hover:shadow-lg"
    >
      {/* Thumbnail placeholder */}
      <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-primary-600 shadow-md transition group-hover:scale-110">
          {content.type === 'video' || content.type === 'audio' ? (
            <Play className="h-8 w-8" />
          ) : (
            typeConfig.icon
          )}
        </div>
        <span
          className={`absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${typeConfig.color}`}
        >
          {typeConfig.icon}
          {typeConfig.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
          {content.title}
        </h3>
        {content.description && (
          <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-2">
            {content.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
          {publishedDate && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {publishedDate}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
