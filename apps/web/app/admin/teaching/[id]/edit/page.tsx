'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import { Breadcrumbs, formatDate } from '@acts29/admin-ui';
import {
  ArrowLeft,
  Save,
  Eye,
  BookOpen,
  Video,
  Headphones,
  Heart,
  FileText,
} from 'lucide-react';
import { mockContent, type ContentType } from '@acts29/database';

const contentTypes: { value: ContentType; label: string; icon: React.ReactNode }[] = [
  { value: 'sermon', label: 'Sermon', icon: <Headphones className="h-4 w-4" /> },
  { value: 'devotional', label: 'Devotional', icon: <BookOpen className="h-4 w-4" /> },
  { value: 'testimony', label: 'Testimony', icon: <Heart className="h-4 w-4" /> },
  { value: 'article', label: 'Article', icon: <FileText className="h-4 w-4" /> },
  { value: 'video', label: 'Video', icon: <Video className="h-4 w-4" /> },
  { value: 'audio', label: 'Audio', icon: <Headphones className="h-4 w-4" /> },
];

export default function EditTeachingPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;

  const existingContent = mockContent.find((c) => c.id === contentId);

  const [formData, setFormData] = React.useState({
    title: existingContent?.title ?? '',
    type: existingContent?.type ?? 'sermon',
    description: existingContent?.description ?? '',
    body: existingContent?.body ?? '',
    media_url: existingContent?.media_url ?? '',
    thumbnail_url: existingContent?.thumbnail_url ?? '',
    is_published: existingContent?.is_published ?? false,
    published_at: existingContent?.published_at?.split('T')[0] ?? '',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  if (!existingContent) {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // In a real app, this would call the update API
      console.log('Updating content:', { id: contentId, ...formData });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push(`/admin/teaching/${contentId}`);
    } catch (error) {
      console.error('Error updating content:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    const publishDate = new Date().toISOString().split('T')[0] ?? '';
    setFormData((prev) => ({
      ...prev,
      is_published: true,
      published_at: prev.published_at !== '' ? prev.published_at : publishDate,
    }));
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Teaching', href: '/admin/teaching' },
          { label: existingContent.title, href: `/admin/teaching/${contentId}` },
          { label: 'Edit' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
            <p className="text-sm text-gray-500">
              Last updated {formatDate(existingContent.updated_at)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/teaching/${contentId}`}>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter content title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none ${
                      errors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {contentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-500">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    placeholder="Brief description of the content"
                  />
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Content Body</h3>
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Text Content
                </label>
                <textarea
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  rows={12}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-mono focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  placeholder="Enter the full content text here..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  For devotionals, testimonies, and articles. Leave empty for audio/video content.
                </p>
              </div>
            </div>

            {/* Media */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Media</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="media_url" className="block text-sm font-medium text-gray-700 mb-1">
                    Media URL
                  </label>
                  <input
                    type="url"
                    id="media_url"
                    name="media_url"
                    value={formData.media_url}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    placeholder="https://example.com/video.mp4"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    URL to the video or audio file
                  </p>
                </div>

                <div>
                  <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    id="thumbnail_url"
                    name="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Optional thumbnail image for the content
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Publishing</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                      Published
                    </label>
                    <p className="text-xs text-gray-500">Make this content visible on the public site</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      id="is_published"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
                  </label>
                </div>

                <div>
                  <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    id="published_at"
                    name="published_at"
                    value={formData.published_at}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  />
                </div>

                {!formData.is_published && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handlePublish}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Publish Now
                  </Button>
                )}
              </div>
            </div>

            {/* Save Actions */}
            <div className="rounded-xl border bg-gray-50 p-6">
              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
