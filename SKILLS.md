# Acts 29 Ministry - Technical Skills & Capabilities

## Application Capabilities

### Public Website Features

#### Homepage
- Ministry overview with mission statement
- Featured statistics (meals served, families housed, etc.)
- Upcoming events preview
- Partner organization highlights

#### Calendar
- Interactive event calendar
- Event details and registration
- Volunteer opportunity listings
- Filter by event type and date

#### Prayer Requests
- Anonymous prayer request submission
- Privacy controls for requests
- Prayer wall display

#### Teaching Content
- Sermons with audio/video support
- Daily devotionals
- Testimonies and stories
- Scripture references and notes

#### Resources Directory
- Community resource listings
- Categories: shelters, food, medical, employment, etc.
- Map integration for locations
- Contact information and hours

### Admin Portal Features

#### Dashboard
- Real-time statistics with live updates
- Recent activity feed with notifications
- Quick action buttons
- Ministry impact metrics
- Live connection status indicator

#### Donations Management
- Record monetary and in-kind donations
- Donor tracking and history
- Receipt generation
- Year-end tax statements via email

#### Volunteer Management
- Volunteer profiles and contact info
- Shift scheduling and assignment
- Hours tracking
- Availability management
- Team-based shift assignments
- Real-time shift status updates
- Live indicator showing connection status

#### Calendar/Events Management
- Create and edit events
- Registration management
- Capacity tracking
- Waitlist handling
- Event communications

#### Case Management
- Client intake forms
- Needs assessment tracking
- Case worker assignment
- Progress notes
- Referral tracking

#### Teaching Content Management
- Create sermons, devotionals, testimonies
- Media uploads (audio/video URLs)
- Publishing workflow
- Author attribution
- Team-scoped content

#### Resources Management
- Add community resources
- Categorize by service type
- Location and contact details
- Operating hours
- Verification status
- Team ownership

#### Teams & Collaboration
- Create and manage teams
- Lead/Member role hierarchy
- Team dashboards with:
  - Member management
  - Activity feeds
  - Team-specific resources
  - Upcoming shifts
  - Performance metrics
- Scoped access to shifts, resources, and content

#### User Management
- User accounts and profiles
- Role assignment
- Organization membership
- Access control

## Modular Feature System

The platform supports optional modules that organizations can enable based on their specific needs. Not all ministries require all features - a food pantry may not need shelter management, while a shelter may not need case management.

### Core Features (Always Enabled)
- Donations & Tax Receipts
- Volunteers & Shift Scheduling
- Events/Calendar
- Teams & Collaboration
- Prayer Requests
- Teaching Content

### Optional Modules

#### Case Management
- Client intake and needs assessment
- Case worker assignment
- Progress notes and referrals
- Outcome tracking

#### Shelter Management
- Bed/room inventory and status
- Guest check-in/check-out
- Occupancy tracking and reports
- Stay history per guest
- Capacity alerts and notifications

#### Resource Directory
- Community resource listings
- Category filtering (shelter, food, medical, etc.)
- Public visibility controls

#### Food Pantry (planned)
- Inventory management
- Distribution tracking
- Client visit limits

#### Medical Outreach (planned)
- Health screening records
- Medication tracking
- Provider referrals

#### Transportation (planned)
- Ride scheduling
- Vehicle/driver management
- Route optimization

### Feature Configuration
- Settings > Features page for org admins
- Toggle switches with descriptions
- Dependency warnings between modules
- `useFeatures()` hook for conditional rendering
- `<FeatureGate>` component for access control

## Theme System

### Dark Mode Support
- Full dark/light mode throughout public website and admin portal
- Theme provider with React Context
- System preference detection via `matchMedia`
- LocalStorage persistence (`acts29-theme`)
- Flash prevention script in root layout
- Smooth color transitions

### Theme Toggle Component
- Icon variant (sun/moon button)
- Dropdown variant (Light/Dark/System menu)
- Switch variant (side-by-side buttons)
- Available in Header (public) and TopBar (admin)

### Dark Mode Color Palette
- Backgrounds: `gray-800`/`gray-900`/`gray-950`
- Text: `gray-100`/`gray-200`/`gray-300`
- Borders: `gray-700`/`gray-800`
- Primary colors use `/30` opacity variants
- All components include dark: variants

## Real-time Capabilities

### Live Activity Feeds
- Dashboard activity feed showing recent events across the ministry
- Compact feed variant for sidebars and team dashboards
- Automatic timestamp formatting ("5m ago", "2h ago")
- Visual indicators for activity types with icons and colors

### Notification System
- TopBar notification center with dropdown panel
- Unread count badge with animated indicator
- Mark as read / mark all read functionality
- Click-through navigation to related items
- Notification settings integration

### Live Data Updates
- Supabase Realtime subscription infrastructure
- Automatic reconnection handling
- Toast notifications for important changes
- Live connection status indicator
- Manual refresh capability

### Supported Real-time Events
- Donations: received, refunded
- Volunteers: check-in, check-out
- Shifts: scheduled, completed, cancelled
- Cases: created, updated, closed
- Events: created, registration
- Content: published
- Teams: member added
- Resources: updated

## Technical Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **Theming**: Light/Dark/System theme preferences
- **Components**: Custom UI libraries
  - `@acts29/ui` - Shared components
  - `@acts29/admin-ui` - Admin components

### Backend
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: Resend API

### Infrastructure
- **Monorepo**: pnpm workspaces
- **Build**: Turbo
- **Deployment**: Netlify
- **Version Control**: Git

## Component Libraries

### @acts29/ui
Core UI components for public and admin use:
- `Button` - Primary action buttons with variants
- `Card` - Content container component
- `Dialog` - Modal dialogs
- Additional base components

### @acts29/admin-ui
Admin-specific components:
- `DataTable` - Sortable, filterable tables
- `Pagination` - Table pagination
- `StatCard` - Metric display cards
- `Badge` - Status indicators
- `Breadcrumbs` - Navigation breadcrumbs
- `Sidebar` - Admin navigation with dark mode
- `TopBar` - Header with search, user menu, and theme toggle slot
- `PageHeader` - Page title and description
- `FormSection` - Form layout component
- `Input` - Form text inputs
- `Textarea` - Multi-line text inputs
- `Select` - Dropdown selects
- `Alert` - Notification banners
- `ConfirmDialog` - Confirmation modals
- `Calendar` - Date picker component
- `ActivityFeed` - Live activity feed display
- `ActivityFeedCompact` - Compact activity feed for sidebars
- `NotificationCenter` - TopBar notification dropdown
- `LiveIndicator` - Real-time connection status
- `LiveDot` - Compact connection indicator

### @acts29/database
Database types and mock data:
- TypeScript type definitions
- Mock data for development
- Supabase client configuration
- Activity types for real-time feeds
- Mock activities for development

### @acts29/hooks
React hooks for application logic:
- `useAuth` - Authentication state management
- `useForm` - Form state and validation
- `useToast` - Toast notification system
- `useTheme` - Theme state and toggle (light/dark/system)
- `useRealtimeSubscription` - Supabase realtime subscriptions
- `useActivityFeed` - Activity feed state with converters
- `useRealtimeShifts` - Live shift updates with notifications
- `useLiveStats` - Dashboard statistics with real-time updates
- `useNotifications` - Notification state management (re-exported from admin-ui)
- `useGeolocation` - Browser geolocation with distance calculation
- `useMediaQuery` - Responsive breakpoint detection
- `useIsMobile`, `useIsTablet`, `useIsDesktop` - Device detection

### @acts29/calendar-service (packages/calendar-service)
iCalendar generation and subscription service:
- RFC 5545 compliant iCal generation
- Full calendar feed generation
- Single event .ics file generation
- Subscription URL generation for multiple providers
- Google Calendar integration URLs
- Outlook/Office 365 integration URLs
- Apple Calendar (webcal://) support

### @acts29/email-service (packages/email-service)
Email template and sending service:
- Tax receipt email templates
- Newsletter templates
- Annual statement generation
- Resend API integration
- HTML email generation

### @acts29/sms-service (packages/sms-service)
SMS notification service:
- Twilio API integration
- Shift reminders
- Emergency alerts
- Prayer request updates
- Event reminders
- Case status updates
- Donation confirmations
- Bulk SMS support

### @acts29/automation-service (packages/automation-service)
Zapier-style workflow automation:
- 20+ trigger types (donations, volunteers, events, cases, prayer, scheduled)
- 10+ action types (email, SMS, Slack, webhooks, tasks, lists)
- Template variable support ({{donorName}}, etc.)
- Condition-based branching
- Delay steps for drip campaigns
- 15+ pre-built templates

## Data Models

### Organizations
Partner organizations in the Springfield area:
- Helping Hands of Springfield
- Inner City Mission
- Washington Street Mission
- Salvation Army Springfield
- St. John's Breadline
- Central Illinois Foodbank

### Profiles
User accounts with roles:
- super_admin, org_admin, staff, volunteer, donor, guest

### Resources
Community resources by type:
- shelter, food, medical, clothing, employment, counseling, legal, financial, housing

### Cases
Client case management:
- Status: active, pending, referred, closed
- Needs tracking: housing, food, medical, mental health, etc.

### Volunteer Shifts
Scheduling with:
- Status: scheduled, completed, cancelled, no_show
- Team assignments
- Resource assignments

### Donations
Financial tracking:
- Types: monetary, goods, time
- Tax-deductible flagging
- Receipt generation

### Content
Teaching materials:
- Types: sermon, devotional, testimony, article, video, audio
- Publishing workflow
- Team ownership

### Events
Ministry events:
- Status: upcoming, completed, cancelled
- Registration management
- Capacity tracking

### Teams
Collaboration groups:
- Lead/Member role hierarchy
- Color and icon customization
- Activity tracking
- Resource and shift scoping

### Activities
Real-time activity tracking:
- Types: donation_received, donation_refunded, volunteer_checked_in, volunteer_checked_out
- Types: shift_scheduled, shift_completed, shift_cancelled
- Types: case_created, case_updated, case_closed
- Types: event_created, event_registration
- Types: prayer_request, content_published, team_member_added, resource_updated
- Actor information (name, avatar)
- Metadata for navigation
- Read/unread status

## API Endpoints

### /api/email/send-receipt
POST - Send tax receipt email
- Requires: donationId, recipientEmail
- Uses Resend API for delivery

### /api/calendar/feed.ics
GET - iCalendar feed of all public events
- Returns text/calendar content type
- Auto-refreshes every hour
- Subscribable from any calendar app

### /api/calendar/event/[id]
GET - Download single event as .ics file
- Returns downloadable iCal file
- Only for public events

### /api/calendar/subscribe
GET - Calendar subscription URLs
- Returns URLs for Google Calendar, Outlook, Apple Calendar
- Includes webcal:// protocol link

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email
RESEND_API_KEY=

# Application
NEXT_PUBLIC_APP_URL=
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Type checking
pnpm typecheck

# Build for production
pnpm build

# Run tests
pnpm test
```

## File Structure Patterns

### Page Routes
```
apps/web/app/
├── (public)/           # Public pages (grouped route)
│   ├── page.tsx        # Homepage
│   ├── calendar/       # Public calendar
│   │   └── subscribe/  # Calendar subscription page
│   ├── prayer/         # Prayer requests
│   ├── teaching/       # Teaching content
│   ├── resources/      # Resource directory
│   └── about/          # About page
├── admin/              # Admin portal
│   ├── page.tsx        # Dashboard
│   ├── donations/      # Donation management
│   ├── volunteers/     # Volunteer management
│   ├── calendar/       # Event management
│   ├── cases/          # Case management
│   ├── teaching/       # Content management
│   ├── resources/      # Resource management
│   ├── teams/          # Team management
│   ├── users/          # User management
│   └── settings/       # Settings
└── api/                # API routes
```

### Component Patterns
- List pages: DataTable with filters, StatCards, bulk actions
- Detail pages: Info cards, tabs, related data sections
- Form pages: FormSection, Input/Select/Textarea, sidebar actions
- Dashboard pages: Stats, activity feeds, quick actions
