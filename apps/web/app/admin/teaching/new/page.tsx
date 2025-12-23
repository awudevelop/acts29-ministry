'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import { Breadcrumbs } from '@acts29/admin-ui';
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
import { type ContentType } from '@acts29/database';

const contentTypes: { value: ContentType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'sermon', label: 'Sermon', icon: <Headphones className="h-5 w-5" />, description: 'Audio or video sermon message' },
  { value: 'devotional', label: 'Devotional', icon: <BookOpen className="h-5 w-5" />, description: 'Written devotional or reflection' },
  { value: 'testimony', label: 'Testimony', icon: <Heart className="h-5 w-5" />, description: 'Personal story of faith and transformation' },
  { value: 'article', label: 'Article', icon: <FileText className="h-5 w-5" />, description: 'Written article or blog post' },
  { value: 'video', label: 'Video', icon: <Video className="h-5 w-5" />, description: 'Video content or recording' },
  { value: 'audio', label: 'Audio', icon: <Headphones className="h-5 w-5" />, description: 'Audio content or podcast' },
];

export default function NewTeachingPage() {
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    title: '',
    type: 'sermon' as ContentType,
    description: '',
    body: '',
    media_url: '',
    thumbnail_url: '',
    is_published: false,
    published_at: '',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

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

  const handleTypeSelect = (type: ContentType) => {
    setFormData((prev) => ({ ...prev, type }));
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

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        is_published: publish,
        published_at: publish ? formData.published_at || new Date().toISOString() : null,
      };

      // In a real app, this would call the create API
      console.log('Creating content:', submitData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push('/admin/teaching');
    } catch (error) {
      console.error('Error creating content:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Teaching', href: '/admin/teaching' },
          { label: 'New Content' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Content</h1>
          <p className="text-sm text-gray-500">
            Create a new sermon, devotional, testimony, or other teaching content
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Type Selection */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Content Type</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {contentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeSelect(type.value)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition ${
                      formData.type === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`rounded-lg p-2 ${
                        formData.type === type.value
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {type.icon}
                    </div>
                    <span className="font-medium text-gray-900">{type.label}</span>
                    <span className="text-xs text-gray-500">{type.description}</span>
                  </button>
                ))}
              </div>
              {errors.type && (
                <p className="mt-2 text-sm text-red-500">{errors.type}</p>
              )}
            </div>

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
                    placeholder="Brief description of the content (shown in listings)"
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
                  For devotionals, testimonies, and articles. Leave empty for audio/video-only content.
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
                    URL to the video or audio file (YouTube, Vimeo, direct link, etc.)
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
                    Optional thumbnail image for the content card
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
                <div>
                  <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule Publish Date
                  </label>
                  <input
                    type="date"
                    id="published_at"
                    name="published_at"
                    value={formData.published_at}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty to use today&apos;s date when publishing
                  </p>
                </div>
              </div>
            </div>

            {/* Save Actions */}
            <div className="rounded-xl border bg-gray-50 p-6">
              <div className="space-y-2">
                <Button
                  type="button"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={(e) => handleSubmit(e, true)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Publishing...' : 'Publish Now'}
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save as Draft'}
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

            {/* Help */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Tips</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• <strong>Sermons/Audio:</strong> Add a media URL for the audio file</li>
                <li>• <strong>Videos:</strong> Paste YouTube/Vimeo links or direct video URLs</li>
                <li>• <strong>Devotionals:</strong> Focus on the body text content</li>
                <li>• <strong>Testimonies:</strong> Tell the story in first person</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
