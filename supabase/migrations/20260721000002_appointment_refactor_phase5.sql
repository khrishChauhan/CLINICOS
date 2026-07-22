-- Phase 5: Feedback & Audit Schema

-- 1. AppointmentFeedback
CREATE TABLE IF NOT EXISTS appointment.appointment_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointment.appointments(id) ON DELETE CASCADE,
    overall_rating INT NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    waiting_time_rating INT CHECK (waiting_time_rating >= 1 AND waiting_time_rating <= 5),
    doctor_experience_rating INT CHECK (doctor_experience_rating >= 1 AND doctor_experience_rating <= 5),
    staff_rating INT CHECK (staff_rating >= 1 AND staff_rating <= 5),
    cleanliness_rating INT CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    comments TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_appointment_feedback UNIQUE (appointment_id)
);

-- 2. AppointmentAudit
CREATE TABLE IF NOT EXISTS appointment.appointment_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointment.appointments(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    performed_by UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Nullable for system actions
    previous_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    metadata JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE appointment.appointment_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment.appointment_audit ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Feedback
CREATE POLICY feedback_clinic_isolation_policy ON appointment.appointment_feedback
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Create RLS Policies for Audit (Strict Immutability)
-- 1. Allow Read
CREATE POLICY audit_select_policy ON appointment.appointment_audit
    FOR SELECT USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- 2. Allow Insert
CREATE POLICY audit_insert_policy ON appointment.appointment_audit
    FOR INSERT WITH CHECK (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Notice: Intentionally omitting UPDATE and DELETE policies.
-- By default in Postgres RLS, if no policy is defined for a command, it is DENIED.
-- Thus, records in appointment.appointment_audit cannot be updated or deleted by any user interacting via the PostgREST API.
