-- Phase 2: Doctor Scheduling & Availability (Blocked Slots & Leaves)

-- 1. Doctor Blocked Slots
CREATE TABLE IF NOT EXISTS doctor.doctor_blocked_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    block_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    reason TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    CONSTRAINT valid_block_time CHECK (end_time > start_time)
);

-- 2. Doctor Leaves
CREATE TABLE IF NOT EXISTS doctor.doctor_leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    
    approval_status VARCHAR(50) DEFAULT 'Approved', -- Defaults to Approved for MVP
    approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    remarks TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_leave_date CHECK (end_date >= start_date)
);

-- Enable RLS
ALTER TABLE doctor.doctor_blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor.doctor_leaves ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Enforce Clinic Isolation)
CREATE POLICY doc_block_isolation_policy ON doctor.doctor_blocked_slots
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY doc_leave_isolation_policy ON doctor.doctor_leaves
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
