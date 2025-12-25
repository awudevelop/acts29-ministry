'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { VolunteerShift, Profile } from '@acts29/database';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { useToast } from './useToast';
import { shiftToActivity } from './useActivityFeed';
import type { Activity } from '@acts29/database';

interface UseRealtimeShiftsOptions {
  initialShifts: VolunteerShift[];
  profiles?: Profile[];
  enabled?: boolean;
  onShiftChange?: (activity: Activity) => void;
}

export function useRealtimeShifts({
  initialShifts,
  profiles = [],
  enabled = true,
  onShiftChange,
}: UseRealtimeShiftsOptions) {
  const [shifts, setShifts] = useState<VolunteerShift[]>(initialShifts);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { success, info } = useToast();

  // Keep track of initial load
  const isInitialLoad = useRef(true);

  // Update shifts when initialShifts changes (e.g., on filter change)
  useEffect(() => {
    setShifts(initialShifts);
    isInitialLoad.current = true;
  }, [initialShifts]);

  const getVolunteerName = useCallback(
    (volunteerId: string | null): Profile | null => {
      if (!volunteerId) return null;
      return profiles.find((p) => p.id === volunteerId) || null;
    },
    [profiles]
  );

  const handleInsert = useCallback(
    (newShift: VolunteerShift) => {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }

      setShifts((prev) => {
        // Don't add if already exists
        if (prev.some((s) => s.id === newShift.id)) return prev;
        return [newShift, ...prev];
      });
      setLastUpdate(new Date());

      const volunteer = getVolunteerName(newShift.volunteer_id);
      const activity = shiftToActivity(newShift, volunteer, 'scheduled');
      onShiftChange?.(activity);

      info(`New shift scheduled: ${newShift.role}`);
    },
    [getVolunteerName, onShiftChange, info]
  );

  const handleUpdate = useCallback(
    ({ old: oldShift, new: newShift }: { old: Partial<VolunteerShift>; new: VolunteerShift }) => {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }

      setShifts((prev) =>
        prev.map((s) => (s.id === newShift.id ? newShift : s))
      );
      setLastUpdate(new Date());

      const volunteer = getVolunteerName(newShift.volunteer_id);

      // Determine what type of update occurred
      let eventType: 'scheduled' | 'completed' | 'cancelled' | 'check_in' | 'check_out' = 'scheduled';

      if (oldShift.status !== newShift.status) {
        if (newShift.status === 'completed') {
          eventType = 'completed';
          success(`Shift completed: ${newShift.role}`);
        } else if (newShift.status === 'cancelled') {
          eventType = 'cancelled';
          info(`Shift cancelled: ${newShift.role}`);
        }
      } else if (!oldShift.volunteer_id && newShift.volunteer_id) {
        eventType = 'check_in';
        const volunteerName = volunteer
          ? `${volunteer.first_name} ${volunteer.last_name}`
          : 'A volunteer';
        success(`${volunteerName} checked in for ${newShift.role}`);
      }

      const activity = shiftToActivity(newShift, volunteer, eventType);
      onShiftChange?.(activity);
    },
    [getVolunteerName, onShiftChange, success, info]
  );

  const handleDelete = useCallback(
    (deletedShift: Partial<VolunteerShift>) => {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }

      if (deletedShift.id) {
        setShifts((prev) => prev.filter((s) => s.id !== deletedShift.id));
        setLastUpdate(new Date());
        info(`Shift removed: ${deletedShift.role || 'Unknown'}`);
      }
    },
    [info]
  );

  // Subscribe to real-time updates
  useRealtimeSubscription({
    table: 'volunteer_shifts',
    event: '*',
    enabled,
    onInsert: handleInsert,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  });

  // Helper to refresh data manually
  const refresh = useCallback(() => {
    setShifts(initialShifts);
    setLastUpdate(new Date());
  }, [initialShifts]);

  // Stats calculated from current shifts
  const stats = {
    total: shifts.length,
    upcoming: shifts.filter((s) => new Date(s.start_time) > new Date()).length,
    needsVolunteers: shifts.filter((s) => !s.volunteer_id && s.status === 'scheduled').length,
    completed: shifts.filter((s) => s.status === 'completed').length,
    cancelled: shifts.filter((s) => s.status === 'cancelled').length,
  };

  return {
    shifts,
    stats,
    lastUpdate,
    refresh,
    isConnected: enabled,
  };
}
