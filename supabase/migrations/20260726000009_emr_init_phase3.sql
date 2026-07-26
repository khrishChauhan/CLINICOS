-- EMR Module Phase 3: Clinical Documentation & Follow-up
-- Schema: emr
-- Creates: clinical_notes, follow_up_plans, clinical_attachments

-- ─────────────────────────────────────────────────────────────────────────────
-- Clinical Notes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emr.clinical_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES emr.visits(id) ON DELETE CASCADE,
    
    note_type VARCHAR(100) NOT NULL, -- Progress, Consultation, Nursing, Observation
    note TEXT NOT NULL,
    entered_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    entered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    edit_history JSONB DEFAULT '[]'::jsonb, -- Immutability tracking [{ edited_at, previous_content, edited_by }]
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clinical_notes_visit ON emr.clinical_notes(visit_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Follow Up Plans
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emr.follow_up_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES emr.visits(id) ON DELETE CASCADE,
    
    followup_date DATE NOT NULL,
    followup_reason TEXT,
    instructions TEXT,
    reminder_required BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT follow_up_plans_visit_unique UNIQUE (visit_id)
);

CREATE INDEX IF NOT EXISTS idx_follow_up_plans_visit ON emr.follow_up_plans(visit_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Clinical Attachments
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emr.clinical_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES emr.visits(id) ON DELETE CASCADE,
    
    attachment_path TEXT NOT NULL, -- Supabase Storage path
    attachment_type VARCHAR(100) NOT NULL, -- Medical Image, Lab Report, etc.
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL, -- Ensure we have metadata on size
    mime_type VARCHAR(100),
    remarks TEXT,
    
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clinical_attachments_visit ON emr.clinical_attachments(visit_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS Policies
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE emr.clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE emr.follow_up_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE emr.clinical_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY emr_clinical_notes_policy ON emr.clinical_notes
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY emr_follow_up_plans_policy ON emr.follow_up_plans
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY emr_clinical_attachments_policy ON emr.clinical_attachments
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
