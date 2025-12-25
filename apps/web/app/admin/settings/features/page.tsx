'use client';

import * as React from 'react';
import { Breadcrumbs, Alert, Badge } from '@acts29/admin-ui';
import { Button } from '@acts29/ui';
import { useFeatures } from '@/lib/features';
import {
  ClipboardList,
  Home,
  MapPin,
  Apple,
  Stethoscope,
  Car,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { FeatureModule } from '@acts29/database';

// Map icon names to components
const iconMap: Record<string, React.ElementType> = {
  ClipboardList,
  Home,
  MapPin,
  Apple,
  Stethoscope,
  Car,
};

function FeatureCard({ module }: { module: FeatureModule }) {
  const { isFeatureEnabled, toggleFeature } = useFeatures();
  const enabled = isFeatureEnabled(module.id);
  const Icon = iconMap[module.icon] || ClipboardList;

  const categoryColors = {
    outreach: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    operations: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    services: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <div
      className={`relative rounded-xl border-2 p-6 transition-all ${
        module.isPlanned
          ? 'border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
          : enabled
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      {/* Enabled indicator */}
      {enabled && !module.isPlanned && (
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
          <Check className="h-4 w-4" />
        </div>
      )}

      {/* Coming Soon badge */}
      {module.isPlanned && (
        <div className="absolute -right-2 -top-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Coming Soon
          </Badge>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
            module.isPlanned
              ? 'bg-gray-200 dark:bg-gray-700'
              : enabled
                ? 'bg-primary-100 dark:bg-primary-900/30'
                : 'bg-gray-100 dark:bg-gray-700'
          }`}
        >
          <Icon
            className={`h-6 w-6 ${
              module.isPlanned
                ? 'text-gray-400 dark:text-gray-500'
                : enabled
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-semibold ${
                module.isPlanned
                  ? 'text-gray-500 dark:text-gray-400'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {module.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[module.category]}`}>
              {module.category}
            </span>
          </div>
          <p
            className={`text-sm ${
              module.isPlanned
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {module.description}
          </p>

          {module.dependencies && module.dependencies.length > 0 && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              Requires: {module.dependencies.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Toggle button */}
      <div className="mt-4 flex justify-end">
        {module.isPlanned ? (
          <Button variant="outline" size="sm" disabled className="opacity-50">
            <Sparkles className="mr-2 h-4 w-4" />
            Coming Soon
          </Button>
        ) : (
          <Button
            variant={enabled ? 'outline' : 'default'}
            size="sm"
            onClick={() => toggleFeature(module.id)}
          >
            {enabled ? 'Disable' : 'Enable'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function FeaturesSettingsPage() {
  const { availableFeatures, plannedFeatures, enabledFeatures } = useFeatures();
  const [success, setSuccess] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Features' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Feature Modules</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Enable or disable optional features based on your organization's needs. Core features
          (donations, volunteers, events, teams, prayer, teaching) are always enabled.
        </p>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Stats */}
      <div className="flex gap-4">
        <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 px-4 py-3">
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {enabledFeatures.length}
          </p>
          <p className="text-sm text-primary-700 dark:text-primary-300">Enabled modules</p>
        </div>
        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-3">
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {availableFeatures.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Available modules</p>
        </div>
        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-3">
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {plannedFeatures.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Coming soon</p>
        </div>
      </div>

      {/* Available Features */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Available Modules
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableFeatures.map((module) => (
            <FeatureCard key={module.id} module={module} />
          ))}
        </div>
      </div>

      {/* Planned Features */}
      {plannedFeatures.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Coming Soon
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plannedFeatures.map((module) => (
              <FeatureCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      )}

      {/* Core Features Info */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Core Features</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          These features are always enabled and form the foundation of the Acts 29 platform:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'Donations & Tax Receipts',
            'Volunteers & Shifts',
            'Events/Calendar',
            'Teams & Collaboration',
            'Prayer Requests',
            'Teaching Content',
          ].map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-gray-700 px-3 py-1 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
            >
              <Check className="h-3 w-3 text-green-500" />
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
