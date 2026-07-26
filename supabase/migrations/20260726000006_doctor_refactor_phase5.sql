-- Phase 5: Doctor Login Devices & Audit (FINAL PHASE)

-- 1. Doctor Login Devices
CREATE TABLE IF NOT EXISTS doctor.doctor_login_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    device_name VARCHAR(255),
    operating_system VARCHAR(100),
    browser VARCHAR(100),
    ip_address VARCHAR(50),
    
    last_login TIMESTAMPTZ NOT NULL DEFAULT now(),
    trusted_device BOOLEAN NOT NULL DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Doctor Audit
CREATE TABLE IF NOT EXISTS doctor.doctor_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    action VARCHAR(255) NOT NULL, -- e.g. "Doctor Profile Updated"
    action_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    previous_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(50),
    metadata JSONB,
    
    action_time TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE doctor.doctor_login_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor.doctor_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Enforce Clinic Isolation)
CREATE POLICY doc_devices_isolation_policy ON doctor.doctor_login_devices
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Audit table policies: Allow Select and Insert. DENY Update and Delete to enforce immutability.
CREATE POLICY doc_audit_select_policy ON doctor.doctor_audit
    FOR SELECT USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY doc_audit_insert_policy ON doctor.doctor_audit
    FOR INSERT WITH CHECK (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Explicitly deny update and delete (Not strictly necessary if they just aren't granted, but good for self-documentation)
-- By omitting FOR UPDATE and FOR DELETE, they are implicitly denied under RLS.
