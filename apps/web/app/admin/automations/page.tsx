'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@acts29/admin-ui';
import {
  Zap,
  Plus,
  Play,
  MoreVertical,
  Check,
  Clock,
  Activity,
  Mail,
  MessageSquare,
  Webhook,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  description?: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  runCount: number;
  lastRunAt?: string;
}

const triggerLabels: Record<string, string> = {
  'donation.created': 'New Donation',
  'donation.recurring.created': 'New Recurring Donation',
  'donation.recurring.cancelled': 'Recurring Donation Cancelled',
  'donation.failed': 'Donation Failed',
  'volunteer.signed_up': 'New Volunteer Signup',
  'volunteer.shift_assigned': 'Shift Assigned',
  'volunteer.shift_completed': 'Shift Completed',
  'volunteer.shift_upcoming': 'Upcoming Shift',
  'event.created': 'New Event',
  'event.registration': 'Event Registration',
  'event.reminder': 'Event Reminder',
  'case.created': 'New Case',
  'case.status_changed': 'Case Status Changed',
  'case.assigned': 'Case Assigned',
  'prayer.submitted': 'Prayer Request Submitted',
  'newsletter.subscribed': 'Newsletter Subscription',
  'schedule.daily': 'Daily Schedule',
  'schedule.weekly': 'Weekly Schedule',
  'schedule.monthly': 'Monthly Schedule',
};

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'send_email': Mail,
  'send_sms': MessageSquare,
  'send_slack': MessageSquare,
  'send_webhook': Webhook,
  'delay': Clock,
};

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalRuns: 0,
  });

  useEffect(() => {
    fetchAutomations();
  }, [filter]);

  const fetchAutomations = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.set('status', filter);
      }

      const response = await fetch(`/api/automations?${params}`);
      const data = await response.json();

      if (data.success) {
        setAutomations(data.automations);
        setStats({
          total: data.automations.length,
          active: data.automations.filter((a: Automation) => a.isActive).length,
          totalRuns: data.automations.reduce((sum: number, a: Automation) => sum + a.runCount, 0),
        });
      }
    } catch (error) {
      console.error('Failed to fetch automations:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async (id: string, currentStatus: boolean) => {
    try {
      await fetch('/api/automations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      setAutomations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isActive: !currentStatus } : a))
      );
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  const filteredAutomations = automations.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Automations"
          description="Create workflows that run automatically when events happen"
        />
        <Link
          href="/admin/automations/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          New Automation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-100 dark:bg-primary-900/30 p-2">
              <Zap className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Automations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
              <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Runs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalRuns.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search automations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 transition-colors"
          >
            <option value="all">All Automations</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        <Link
          href="/admin/automations/templates"
          className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Browse Templates
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Automations List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : filteredAutomations.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 py-12 text-center transition-colors">
          <Zap className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No automations found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {searchQuery
              ? 'Try adjusting your search'
              : 'Create your first automation to get started'}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/automations/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Create Automation
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAutomations.map((automation) => (
            <div
              key={automation.id}
              className={`rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 transition hover:shadow-md ${
                !automation.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Status Toggle */}
                  <button
                    onClick={() => toggleAutomation(automation.id, automation.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      automation.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        automation.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>

                  {/* Automation Info */}
                  <div>
                    <Link
                      href={`/admin/automations/${automation.id}`}
                      className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {automation.name}
                    </Link>
                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {triggerLabels[automation.trigger.type] || automation.trigger.type}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {automation.steps.length} step{automation.steps.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Steps Preview */}
                  <div className="hidden md:flex items-center gap-1">
                    {automation.steps.slice(0, 4).map((step, index) => {
                      const Icon = actionIcons[step.action.type] || Activity;
                      return (
                        <div
                          key={step.id}
                          className="flex items-center"
                          title={step.action.type.replace('_', ' ')}
                        >
                          <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-1.5">
                            <Icon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                          </div>
                          {index < automation.steps.length - 1 && index < 3 && (
                            <ChevronRight className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                          )}
                        </div>
                      );
                    })}
                    {automation.steps.length > 4 && (
                      <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                        +{automation.steps.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      {automation.runCount > 0 ? (
                        <>
                          <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">{automation.runCount}</span>
                          <span className="text-gray-500 dark:text-gray-400">runs</span>
                        </>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">No runs yet</span>
                      )}
                    </div>
                    {automation.lastRunAt && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Last: {formatDate(automation.lastRunAt)}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="relative">
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {automation.description && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 ml-15">{automation.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Run History Link */}
      <div className="flex justify-center">
        <Link
          href="/admin/automations/runs"
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          View Run History →
        </Link>
      </div>
    </div>
  );
}
