import * as React from 'react';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';

interface UseTableFiltersOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  initialFilters?: Record<string, string>;
}

interface UseTableFiltersReturn<T> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearchQuery: string;
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  filteredData: T[];
}

export function useTableFilters<T extends Record<string, unknown>>({
  data,
  searchFields,
  initialFilters = {},
}: UseTableFiltersOptions<T>): UseTableFiltersReturn<T> {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<Record<string, string>>(initialFilters);

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const setFilter = React.useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = React.useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setFilters(initialFilters);
  }, [initialFilters]);

  const filteredData = React.useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return typeof value === 'string' && value.toLowerCase().includes(query);
        })
      );
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter((item) => {
          const itemValue = item[key];
          if (typeof itemValue === 'boolean') {
            return value === 'true' ? itemValue : !itemValue;
          }
          return String(itemValue) === value;
        });
      }
    });

    return result;
  }, [data, debouncedSearchQuery, filters, searchFields]);

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    filters,
    setFilter,
    clearFilters,
    filteredData,
  };
}
