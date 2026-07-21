-- Phase 4: Communication & Documents Schema

-- 1. AppointmentReminders
CREATE TABLE IF NOT EXISTS appointment.appointment_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointment.appointments(id) ON DELETE CASCADE,
    reminder_type VARCHAR(50) NOT NULL, -- e.g., 'Confirmation', '24 Hour', '2 Hour', 'Follow-up'
    reminder_channel VARCHAR(50) NOT NULL, -- e.g., 'In-App', 'Email', 'SMS'
    scheduled_time TIMESTAMPTZ NOT NULL,
    sent_time TIMESTAMPTZ,
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'Scheduled',
    retry_count INT DEFAULT 0,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. AppointmentNotifications
CREATE TABLE IF NOT EXISTS appointment.appointment_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointment.appointments(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL, -- ID or Phone or Email
    notification_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. OnlineAppointments
CREATE TABLE IF NOT EXISTS appointment.online_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointment.appointments(id) ON DELETE CASCADE,
    booking_platform VARCHAR(100) NOT NULL,
    booking_reference VARCHAR(100),
    patient_message TEXT,
    confirmation_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    confirmed_at TIMESTAMPTZ,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. AppointmentDocuments
CREATE TABLE IF NOT EXISTS appointment.appointment_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointment.appointments(id) ON DELETE CASCADE,
    attachment_id VARCHAR(500) NOT NULL, -- Path to storage bucket
    document_type VARCHAR(100) NOT NULL, -- e.g. 'Prescription', 'Consent Form'
    remarks TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE appointment.appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment.appointment_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment.online_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment.appointment_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for clinic isolation
CREATE POLICY reminder_clinic_isolation_policy ON appointment.appointment_reminders
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY notification_clinic_isolation_policy ON appointment.appointment_notifications
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY online_apt_clinic_isolation_policy ON appointment.online_appointments
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY document_clinic_isolation_policy ON appointment.appointment_documents
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

