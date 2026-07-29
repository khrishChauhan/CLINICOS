-- Laboratory Module Phase 4: Reporting & Operations
-- Schema: laboratory
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. LabTechnicians
CREATE TABLE IF NOT EXISTS laboratory.lab_technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    qualification VARCHAR(150),
    registration_number VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clinic_id, user_id)
);

-- 2. LabInstruments
CREATE TABLE IF NOT EXISTS laboratory.lab_instruments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    instrument_code VARCHAR(50) NOT NULL,
    instrument_name VARCHAR(150) NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Active',
    commissioned_date DATE,
    last_calibrated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clinic_id, instrument_code)
);

-- 3. LabQualityControl (immutable log — no updates allowed by design)
CREATE TABLE IF NOT EXISTS laboratory.lab_quality_control (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    instrument_id UUID NOT NULL REFERENCES laboratory.lab_instruments(id) ON DELETE CASCADE,
    qc_date DATE NOT NULL DEFAULT CURRENT_DATE,
    qc_type VARCHAR(100) NOT NULL,
    performed_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    result VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
    -- NOTE: No updated_at — QC records are immutable by design
);

-- 4. LabReports
CREATE TABLE IF NOT EXISTS laboratory.lab_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    lab_order_id UUID NOT NULL REFERENCES laboratory.lab_orders(id) ON DELETE CASCADE,
    report_number VARCHAR(50) UNIQUE,
    generated_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    report_status VARCHAR(50) DEFAULT 'Draft',
    storage_path TEXT,          -- Private bucket path: lab_reports/{clinic_id}/{report_number}.pdf
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sequence and trigger for report number (RPT-YYYYMMDD-XXXX)
CREATE SEQUENCE IF NOT EXISTS laboratory_report_seq;

CREATE OR REPLACE FUNCTION laboratory.generate_lab_report_number()
RETURNS TRIGGER AS $$
DECLARE
    today_str TEXT;
    seq_val INT;
BEGIN
    today_str := to_char(CURRENT_DATE, 'YYYYMMDD');
    seq_val := nextval('laboratory_report_seq');
    NEW.report_number := 'RPT-' || today_str || '-' || lpad(seq_val::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lab_report_number
BEFORE INSERT ON laboratory.lab_reports
FOR EACH ROW
WHEN (NEW.report_number IS NULL)
EXECUTE FUNCTION laboratory.generate_lab_report_number();

-- Indexes
CREATE INDEX idx_lab_technicians_clinic ON laboratory.lab_technicians(clinic_id);
CREATE INDEX idx_lab_instruments_clinic ON laboratory.lab_instruments(clinic_id);
CREATE INDEX idx_lab_qc_instrument ON laboratory.lab_quality_control(instrument_id);
CREATE INDEX idx_lab_reports_order ON laboratory.lab_reports(lab_order_id);
CREATE INDEX idx_lab_reports_clinic ON laboratory.lab_reports(clinic_id);

-- RLS
ALTER TABLE laboratory.lab_technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.lab_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.lab_quality_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.lab_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY lab_technicians_isolation ON laboratory.lab_technicians
    FOR ALL TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY lab_instruments_isolation ON laboratory.lab_instruments
    FOR ALL TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY lab_qc_isolation ON laboratory.lab_quality_control
    FOR ALL TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY lab_reports_isolation ON laboratory.lab_reports
    FOR ALL TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- ─────────────────────────────────────────────────────────────────────────────
-- RPC: Atomic Report Generation + Lab Order Completion + EMR Timeline Injection
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION laboratory.generate_lab_report_transaction(
    p_lab_order_id UUID,
    p_generated_by UUID,
    p_clinic_id UUID,
    p_storage_path TEXT,
    p_remarks TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_report_id UUID;
    v_report_number TEXT;
    v_visit_id UUID;
    v_patient_id UUID;
    v_timeline_id UUID;
BEGIN
    -- Verify lab order exists and belongs to clinic
    SELECT visit_id, patient_id INTO v_visit_id, v_patient_id
    FROM laboratory.lab_orders
    WHERE id = p_lab_order_id AND clinic_id = p_clinic_id;

    IF v_visit_id IS NULL THEN
        RAISE EXCEPTION 'Lab order % not found or not accessible', p_lab_order_id;
    END IF;

    -- 1. Insert the Lab Report record
    INSERT INTO laboratory.lab_reports (
        clinic_id, lab_order_id, generated_by, storage_path, report_status, remarks
    ) VALUES (
        p_clinic_id, p_lab_order_id, p_generated_by, p_storage_path, 'Draft', p_remarks
    ) RETURNING id, report_number INTO v_report_id, v_report_number;

    -- 2. Mark the Lab Order as Completed
    UPDATE laboratory.lab_orders
    SET status = 'Completed',
        updated_at = NOW()
    WHERE id = p_lab_order_id;

    -- 3. Inject event into EMR Clinical Timeline
    INSERT INTO emr.clinical_timeline (
        clinic_id, visit_id, patient_id,
        event_type, event_description,
        source_table, source_id,
        recorded_by
    ) VALUES (
        p_clinic_id,
        v_visit_id,
        v_patient_id,
        'Lab Report Generated',
        'Laboratory report ' || v_report_number || ' has been generated and is pending approval.',
        'laboratory.lab_reports',
        v_report_id,
        p_generated_by
    ) RETURNING id INTO v_timeline_id;

    RETURN jsonb_build_object(
        'report_id', v_report_id,
        'report_number', v_report_number,
        'timeline_id', v_timeline_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
