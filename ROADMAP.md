# Acts 29 Ministry - Development Roadmap

## Overview

Acts 29 Church for the Unsheltered is a ministry application built to support homeless outreach efforts in Springfield, IL. The application connects churches, shelters, and community resources to serve those experiencing homelessness.

## Completed Features

### Phase 1: Foundation (Complete)
- [x] Next.js 14 App Router with TypeScript
- [x] Monorepo structure with pnpm workspaces
- [x] UI component library (@acts29/ui)
- [x] Admin UI component library (@acts29/admin-ui)
- [x] Database package with mock data (@acts29/database)
- [x] Acts 29 branding integration (logo, colors, imagery)

### Phase 2: Public Website (Complete)
- [x] Homepage with ministry overview
- [x] Calendar page with event listings
- [x] Prayer request submission
- [x] Teaching content (sermons, devotionals, testimonies)
- [x] About page with mission and partners
- [x] Resources page with community resource directory

### Phase 3: Admin Portal - Core (Complete)
- [x] Admin dashboard with statistics
- [x] Donations management
  - [x] List, create, view donations
  - [x] Edit donation records
- [x] Tax Receipts
  - [x] Generate individual receipts
  - [x] Year-end batch generation
  - [x] Email delivery via Resend
- [x] Volunteer management
  - [x] Volunteer list and profiles
  - [x] Shift scheduling
  - [x] Shift detail view
  - [x] New shift creation
- [x] Calendar/Events management
  - [x] Event list and calendar view
  - [x] Event creation and editing
  - [x] Event registration management
- [x] Case management
  - [x] Case list and detail view
  - [x] Edit case records
  - [x] Needs assessment tracking

### Phase 4: Admin Portal - Extended (Complete)
- [x] Teaching content management
  - [x] Content list with filtering
  - [x] Create/edit sermons, devotionals, testimonies
  - [x] Media URL support
- [x] Resources management
  - [x] Resource directory (shelters, food, medical, etc.)
  - [x] Create/edit/delete resources
  - [x] Category filtering
- [x] User management interface
- [x] Settings page

### Phase 5: Teams & Collaboration (Complete)
- [x] Teams feature for scoped access control and collaboration
  - [x] Team types with Lead/Member roles
  - [x] Team database schema and mock data
  - [x] Teams list page with search and filters
  - [x] Create new team form
  - [x] Team dashboard (collaboration hub)
    - [x] Team stats (members, shifts, hours, resources)
    - [x] Team members list with role badges
    - [x] Recent activity feed
    - [x] Team resources section
    - [x] Upcoming team shifts
  - [x] Edit team form
  - [x] Team members management
    - [x] Add members from organization
    - [x] Change member roles
    - [x] Remove members
    - [x] Member stats display
  - [x] Team scoping for shifts, resources, and content

### Phase 7: Real-time Features (Complete)
- [x] Live activity feeds
  - [x] ActivityFeed component with real-time updates
  - [x] ActivityFeedCompact for sidebars
  - [x] Activity types for all major events (donations, shifts, cases, etc.)
  - [x] Mock activities for development
- [x] Real-time notifications
  - [x] NotificationCenter component in TopBar
  - [x] useNotifications hook for state management
  - [x] Mark as read / mark all read functionality
  - [x] Click-through navigation to related items
- [x] Shift status updates
  - [x] useRealtimeSubscription hook (Supabase realtime)
  - [x] useRealtimeShifts hook with toast notifications
  - [x] LiveIndicator component showing connection status
  - [x] useLiveStats hook for dashboard statistics
- [x] Real-time hooks package (@acts29/hooks)
  - [x] useActivityFeed with activity converters
  - [x] useRealtimeShifts for volunteer shift tracking
  - [x] useLiveStats for dashboard metrics

## Next Priority: Phase 6 - Authentication & Security

This phase will connect the real Supabase backend and enable the real-time features built in Phase 7.

### Phase 6: Authentication & Security
- [ ] Supabase project setup and configuration
  - [ ] Create Supabase project
  - [ ] Configure environment variables
  - [ ] Set up database schema migrations
- [ ] Authentication integration
  - [ ] Email/password authentication
  - [ ] OAuth providers (Google, optional)
  - [ ] Password reset flow
  - [ ] Email verification
- [ ] Role-based access control
  - [ ] Implement RLS (Row Level Security) policies
  - [ ] Role-based route protection middleware
  - [ ] Permission checks in UI components
- [ ] Session management
  - [ ] Server-side session handling
  - [ ] Token refresh logic
  - [ ] Secure cookie configuration
- [ ] Convert mock data to live database
  - [ ] Run database migrations
  - [ ] Seed initial data for Springfield partners
  - [ ] Connect existing pages to real data

## Planned Features

### Phase 8: Mobile Optimization
- [ ] Progressive Web App (PWA)
  - [ ] Service worker configuration
  - [ ] App manifest with dark mode support
  - [ ] Install prompts
- [ ] Mobile-optimized layouts
  - [ ] Responsive admin navigation
  - [ ] Touch-friendly data tables
  - [ ] Mobile form improvements
  - [ ] Mobile-friendly theme toggle
- [ ] Offline support for key features
  - [ ] Cached resource directory
  - [ ] Offline prayer submissions
  - [ ] Background sync
  - [ ] Offline theme persistence

### Phase 9: Reporting & Analytics
- [ ] Donation reports
  - [ ] Monthly/yearly summaries
  - [ ] Donor retention metrics
  - [ ] Export to CSV/PDF
- [ ] Volunteer hour tracking
  - [ ] Individual volunteer reports
  - [ ] Team comparisons
  - [ ] Trend analysis
- [ ] Case outcome metrics
  - [ ] Success rates by need type
  - [ ] Time-to-resolution tracking
  - [ ] Partner effectiveness
- [ ] Ministry impact dashboard
  - [ ] Visual charts with Recharts
  - [ ] Year-over-year comparisons
  - [ ] Goal tracking

### Phase 10: Integrations (Complete)
- [x] Email marketing integration
  - [x] Newsletter signup
  - [x] Automated donor updates
  - [x] Event reminders
- [x] SMS notifications
  - [x] Shift reminders
  - [x] Emergency alerts
  - [x] Prayer request updates
- [x] Calendar sync (Google, Apple) - Complete

### Phase 11: Automation Engine (Complete)
- [x] Zapier-style workflow automation
  - [x] Visual automation builder
  - [x] 20+ trigger types (donations, volunteers, events, cases, prayer, scheduled)
  - [x] 10+ action types (email, SMS, Slack, webhooks, tasks, lists)
  - [x] Template variable support ({{donorName}}, etc.)
  - [x] Condition-based branching
  - [x] Delay steps for drip campaigns
- [x] Pre-built automation templates (15+ templates)
  - [x] Welcome new donor
  - [x] Volunteer shift reminders
  - [x] Prayer request notifications
  - [x] Urgent case alerts
  - [x] Recurring donation follow-ups
  - [x] Event registration confirmations
  - [x] Weekly/monthly scheduled emails
- [x] Automation management UI
  - [x] Automations list with toggle on/off
  - [x] Visual workflow builder
  - [x] Template library browser
  - [x] Run history with step-by-step logs
- [x] Automation service package (@acts29/automation-service)

### Phase 12: Dark Mode & Theming (Complete)
- [x] Theme system implementation
  - [x] ThemeProvider with React Context
  - [x] Light/Dark/System preference options
  - [x] LocalStorage persistence
  - [x] System preference detection via matchMedia
  - [x] Flash prevention script
- [x] ThemeToggle component
  - [x] Icon variant (sun/moon button)
  - [x] Dropdown variant (menu with options)
  - [x] Switch variant (toggle buttons)
- [x] Public website dark mode
  - [x] Header with theme toggle
  - [x] Footer styling
  - [x] All page components
- [x] Admin portal dark mode
  - [x] AdminLayout with dark backgrounds
  - [x] Sidebar navigation
  - [x] TopBar with theme toggle slot
  - [x] PageHeader component (new)
  - [x] All admin-ui components updated
    - [x] StatCard, DataTable, EmptyState
    - [x] Badge, Pagination
    - [x] Input, Select, Textarea
    - [x] Alert, ConfirmDialog
- [x] Tailwind configuration
  - [x] `darkMode: 'class'` enabled
  - [x] Consistent dark palette

### Phase 13: Modular Features & Shelter Management
Organizations have different needs - some run shelters, others focus on food distribution, some do case management. This phase introduces a modular feature system allowing organizations to enable only the features they need.

#### Feature Toggle System
- [ ] Organization feature flags in database
  - [ ] `enabled_features` JSONB column on organizations table
  - [ ] Feature definitions with metadata (icon, description, dependencies)
- [ ] Feature settings UI
  - [ ] Settings > Features page for org admins
  - [ ] Toggle switches for each module
  - [ ] Feature descriptions and use cases
  - [ ] Dependency warnings (e.g., "Shelter requires Case Management")
- [ ] Conditional navigation
  - [ ] Sidebar shows only enabled features
  - [ ] Dashboard stats scoped to enabled modules
  - [ ] Automation triggers/actions filtered by enabled features
- [ ] Feature context hook
  - [ ] `useFeatures()` hook for checking enabled status
  - [ ] `<FeatureGate>` component for conditional rendering

#### Core Features (Always Enabled)
- Donations & Tax Receipts
- Volunteers & Shift Scheduling
- Events/Calendar
- Teams & Collaboration
- Prayer Requests
- Teaching Content

#### Optional Modules

##### Case Management (existing, now optional)
- [ ] Make case management toggleable
- [ ] Hide sidebar link when disabled
- [ ] Filter dashboard stats
- [ ] Client intake and needs tracking
- [ ] Referral management
- [ ] Case notes and progress

##### Shelter Management (new)
- [ ] Shelter database schema
  - [ ] `shelters` table (capacity, type, location)
  - [ ] `beds` table (bed number, status, shelter_id)
  - [ ] `stays` table (guest, bed, check_in, check_out, notes)
  - [ ] `shelter_guests` table (name, demographics, needs)
- [ ] Shelter admin pages
  - [ ] Shelter list and configuration
  - [ ] Bed management grid view
  - [ ] Check-in/check-out flow
  - [ ] Current occupancy dashboard
  - [ ] Stay history and reports
- [ ] Real-time bed availability
  - [ ] Live occupancy indicators
  - [ ] Bed status updates (available, occupied, reserved, maintenance)
- [ ] Guest management
  - [ ] Guest profiles (linked to cases if enabled)
  - [ ] Stay history per guest
  - [ ] Banned guest tracking
- [ ] Shelter automations
  - [ ] Check-in confirmation SMS
  - [ ] Capacity alerts
  - [ ] Nightly report emails

##### Resource Directory (existing, now optional)
- [ ] Make resource directory toggleable
- [ ] Community resource listings
- [ ] Category filtering
- [ ] Public resource page visibility

##### Food Pantry Module (future)
- [ ] Inventory tracking
- [ ] Distribution records
- [ ] Client visits and limits
- [ ] Donation intake

##### Medical Outreach Module (future)
- [ ] Health screening records
- [ ] Medication tracking
- [ ] Referral to providers
- [ ] HIPAA-compliant notes

##### Transportation Module (future)
- [ ] Ride requests
- [ ] Vehicle/driver management
- [ ] Route scheduling
- [ ] Mileage tracking

### Phase 14: Calendar Sync & Enhanced Notifications

This phase focuses on two interconnected features: bidirectional calendar sync with external providers and a comprehensive notification system across email and SMS channels.

#### Phase 14A: Notification Preferences & Infrastructure (Foundation) ✅ COMPLETE
User-controlled notification preferences and unified notification queue.

- [x] Notification preferences database schema
  - [x] `NotificationSettings` type (user_id, channels, quiet_hours, digest preferences)
  - [x] `NotificationPreference` type (user_id, notification_type, channel toggles)
  - [x] `QueuedNotification` type (id, user_id, type, channels, payload, status, scheduled_for)
  - [x] `NotificationLog` type (id, channel, status, timestamps, response_data)
  - [x] 27 notification types across 7 categories
  - [x] Mock data for notification settings and preferences
- [x] Admin Settings > Notifications page enhancements
  - [x] Global channel toggles (Email, SMS, Push)
  - [x] Per-notification-type toggles organized by category
  - [x] Channel preferences (email, SMS, push, in-app) per notification type
  - [x] Quiet hours configuration with start/end times
  - [x] Digest frequency options (immediate, daily, weekly, none)
  - [x] SMS phone number configuration
  - [x] Collapsible category sections with quick toggle buttons
- [x] User notification preferences (public portal)
  - [x] /account/notifications page for donors/volunteers
  - [x] SMS opt-in with TCPA compliance language
  - [x] Quiet hours configuration for SMS/push
  - [x] Per-notification preferences for external user types
  - [x] Unsubscribe from all option
- [x] Notification queue service (@acts29/notification-service)
  - [x] Multi-channel notification delivery (email, SMS, push, in-app)
  - [x] User preference caching with TTL
  - [x] Channel availability checking
  - [x] Quiet hours enforcement
  - [x] Queue processing with retry logic (3 attempts)
  - [x] Batch sending for bulk notifications
  - [x] Digest management (queue and send)
  - [x] Built-in notification templates
  - [x] Queue statistics and logging

#### Phase 14B: Email Notifications Enhancement (Near Complete)
Expand email templates and automation triggers.

- [x] New email templates
  - [x] Shift reminder (24h, 2h before) - ShiftReminderEmail
  - [x] Event registration confirmation - EventRegistrationEmail
  - [x] Event reminder (24h, 1h before) - EventReminderEmail
  - [x] Weekly/monthly volunteer digest - VolunteerDigestEmail
  - [x] Case status update - CaseUpdateEmail
  - [x] Prayer request received/update - PrayerReceivedEmail, PrayerUpdateEmail
  - [ ] Shelter check-in confirmation
- [x] Email automation integration
  - [x] Connect automation-service to email-service (EmailExecutor)
  - [x] Template variable expansion ({{name}}, {{date}}, etc.)
  - [x] Trigger data to template props mapping
  - [x] Email service adapter interface
  - [ ] Scheduled email campaigns
  - [ ] A/B testing support (future)
- [x] Email analytics
  - [x] Email event types (sent, delivered, opened, clicked, bounced, etc.)
  - [x] Email record tracking with full event history
  - [x] Analytics summary calculation (totals, rates, by template, by day)
  - [x] Template performance metrics (open rate, click rate, device breakdown)
  - [x] Recipient engagement scoring (highly_engaged to inactive)
  - [x] Resend webhook event processing
  - [x] Dashboard analytics generation
  - [ ] Webhook API endpoint for Resend events

#### Phase 14C: SMS Notifications Enhancement
Expand Twilio integration with two-way messaging.

- [ ] SMS opt-in/opt-out management
  - [ ] SMS consent tracking in database
  - [ ] STOP/START keyword handling
  - [ ] Opt-in confirmation flow
  - [ ] Compliance with TCPA regulations
- [ ] New SMS notification types
  - [ ] Volunteer shift reminders (configurable timing)
  - [ ] Urgent case alerts to assigned workers
  - [ ] Event day-of reminders
  - [ ] Shelter capacity alerts
  - [ ] Weather emergency broadcasts
- [ ] Two-way SMS (Twilio webhooks)
  - [ ] Incoming message webhook endpoint
  - [ ] Keyword response handling (YES, NO, INFO)
  - [ ] Shift confirmation via SMS reply
  - [ ] Case note additions via SMS
- [ ] SMS message threading
  - [ ] Conversation history per user
  - [ ] Admin inbox for SMS conversations

#### Phase 14D: Calendar Sync - Outbound (iCal Feeds) ✅ COMPLETE
Public and private calendar subscription feeds.

- [x] iCal feed API endpoints
  - [x] `/api/calendar/feed.ics` - Public events feed (existing)
  - [x] `/api/calendar/feed/[token]` - Token-based authenticated feeds
    - [x] Personal calendar feeds (user's events + shifts)
    - [x] Team calendar feeds
    - [x] Organization calendar feeds
  - [x] Feed type configuration (events, shifts, private events)
- [x] calendar-service package enhancements
  - [x] `generateShiftVEvent()` - Volunteer shift calendar events
  - [x] `generateShiftCalendar()` - Shifts-only calendar feeds
  - [x] `generateCombinedCalendar()` - Combined events + shifts
  - [x] `generateCustomSubscriptionUrls()` - Multi-provider URLs
- [x] Database types for calendar feeds
  - [x] `CalendarFeedType` (personal, team, organization, public)
  - [x] `CalendarFeedToken` - Token configuration with include flags
  - [x] `CalendarFeedSettings` - User preferences
  - [x] `ConnectedCalendar` - For future inbound sync
- [x] Calendar subscription management UI
  - [x] Settings > Calendar page with full management
  - [x] Public events subscription section
  - [x] Personal feeds list with create/delete/regenerate
  - [x] Copy subscription URLs with show/hide toggle
  - [x] One-click subscribe buttons (Google, Apple, Outlook)
  - [x] QR codes for mobile subscription
  - [x] Create Feed modal with type and content configuration
  - [x] Instructions for each calendar platform

#### Phase 14E: Calendar Sync - Inbound (OAuth Integration)
Bidirectional sync with external calendar providers.

- [ ] Google Calendar OAuth integration
  - [ ] OAuth 2.0 consent flow
  - [ ] Token storage and refresh
  - [ ] Read events from user's calendar
  - [ ] Write volunteer shifts to user's calendar
  - [ ] Conflict detection (shift overlaps with user events)
- [ ] Microsoft Outlook/365 integration
  - [ ] Microsoft Graph API setup
  - [ ] OAuth consent flow
  - [ ] Calendar read/write operations
- [ ] Apple Calendar (CalDAV)
  - [ ] CalDAV client implementation
  - [ ] iCloud calendar support
- [ ] Sync settings per user
  - [ ] Connected calendars list
  - [ ] Sync direction (one-way, two-way)
  - [ ] Calendar selection for write-back
  - [ ] Sync frequency options

#### Phase 14F: Unified Notification Center
Central hub for all notification management.

- [ ] In-app notification center
  - [ ] Real-time notifications (WebSocket/SSE)
  - [ ] Notification drawer in admin TopBar (enhanced)
  - [ ] Notification history page
  - [ ] Mark read/unread, archive, delete
- [ ] Notification preferences dashboard
  - [ ] Visual overview of all notification settings
  - [ ] Quick toggles per category
  - [ ] Test notification button
- [ ] Admin notification management
  - [ ] Broadcast messages to all users/segments
  - [ ] Scheduled announcements
  - [ ] Notification analytics (sent, opened, clicked)

## Technical Debt & Improvements

### High Priority
- [ ] Convert mock data to Supabase database
- [x] Fix payment-service TypeScript errors
- [x] Add email-service react-dom/server dependency

### Medium Priority
- [ ] Add comprehensive test suite
  - [ ] Unit tests for hooks
  - [ ] Component tests for UI
  - [ ] Integration tests for pages
- [ ] Performance optimization
  - [ ] Image optimization
  - [ ] Code splitting analysis
  - [ ] Bundle size reduction

### Low Priority
- [ ] Accessibility audit and improvements
- [ ] API documentation
- [ ] Developer onboarding guide

## Architecture

```
Acts29Ministry/
├── apps/
│   └── web/                    # Next.js application
│       └── app/
│           ├── (public)/       # Public-facing pages
│           ├── admin/          # Admin portal
│           └── api/            # API routes
├── packages/
│   ├── ui/                     # Shared UI components (Button, Card, etc.)
│   ├── admin-ui/               # Admin components (DataTable, ActivityFeed, etc.)
│   ├── database/               # Database types, mock data, Supabase client
│   ├── hooks/                  # React hooks (realtime, auth, forms, etc.)
│   ├── automation-service/     # Zapier-style workflow automation engine
│   ├── calendar-service/       # iCal generation and calendar subscriptions
│   ├── email-service/          # Email templates and Resend integration
│   ├── notification-service/   # Unified notification orchestration
│   ├── payment-service/        # Payment provider abstraction (HelloPayments, Stripe)
│   ├── pdf-service/            # PDF generation for receipts
│   ├── sms-service/            # SMS notifications via Twilio
│   └── validators/             # Zod validation schemas
└── supabase/                   # Database migrations and config
```

## User Roles

| Role | Description | Access |
|------|-------------|--------|
| super_admin | System administrator | Full access |
| org_admin | Organization administrator | Full org access |
| staff | Ministry staff | Operational access |
| volunteer | Active volunteer | Limited portal access |
| donor | Financial supporter | Donation history |
| guest | Public visitor | Public pages only |

## Contributing

This project is maintained by Acts 29 Church for the Unsheltered ministry. For questions or contributions, please contact the development team.
