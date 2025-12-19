'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { createBrowserSupabaseClient, type TableName, type Row } from '@acts29/database';

type PostgresChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeSubscriptionOptions<T extends TableName> {
  table: T;
  event?: PostgresChangeEvent;
  filter?: string;
  schema?: string;
  onInsert?: (payload: Row<T>) => void;
  onUpdate?: (payload: { old: Partial<Row<T>>; new: Row<T> }) => void;
  onDelete?: (payload: Partial<Row<T>>) => void;
  onChange?: (payload: RealtimePostgresChangesPayload<Row<T>>) => void;
  enabled?: boolean;
}

/**
 * Custom hook for Supabase realtime subscriptions
 * Automatically subscribes and unsubscribes based on component lifecycle
 */
export function useRealtimeSubscription<T extends TableName>({
  table,
  event = '*',
  filter,
  schema = 'public',
  onInsert,
  onUpdate,
  onDelete,
  onChange,
  enabled = true,
}: UseRealtimeSubscriptionOptions<T>) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = createBrowserSupabaseClient();

  const subscribe = useCallback(() => {
    if (!enabled) return;

    const channelName = `${schema}:${table}:${filter ?? 'all'}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = supabase.channel(channelName) as any;
    channelRef.current = channel
      .on(
        'postgres_changes',
        {
          event,
          schema,
          table,
          filter,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          onChange?.(payload as RealtimePostgresChangesPayload<Row<T>>);

          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload.new as Row<T>);
              break;
            case 'UPDATE':
              onUpdate?.({
                old: payload.old as Partial<Row<T>>,
                new: payload.new as Row<T>,
              });
              break;
            case 'DELETE':
              onDelete?.(payload.old as Partial<Row<T>>);
              break;
          }
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [enabled, event, filter, onChange, onDelete, onInsert, onUpdate, schema, supabase, table]);

  useEffect(() => {
    const unsubscribe = subscribe();
    return () => {
      unsubscribe?.();
    };
  }, [subscribe]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, [supabase]);

  return { unsubscribe };
}
