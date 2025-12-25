'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@acts29/admin-ui';
import {
  ArrowLeft,
  Search,
  Zap,
  Mail,
  MessageSquare,
  Webhook,
  Clock,
  ChevronRight,
  Star,
  Check,
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  popularity: number;
  trigger: {
    type: string;
    filters?: Record<string, unknown>;
  };
  steps: Array<{
    id: string;
    action: {
      type: string;
      config: Record<string, unknown>;
    };
  }>;
}

interface TemplateCategory {
  category: string;
  templates: Template[];
}

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'send_email': Mail,
  'send_sms': MessageSquare,
  'send_slack': MessageSquare,
  'send_webhook': Webhook,
  'delay': Clock,
};

export default function AutomationTemplatesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [installing, setInstalling] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/automations/templates');
      const data = await response.json();

      if (data.success) {
        setCategories(data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const installTemplate = async (template: Template) => {
    setInstalling(template.id);

    try {
      const response = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          trigger: template.trigger,
          steps: template.steps,
          isActive: false, // Start as draft
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/admin/automations/${data.automation.id}`);
      } else {
        alert(data.error || 'Failed to install template');
      }
    } catch (error) {
      console.error('Install error:', error);
      alert('Failed to install template');
    } finally {
      setInstalling(null);
    }
  };

  const allTemplates = categories.flatMap((c) => c.templates);
  const filteredTemplates = allTemplates.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || t.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categoryNames = [...new Set(allTemplates.map((t) => t.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/automations"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader
          title="Automation Templates"
          description="Pre-built workflows to get you started quickly"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              !selectedCategory
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="rounded-lg border bg-white py-12 text-center">
          <Zap className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No templates found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-lg border bg-white p-5 transition hover:shadow-md"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary-100 p-2">
                    <Zap className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {template.category}
                  </span>
                </div>
                {template.popularity >= 80 && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-xs font-medium">Popular</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.description}</p>

              {/* Steps Preview */}
              <div className="flex items-center gap-1 mb-4">
                {template.steps.slice(0, 4).map((step, index) => {
                  const Icon = actionIcons[step.action.type] || Zap;
                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className="rounded-full bg-gray-100 p-1.5"
                        title={step.action.type.replace('_', ' ')}
                      >
                        <Icon className="h-3 w-3 text-gray-600" />
                      </div>
                      {index < template.steps.length - 1 && index < 3 && (
                        <ChevronRight className="h-3 w-3 text-gray-300" />
                      )}
                    </div>
                  );
                })}
                {template.steps.length > 4 && (
                  <span className="ml-1 text-xs text-gray-400">
                    +{template.steps.length - 4} more
                  </span>
                )}
              </div>

              {/* Install Button */}
              <button
                onClick={() => installTemplate(template)}
                disabled={installing === template.id}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary-600 px-4 py-2 text-sm font-medium text-primary-600 transition hover:bg-primary-50 disabled:opacity-50"
              >
                {installing === template.id ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                    Installing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Use Template
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Build Your Own CTA */}
      <div className="rounded-lg border bg-gradient-to-r from-primary-50 to-blue-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Don&apos;t see what you need?
        </h3>
        <p className="text-gray-600 mb-4">
          Create a custom automation from scratch with our visual builder
        </p>
        <Link
          href="/admin/automations/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2 font-medium text-white transition hover:bg-primary-700"
        >
          Build Your Own
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
