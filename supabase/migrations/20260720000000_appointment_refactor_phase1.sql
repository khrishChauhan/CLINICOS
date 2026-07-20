-- Migration: Appointment Refactor Phase 1
-- Drops old doctor_schedules and creates doctor_availability & appointment_slots
-- Extends appointments table

-- 1. Drop old doctor_schedules
DROP TABLE IF EXISTS public.doctor_schedules CASCADE;

-- 2. Create DoctorAvailability
CREATE TABLE public.doctor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    available_from TIME NOT NULL,
    available_to TIME NOT NULL,
    available_days INTEGER[] NOT NULL,
    consultation_mode VARCHAR(50) DEFAULT 'In-Person',
    appointment_limit INTEGER,
    break_start TIME,
    break_end TIME,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create AppointmentSlots
CREATE TABLE public.appointment_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    branch_id UUID,
    day_of_week INTEGER NOT NULL,
    slot_start_time TIME NOT NULL,
    slot_end_time TIME NOT NULL,
    slot_duration INTEGER NOT NULL,
    maximum_patients INTEGER DEFAULT 1,
    booking_window INTEGER,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Extend Appointments
ALTER TABLE public.appointments
    ADD COLUMN branch_id UUID,
    ADD COLUMN department_id UUID,
    ADD COLUMN appointment_number VARCHAR(100),
    ADD COLUMN appointment_source VARCHAR(50) DEFAULT 'Manual',
    ADD COLUMN slot_id UUID REFERENCES public.appointment_slots(id) ON DELETE SET NULL,
    ADD COLUMN token_id UUID,
    ADD COLUMN consultation_type VARCHAR(50),
    ADD COLUMN visit_type VARCHAR(50) DEFAULT 'New',
    ADD COLUMN referred_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ADD COLUMN checked_in_at TIMESTAMPTZ,
    ADD COLUMN consultation_started_at TIMESTAMPTZ,
    ADD COLUMN consultation_completed_at TIMESTAMPTZ,
    ADD COLUMN cancelled_at TIMESTAMPTZ,
    ADD COLUMN cancelled_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ADD COLUMN cancellation_reason TEXT,
    ADD COLUMN booked_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.appointments
    RENAME COLUMN start_time TO appointment_start_time;

ALTER TABLE public.appointments
    RENAME COLUMN end_time TO appointment_end_time;

-- Add Unique Constraint for appointment_number per clinic
ALTER TABLE public.appointments 
    ADD CONSTRAINT uq_appointment_number_clinic UNIQUE (clinic_id, appointment_number);

-- Indexes
CREATE INDEX idx_doctor_availability_doctor ON public.doctor_availability(doctor_id);
CREATE INDEX idx_doctor_availability_clinic ON public.doctor_availability(clinic_id);

CREATE INDEX idx_appointment_slots_doctor ON public.appointment_slots(doctor_id);
CREATE INDEX idx_appointment_slots_clinic ON public.appointment_slots(clinic_id);

CREATE INDEX idx_appointments_number ON public.appointments(appointment_number);
CREATE INDEX idx_appointments_slot ON public.appointments(slot_id);

-- RLS
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_isolation_doctor_availability" ON public.doctor_availability
    FOR ALL USING (
        clinic_id IN (
            SELECT clinic_id FROM public.users WHERE id = auth.uid()
        )
    );

CREATE POLICY "clinic_isolation_appointment_slots" ON public.appointment_slots
    FOR ALL USING (
        clinic_id IN (
            SELECT clinic_id FROM public.users WHERE id = auth.uid()
        )
    );
