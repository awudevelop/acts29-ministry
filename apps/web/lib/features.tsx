'use client';

import * as React from 'react';
import {
  featureModules,
  defaultEnabledFeatures,
  type FeatureModuleId,
  type FeatureModule,
} from '@acts29/database';

interface FeaturesContextValue {
  enabledFeatures: FeatureModuleId[];
  isFeatureEnabled: (featureId: FeatureModuleId) => boolean;
  toggleFeature: (featureId: FeatureModuleId) => void;
  getFeatureModule: (featureId: FeatureModuleId) => FeatureModule | undefined;
  allFeatures: FeatureModule[];
  availableFeatures: FeatureModule[];
  plannedFeatures: FeatureModule[];
}

const FeaturesContext = React.createContext<FeaturesContextValue | undefined>(undefined);

const STORAGE_KEY = 'acts29-features';

interface FeaturesProviderProps {
  children: React.ReactNode;
  initialFeatures?: FeatureModuleId[];
}

export function FeaturesProvider({ children, initialFeatures }: FeaturesProviderProps) {
  const [enabledFeatures, setEnabledFeatures] = React.useState<FeatureModuleId[]>(() => {
    // In production, this would come from the organization's database record
    // For now, use localStorage for demo purposes
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return initialFeatures ?? defaultEnabledFeatures;
        }
      }
    }
    return initialFeatures ?? defaultEnabledFeatures;
  });

  // Persist to localStorage when features change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enabledFeatures));
    }
  }, [enabledFeatures]);

  const isFeatureEnabled = React.useCallback(
    (featureId: FeatureModuleId) => enabledFeatures.includes(featureId),
    [enabledFeatures]
  );

  const toggleFeature = React.useCallback((featureId: FeatureModuleId) => {
    setEnabledFeatures((prev) => {
      const module = featureModules.find((m) => m.id === featureId);

      // Don't allow toggling planned features
      if (module?.isPlanned) return prev;

      if (prev.includes(featureId)) {
        // Removing - check if other features depend on this one
        const dependentFeatures = featureModules.filter(
          (m) => m.dependencies?.includes(featureId) && prev.includes(m.id)
        );

        if (dependentFeatures.length > 0) {
          // For now, just remove the feature. In production, show a warning.
          // Could also cascade-disable dependent features.
        }

        return prev.filter((id) => id !== featureId);
      } else {
        // Adding - also enable any dependencies
        const newFeatures = [...prev, featureId];

        if (module?.dependencies) {
          for (const depId of module.dependencies) {
            if (!newFeatures.includes(depId)) {
              newFeatures.push(depId);
            }
          }
        }

        return newFeatures;
      }
    });
  }, []);

  const getFeatureModule = React.useCallback(
    (featureId: FeatureModuleId) => featureModules.find((m) => m.id === featureId),
    []
  );

  const availableFeatures = React.useMemo(
    () => featureModules.filter((m) => !m.isPlanned),
    []
  );

  const plannedFeatures = React.useMemo(
    () => featureModules.filter((m) => m.isPlanned),
    []
  );

  const value: FeaturesContextValue = {
    enabledFeatures,
    isFeatureEnabled,
    toggleFeature,
    getFeatureModule,
    allFeatures: featureModules,
    availableFeatures,
    plannedFeatures,
  };

  return (
    <FeaturesContext.Provider value={value}>
      {children}
    </FeaturesContext.Provider>
  );
}

export function useFeatures() {
  const context = React.useContext(FeaturesContext);
  if (context === undefined) {
    throw new Error('useFeatures must be used within a FeaturesProvider');
  }
  return context;
}

// FeatureGate component for conditional rendering
interface FeatureGateProps {
  feature: FeatureModuleId;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const { isFeatureEnabled } = useFeatures();

  if (!isFeatureEnabled(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
