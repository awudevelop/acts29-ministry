'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@acts29/admin-ui';
import {
  ArrowLeft,
  Check,
  X,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Filter,
  RefreshCw,
} from 'lucide-react';

interface RunStep {
  stepId: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  error?: string;
  output?: Record<string, unknown>;
}

interface AutomationRun {
  id: string;
  automationId: string;
  automationName: string;
  triggeredBy: string;
  triggerData: Record<string, unknown>;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  steps: RunStep[];
  startedAt: string;
  completedAt?: string;
  duration?: number;
  error?: string;
}

interface RunStats {
  total: number;
  completed: number;
  failed: number;
  avgDuration: number;
}

const statusConfig = {
  running: { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Running' },
  completed: { icon: Check, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
  failed: { icon: X, color: 'text-red-600', bg: 'bg-red-100', label: 'Failed' },
  cancelled: { icon: AlertTriangle, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Cancelled' },
};

const stepStatusConfig = {
  pending: { color: 'bg-gray-300' },
  running: { color: 'bg-blue-500 animate-pulse' },
  completed: { color: 'bg-green-500' },
  failed: { color: 'bg-red-500' },
  skipped: { color: 'bg-gray-400' },
};

export default function AutomationRunsPage() {
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [stats, setStats] = useState<RunStats>({ total: 0, completed: 0, failed: 0, avgDuration: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  useEffect(() => {
    fetchRuns();
  }, [statusFilter]);

  const fetchRuns = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      const response = await fetch(`/api/automations/runs?${params}`);
      const data = await response.json();

      if (data.success) {
        setRuns(data.runs);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch runs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

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
          title="Automation Run History"
          description="View the history of all automation executions"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Total Runs</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Failed</p>
          <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Avg Duration</p>
          <p className="text-2xl font-bold">{formatDuration(stats.avgDuration)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="all">All Runs</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="running">Running</option>
          </select>
        </div>

        <button
          onClick={() => fetchRuns()}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Runs List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : runs.length === 0 ? (
        <div className="rounded-lg border bg-white py-12 text-center">
          <Clock className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No runs found</h3>
          <p className="mt-2 text-gray-500">
            Automation runs will appear here once they execute
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => {
            const config = statusConfig[run.status];
            const StatusIcon = config.icon;
            const isExpanded = expandedRun === run.id;

            return (
              <div key={run.id} className="rounded-lg border bg-white overflow-hidden">
                {/* Run Header */}
                <button
                  onClick={() => setExpandedRun(isExpanded ? null : run.id)}
                  className="flex w-full items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-2 ${config.bg}`}>
                      <StatusIcon className={`h-4 w-4 ${config.color} ${run.status === 'running' ? 'animate-spin' : ''}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{run.automationName}</p>
                      <p className="text-sm text-gray-500">
                        Triggered by: {run.triggeredBy.replace('.', ' → ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Steps Progress */}
                    <div className="hidden md:flex items-center gap-1">
                      {run.steps.map((step) => (
                        <div
                          key={step.stepId}
                          className={`h-2 w-2 rounded-full ${stepStatusConfig[step.status].color}`}
                          title={`${step.action}: ${step.status}`}
                        />
                      ))}
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {run.duration ? formatDuration(run.duration) : '—'}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(run.startedAt)}</p>
                    </div>

                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    {/* Trigger Data */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Trigger Data</h4>
                      <pre className="rounded bg-gray-800 text-gray-100 p-3 text-xs overflow-x-auto">
                        {JSON.stringify(run.triggerData, null, 2)}
                      </pre>
                    </div>

                    {/* Steps */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Steps</h4>
                      <div className="space-y-2">
                        {run.steps.map((step, index) => (
                          <div
                            key={step.stepId}
                            className={`flex items-center justify-between rounded-lg border bg-white p-3 ${
                              step.status === 'failed' ? 'border-red-200' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
                                {index + 1}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {step.action.replace('_', ' ')}
                                </p>
                                {step.error && (
                                  <p className="text-sm text-red-600">{step.error}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  step.status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : step.status === 'failed'
                                    ? 'bg-red-100 text-red-700'
                                    : step.status === 'skipped'
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {step.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Error Message */}
                    {run.error && (
                      <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
                        <p className="text-sm font-medium text-red-800">Error</p>
                        <p className="text-sm text-red-600">{run.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
