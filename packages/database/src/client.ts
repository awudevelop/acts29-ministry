import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Environment variable validation
 */
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

/**
 * Create a Supabase client for browser/client-side usage
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  );
}

/**
 * Create a Supabase client for server-side usage (Server Components, Route Handlers)
 */
export function createServerSupabaseClient(cookieStore: {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
}) {
  return createServerClient<Database>(
    getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Handle cookies in Server Components (read-only)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.remove(name, options);
          } catch {
            // Handle cookies in Server Components (read-only)
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase admin client with service role key
 * WARNING: Only use this on the server side for admin operations
 */
export function createAdminSupabaseClient() {
  return createSupabaseClient<Database>(
    getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Type-safe database query helpers
 */
export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;

export type Row<T extends TableName> = Tables[T]['Row'];
export type InsertRow<T extends TableName> = Tables[T]['Insert'];
export type UpdateRow<T extends TableName> = Tables[T]['Update'];
