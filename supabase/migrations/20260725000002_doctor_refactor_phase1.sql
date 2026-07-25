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
