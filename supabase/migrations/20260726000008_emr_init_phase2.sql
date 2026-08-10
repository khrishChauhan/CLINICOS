-- EMR Module Phase 2: Clinical Diagnosis & Prescription Engine
-- Schema: emr
-- Creates: diagnoses, procedures, prescriptions, prescription_items

-- ─────────────────────────────────────────────────────────────────────────────
-- Diagnoses
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,

    diagnosis_code VARCHAR(50),
    diagnosis_name TEXT NOT NULL,
    diagnosis_type TEXT NOT NULL DEFAULT 'Primary'
        CHECK (diagnosis_type IN ('Primary', 'Secondary')),
    icd_code VARCHAR(20),
    diagnosis_notes TEXT,
    status TEXT NOT NULL DEFAULT 'Active'
        CHECK (status IN ('Active', 'Resolved', 'Chronic', 'Ruled Out')),

    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diagnoses_visit ON public.diagnoses(visit_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_clinic ON public.diagnoses(clinic_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Procedures
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.procedures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,

    procedure_code VARCHAR(50),
    procedure_name TEXT NOT NULL,
    procedure_date DATE,
    performed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    remarks TEXT,
    status TEXT NOT NULL DEFAULT 'Planned'
        CHECK (status IN ('Planned', 'In Progress', 'Completed', 'Cancelled')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_procedures_visit ON public.procedures(visit_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Prescriptions (one per visit, can be updated while consultation is active)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE RESTRICT,

    prescription_date DATE NOT NULL DEFAULT CURRENT_DATE,
    advice TEXT,
    dietary_advice TEXT,
    next_visit DATE,
    digital_signature TEXT,  -- Supabase Storage path to signature image

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT prescriptions_visit_unique UNIQUE (visit_id)  -- One prescription per visit
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_visit ON public.prescriptions(visit_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON public.prescriptions(doctor_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Prescription Items (multiple medicines per prescription)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,

    medicine_id UUID,                   -- optional: future medicine master FK
    medicine_name TEXT NOT NULL,
    dosage VARCHAR(100),               -- e.g. "500mg"
    frequency VARCHAR(100),            -- e.g. "1-0-1", "Twice daily"
    duration VARCHAR(100),             -- e.g. "5 Days", "1 Week"
    quantity INTEGER,
    route VARCHAR(100),                -- e.g. "Oral", "Topical", "IV"
    before_after_food VARCHAR(50),     -- e.g. "After Food", "Before Food"
    instructions TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prescription_items_prescription ON public.prescription_items(prescription_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY emr_diagnoses_policy ON public.diagnoses
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY emr_procedures_policy ON public.procedures
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY emr_prescriptions_policy ON public.prescriptions
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY emr_prescription_items_policy ON public.prescription_items
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
