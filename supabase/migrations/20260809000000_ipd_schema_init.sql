-- 20260809000000_ipd_schema_init.sql
-- IPD & Ward Management Schema

CREATE SCHEMA IF NOT EXISTS ipd;

-- 1. Wards
CREATE TABLE IF NOT EXISTS ipd.wards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- e.g., 'General', 'ICU', 'Private'
    capacity INTEGER NOT NULL DEFAULT 0,
    floor VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ipd_wards_clinic ON ipd.wards(clinic_id);

-- 2. Beds
CREATE TABLE IF NOT EXISTS ipd.beds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id UUID NOT NULL REFERENCES ipd.wards(id) ON DELETE CASCADE,
    bed_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Available', -- 'Available', 'Occupied', 'Cleaning', 'Maintenance'
    base_price_per_day NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ward_id, bed_number)
);
CREATE INDEX idx_ipd_beds_ward ON ipd.beds(ward_id);
CREATE INDEX idx_ipd_beds_status ON ipd.beds(status);

-- 3. Admissions
CREATE TABLE IF NOT EXISTS ipd.admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    admitting_doctor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    visit_id UUID REFERENCES public.visits(id) ON DELETE SET NULL, -- Link to OPD visit that triggered admission
    status VARCHAR(50) NOT NULL DEFAULT 'Requested', -- 'Requested', 'Pending Bed Assignment', 'Admitted', 'Discharge Requested', 'Billing Pending', 'Discharged'
    admission_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expected_discharge_date TIMESTAMPTZ,
    actual_discharge_date TIMESTAMPTZ,
    reason_for_admission TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);
CREATE INDEX idx_ipd_admissions_patient ON ipd.admissions(patient_id);
CREATE INDEX idx_ipd_admissions_clinic ON ipd.admissions(clinic_id);
CREATE INDEX idx_ipd_admissions_status ON ipd.admissions(status);

-- 4. Bed Allocations (Concurrency Protected)
CREATE TABLE IF NOT EXISTS ipd.bed_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id UUID NOT NULL REFERENCES ipd.admissions(id) ON DELETE CASCADE,
    bed_id UUID NOT NULL REFERENCES ipd.beds(id) ON DELETE RESTRICT,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    assigned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ipd_allocations_admission ON ipd.bed_allocations(admission_id);
CREATE INDEX idx_ipd_allocations_bed ON ipd.bed_allocations(bed_id);

-- CONCURRENCY PROTECTION: Ensure a bed cannot have overlapping active allocations
CREATE UNIQUE INDEX idx_unique_active_bed_allocation 
ON ipd.bed_allocations(bed_id) 
WHERE end_time IS NULL;

-- 5. Nursing Vitals
CREATE TABLE IF NOT EXISTS ipd.nursing_vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id UUID NOT NULL REFERENCES ipd.admissions(id) ON DELETE CASCADE,
    recorded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    heart_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    temperature_celsius NUMERIC(5,2),
    spo2 INTEGER,
    respiratory_rate INTEGER,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ipd_vitals_admission ON ipd.nursing_vitals(admission_id);

-- 6. Inpatient Prescriptions / Administrations
CREATE TABLE IF NOT EXISTS ipd.medication_administrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id UUID NOT NULL REFERENCES ipd.admissions(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE RESTRICT,
    prescription_item_id UUID REFERENCES public.prescription_items(id) ON DELETE SET NULL, -- Link if it came from EMR order
    dispense_item_id UUID, -- Link to pharmacy dispensing record to deduct stock safely
    scheduled_time TIMESTAMPTZ,
    administered_time TIMESTAMPTZ,
    administered_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Prescribed', -- 'Prescribed', 'Dispensed', 'Administered', 'Skipped', 'Refused'
    dose VARCHAR(100),
    route VARCHAR(100),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ipd_medadmin_admission ON ipd.medication_administrations(admission_id);

-- RLS Enablement
ALTER TABLE ipd.wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipd.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipd.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipd.bed_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipd.nursing_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipd.medication_administrations ENABLE ROW LEVEL SECURITY;

-- Policies using get_session_context()
CREATE POLICY "Clinic isolation for wards" ON ipd.wards FOR ALL USING (clinic_id = (SELECT clinic_id FROM get_session_context()));
CREATE POLICY "Clinic isolation for beds" ON ipd.beds FOR ALL USING (ward_id IN (SELECT id FROM ipd.wards WHERE clinic_id = (SELECT clinic_id FROM get_session_context())));
CREATE POLICY "Clinic isolation for admissions" ON ipd.admissions FOR ALL USING (clinic_id = (SELECT clinic_id FROM get_session_context()));
CREATE POLICY "Clinic isolation for bed allocations" ON ipd.bed_allocations FOR ALL USING (admission_id IN (SELECT id FROM ipd.admissions WHERE clinic_id = (SELECT clinic_id FROM get_session_context())));
CREATE POLICY "Clinic isolation for vitals" ON ipd.nursing_vitals FOR ALL USING (admission_id IN (SELECT id FROM ipd.admissions WHERE clinic_id = (SELECT clinic_id FROM get_session_context())));
CREATE POLICY "Clinic isolation for medication admin" ON ipd.medication_administrations FOR ALL USING (admission_id IN (SELECT id FROM ipd.admissions WHERE clinic_id = (SELECT clinic_id FROM get_session_context())));
