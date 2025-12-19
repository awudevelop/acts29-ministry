/**
 * Mock Supabase Client
 * Provides a mock implementation that uses local data instead of Supabase
 */

import {
  mockOrganizations,
  mockProfiles,
  mockResources,
  mockCases,
  mockVolunteerShifts,
  mockDonations,
  mockContent,
  mockPrayerRequests,
  mockStats,
} from './data';

type MockData = {
  organizations: typeof mockOrganizations;
  profiles: typeof mockProfiles;
  resources: typeof mockResources;
  cases: typeof mockCases;
  volunteer_shifts: typeof mockVolunteerShifts;
  donations: typeof mockDonations;
  content: typeof mockContent;
  prayer_requests: typeof mockPrayerRequests;
};

const mockData: MockData = {
  organizations: mockOrganizations,
  profiles: mockProfiles,
  resources: mockResources,
  cases: mockCases,
  volunteer_shifts: mockVolunteerShifts,
  donations: mockDonations,
  content: mockContent,
  prayer_requests: mockPrayerRequests,
};

type TableName = keyof MockData;

/**
 * Mock query builder that mimics Supabase's query interface
 */
class MockQueryBuilder<T extends object> {
  private data: T[];
  private filters: Array<(item: T) => boolean> = [];
  private selectFields: string[] | null = null;
  private limitCount: number | null = null;
  private offsetCount: number = 0;
  private orderByField: string | null = null;
  private orderAscending: boolean = true;

  constructor(data: T[]) {
    this.data = [...data];
  }

  select(fields?: string) {
    if (fields && fields !== '*') {
      this.selectFields = fields.split(',').map((f) => f.trim());
    }
    return this;
  }

  eq<K extends keyof T>(field: K, value: T[K]) {
    this.filters.push((item) => item[field] === value);
    return this;
  }

  neq<K extends keyof T>(field: K, value: T[K]) {
    this.filters.push((item) => item[field] !== value);
    return this;
  }

  gt<K extends keyof T>(field: K, value: T[K]) {
    this.filters.push((item) => (item[field] as number) > (value as number));
    return this;
  }

  gte<K extends keyof T>(field: K, value: T[K]) {
    this.filters.push((item) => (item[field] as number) >= (value as number));
    return this;
  }

  lt<K extends keyof T>(field: K, value: T[K]) {
    this.filters.push((item) => (item[field] as number) < (value as number));
    return this;
  }

  lte<K extends keyof T>(field: K, value: T[K]) {
    this.filters.push((item) => (item[field] as number) <= (value as number));
    return this;
  }

  like<K extends keyof T>(field: K, pattern: string) {
    const regex = new RegExp(pattern.replace(/%/g, '.*'), 'i');
    this.filters.push((item) => regex.test(String(item[field])));
    return this;
  }

  ilike<K extends keyof T>(field: K, pattern: string) {
    return this.like(field, pattern);
  }

  in<K extends keyof T>(field: K, values: T[K][]) {
    this.filters.push((item) => values.includes(item[field]));
    return this;
  }

  contains<K extends keyof T>(field: K, value: unknown) {
    this.filters.push((item) => {
      const fieldValue = item[field];
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(value);
      }
      return false;
    });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderByField = field;
    this.orderAscending = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  range(from: number, to: number) {
    this.offsetCount = from;
    this.limitCount = to - from + 1;
    return this;
  }

  single() {
    return this.execute().then((result) => ({
      data: result.data?.[0] ?? null,
      error: result.data?.length === 0 ? { message: 'No rows found' } : null,
    }));
  }

  maybeSingle() {
    return this.execute().then((result) => ({
      data: result.data?.[0] ?? null,
      error: null,
    }));
  }

  async execute(): Promise<{ data: T[] | null; error: null }> {
    // Simulate async behavior
    await new Promise((resolve) => setTimeout(resolve, 50));

    let result = this.data;

    // Apply filters
    for (const filter of this.filters) {
      result = result.filter(filter);
    }

    // Apply ordering
    if (this.orderByField) {
      const field = this.orderByField as keyof T;
      result = [...result].sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (aVal < bVal) return this.orderAscending ? -1 : 1;
        if (aVal > bVal) return this.orderAscending ? 1 : -1;
        return 0;
      });
    }

    // Apply offset
    if (this.offsetCount > 0) {
      result = result.slice(this.offsetCount);
    }

    // Apply limit
    if (this.limitCount !== null) {
      result = result.slice(0, this.limitCount);
    }

    // Apply field selection
    if (this.selectFields) {
      result = result.map((item) => {
        const selected: Partial<T> = {};
        for (const field of this.selectFields!) {
          if (field in item) {
            selected[field as keyof T] = item[field as keyof T];
          }
        }
        return selected as T;
      });
    }

    return { data: result, error: null };
  }

  then<TResult>(
    onfulfilled?: (value: { data: T[] | null; error: null }) => TResult | PromiseLike<TResult>
  ): Promise<TResult> {
    return this.execute().then(onfulfilled);
  }
}

/**
 * Mock Supabase client
 */
export function createMockSupabaseClient() {
  return {
    from: <T extends TableName>(table: T) => {
      const tableData = mockData[table];
      return new MockQueryBuilder(tableData as unknown as MockData[T][]);
    },

    auth: {
      getSession: async () => ({
        data: { session: null },
        error: null,
      }),
      getUser: async () => ({
        data: { user: null },
        error: null,
      }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: { message: 'Mock: Authentication disabled' },
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: { message: 'Mock: Authentication disabled' },
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },

    // Helper to get stats
    getStats: () => mockStats,
  };
}

export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>;
