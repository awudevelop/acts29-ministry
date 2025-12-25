/**
 * Database types for Acts29 Ministry
 * These will be auto-generated from Supabase once connected
 * Run: pnpm db:generate
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'super_admin' | 'org_admin' | 'staff' | 'volunteer' | 'donor' | 'guest';

export type ResourceType =
  | 'shelter'
  | 'food_bank'
  | 'clinic'
  | 'clothing'
  | 'employment'
  | 'counseling'
  | 'church'
  | 'other';

export type CaseStatus = 'active' | 'pending' | 'closed' | 'referred';

export type DonationType = 'monetary' | 'goods' | 'time';

export type ContentType = 'sermon' | 'devotional' | 'testimony' | 'article' | 'video' | 'audio';

export type EventStatus = 'upcoming' | 'completed' | 'cancelled';

export type RegistrationStatus = 'registered' | 'confirmed' | 'waitlist' | 'cancelled' | 'attended';

export type TeamRole = 'lead' | 'member';

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: string;
          description: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['organizations']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string | null;
          role: UserRole;
          first_name: string;
          last_name: string;
          phone: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['profiles']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      resources: {
        Row: {
          id: string;
          organization_id: string;
          team_id: string | null;
          name: string;
          type: ResourceType;
          description: string | null;
          address: string;
          latitude: number | null;
          longitude: number | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          hours: Json | null;
          capacity: number | null;
          current_availability: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['resources']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['resources']['Insert']>;
      };
      cases: {
        Row: {
          id: string;
          organization_id: string;
          assigned_to: string | null;
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
          status: CaseStatus;
          needs: string[];
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['cases']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['cases']['Insert']>;
      };
      volunteer_shifts: {
        Row: {
          id: string;
          organization_id: string;
          volunteer_id: string | null;
          resource_id: string | null;
          team_id: string | null;
          start_time: string;
          end_time: string;
          role: string;
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['volunteer_shifts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['volunteer_shifts']['Insert']>;
      };
      donations: {
        Row: {
          id: string;
          organization_id: string;
          donor_id: string | null;
          type: DonationType;
          amount: number | null;
          description: string | null;
          stripe_payment_intent_id: string | null;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          // Fee coverage fields - allows donors to offset processing fees
          cover_fees: boolean;
          fee_percentage: number;
          fee_amount: number | null;
          total_amount: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['donations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['donations']['Insert']>;
      };
      content: {
        Row: {
          id: string;
          organization_id: string;
          team_id: string | null;
          author_id: string;
          title: string;
          type: ContentType;
          description: string | null;
          body: string | null;
          media_url: string | null;
          thumbnail_url: string | null;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['content']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['content']['Insert']>;
      };
      prayer_requests: {
        Row: {
          id: string;
          user_id: string | null;
          organization_id: string | null;
          title: string;
          description: string;
          is_anonymous: boolean;
          is_answered: boolean;
          prayer_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['prayer_requests']['Row'],
          'id' | 'created_at' | 'updated_at' | 'prayer_count'
        >;
        Update: Partial<Database['public']['Tables']['prayer_requests']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          location: string;
          start_time: string;
          end_time: string;
          max_attendees: number | null;
          registered: number;
          is_public: boolean;
          accepts_clothing: boolean;
          accepts_food: boolean;
          status: EventStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['events']['Row'],
          'id' | 'created_at' | 'updated_at' | 'registered'
        >;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          status: RegistrationStatus;
          party_size: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['event_registrations']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['event_registrations']['Insert']>;
      };
      teams: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          slug: string;
          description: string | null;
          color: string | null;
          icon: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['teams']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['teams']['Insert']>;
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          profile_id: string;
          role: TeamRole;
          joined_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['team_members']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      resource_type: ResourceType;
      case_status: CaseStatus;
      donation_type: DonationType;
      content_type: ContentType;
      event_status: EventStatus;
      registration_status: RegistrationStatus;
      team_role: TeamRole;
    };
  };
}

// Helper types for easier usage
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Resource = Database['public']['Tables']['resources']['Row'];
export type Case = Database['public']['Tables']['cases']['Row'];
export type VolunteerShift = Database['public']['Tables']['volunteer_shifts']['Row'];
export type Donation = Database['public']['Tables']['donations']['Row'];
export type Content = Database['public']['Tables']['content']['Row'];
export type PrayerRequest = Database['public']['Tables']['prayer_requests']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type EventRegistration = Database['public']['Tables']['event_registrations']['Row'];
export type Team = Database['public']['Tables']['teams']['Row'];
export type TeamMember = Database['public']['Tables']['team_members']['Row'];

// Activity types for real-time feeds
export type ActivityType =
  | 'donation_received'
  | 'donation_refunded'
  | 'volunteer_checked_in'
  | 'volunteer_checked_out'
  | 'shift_scheduled'
  | 'shift_completed'
  | 'shift_cancelled'
  | 'case_created'
  | 'case_updated'
  | 'case_closed'
  | 'event_created'
  | 'event_registration'
  | 'prayer_request'
  | 'content_published'
  | 'team_member_added'
  | 'resource_updated';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  actor?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  metadata?: Record<string, unknown>;
  timestamp: string;
  read?: boolean;
}
