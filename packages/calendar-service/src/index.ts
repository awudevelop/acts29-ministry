export {
  // Event calendar functions
  generateICalendar,
  generateSingleEventICalendar,
  generateVEvent,
  generateSubscriptionUrls,
  generateGoogleCalendarEventUrl,
  generateOutlookEventUrl,
  // Shift calendar functions
  generateShiftCalendar,
  generateShiftVEvent,
  generateCombinedCalendar,
  generateCustomSubscriptionUrls,
  // Types
  type ICalendarOptions,
  type ICalEventOptions,
  type CalendarSubscriptionUrls,
  type VolunteerShiftCalendarItem,
  type ICalShiftOptions,
  type ShiftCalendarOptions,
} from './ical';

// ============================================
// Calendar OAuth Integration
// ============================================

export {
  // Types
  type CalendarProvider,
  type OAuthTokens,
  type ConnectedCalendar,
  type CalendarInfo,
  type SyncSettings,
  type ExternalEvent,
  type ConflictResult,
  type OAuthConfig,
  type CalendarStore,
  // Classes
  GoogleCalendarOAuth,
  MicrosoftCalendarOAuth,
  CalendarSyncManager,
  InMemoryCalendarStore,
} from './oauth';
