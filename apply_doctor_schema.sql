-- Phase 1: Doctor Identity & Professional Profile Schema
CREATE SCHEMA IF NOT EXISTS doctor;

-- 1. Doctors (Master Table mapping to public.users)
CREATE TABLE IF NOT EXISTS doctor.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE, -- Link to Auth/Users
    doctor_code VARCHAR(50) NOT NULL,
    
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    date_of_birth DATE,
    blood_group VARCHAR(10),
    mobile_number VARCHAR(20),
    alternate_mobile VARCHAR(20),
    email VARCHAR(255),
    
    profile_photo TEXT, -- Supabase Storage Path
    consultation_type VARCHAR(50),
    joining_date DATE,
    experience_years NUMERIC(4,1),
    
    status VARCHAR(50) DEFAULT 'Active',
    remarks TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    CONSTRAINT unique_clinic_doctor_code UNIQUE (clinic_id, doctor_code)
);

-- 2. DoctorQualifications
CREATE TABLE IF NOT EXISTS doctor.doctor_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    qualification VARCHAR(255) NOT NULL,
    university VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    passing_year INT,
    specialization VARCHAR(255),
    certificate_attachment_id UUID REFERENCES public.file_attachments(id) ON DELETE SET NULL,
    remarks TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. DoctorRegistrations
CREATE TABLE IF NOT EXISTS doctor.doctor_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    registration_number VARCHAR(100) NOT NULL,
    registration_council VARCHAR(255) NOT NULL,
    registration_state VARCHAR(100),
    registration_date DATE,
    expiry_date DATE,
    attachment_id UUID REFERENCES public.file_attachments(id) ON DELETE SET NULL,
    verification_status VARCHAR(50) DEFAULT 'Pending',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Ensure no duplicate licenses are registered across the clinic
    CONSTRAINT unique_registration UNIQUE (clinic_id, registration_number, registration_council)
);

-- 4. DoctorSpecializations
CREATE TABLE IF NOT EXISTS doctor.doctor_specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    specialization_name VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    years_of_experience NUMERIC(4,1),
    primary_specialization BOOLEAN DEFAULT false,
    remarks TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. DoctorDepartments (Junction table for multiple departments)
CREATE TABLE IF NOT EXISTS doctor.doctor_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    designation UUID REFERENCES public.designations(id) ON DELETE SET NULL,
    joining_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT unique_doctor_department UNIQUE (doctor_id, department_id)
);

-- Enable RLS
ALTER TABLE doctor.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor.doctor_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor.doctor_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor.doctor_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor.doctor_departments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Enforce Clinic Isolation)
CREATE POLICY doc_isolation_policy ON doctor.doctors
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY doc_qual_isolation_policy ON doctor.doctor_qualifications
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY doc_reg_isolation_policy ON doctor.doctor_registrations
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY doc_spec_isolation_policy ON doctor.doctor_specializations
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY doc_dept_isolation_policy ON doctor.doctor_departments
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
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
-- Phase 3: Doctor Professional Assets

-- 1. Doctor Consultation Fees
CREATE TABLE IF NOT EXISTS doctor.doctor_consultation_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    consultation_type VARCHAR(100) NOT NULL, -- e.g. "Standard", "Premium"
    consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    followup_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    emergency_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    teleconsultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    
    effective_from DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active', -- 'Active' or 'Inactive'
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- 2. Doctor Digital Signature
CREATE TABLE IF NOT EXISTS doctor.doctor_digital_signature (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    file_path TEXT NOT NULL, -- Path in Supabase Storage
    signature_type VARCHAR(50) NOT NULL, -- e.g. "Scanned", "Digital Certificate"
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- 3. Doctor Documents
CREATE TABLE IF NOT EXISTS doctor.doctor_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor.doctors(id) ON DELETE CASCADE,
    
    file_path TEXT NOT NULL, -- Path in Supabase Storage
    document_type VARCHAR(100) NOT NULL, -- e.g. "Medical Registration", "Degree"
    document_name VARCHAR(255) NOT NULL,
    remarks TEXT,
    
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE doctor.doctor_consultation_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor.doctor_digital_signature ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor.doctor_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Enforce Clinic Isolation)
CREATE POLICY doc_fees_isolation_policy ON doctor.doctor_consultation_fees
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY doc_signature_isolation_policy ON doctor.doctor_digital_signature
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY doc_documents_isolation_policy ON doctor.doctor_documents
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
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
