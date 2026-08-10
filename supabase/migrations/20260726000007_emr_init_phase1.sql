-- EMR Module Phase 1: Clinical Visit Foundation
-- Schema: emr
-- Creates: visits, soap_notes, chief_complaints, vitals



-- ─────────────────────────────────────────────────────────────────────────────
-- Sequence tracker for per-clinic visit numbers
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.visit_number_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    seq_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_seq INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT visit_seq_clinic_date_unique UNIQUE (clinic_id, seq_date)
);

-- Function to atomically get + increment the daily sequence per clinic
CREATE OR REPLACE FUNCTION public.next_visit_number(p_clinic_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_date TEXT := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
    v_seq  INTEGER;
BEGIN
    INSERT INTO public.visit_number_sequences (clinic_id, seq_date, last_seq)
    VALUES (p_clinic_id, CURRENT_DATE, 1)
    ON CONFLICT (clinic_id, seq_date)
    DO UPDATE SET last_seq = public.visit_number_sequences.last_seq + 1
    RETURNING last_seq INTO v_seq;

    RETURN 'VST-' || v_date || '-' || LPAD(v_seq::TEXT, 4, '0');
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Visits
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE RESTRICT,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,

    visit_number TEXT NOT NULL,
    visit_type TEXT NOT NULL DEFAULT 'OPD', -- OPD, IPD, Emergency, Teleconsult
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    consultation_start_time TIMESTAMPTZ,
    consultation_end_time TIMESTAMPTZ,

    chief_complaint TEXT,        -- Single-line summary (detailed in chief_complaints table)
    provisional_diagnosis TEXT,
    final_diagnosis TEXT,
    treatment_plan TEXT,
    notes TEXT,

    followup_required BOOLEAN NOT NULL DEFAULT FALSE,
    followup_date DATE,

    consultation_status TEXT NOT NULL DEFAULT 'In Progress'
        CHECK (consultation_status IN ('In Progress', 'Completed', 'Cancelled')),

    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT visits_number_clinic_unique UNIQUE (clinic_id, visit_number)
);

CREATE INDEX IF NOT EXISTS idx_visits_clinic ON public.visits(clinic_id);
CREATE INDEX IF NOT EXISTS idx_visits_patient ON public.visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_doctor ON public.visits(doctor_id);
CREATE INDEX IF NOT EXISTS idx_visits_appointment ON public.visits(appointment_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON public.visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_visits_status ON public.visits(consultation_status);

-- ─────────────────────────────────────────────────────────────────────────────
-- SOAP Notes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.soap_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,

    subjective TEXT,    -- Patient's own description of symptoms
    objective TEXT,     -- Clinical findings / examination
    assessment TEXT,    -- Doctor's clinical assessment
    plan TEXT,          -- Treatment plan

    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT soap_notes_visit_unique UNIQUE (visit_id)  -- One SOAP per visit
);

CREATE INDEX IF NOT EXISTS idx_soap_notes_visit ON public.soap_notes(visit_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Chief Complaints (multiple per visit)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chief_complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,

    complaint TEXT NOT NULL,
    duration TEXT,           -- e.g., "3 days", "2 weeks"
    severity TEXT CHECK (severity IN ('Mild', 'Moderate', 'Severe')),
    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chief_complaints_visit ON public.chief_complaints(visit_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Vitals (multiple records per visit allowed)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,

    height_cm NUMERIC(5,2),          -- centimeters
    weight_kg NUMERIC(5,2),          -- kilograms
    bmi NUMERIC(5,2),                -- auto-calculated: weight / (height_m)^2
    temperature_c NUMERIC(4,1),      -- celsius
    pulse_rate INTEGER,              -- bpm
    respiratory_rate INTEGER,        -- breaths/min
    oxygen_saturation NUMERIC(4,1),  -- SpO2 %
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    blood_sugar NUMERIC(5,1),        -- mg/dL
    pain_score INTEGER CHECK (pain_score BETWEEN 0 AND 10),

    recorded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vitals_visit ON public.vitals(visit_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.visit_number_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chief_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vitals ENABLE ROW LEVEL SECURITY;

-- RLS helper expression
-- All policies enforce clinic_id matches the authenticated user's clinic_id

CREATE POLICY emr_visit_seq_policy ON public.visit_number_sequences
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY emr_visits_policy ON public.visits
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY emr_soap_policy ON public.soap_notes
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY emr_cc_policy ON public.chief_complaints
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY emr_vitals_policy ON public.vitals
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
