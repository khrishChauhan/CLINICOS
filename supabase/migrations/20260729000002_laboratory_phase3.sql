-- Laboratory Module Phase 3: Testing & Result Management
-- Schema: laboratory
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. LabTests
CREATE TABLE IF NOT EXISTS laboratory.lab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    lab_order_item_id UUID NOT NULL REFERENCES laboratory.lab_order_items(id) ON DELETE CASCADE,
    test_code VARCHAR(50),
    test_name VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    instrument VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Ordered',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LabResults
CREATE TABLE IF NOT EXISTS laboratory.lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    lab_test_id UUID NOT NULL REFERENCES laboratory.lab_tests(id) ON DELETE CASCADE,
    result_value TEXT,
    unit VARCHAR(50),
    reference_range VARCHAR(100),
    abnormal_flag VARCHAR(20) DEFAULT 'Normal',
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'Pending',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LabResultParameters (for composite tests like CBC, LFT, KFT)
CREATE TABLE IF NOT EXISTS laboratory.lab_result_parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_result_id UUID NOT NULL REFERENCES laboratory.lab_results(id) ON DELETE CASCADE,
    parameter_name VARCHAR(150) NOT NULL,
    parameter_value TEXT,
    unit VARCHAR(50),
    reference_range VARCHAR(100),
    abnormal_flag VARCHAR(20) DEFAULT 'Normal'
);

-- 4. EMR Clinical Timeline (lightweight event log)
CREATE TABLE IF NOT EXISTS emr.clinical_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    visit_id UUID NOT NULL REFERENCES emr.visits(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_description TEXT,
    event_date TIMESTAMPTZ DEFAULT NOW(),
    source_table VARCHAR(100),
    source_id UUID,
    recorded_by UUID,
    metadata JSONB
);

-- Indexes
CREATE INDEX idx_lab_tests_order_item ON laboratory.lab_tests(lab_order_item_id);
CREATE INDEX idx_lab_tests_status ON laboratory.lab_tests(status);
CREATE INDEX idx_lab_results_test ON laboratory.lab_results(lab_test_id);
CREATE INDEX idx_lab_result_params_result ON laboratory.lab_result_parameters(lab_result_id);
CREATE INDEX idx_clinical_timeline_visit ON emr.clinical_timeline(visit_id);
CREATE INDEX idx_clinical_timeline_patient ON emr.clinical_timeline(patient_id);

-- RLS
ALTER TABLE laboratory.lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.lab_result_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE emr.clinical_timeline ENABLE ROW LEVEL SECURITY;

-- Policies for lab_tests
CREATE POLICY lab_tests_isolation_policy ON laboratory.lab_tests
    FOR ALL TO authenticated
    USING (clinic_id IN (
        SELECT clinic_id FROM public.users WHERE id = auth.uid()
    ));

-- Policies for lab_results
CREATE POLICY lab_results_isolation_policy ON laboratory.lab_results
    FOR ALL TO authenticated
    USING (clinic_id IN (
        SELECT clinic_id FROM public.users WHERE id = auth.uid()
    ));

-- Policies for lab_result_parameters (inherited via lab_result)
CREATE POLICY lab_result_params_isolation_policy ON laboratory.lab_result_parameters
    FOR ALL TO authenticated
    USING (lab_result_id IN (
        SELECT id FROM laboratory.lab_results WHERE clinic_id IN (
            SELECT clinic_id FROM public.users WHERE id = auth.uid()
        )
    ));

-- Policy for clinical_timeline
CREATE POLICY clinical_timeline_isolation_policy ON emr.clinical_timeline
    FOR ALL TO authenticated
    USING (clinic_id IN (
        SELECT clinic_id FROM public.users WHERE id = auth.uid()
    ));

-- ─────────────────────────────────────────────────────────────────────────────
-- RPC: Atomic Result Verification + Order Status Sync + EMR Timeline Injection
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION laboratory.verify_lab_result_transaction(
    p_result_id UUID,
    p_verified_by UUID,
    p_clinic_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_lab_test_id UUID;
    v_lab_order_item_id UUID;
    v_lab_order_id UUID;
    v_visit_id UUID;
    v_patient_id UUID;
    v_test_name TEXT;
    v_timeline_id UUID;
BEGIN
    -- 1. Get the lab_test_id from lab_result
    SELECT lab_test_id INTO v_lab_test_id
    FROM laboratory.lab_results
    WHERE id = p_result_id;

    IF v_lab_test_id IS NULL THEN
        RAISE EXCEPTION 'Lab result % not found', p_result_id;
    END IF;

    -- 2. Get lab_order_item_id and test_name from lab_test
    SELECT lab_order_item_id, test_name INTO v_lab_order_item_id, v_test_name
    FROM laboratory.lab_tests
    WHERE id = v_lab_test_id;

    -- 3. Get lab_order_id from lab_order_item
    SELECT lab_order_id INTO v_lab_order_id
    FROM laboratory.lab_order_items
    WHERE id = v_lab_order_item_id;

    -- 4. Get visit_id and patient_id from lab_order
    SELECT visit_id, patient_id INTO v_visit_id, v_patient_id
    FROM laboratory.lab_orders
    WHERE id = v_lab_order_id;

    -- 5. Verify the lab_result
    UPDATE laboratory.lab_results
    SET status = 'Verified',
        verified_by = p_verified_by,
        verified_at = NOW(),
        updated_at = NOW()
    WHERE id = p_result_id;

    -- 6. Mark the lab_test as Completed
    UPDATE laboratory.lab_tests
    SET status = 'Completed',
        completed_at = NOW(),
        updated_at = NOW()
    WHERE id = v_lab_test_id;

    -- 7. Mark lab_order_item as Resulted
    UPDATE laboratory.lab_order_items
    SET status = 'Resulted'
    WHERE id = v_lab_order_item_id;

    -- 8. Check if all items are resulted; if so, update order
    UPDATE laboratory.lab_orders
    SET status = 'Resulted',
        updated_at = NOW()
    WHERE id = v_lab_order_id
    AND NOT EXISTS (
        SELECT 1 FROM laboratory.lab_order_items
        WHERE lab_order_id = v_lab_order_id
        AND status NOT IN ('Resulted', 'Cancelled')
    );

    -- 9. Inject event into EMR Clinical Timeline
    INSERT INTO emr.clinical_timeline (
        clinic_id, visit_id, patient_id,
        event_type, event_description,
        source_table, source_id,
        recorded_by
    ) VALUES (
        p_clinic_id,
        v_visit_id,
        v_patient_id,
        'Lab Result Verified',
        'Laboratory result for test "' || v_test_name || '" has been verified.',
        'laboratory.lab_results',
        p_result_id,
        p_verified_by
    ) RETURNING id INTO v_timeline_id;

    RETURN jsonb_build_object(
        'result_id', p_result_id,
        'lab_test_id', v_lab_test_id,
        'lab_order_id', v_lab_order_id,
        'timeline_id', v_timeline_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
