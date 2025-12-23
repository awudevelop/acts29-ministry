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
- Real-time statistics
- Recent activity feed
- Quick action buttons
- Ministry impact metrics

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

## Technical Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
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
- `Sidebar` - Admin navigation
- `TopBar` - Header with search and user menu
- `FormSection` - Form layout component
- `Input` - Form text inputs
- `Textarea` - Multi-line text inputs
- `Select` - Dropdown selects
- `Alert` - Notification banners
- `ConfirmDialog` - Confirmation modals
- `Calendar` - Date picker component

### @acts29/database
Database types and mock data:
- TypeScript type definitions
- Mock data for development
- Supabase client configuration

### @acts29/email-service (packages/email-service)
Email template and sending service:
- Tax receipt email templates
- Resend API integration
- HTML email generation

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

## API Endpoints

### /api/email/send-receipt
POST - Send tax receipt email
- Requires: donationId, recipientEmail
- Uses Resend API for delivery

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
