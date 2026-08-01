-- Radiology Module Phase 5: Attachments, Notifications & Audit
-- Schema: radiology
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. RadiologyAttachments
CREATE TABLE IF NOT EXISTS radiology.radiology_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    radiology_order_id UUID NOT NULL REFERENCES radiology.radiology_orders(id) ON DELETE CASCADE,
    attachment_id UUID NOT NULL REFERENCES public.file_attachments(id) ON DELETE CASCADE,
    document_type VARCHAR(100),
    remarks TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. RadiologyNotifications
CREATE TABLE IF NOT EXISTS radiology.radiology_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    radiology_order_id UUID NOT NULL REFERENCES radiology.radiology_orders(id) ON DELETE CASCADE,
    recipient_type VARCHAR(50) NOT NULL, -- e.g., 'Patient', 'Doctor'
    notification_type VARCHAR(50) NOT NULL, -- e.g., 'Report Ready', 'Critical Findings'
    status VARCHAR(50) DEFAULT 'Pending',
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 3. RadiologyAudit
CREATE TABLE IF NOT EXISTS radiology.radiology_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    radiology_order_id UUID NOT NULL REFERENCES radiology.radiology_orders(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    action_by UUID NOT NULL REFERENCES public.users(id),
    previous_value JSONB,
    new_value JSONB,
    action_time TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage Bucket Setup
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'radiology_attachments',
  'radiology_attachments',
  FALSE, -- Private bucket
  104857600, -- 100MB limit per file
  ARRAY['image/jpeg', 'image/png', 'application/pdf', 'application/dicom', 'image/dicom']
) ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes & RLS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX idx_rad_attachments_order ON radiology.radiology_attachments(radiology_order_id);
CREATE INDEX idx_rad_attachments_clinic ON radiology.radiology_attachments(clinic_id);

CREATE INDEX idx_rad_notifications_order ON radiology.radiology_notifications(radiology_order_id);
CREATE INDEX idx_rad_notifications_clinic ON radiology.radiology_notifications(clinic_id);

CREATE INDEX idx_rad_audit_order ON radiology.radiology_audit(radiology_order_id);
CREATE INDEX idx_rad_audit_clinic ON radiology.radiology_audit(clinic_id);

ALTER TABLE radiology.radiology_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology.radiology_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology.radiology_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY rad_attachments_clinic_isolation_policy ON radiology.radiology_attachments
    FOR ALL TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY rad_notifications_clinic_isolation_policy ON radiology.radiology_notifications
    FOR ALL TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Strict Immutable Policies for Audit
CREATE POLICY rad_audit_clinic_isolation_select ON radiology.radiology_audit
    FOR SELECT TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY rad_audit_clinic_isolation_insert ON radiology.radiology_audit
    FOR INSERT TO authenticated WITH CHECK (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- No UPDATE or DELETE policies intentionally created. By default, they are DENIED.
