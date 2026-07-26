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
