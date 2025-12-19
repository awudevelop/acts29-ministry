-- Acts29 Ministry - Row Level Security for Admin Portal Tables
-- This migration adds RLS policies for the new admin portal tables

-- ===========================================
-- ENABLE RLS ON ALL NEW TABLES
-- ===========================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Get user's organization ID
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT organization_id
        FROM profiles
        WHERE user_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has admin role
CREATE OR REPLACE FUNCTION is_org_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM profiles
        WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'org_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has staff role or higher
CREATE OR REPLACE FUNCTION is_staff_or_higher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM profiles
        WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'org_admin', 'staff')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- EVENTS POLICIES
-- ===========================================

-- Public events are visible to all
CREATE POLICY events_select_public ON events
    FOR SELECT
    USING (is_public = true AND status != 'draft');

-- Org members can see all events in their org
CREATE POLICY events_select_org ON events
    FOR SELECT
    USING (organization_id = get_user_organization_id());

-- Staff and admins can create events
CREATE POLICY events_insert ON events
    FOR INSERT
    WITH CHECK (
        organization_id = get_user_organization_id()
        AND is_staff_or_higher()
    );

-- Staff and admins can update events in their org
CREATE POLICY events_update ON events
    FOR UPDATE
    USING (
        organization_id = get_user_organization_id()
        AND is_staff_or_higher()
    );

-- Only admins can delete events
CREATE POLICY events_delete ON events
    FOR DELETE
    USING (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

-- ===========================================
-- EVENT REGISTRATIONS POLICIES
-- ===========================================

-- Users can see their own registrations
CREATE POLICY registrations_select_own ON event_registrations
    FOR SELECT
    USING (
        user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Staff can see all registrations for their org's events
CREATE POLICY registrations_select_org ON event_registrations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM events e
            WHERE e.id = event_registrations.event_id
            AND e.organization_id = get_user_organization_id()
        )
        AND is_staff_or_higher()
    );

-- Anyone can register for public events
CREATE POLICY registrations_insert_public ON event_registrations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM events e
            WHERE e.id = event_id
            AND e.is_public = true
            AND e.requires_registration = true
        )
    );

-- Users can update their own registrations
CREATE POLICY registrations_update_own ON event_registrations
    FOR UPDATE
    USING (
        user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Staff can update registrations for their org
CREATE POLICY registrations_update_org ON event_registrations
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM events e
            WHERE e.id = event_registrations.event_id
            AND e.organization_id = get_user_organization_id()
        )
        AND is_staff_or_higher()
    );

-- ===========================================
-- TAX RECEIPTS POLICIES
-- ===========================================

-- Donors can see their own receipts
CREATE POLICY receipts_select_own ON tax_receipts
    FOR SELECT
    USING (
        donor_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Staff can see all receipts in their org
CREATE POLICY receipts_select_org ON tax_receipts
    FOR SELECT
    USING (
        organization_id = get_user_organization_id()
        AND is_staff_or_higher()
    );

-- Only staff can create receipts
CREATE POLICY receipts_insert ON tax_receipts
    FOR INSERT
    WITH CHECK (
        organization_id = get_user_organization_id()
        AND is_staff_or_higher()
    );

-- Staff can update receipts
CREATE POLICY receipts_update ON tax_receipts
    FOR UPDATE
    USING (
        organization_id = get_user_organization_id()
        AND is_staff_or_higher()
    );

-- Only admins can delete receipts
CREATE POLICY receipts_delete ON tax_receipts
    FOR DELETE
    USING (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

-- ===========================================
-- USER INVITATIONS POLICIES
-- ===========================================

-- Admins can see invitations for their org
CREATE POLICY invitations_select ON user_invitations
    FOR SELECT
    USING (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

-- Only admins can create invitations
CREATE POLICY invitations_insert ON user_invitations
    FOR INSERT
    WITH CHECK (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

-- Admins can update invitations
CREATE POLICY invitations_update ON user_invitations
    FOR UPDATE
    USING (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

-- Admins can delete invitations
CREATE POLICY invitations_delete ON user_invitations
    FOR DELETE
    USING (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

-- ===========================================
-- ORGANIZATION SETTINGS POLICIES
-- ===========================================

-- Only admins can view settings
CREATE POLICY settings_select ON organization_settings
    FOR SELECT
    USING (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

-- Only admins can update settings
CREATE POLICY settings_update ON organization_settings
    FOR UPDATE
    USING (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

-- ===========================================
-- EMAIL TEMPLATES POLICIES
-- ===========================================

-- Admins can manage email templates
CREATE POLICY templates_select ON email_templates
    FOR SELECT
    USING (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

CREATE POLICY templates_insert ON email_templates
    FOR INSERT
    WITH CHECK (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

CREATE POLICY templates_update ON email_templates
    FOR UPDATE
    USING (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

CREATE POLICY templates_delete ON email_templates
    FOR DELETE
    USING (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

-- ===========================================
-- RECURRING DONATIONS POLICIES
-- ===========================================

-- Donors can see their own recurring donations
CREATE POLICY recurring_select_own ON recurring_donations
    FOR SELECT
    USING (
        donor_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Staff can see all recurring donations in their org
CREATE POLICY recurring_select_org ON recurring_donations
    FOR SELECT
    USING (
        organization_id = get_user_organization_id()
        AND is_staff_or_higher()
    );

-- Donors can update their own recurring donations (cancel, etc)
CREATE POLICY recurring_update_own ON recurring_donations
    FOR UPDATE
    USING (
        donor_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Staff can update recurring donations
CREATE POLICY recurring_update_org ON recurring_donations
    FOR UPDATE
    USING (
        organization_id = get_user_organization_id()
        AND is_staff_or_higher()
    );

-- ===========================================
-- AUDIT LOG POLICIES
-- ===========================================

-- Only admins can view audit logs
CREATE POLICY audit_select ON audit_log
    FOR SELECT
    USING (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

-- System inserts audit logs (no user policy needed for insert)
-- In practice, audit log inserts happen via service role or triggers

-- ===========================================
-- DATA EXPORTS POLICIES
-- ===========================================

-- Users can see their own exports
CREATE POLICY exports_select_own ON data_exports
    FOR SELECT
    USING (
        requested_by = (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Admins can see all exports in their org
CREATE POLICY exports_select_org ON data_exports
    FOR SELECT
    USING (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );

-- Only admins can create exports
CREATE POLICY exports_insert ON data_exports
    FOR INSERT
    WITH CHECK (
        organization_id = get_user_organization_id()
        AND is_org_admin()
    );
