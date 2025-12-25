'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Donation, VolunteerShift, Case } from '@acts29/database';
import { useRealtimeSubscription } from './useRealtimeSubscription';

interface DashboardStats {
  totalDonationsMonth: number;
  donationChange: number;
  activeVolunteers: number;
  volunteerChange: number;
  activeCases: number;
  volunteerHoursMonth: number;
  hoursChange: number;
}

interface UseLiveStatsOptions {
  initialStats: DashboardStats;
  initialDonations?: Donation[];
  initialShifts?: VolunteerShift[];
  initialCases?: Case[];
  enabled?: boolean;
}

export function useLiveStats({
  initialStats,
  initialDonations = [],
  initialShifts = [],
  initialCases = [],
  enabled = true,
}: UseLiveStatsOptions) {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [shifts, setShifts] = useState<VolunteerShift[]>(initialShifts);
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Recalculate stats when data changes
  const recalculateStats = useCallback(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total donations this month
    const monthlyDonations = donations.filter(
      (d) =>
        d.type === 'monetary' &&
        d.status === 'completed' &&
        new Date(d.created_at) >= startOfMonth
    );
    const totalDonationsMonth = monthlyDonations.reduce(
      (sum, d) => sum + (d.amount ?? 0),
      0
    );

    // Active volunteers (unique volunteers with shifts this month)
    const activeVolunteerIds = new Set(
      shifts
        .filter((s) => s.volunteer_id && new Date(s.start_time) >= startOfMonth)
        .map((s) => s.volunteer_id)
    );
    const activeVolunteers = activeVolunteerIds.size;

    // Active cases
    const activeCases = cases.filter((c) => c.status === 'active').length;

    // Volunteer hours this month
    const volunteerHoursMonth = shifts
      .filter(
        (s) =>
          s.status === 'completed' &&
          new Date(s.start_time) >= startOfMonth
      )
      .reduce((sum, s) => {
        const start = new Date(s.start_time);
        const end = new Date(s.end_time);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);

    setStats((prev) => ({
      ...prev,
      totalDonationsMonth,
      activeVolunteers,
      activeCases,
      volunteerHoursMonth: Math.round(volunteerHoursMonth),
    }));
    setLastUpdate(new Date());
  }, [donations, shifts, cases]);

  // Subscribe to donation changes
  useRealtimeSubscription({
    table: 'donations',
    event: '*',
    enabled,
    onInsert: (newDonation) => {
      setDonations((prev) => [newDonation, ...prev]);
    },
    onUpdate: ({ new: updatedDonation }) => {
      setDonations((prev) =>
        prev.map((d) => (d.id === updatedDonation.id ? updatedDonation : d))
      );
    },
    onDelete: (deleted) => {
      if (deleted.id) {
        setDonations((prev) => prev.filter((d) => d.id !== deleted.id));
      }
    },
  });

  // Subscribe to shift changes
  useRealtimeSubscription({
    table: 'volunteer_shifts',
    event: '*',
    enabled,
    onInsert: (newShift) => {
      setShifts((prev) => [newShift, ...prev]);
    },
    onUpdate: ({ new: updatedShift }) => {
      setShifts((prev) =>
        prev.map((s) => (s.id === updatedShift.id ? updatedShift : s))
      );
    },
    onDelete: (deleted) => {
      if (deleted.id) {
        setShifts((prev) => prev.filter((s) => s.id !== deleted.id));
      }
    },
  });

  // Subscribe to case changes
  useRealtimeSubscription({
    table: 'cases',
    event: '*',
    enabled,
    onInsert: (newCase) => {
      setCases((prev) => [newCase, ...prev]);
    },
    onUpdate: ({ new: updatedCase }) => {
      setCases((prev) =>
        prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
      );
    },
    onDelete: (deleted) => {
      if (deleted.id) {
        setCases((prev) => prev.filter((c) => c.id !== deleted.id));
      }
    },
  });

  // Recalculate stats when data changes
  useEffect(() => {
    recalculateStats();
  }, [recalculateStats]);

  return {
    stats,
    lastUpdate,
    isConnected: enabled,
    refresh: recalculateStats,
  };
}
