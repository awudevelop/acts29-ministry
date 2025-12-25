// Authentication
export { useAuth } from './useAuth';

// Forms
export { useForm } from './useForm';

// Notifications
export { useToast, type Toast, type ToastType } from './useToast';

// Realtime
export { useRealtimeSubscription } from './useRealtimeSubscription';
export {
  useActivityFeed,
  donationToActivity,
  shiftToActivity,
  caseToActivity,
  eventToActivity,
  prayerToActivity,
  contentToActivity,
} from './useActivityFeed';
export { useRealtimeShifts } from './useRealtimeShifts';
export { useLiveStats } from './useLiveStats';

// Geolocation
export { useGeolocation, calculateDistance } from './useGeolocation';

// Responsive
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useBreakpoint,
  usePrefersDarkMode,
  usePrefersReducedMotion,
} from './useMediaQuery';
