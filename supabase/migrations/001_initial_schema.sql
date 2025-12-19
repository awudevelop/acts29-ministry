-- Acts29 Ministry - Initial Database Schema
-- This migration creates the core tables with Row Level Security (RLS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geolocation features
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE user_role AS ENUM ('super_admin', 'org_admin', 'staff', 'volunteer', 'donor', 'guest');
CREATE TYPE resource_type AS ENUM ('shelter', 'food_bank', 'clinic', 'clothing', 'employment', 'counseling', 'church', 'other');
CREATE TYPE case_status AS ENUM ('active', 'pending', 'closed', 'referred');
CREATE TYPE donation_type AS ENUM ('monetary', 'goods', 'time');
CREATE TYPE donation_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE content_type AS ENUM ('sermon', 'devotional', 'testimony', 'article', 'video', 'audio');
CREATE TYPE shift_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- ===========================================
-- ORGANIZATIONS
-- ===========================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_active ON organizations(is_active) WHERE is_active = true;

-- ===========================================
-- USER PROFILES
-- ===========================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    role user_role NOT NULL DEFAULT 'guest',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_organization ON profiles(organization_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ===========================================
-- RESOURCES (Shelters, Food Banks, etc.)
-- ===========================================

CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    type resource_type NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    hours JSONB,
    capacity INTEGER,
    current_availability INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_resources_organization ON resources(organization_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_location ON resources USING GIST(location);
CREATE INDEX idx_resources_active ON resources(is_active) WHERE is_active = true;

-- ===========================================
-- CASES (Service Recipients)
-- ===========================================

CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    status case_status NOT NULL DEFAULT 'pending',
    needs TEXT[] DEFAULT '{}',
    notes TEXT,
    is_confidential BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cases_organization ON cases(organization_id);
CREATE INDEX idx_cases_assigned_to ON cases(assigned_to);
CREATE INDEX idx_cases_status ON cases(status);

-- ===========================================
-- CASE NOTES
-- ===========================================

CREATE TABLE case_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_case_notes_case ON case_notes(case_id);
CREATE INDEX idx_case_notes_author ON case_notes(author_id);

-- ===========================================
-- VOLUNTEER PROFILES
-- ===========================================

CREATE TABLE volunteer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skills TEXT[] DEFAULT '{}',
    availability JSONB,
    has_vehicle BOOLEAN DEFAULT false,
    can_drive_others BOOLEAN DEFAULT false,
    languages TEXT[] DEFAULT '{}',
    background_check_completed BOOLEAN DEFAULT false,
    background_check_date DATE,
    emergency_contact JSONB,
    total_hours DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_volunteer_profiles_profile ON volunteer_profiles(profile_id);

-- ===========================================
-- VOLUNTEER SHIFTS
-- ===========================================

CREATE TABLE volunteer_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
    role VARCHAR(100) NOT NULL,
    description TEXT,
    required_skills TEXT[] DEFAULT '{}',
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    max_volunteers INTEGER DEFAULT 1,
    is_recurring BOOLEAN DEFAULT false,
    recurring_pattern JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_volunteer_shifts_organization ON volunteer_shifts(organization_id);
CREATE INDEX idx_volunteer_shifts_time ON volunteer_shifts(start_time, end_time);

-- ===========================================
-- SHIFT SIGNUPS
-- ===========================================

CREATE TABLE shift_signups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID NOT NULL REFERENCES volunteer_shifts(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status shift_status NOT NULL DEFAULT 'scheduled',
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    hours_logged DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(shift_id, volunteer_id)
);

CREATE INDEX idx_shift_signups_shift ON shift_signups(shift_id);
CREATE INDEX idx_shift_signups_volunteer ON shift_signups(volunteer_id);
CREATE INDEX idx_shift_signups_status ON shift_signups(status);

-- ===========================================
-- DONATIONS
-- ===========================================

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    type donation_type NOT NULL,
    amount DECIMAL(12, 2),
    description TEXT,
    category VARCHAR(50),
    stripe_payment_intent_id VARCHAR(255),
    status donation_status NOT NULL DEFAULT 'pending',
    is_anonymous BOOLEAN DEFAULT false,
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency VARCHAR(20),
    receipt_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_donations_organization ON donations(organization_id);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created ON donations(created_at DESC);

-- ===========================================
-- CONTENT (Sermons, Devotionals, etc.)
-- ===========================================

CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    type content_type NOT NULL,
    description TEXT,
    body TEXT,
    media_url TEXT,
    thumbnail_url TEXT,
    tags TEXT[] DEFAULT '{}',
    scripture VARCHAR(200),
    speaker VARCHAR(100),
    duration INTEGER, -- in seconds
    view_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_organization ON content(organization_id);
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_published ON content(is_published, published_at DESC);
CREATE INDEX idx_content_tags ON content USING GIN(tags);

-- ===========================================
-- PRAYER REQUESTS
-- ===========================================

CREATE TABLE prayer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50),
    is_anonymous BOOLEAN DEFAULT false,
    is_answered BOOLEAN DEFAULT false,
    answered_at TIMESTAMPTZ,
    prayer_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prayer_requests_user ON prayer_requests(user_id);
CREATE INDEX idx_prayer_requests_organization ON prayer_requests(organization_id);
CREATE INDEX idx_prayer_requests_created ON prayer_requests(created_at DESC);

-- ===========================================
-- PRAYER COUNT TRACKING
-- ===========================================

CREATE TABLE prayer_counts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prayer_request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(prayer_request_id, user_id)
);

-- ===========================================
-- UPDATED_AT TRIGGER FUNCTION
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_profiles_updated_at BEFORE UPDATE ON volunteer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shift_signups_updated_at BEFORE UPDATE ON shift_signups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON prayer_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
