-- Acts29 Ministry - Admin Portal Tables
-- This migration adds tables for events, tax receipts, invitations, and payment settings

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE event_status AS ENUM ('draft', 'upcoming', 'in_progress', 'completed', 'cancelled');
CREATE TYPE registration_status AS ENUM ('registered', 'confirmed', 'waitlist', 'cancelled', 'attended');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');
CREATE TYPE receipt_status AS ENUM ('draft', 'generated', 'sent', 'failed');

-- ===========================================
-- EVENTS
-- ===========================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    max_attendees INTEGER,
    registration_deadline TIMESTAMPTZ,
    is_public BOOLEAN DEFAULT true,
    requires_registration BOOLEAN DEFAULT true,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    image_url TEXT,
    status event_status NOT NULL DEFAULT 'draft',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_organization ON events(organization_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_public ON events(is_public) WHERE is_public = true;

-- ===========================================
-- EVENT REGISTRATIONS
-- ===========================================

CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status registration_status NOT NULL DEFAULT 'registered',
    party_size INTEGER DEFAULT 1,
    notes TEXT,
    check_in_time TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_email ON event_registrations(email);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);

-- ===========================================
-- TAX RECEIPTS
-- ===========================================

CREATE TABLE tax_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
    donor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    receipt_number VARCHAR(50) NOT NULL,
    receipt_type VARCHAR(20) NOT NULL DEFAULT 'individual', -- 'individual' or 'annual'
    tax_year INTEGER NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    donor_name VARCHAR(200) NOT NULL,
    donor_email VARCHAR(255),
    donor_address TEXT,
    status receipt_status NOT NULL DEFAULT 'draft',
    pdf_url TEXT,
    sent_at TIMESTAMPTZ,
    generated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, receipt_number)
);

CREATE INDEX idx_tax_receipts_organization ON tax_receipts(organization_id);
CREATE INDEX idx_tax_receipts_donation ON tax_receipts(donation_id);
CREATE INDEX idx_tax_receipts_donor ON tax_receipts(donor_id);
CREATE INDEX idx_tax_receipts_year ON tax_receipts(tax_year);
CREATE INDEX idx_tax_receipts_status ON tax_receipts(status);

-- ===========================================
-- USER INVITATIONS
-- ===========================================

CREATE TABLE user_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role user_role NOT NULL DEFAULT 'volunteer',
    token VARCHAR(100) UNIQUE NOT NULL,
    message TEXT,
    status invitation_status NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_invitations_organization ON user_invitations(organization_id);
CREATE INDEX idx_user_invitations_email ON user_invitations(email);
CREATE INDEX idx_user_invitations_token ON user_invitations(token);
CREATE INDEX idx_user_invitations_status ON user_invitations(status);

-- ===========================================
-- ORGANIZATION SETTINGS
-- ===========================================

CREATE TABLE organization_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

    -- Tax Information
    ein VARCHAR(20),
    tax_exempt_status VARCHAR(20) DEFAULT 'pending',
    tax_deductibility_statement TEXT,

    -- Payment Settings
    payment_provider VARCHAR(50),
    payment_api_key_encrypted TEXT,
    payment_webhook_secret_encrypted TEXT,
    payment_test_mode BOOLEAN DEFAULT true,
    default_fee_coverage VARCHAR(20) DEFAULT 'ask', -- 'ask', 'always', 'never'
    fee_percentage DECIMAL(5, 2) DEFAULT 2.9,
    fee_fixed_amount INTEGER DEFAULT 30, -- in cents

    -- Notification Settings
    notification_preferences JSONB DEFAULT '{}',

    -- Email Settings
    email_from_name VARCHAR(100),
    email_from_address VARCHAR(255),
    email_reply_to VARCHAR(255),

    -- Security Settings
    require_2fa BOOLEAN DEFAULT false,
    session_timeout_minutes INTEGER DEFAULT 60,
    password_min_length INTEGER DEFAULT 8,
    max_login_attempts INTEGER DEFAULT 5,
    lockout_duration_minutes INTEGER DEFAULT 30,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organization_settings_organization ON organization_settings(organization_id);

-- ===========================================
-- EMAIL TEMPLATES
-- ===========================================

CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    template_key VARCHAR(50) NOT NULL, -- 'donation_receipt', 'annual_statement', etc.
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, template_key)
);

CREATE INDEX idx_email_templates_organization ON email_templates(organization_id);
CREATE INDEX idx_email_templates_key ON email_templates(template_key);

-- ===========================================
-- RECURRING DONATIONS
-- ===========================================

CREATE TABLE recurring_donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    frequency VARCHAR(20) NOT NULL, -- 'weekly', 'monthly', 'quarterly', 'yearly'
    payment_provider VARCHAR(50) NOT NULL,
    external_subscription_id VARCHAR(255),
    payment_method_last4 VARCHAR(4),
    payment_method_brand VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'paused', 'cancelled', 'failed'
    next_payment_date DATE,
    last_payment_date DATE,
    failed_attempts INTEGER DEFAULT 0,
    cancelled_at TIMESTAMPTZ,
    cancel_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recurring_donations_organization ON recurring_donations(organization_id);
CREATE INDEX idx_recurring_donations_donor ON recurring_donations(donor_id);
CREATE INDEX idx_recurring_donations_status ON recurring_donations(status);
CREATE INDEX idx_recurring_donations_next_payment ON recurring_donations(next_payment_date);

-- ===========================================
-- AUDIT LOG
-- ===========================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_organization ON audit_log(organization_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- ===========================================
-- DATA EXPORTS
-- ===========================================

CREATE TABLE data_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    export_type VARCHAR(50) NOT NULL, -- 'donations', 'donors', 'volunteers', 'cases', 'events', 'full_backup'
    format VARCHAR(10) NOT NULL DEFAULT 'csv', -- 'csv', 'xlsx', 'json'
    date_range_start DATE,
    date_range_end DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    file_url TEXT,
    file_size INTEGER,
    error_message TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_data_exports_organization ON data_exports(organization_id);
CREATE INDEX idx_data_exports_requested_by ON data_exports(requested_by);
CREATE INDEX idx_data_exports_status ON data_exports(status);

-- ===========================================
-- APPLY UPDATED_AT TRIGGERS
-- ===========================================

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_receipts_updated_at BEFORE UPDATE ON tax_receipts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_invitations_updated_at BEFORE UPDATE ON user_invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organization_settings_updated_at BEFORE UPDATE ON organization_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recurring_donations_updated_at BEFORE UPDATE ON recurring_donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- ADD FEE COVERAGE COLUMNS TO DONATIONS
-- ===========================================

ALTER TABLE donations
ADD COLUMN IF NOT EXISTS cover_fees BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fee_amount DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS external_payment_id VARCHAR(255);
