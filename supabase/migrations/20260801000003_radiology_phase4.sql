-- Radiology Module Phase 4: Radiologist Reporting Workflow
-- Schema: radiology
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. RadiologyReports
CREATE TABLE IF NOT EXISTS radiology.radiology_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    imaging_study_id UUID NOT NULL REFERENCES radiology.imaging_studies(id) ON DELETE CASCADE,
    radiologist_id UUID NOT NULL, -- references public.users (doctors)
    report_number VARCHAR(50) NOT NULL UNIQUE,
    version_number INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Verified, Approved
    verified_date TIMESTAMPTZ,
    approved_date TIMESTAMPTZ,
    digital_signature_id UUID, -- reference to existing signatures if needed or string path
    pdf_storage_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Sequence and Trigger for Report Number (RAD-REP-YYYYMMDD-XXXX)
CREATE SEQUENCE IF NOT EXISTS radiology_report_number_seq;

CREATE OR REPLACE FUNCTION radiology.generate_radiology_report_number()
RETURNS TRIGGER AS $$
DECLARE
    today_str TEXT;
    seq_val INT;
BEGIN
    today_str := to_char(CURRENT_DATE, 'YYYYMMDD');
    seq_val := nextval('radiology_report_number_seq');
    NEW.report_number := 'RAD-REP-' || today_str || '-' || lpad(seq_val::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_radiology_report_number
BEFORE INSERT ON radiology.radiology_reports
FOR EACH ROW
WHEN (NEW.report_number IS NULL)
EXECUTE FUNCTION radiology.generate_radiology_report_number();

-- 2. RadiologistFindings
CREATE TABLE IF NOT EXISTS radiology.radiologist_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    radiology_report_id UUID NOT NULL REFERENCES radiology.radiology_reports(id) ON DELETE CASCADE,
    clinical_history TEXT,
    technique TEXT,
    findings TEXT,
    impression TEXT,
    recommendations TEXT,
    is_critical_finding BOOLEAN DEFAULT FALSE,
    follow_up_recommendation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(radiology_report_id) -- 1:1 mapped to report version
);

-- 3. ContrastAdministration
CREATE TABLE IF NOT EXISTS radiology.contrast_administration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    imaging_study_id UUID NOT NULL REFERENCES radiology.imaging_studies(id) ON DELETE CASCADE,
    contrast_agent VARCHAR(150) NOT NULL,
    dose VARCHAR(50) NOT NULL,
    route VARCHAR(50) NOT NULL,
    administered_by UUID NOT NULL, -- references public.users
    administration_time TIMESTAMPTZ NOT NULL,
    reaction TEXT, -- adverse reaction notes
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 4. RadiationDose
CREATE TABLE IF NOT EXISTS radiology.radiation_dose (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    imaging_study_id UUID NOT NULL REFERENCES radiology.imaging_studies(id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES radiology.radiology_equipment(id),
    dose_value NUMERIC NOT NULL,
    dose_unit VARCHAR(20) NOT NULL, -- e.g., mGy, mSv
    exposure_time INT, -- in seconds or ms
    operator_id UUID NOT NULL, -- references public.users (technician/doctor)
    reference_level VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage Bucket Setup
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'radiology_reports',
  'radiology_reports',
  FALSE, -- Private bucket
  104857600, -- 100MB limit per file
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes & RLS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX idx_rad_reports_study ON radiology.radiology_reports(imaging_study_id);
CREATE INDEX idx_rad_reports_clinic ON radiology.radiology_reports(clinic_id);
CREATE INDEX idx_rad_reports_doc ON radiology.radiology_reports(radiologist_id);
CREATE INDEX idx_rad_findings_report ON radiology.radiologist_findings(radiology_report_id);

ALTER TABLE radiology.radiology_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology.radiologist_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology.contrast_administration ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology.radiation_dose ENABLE ROW LEVEL SECURITY;

CREATE POLICY radiology_reports_clinic_isolation_policy ON radiology.radiology_reports
    FOR ALL TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY radiologist_findings_clinic_isolation_policy ON radiology.radiologist_findings
    FOR ALL TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY contrast_admin_clinic_isolation_policy ON radiology.contrast_administration
    FOR ALL TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY radiation_dose_clinic_isolation_policy ON radiology.radiation_dose
    FOR ALL TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Strict Immutable Policies for Approved Reports
-- If a report is Approved, prevent UPDATE/DELETE
CREATE POLICY radiology_reports_immutable_approved_update ON radiology.radiology_reports
    FOR UPDATE TO authenticated
    USING (status != 'Approved');

CREATE POLICY radiology_reports_immutable_approved_delete ON radiology.radiology_reports
    FOR DELETE TO authenticated
    USING (status != 'Approved');

-- ─────────────────────────────────────────────────────────────────────────────
-- RPC: approve_radiology_report (Transactional)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION radiology.approve_radiology_report(
  p_report_id UUID,
  p_pdf_storage_path TEXT,
  p_digital_signature_id UUID,
  p_is_critical BOOLEAN,
  p_patient_id UUID,
  p_doctor_id UUID
) RETURNS VOID AS $$
DECLARE
  v_study_id UUID;
  v_report_number VARCHAR;
  v_clinic_id UUID;
  v_event_id UUID;
BEGIN
  -- 1. Lock and Update Report
  SELECT imaging_study_id, report_number, clinic_id INTO v_study_id, v_report_number, v_clinic_id
  FROM radiology.radiology_reports
  WHERE id = p_report_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Report not found.';
  END IF;

  UPDATE radiology.radiology_reports
  SET status = 'Approved',
      approved_date = NOW(),
      digital_signature_id = p_digital_signature_id,
      pdf_storage_path = p_pdf_storage_path
  WHERE id = p_report_id;

  -- 2. Mark Study as Reported
  UPDATE radiology.imaging_studies
  SET study_status = 'Reported'
  WHERE id = v_study_id;

  -- 3. Inject EMR Timeline Event
  INSERT INTO emr.timeline_events (
    clinic_id, patient_id, doctor_id, event_type, event_date, description, reference_id, reference_type, priority, status
  ) VALUES (
    v_clinic_id, 
    p_patient_id, 
    p_doctor_id, 
    'radiology_report_approved', 
    NOW(), 
    CASE WHEN p_is_critical THEN 'CRITICAL ALERT: Radiology Report Approved (' || v_report_number || ')' 
         ELSE 'Radiology Report Approved (' || v_report_number || ')' END,
    p_report_id, 
    'radiology_report', 
    CASE WHEN p_is_critical THEN 'High' ELSE 'Normal' END, 
    'Active'
  ) RETURNING id INTO v_event_id;

  -- End transaction implicitly
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
