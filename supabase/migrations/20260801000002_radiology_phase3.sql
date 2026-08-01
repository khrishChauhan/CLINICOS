-- Radiology Module Phase 3: Imaging Workflow & PACS Integration
-- Schema: radiology
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. ImagingStudies
CREATE TABLE IF NOT EXISTS radiology.imaging_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    patient_id UUID NOT NULL, -- references patient.patients
    radiology_order_item_id UUID NOT NULL REFERENCES radiology.radiology_order_items(id) ON DELETE CASCADE,
    study_uid VARCHAR(100) NOT NULL UNIQUE, -- DICOM StudyInstanceUID
    accession_number VARCHAR(50) NOT NULL UNIQUE,
    modality VARCHAR(50) NOT NULL,
    study_description TEXT,
    performed_date TIMESTAMPTZ DEFAULT NOW(),
    technician_id UUID, -- references public.users
    equipment_id UUID, -- references radiology_equipment
    study_status VARCHAR(50) DEFAULT 'Acquired',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Sequence and Trigger for Accession Number (ACC-YYYYMMDD-XXXX)
CREATE SEQUENCE IF NOT EXISTS accession_number_seq;

CREATE OR REPLACE FUNCTION radiology.generate_accession_number()
RETURNS TRIGGER AS $$
DECLARE
    today_str TEXT;
    seq_val INT;
BEGIN
    today_str := to_char(CURRENT_DATE, 'YYYYMMDD');
    seq_val := nextval('accession_number_seq');
    NEW.accession_number := 'ACC-' || today_str || '-' || lpad(seq_val::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_accession_number
BEFORE INSERT ON radiology.imaging_studies
FOR EACH ROW
WHEN (NEW.accession_number IS NULL)
EXECUTE FUNCTION radiology.generate_accession_number();

-- 2. ImagingSeries
CREATE TABLE IF NOT EXISTS radiology.imaging_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    imaging_study_id UUID NOT NULL REFERENCES radiology.imaging_studies(id) ON DELETE CASCADE,
    series_uid VARCHAR(100) NOT NULL UNIQUE, -- DICOM SeriesInstanceUID
    series_number INT NOT NULL,
    modality VARCHAR(50),
    body_part VARCHAR(100),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 3. ImagingImages
CREATE TABLE IF NOT EXISTS radiology.imaging_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    imaging_series_id UUID NOT NULL REFERENCES radiology.imaging_series(id) ON DELETE CASCADE,
    image_uid VARCHAR(100) NOT NULL UNIQUE, -- DICOM SOPInstanceUID
    image_number INT NOT NULL,
    storage_path TEXT NOT NULL, -- Path in Supabase Storage bucket 'radiology_images'
    thumbnail_path TEXT, -- Optional separate thumbnail path
    image_format VARCHAR(20) DEFAULT 'DICOM',
    image_size INT, -- in bytes
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 4. PACSIntegration
CREATE TABLE IF NOT EXISTS radiology.pacs_integration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    imaging_study_id UUID NOT NULL REFERENCES radiology.imaging_studies(id) ON DELETE CASCADE,
    pacs_server VARCHAR(100) DEFAULT 'DefaultPACS',
    dicom_uid VARCHAR(100) NOT NULL, -- usually matches study_uid
    transfer_status VARCHAR(50) DEFAULT 'Pending', -- Pending, InProgress, Completed, Failed
    transfer_date TIMESTAMPTZ,
    retry_count INT DEFAULT 0,
    error_log TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage Bucket Setup
-- ─────────────────────────────────────────────────────────────────────────────
-- Ensure the storage bucket exists in the master storage schema
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'radiology_images',
  'radiology_images',
  FALSE, -- Private bucket
  104857600, -- 100MB limit per file
  ARRAY['image/jpeg', 'image/png', 'application/dicom']
) ON CONFLICT (id) DO NOTHING;

-- RLS on Storage Objects for radiology_images
-- Allowing users to upload and read only if they belong to a clinic (rudimentary isolation)
-- Real implementation would use user's clinic_id matching a folder path, e.g., clinic_id/study_id/image.dcm
-- For now we assume the application service layer validates clinic boundaries before signing URLs.

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes & RLS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX idx_img_studies_clinic ON radiology.imaging_studies(clinic_id);
CREATE INDEX idx_img_studies_patient ON radiology.imaging_studies(patient_id);
CREATE INDEX idx_img_series_study ON radiology.imaging_series(imaging_study_id);
CREATE INDEX idx_img_images_series ON radiology.imaging_images(imaging_series_id);
CREATE INDEX idx_pacs_study ON radiology.pacs_integration(imaging_study_id);

ALTER TABLE radiology.imaging_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology.imaging_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology.imaging_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology.pacs_integration ENABLE ROW LEVEL SECURITY;

CREATE POLICY imaging_studies_clinic_isolation_policy ON radiology.imaging_studies
    FOR ALL TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY imaging_series_clinic_isolation_policy ON radiology.imaging_series
    FOR ALL TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY imaging_images_clinic_isolation_policy ON radiology.imaging_images
    FOR ALL TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY pacs_integration_clinic_isolation_policy ON radiology.pacs_integration
    FOR ALL TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
