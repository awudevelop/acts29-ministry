-- Acts29 Ministry - Row Level Security Policies
-- This migration enables RLS and creates security policies

-- ===========================================
-- ENABLE RLS ON ALL TABLES
-- ===========================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_counts ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Get current user's profile
CREATE OR REPLACE FUNCTION get_current_profile()
RETURNS profiles AS $$
    SELECT * FROM profiles WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE user_id = auth.uid()
        AND role = 'super_admin'
    )
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user is org admin for a specific org
CREATE OR REPLACE FUNCTION is_org_admin(org_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE user_id = auth.uid()
        AND organization_id = org_id
        AND role IN ('super_admin', 'org_admin')
    )
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user is staff or above for a specific org
CREATE OR REPLACE FUNCTION is_org_staff(org_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE user_id = auth.uid()
        AND organization_id = org_id
        AND role IN ('super_admin', 'org_admin', 'staff')
    )
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user belongs to organization
CREATE OR REPLACE FUNCTION belongs_to_org(org_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE user_id = auth.uid()
        AND organization_id = org_id
    )
$$ LANGUAGE sql SECURITY DEFINER;

-- ===========================================
-- ORGANIZATIONS POLICIES
-- ===========================================

-- Anyone can view active organizations
CREATE POLICY "Organizations are viewable by everyone"
    ON organizations FOR SELECT
    USING (is_active = true);

-- Only super admins can create organizations
CREATE POLICY "Super admins can create organizations"
    ON organizations FOR INSERT
    WITH CHECK (is_super_admin());

-- Org admins and super admins can update their organization
CREATE POLICY "Org admins can update their organization"
    ON organizations FOR UPDATE
    USING (is_org_admin(id));

-- ===========================================
-- PROFILES POLICIES
-- ===========================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

-- Users in same org can view each other's profiles
CREATE POLICY "Org members can view each other"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.organization_id = profiles.organization_id
        )
    );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Org admins can update profiles in their org
CREATE POLICY "Org admins can update org profiles"
    ON profiles FOR UPDATE
    USING (is_org_admin(organization_id));

-- New users can create their profile
CREATE POLICY "Users can create their profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- RESOURCES POLICIES
-- ===========================================

-- Anyone can view active resources
CREATE POLICY "Active resources are public"
    ON resources FOR SELECT
    USING (is_active = true);

-- Org staff can view all resources in their org
CREATE POLICY "Org staff can view all org resources"
    ON resources FOR SELECT
    USING (is_org_staff(organization_id));

-- Org staff can create resources
CREATE POLICY "Org staff can create resources"
    ON resources FOR INSERT
    WITH CHECK (is_org_staff(organization_id));

-- Org staff can update resources
CREATE POLICY "Org staff can update resources"
    ON resources FOR UPDATE
    USING (is_org_staff(organization_id));

-- Org admins can delete resources
CREATE POLICY "Org admins can delete resources"
    ON resources FOR DELETE
    USING (is_org_admin(organization_id));

-- ===========================================
-- CASES POLICIES (Privacy-sensitive)
-- ===========================================

-- Only staff and above can view cases in their org
CREATE POLICY "Org staff can view cases"
    ON cases FOR SELECT
    USING (is_org_staff(organization_id));

-- Staff can view cases assigned to them
CREATE POLICY "Staff can view assigned cases"
    ON cases FOR SELECT
    USING (
        assigned_to IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Org staff can create cases
CREATE POLICY "Org staff can create cases"
    ON cases FOR INSERT
    WITH CHECK (is_org_staff(organization_id));

-- Assigned staff and org admins can update cases
CREATE POLICY "Assigned staff can update cases"
    ON cases FOR UPDATE
    USING (
        is_org_staff(organization_id) OR
        assigned_to IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- ===========================================
-- CASE NOTES POLICIES
-- ===========================================

-- Staff can view non-private notes in their org
CREATE POLICY "Staff can view case notes"
    ON case_notes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM cases c
            WHERE c.id = case_notes.case_id
            AND is_org_staff(c.organization_id)
        )
        AND (is_private = false OR author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

-- Staff can create notes
CREATE POLICY "Staff can create case notes"
    ON case_notes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cases c
            WHERE c.id = case_id
            AND is_org_staff(c.organization_id)
        )
    );

-- ===========================================
-- VOLUNTEER SHIFTS POLICIES
-- ===========================================

-- Anyone can view upcoming shifts
CREATE POLICY "Shifts are viewable by everyone"
    ON volunteer_shifts FOR SELECT
    USING (start_time > NOW() - INTERVAL '1 day');

-- Org staff can create shifts
CREATE POLICY "Org staff can create shifts"
    ON volunteer_shifts FOR INSERT
    WITH CHECK (is_org_staff(organization_id));

-- Org staff can update shifts
CREATE POLICY "Org staff can update shifts"
    ON volunteer_shifts FOR UPDATE
    USING (is_org_staff(organization_id));

-- ===========================================
-- SHIFT SIGNUPS POLICIES
-- ===========================================

-- Volunteers can view their own signups
CREATE POLICY "Volunteers view own signups"
    ON shift_signups FOR SELECT
    USING (volunteer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Org staff can view all signups for their shifts
CREATE POLICY "Staff view org signups"
    ON shift_signups FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM volunteer_shifts vs
            WHERE vs.id = shift_signups.shift_id
            AND is_org_staff(vs.organization_id)
        )
    );

-- Authenticated users can sign up for shifts
CREATE POLICY "Users can sign up for shifts"
    ON shift_signups FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND volunteer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Volunteers can update their own signups
CREATE POLICY "Volunteers can update own signups"
    ON shift_signups FOR UPDATE
    USING (volunteer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- ===========================================
-- DONATIONS POLICIES
-- ===========================================

-- Donors can view their own donations
CREATE POLICY "Donors view own donations"
    ON donations FOR SELECT
    USING (donor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Org admins can view all donations
CREATE POLICY "Org admins view all donations"
    ON donations FOR SELECT
    USING (is_org_admin(organization_id));

-- Anyone can create a donation
CREATE POLICY "Anyone can donate"
    ON donations FOR INSERT
    WITH CHECK (true);

-- ===========================================
-- CONTENT POLICIES
-- ===========================================

-- Anyone can view published content
CREATE POLICY "Published content is public"
    ON content FOR SELECT
    USING (is_published = true);

-- Org staff can view all content
CREATE POLICY "Org staff view all content"
    ON content FOR SELECT
    USING (is_org_staff(organization_id));

-- Org staff can create content
CREATE POLICY "Org staff can create content"
    ON content FOR INSERT
    WITH CHECK (is_org_staff(organization_id));

-- Authors and admins can update content
CREATE POLICY "Authors can update content"
    ON content FOR UPDATE
    USING (
        author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
        OR is_org_admin(organization_id)
    );

-- ===========================================
-- PRAYER REQUESTS POLICIES
-- ===========================================

-- Anyone can view non-anonymous public prayer requests
CREATE POLICY "Public prayer requests viewable"
    ON prayer_requests FOR SELECT
    USING (
        (is_anonymous = false AND organization_id IS NULL)
        OR user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
        OR (organization_id IS NOT NULL AND belongs_to_org(organization_id))
    );

-- Authenticated users can create prayer requests
CREATE POLICY "Users can create prayer requests"
    ON prayer_requests FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own prayer requests
CREATE POLICY "Users can update own prayer requests"
    ON prayer_requests FOR UPDATE
    USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- ===========================================
-- PRAYER COUNTS POLICIES
-- ===========================================

-- Users can add prayer counts
CREATE POLICY "Users can pray"
    ON prayer_counts FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Users can view their own prayer activity
CREATE POLICY "Users view own prayer counts"
    ON prayer_counts FOR SELECT
    USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
