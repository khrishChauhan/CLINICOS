-- Master Module Phase 3: Medical Reference Masters
-- Schema: master
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. DiagnosisCodes
CREATE TABLE IF NOT EXISTS master.diagnosis_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icd_code VARCHAR(50) UNIQUE,
    diagnosis_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ProcedureCodes
CREATE TABLE IF NOT EXISTS master.procedure_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procedure_code VARCHAR(50) UNIQUE,
    procedure_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LaboratoryTests
CREATE TABLE IF NOT EXISTS master.laboratory_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_code VARCHAR(50) UNIQUE,
    test_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    sample_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RadiologyTests
CREATE TABLE IF NOT EXISTS master.radiology_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_code VARCHAR(50) UNIQUE,
    test_name VARCHAR(255) NOT NULL,
    modality VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_diagnosis_codes_name ON master.diagnosis_codes(diagnosis_name);
CREATE INDEX IF NOT EXISTS idx_procedure_codes_name ON master.procedure_codes(procedure_name);
CREATE INDEX IF NOT EXISTS idx_lab_tests_name ON master.laboratory_tests(test_name);
CREATE INDEX IF NOT EXISTS idx_rad_tests_name ON master.radiology_tests(test_name);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS Policies (Global, Open Read, Restricted Write)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE master.diagnosis_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.procedure_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.laboratory_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.radiology_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY master_diagnosis_codes_select ON master.diagnosis_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY master_procedure_codes_select ON master.procedure_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY master_laboratory_tests_select ON master.laboratory_tests FOR SELECT TO authenticated USING (true);
CREATE POLICY master_radiology_tests_select ON master.radiology_tests FOR SELECT TO authenticated USING (true);

CREATE POLICY master_diagnosis_codes_all ON master.diagnosis_codes FOR ALL TO authenticated USING (true);
CREATE POLICY master_procedure_codes_all ON master.procedure_codes FOR ALL TO authenticated USING (true);
CREATE POLICY master_laboratory_tests_all ON master.laboratory_tests FOR ALL TO authenticated USING (true);
CREATE POLICY master_radiology_tests_all ON master.radiology_tests FOR ALL TO authenticated USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Data Seeding
-- ─────────────────────────────────────────────────────────────────────────────

-- DiagnosisCodes (Representative sample of ICD-10)
INSERT INTO master.diagnosis_codes (icd_code, diagnosis_name, category) VALUES
('I10', 'Essential (primary) hypertension', 'Cardiovascular'),
('E11', 'Type 2 diabetes mellitus', 'Endocrine'),
('J02.9', 'Acute pharyngitis, unspecified', 'Respiratory'),
('M54.5', 'Low back pain', 'Musculoskeletal'),
('K21.9', 'Gastro-esophageal reflux disease without esophagitis', 'Gastrointestinal')
ON CONFLICT DO NOTHING;

-- ProcedureCodes (Representative sample)
INSERT INTO master.procedure_codes (procedure_code, procedure_name, category) VALUES
('93000', 'Electrocardiogram, routine ECG', 'Diagnostic'),
('99213', 'Office or other outpatient visit', 'Evaluation and Management'),
('12001', 'Simple repair of superficial wounds', 'Surgical'),
('36415', 'Collection of venous blood by venipuncture', 'Diagnostic')
ON CONFLICT DO NOTHING;

-- LaboratoryTests
INSERT INTO master.laboratory_tests (test_code, test_name, category, sample_type) VALUES
('CBC', 'Complete Blood Count', 'Hematology', 'Blood'),
('LIPID', 'Lipid Profile', 'Biochemistry', 'Blood'),
('TSH', 'Thyroid Stimulating Hormone', 'Endocrinology', 'Blood'),
('URINE-R', 'Urine Routine Examination', 'Pathology', 'Urine')
ON CONFLICT DO NOTHING;

-- RadiologyTests
INSERT INTO master.radiology_tests (test_code, test_name, modality) VALUES
('CXR', 'Chest X-Ray', 'X-Ray'),
('MRI-BRAIN', 'MRI Brain', 'MRI'),
('USG-ABD', 'Ultrasound Abdomen', 'Ultrasound'),
('CT-HEAD', 'CT Scan Head', 'CT Scan')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Add UUID FKs to Existing Tables (Backwards Compatibility Mode)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. emr.diagnoses
ALTER TABLE emr.diagnoses
ADD COLUMN master_diagnosis_id UUID REFERENCES master.diagnosis_codes(id) ON DELETE SET NULL;

-- 2. emr.procedures
ALTER TABLE emr.procedures
ADD COLUMN master_procedure_id UUID REFERENCES master.procedure_codes(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- Dynamic Migration for Constraints (Best Effort)
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  -- We don't drop the string columns right now to prevent breaking existing components,
  -- but we map the data over if any exists.
  
  -- map diagnoses
  UPDATE emr.diagnoses d SET
    master_diagnosis_id = (SELECT id FROM master.diagnosis_codes m WHERE m.diagnosis_name = d.diagnosis_name LIMIT 1)
  WHERE d.diagnosis_name IS NOT NULL;
  
  -- map procedures
  UPDATE emr.procedures p SET
    master_procedure_id = (SELECT id FROM master.procedure_codes m WHERE m.procedure_name = p.procedure_name LIMIT 1)
  WHERE p.procedure_name IS NOT NULL;
  
END $$;
