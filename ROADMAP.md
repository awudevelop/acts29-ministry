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

## In Progress

### Phase 6: Authentication & Security
- [ ] Supabase authentication integration
- [ ] Role-based access control implementation
- [ ] Protected routes
- [ ] Session management

## Planned Features

### Phase 7: Real-time Features
- [ ] Live activity feeds
- [ ] Real-time notifications
- [ ] Shift status updates

### Phase 8: Mobile Optimization
- [ ] Progressive Web App (PWA)
- [ ] Mobile-optimized layouts
- [ ] Offline support for key features

### Phase 9: Reporting & Analytics
- [ ] Donation reports
- [ ] Volunteer hour tracking
- [ ] Case outcome metrics
- [ ] Ministry impact dashboard

### Phase 10: Integrations
- [ ] Email marketing integration
- [ ] SMS notifications
- [ ] Calendar sync (Google, Apple)
- [ ] Payment processing for donations

## Technical Debt & Improvements

- [ ] Convert mock data to Supabase database
- [ ] Add comprehensive test suite
- [ ] Performance optimization
- [ ] Accessibility audit and improvements
- [ ] API documentation

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
│   ├── ui/                     # Shared UI components
│   ├── admin-ui/               # Admin-specific components
│   ├── database/               # Database types and mock data
│   └── email-service/          # Email templates and sending
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
