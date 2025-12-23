// Pagination constants
export const DEFAULT_PAGE_SIZE = 10;
export const PAGINATION_DISPLAY_PAGES = 5;

// Table page size options
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

// Date formats
export const DATE_FORMAT = 'MMM d, yyyy';
export const DATE_TIME_FORMAT = 'MMM d, yyyy h:mm a';
export const TIME_FORMAT = 'h:mm a';

// Debounce delays (in milliseconds)
export const SEARCH_DEBOUNCE_MS = 300;
export const AUTOSAVE_DEBOUNCE_MS = 1000;

// Status colors (for consistent badge coloring)
export const STATUS_COLORS = {
  active: 'success',
  pending: 'warning',
  completed: 'success',
  cancelled: 'danger',
  scheduled: 'info',
  no_show: 'danger',
  closed: 'default',
  referred: 'info',
} as const;

// Animation durations
export const ANIMATION_DURATION_MS = 200;
export const TOAST_DURATION_MS = 5000;
