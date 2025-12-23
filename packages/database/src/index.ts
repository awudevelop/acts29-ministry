// Mock client and data (for development without Supabase)
export {
  createMockSupabaseClient,
  type MockSupabaseClient,
  mockOrganizations,
  mockProfiles,
  mockResources,
  mockCases,
  mockVolunteerShifts,
  mockDonations,
  mockContent,
  mockPrayerRequests,
  mockStats,
  mockEvents,
  mockEventRegistrations,
  mockTeams,
  mockTeamMembers,
} from './mock';

// Real client exports - note: requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env vars
export {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
  createAdminSupabaseClient,
  type Tables,
  type TableName,
  type Row,
  type InsertRow,
  type UpdateRow,
} from './client';

// Type exports
export type {
  Database,
  Json,
  UserRole,
  ResourceType,
  CaseStatus,
  DonationType,
  ContentType,
  EventStatus,
  RegistrationStatus,
  TeamRole,
  Organization,
  Profile,
  Resource,
  Case,
  VolunteerShift,
  Donation,
  Content,
  PrayerRequest,
  Event,
  EventRegistration,
  Team,
  TeamMember,
} from './types';
