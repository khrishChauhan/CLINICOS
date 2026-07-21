-- Phase 3: Appointment Lifecycle Management Schema

-- 1. AppointmentStatusHistory
CREATE TABLE IF NOT EXISTS appointment.appointment_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointment.appointments(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    current_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    remarks TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. AppointmentCancellation
CREATE TABLE IF NOT EXISTS appointment.appointment_cancellation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointment.appointments(id) ON DELETE CASCADE,
    cancelled_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    cancellation_reason TEXT NOT NULL,
    refund_required BOOLEAN DEFAULT false,
    refund_status VARCHAR(50),
    cancelled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    remarks TEXT
);

-- 3. AppointmentReschedule
CREATE TABLE IF NOT EXISTS appointment.appointment_reschedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointment.appointments(id) ON DELETE CASCADE,
    old_date DATE,
    old_time TIME,
    new_date DATE NOT NULL,
    new_time TIME NOT NULL,
    rescheduled_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reason TEXT,
    rescheduled_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. FollowUpAppointments
CREATE TABLE IF NOT EXISTS appointment.follow_up_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    parent_appointment_id UUID NOT NULL REFERENCES appointment.appointments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    followup_date DATE NOT NULL,
    followup_reason TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. CalendarEvents
CREATE TABLE IF NOT EXISTS appointment.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_title VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- e.g. 'Leave', 'Blocked', 'Appointment', 'ClinicEvent'
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- Enable Row Level Security
ALTER TABLE appointment.appointment_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment.appointment_cancellation ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment.appointment_reschedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment.follow_up_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment.calendar_events ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for clinic isolation

-- History
CREATE POLICY history_clinic_isolation_policy ON appointment.appointment_status_history
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Cancellation
CREATE POLICY cancellation_clinic_isolation_policy ON appointment.appointment_cancellation
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Reschedule
CREATE POLICY reschedule_clinic_isolation_policy ON appointment.appointment_reschedule
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Follow Up
CREATE POLICY followup_clinic_isolation_policy ON appointment.follow_up_appointments
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Calendar
CREATE POLICY calendar_clinic_isolation_policy ON appointment.calendar_events
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

