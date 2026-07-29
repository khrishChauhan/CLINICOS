-- Laboratory Module Phase 5: Completion — Reference Ranges, Specimen Types,
-- Consumables, Attachments, Notifications, Audit
-- Schema: laboratory
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. ReferenceRanges
-- Supports multiple ranges per test (age/gender stratified)
CREATE TABLE IF NOT EXISTS laboratory.reference_ranges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    test_id UUID NOT NULL, -- references master.laboratory_tests
    test_name VARCHAR(150) NOT NULL,
    gender VARCHAR(10) DEFAULT 'Any', -- Male, Female, Any
    age_from NUMERIC DEFAULT 0,
    age_to NUMERIC DEFAULT 999,
    low_value NUMERIC NOT NULL,
    high_value NUMERIC NOT NULL,
    unit VARCHAR(50),
    parameter_name VARCHAR(150), -- NULL = overall result, set for composite params
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SpecimenTypes
CREATE TABLE IF NOT EXISTS laboratory.specimen_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    specimen_code VARCHAR(50) NOT NULL,
    specimen_name VARCHAR(150) NOT NULL,
    storage_requirement TEXT,
    status VARCHAR(30) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clinic_id, specimen_code)
);

-- 3. LabConsumables (designed for future inventory integration)
CREATE TABLE IF NOT EXISTS laboratory.lab_consumables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    item_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    unit VARCHAR(50),
    minimum_stock NUMERIC DEFAULT 0,
    current_stock NUMERIC DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clinic_id, item_code)
);

-- 4. LabAttachments (file references only — no binary data)
CREATE TABLE IF NOT EXISTS laboratory.lab_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    lab_order_id UUID NOT NULL REFERENCES laboratory.lab_orders(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,  -- Private bucket path
    file_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) DEFAULT 'General',
    mime_type VARCHAR(100),
    file_size BIGINT,
    uploaded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LabNotifications (lab-specific notification log referencing notification_queue)
CREATE TABLE IF NOT EXISTS laboratory.lab_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    lab_order_id UUID REFERENCES laboratory.lab_orders(id) ON DELETE SET NULL,
    notification_queue_id UUID REFERENCES public.notification_queue(id) ON DELETE SET NULL,
    recipient_type VARCHAR(50) NOT NULL, -- Patient, Doctor, Technician, Admin
    recipient_id UUID,
    notification_type VARCHAR(100) NOT NULL, -- Sample Collected, Test Completed, etc.
    message TEXT,
    status VARCHAR(30) DEFAULT 'Pending',
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
    -- NOTE: No updated_at — notification records should be append-only
);

-- 6. LabAudit (IMMUTABLE — INSERT + SELECT only via RLS)
CREATE TABLE IF NOT EXISTS laboratory.lab_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    lab_order_id UUID,
    action VARCHAR(150) NOT NULL,
    action_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    table_name VARCHAR(100),
    record_id UUID,
    previous_value JSONB,
    new_value JSONB,
    metadata JSONB,
    action_time TIMESTAMPTZ DEFAULT NOW()
    -- NOTE: No updated_at — audit records are immutable by design
);

-- Indexes
CREATE INDEX idx_reference_ranges_test ON laboratory.reference_ranges(test_id);
CREATE INDEX idx_reference_ranges_clinic ON laboratory.reference_ranges(clinic_id);
CREATE INDEX idx_specimen_types_clinic ON laboratory.specimen_types(clinic_id);
CREATE INDEX idx_lab_consumables_clinic ON laboratory.lab_consumables(clinic_id);
CREATE INDEX idx_lab_attachments_order ON laboratory.lab_attachments(lab_order_id);
CREATE INDEX idx_lab_notifications_order ON laboratory.lab_notifications(lab_order_id);
CREATE INDEX idx_lab_audit_order ON laboratory.lab_audit(lab_order_id);
CREATE INDEX idx_lab_audit_action_by ON laboratory.lab_audit(action_by);
CREATE INDEX idx_lab_audit_action_time ON laboratory.lab_audit(action_time DESC);

-- RLS
ALTER TABLE laboratory.reference_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.specimen_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.lab_consumables ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.lab_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.lab_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.lab_audit ENABLE ROW LEVEL SECURITY;

-- Standard clinic isolation policies
CREATE POLICY ref_ranges_isolation ON laboratory.reference_ranges
    FOR ALL TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY specimen_types_isolation ON laboratory.specimen_types
    FOR ALL TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY lab_consumables_isolation ON laboratory.lab_consumables
    FOR ALL TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY lab_attachments_isolation ON laboratory.lab_attachments
    FOR ALL TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY lab_notifications_isolation ON laboratory.lab_notifications
    FOR ALL TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- ─────────────────────────────────────────────────────────────────────────────
-- LabAudit: STRICT IMMUTABILITY via separate INSERT / SELECT policies
-- No UPDATE or DELETE policies defined — PostgreSQL denies by default
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY lab_audit_select ON laboratory.lab_audit
    FOR SELECT TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY lab_audit_insert ON laboratory.lab_audit
    FOR INSERT TO authenticated
    WITH CHECK (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- No UPDATE policy → updates silently denied by RLS
-- No DELETE policy → deletes silently denied by RLS
