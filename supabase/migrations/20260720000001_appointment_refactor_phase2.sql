-- Phase 2: Appointment Queue & Token Management Schema

-- 1. Tokens Table
CREATE TABLE IF NOT EXISTS public.tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    token_number VARCHAR(50) NOT NULL,
    appointment_id UUID REFERENCES appointment.appointments(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    generated_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    display_number VARCHAR(50),
    token_status VARCHAR(50) NOT NULL DEFAULT 'Waiting' CHECK (token_status IN ('Waiting', 'Called', 'In Consultation', 'Completed', 'Skipped', 'Cancelled')),
    served_time TIMESTAMPTZ,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint for daily token generation by clinic
-- To enforce this properly at scale, we rely on the application layer logic + date constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_tokens_clinic_daily_number 
ON public.tokens (clinic_id, token_number, (generated_time::date));

-- 2. AppointmentQueue Table
CREATE TABLE IF NOT EXISTS public.appointment_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointment.appointments(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    queue_number INT,
    current_position INT,
    estimated_wait_time INT, -- in minutes
    queue_status VARCHAR(50) NOT NULL DEFAULT 'Waiting' CHECK (queue_status IN ('Waiting', 'Called', 'In Consultation', 'Completed', 'Skipped', 'Cancelled')),
    called_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    skipped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. WalkInRegistrations Table
CREATE TABLE IF NOT EXISTS public.walk_in_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    arrival_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    token_number VARCHAR(50),
    priority VARCHAR(50) DEFAULT 'Normal' CHECK (priority IN ('Normal', 'Emergency', 'VIP')),
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Registered',
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. QueueDisplay Table
CREATE TABLE IF NOT EXISTS public.queue_display (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    token_number VARCHAR(50),
    current_status VARCHAR(50) NOT NULL DEFAULT 'Waiting',
    display_order INT,
    estimated_wait INT,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.walk_in_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_display ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for clinic isolation

-- Tokens Policy
CREATE POLICY tokens_clinic_isolation_policy ON public.tokens
    FOR ALL
    USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- AppointmentQueue Policy (Using appointment's clinic_id via JOIN, but better to add clinic_id for direct isolation if needed. We assume Appointments already have RLS, but let's add clinic_id to queue for easier isolation)
ALTER TABLE public.appointment_queue ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE;
CREATE POLICY queue_clinic_isolation_policy ON public.appointment_queue
    FOR ALL
    USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- WalkInRegistrations Policy
CREATE POLICY walkin_clinic_isolation_policy ON public.walk_in_registrations
    FOR ALL
    USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- QueueDisplay Policy
CREATE POLICY queuedisplay_clinic_isolation_policy ON public.queue_display
    FOR ALL
    USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Create Trigger for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_tokens_updated_at BEFORE UPDATE ON public.tokens FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_queue_updated_at BEFORE UPDATE ON public.appointment_queue FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_walkin_updated_at BEFORE UPDATE ON public.walk_in_registrations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_queuedisplay_updated_at BEFORE UPDATE ON public.queue_display FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Note: We are placing these tables in `public` schema based on standard Next.js + Supabase pattern unless directed to place them explicitly in `appointment` schema. The schema doc says `Schema: appointment` for some tables. Let's move them to `appointment` schema.

-- Ah, the user provided doc says "Schema: appointment". Let me adjust schema to `appointment` for consistency with Phase 1.
ALTER TABLE public.tokens SET SCHEMA appointment;
ALTER TABLE public.appointment_queue SET SCHEMA appointment;
ALTER TABLE public.walk_in_registrations SET SCHEMA appointment;
ALTER TABLE public.queue_display SET SCHEMA appointment;

-- Re-create indexes/policies just in case schema move affected anything (Postgres handles schema moves well, but good practice)
