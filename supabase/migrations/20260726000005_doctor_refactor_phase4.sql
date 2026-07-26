-- Phase 4: Doctor Performance & Communication

-- 1. Doctor Performance
CREATE TABLE IF NOT EXISTS doctor.doctor_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    report_month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    
    total_patients INTEGER NOT NULL DEFAULT 0,
    completed_consultations INTEGER NOT NULL DEFAULT 0,
    followups INTEGER NOT NULL DEFAULT 0,
    cancelled_appointments INTEGER NOT NULL DEFAULT 0,
    average_consultation_time INTEGER NOT NULL DEFAULT 0, -- in minutes
    patient_rating DECIMAL(3, 2), -- e.g. 4.50
    revenue_generated DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Ensure only one performance report per doctor per month
    CONSTRAINT unique_doctor_month_performance UNIQUE (doctor_id, report_month)
);

-- 2. Doctor Notes
CREATE TABLE IF NOT EXISTS doctor.doctor_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    note_type VARCHAR(100) NOT NULL, -- e.g. "HR", "Administrative"
    note TEXT NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- 3. Doctor Awards
CREATE TABLE IF NOT EXISTS doctor.doctor_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    award_name VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    award_date DATE,
    description TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Doctor Languages
CREATE TABLE IF NOT EXISTS doctor.doctor_languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    language_name VARCHAR(100) NOT NULL,
    proficiency VARCHAR(100) NOT NULL, -- e.g. "Native", "Fluent", "Basic"
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT unique_doctor_language UNIQUE (doctor_id, language_name)
);

-- 5. Doctor Communication Preferences
CREATE TABLE IF NOT EXISTS doctor.doctor_communication_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE UNIQUE,
    
    sms_enabled BOOLEAN NOT NULL DEFAULT true,
    email_enabled BOOLEAN NOT NULL DEFAULT true,
    whatsapp_enabled BOOLEAN NOT NULL DEFAULT true,
    in_app_enabled BOOLEAN NOT NULL DEFAULT true,
    
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE doctor.doctor_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor.doctor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor.doctor_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor.doctor_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor.doctor_communication_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Enforce Clinic Isolation)
CREATE POLICY doc_performance_isolation_policy ON doctor.doctor_performance
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY doc_notes_isolation_policy ON doctor.doctor_notes
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY doc_awards_isolation_policy ON doctor.doctor_awards
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY doc_languages_isolation_policy ON doctor.doctor_languages
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY doc_comm_pref_isolation_policy ON doctor.doctor_communication_preferences
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
