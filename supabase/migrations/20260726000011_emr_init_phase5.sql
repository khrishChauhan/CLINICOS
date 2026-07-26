-- EMR Module Phase 5: Historical Tracking & Audit Logging
-- Schema: emr
-- Creates: diagnosis_history, emr_audit

-- ─────────────────────────────────────────────────────────────────────────────
-- Diagnosis History
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emr.diagnosis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES emr.visits(id) ON DELETE CASCADE,
    
    diagnosis_name TEXT NOT NULL,
    diagnosis_date TIMESTAMPTZ NOT NULL,
    resolved_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    status VARCHAR(50) NOT NULL, -- e.g., 'Resolved', 'Ruled Out'
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diagnosis_history_patient ON emr.diagnosis_history(patient_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- EMR Audit
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emr.emr_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES emr.visits(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    
    action VARCHAR(100) NOT NULL, -- 'CREATED', 'UPDATED', 'DELETED', 'RESOLVED', 'VIEWED'
    action_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    
    previous_value JSONB,
    new_value JSONB,
    
    ip_address VARCHAR(45),
    action_time TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_emr_audit_visit ON emr.emr_audit(visit_id);
CREATE INDEX IF NOT EXISTS idx_emr_audit_patient ON emr.emr_audit(patient_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS Policies
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE emr.diagnosis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE emr.emr_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY emr_diagnosis_history_policy ON emr.diagnosis_history 
    FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- IMMUTABLE AUDIT LOGS: Only SELECT and INSERT allowed
CREATE POLICY emr_audit_select_policy ON emr.emr_audit 
    FOR SELECT USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY emr_audit_insert_policy ON emr.emr_audit 
    FOR INSERT WITH CHECK (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Hard revoke of UPDATE/DELETE at the database level for authenticated users
REVOKE UPDATE, DELETE ON emr.emr_audit FROM authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- Transactional Diagnosis Resolution (RPC)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION emr.resolve_diagnosis_tx(
  p_diagnosis_id UUID,
  p_status VARCHAR,
  p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_diag RECORD;
BEGIN
  -- 1. Fetch existing diagnosis
  SELECT * INTO v_diag FROM emr.diagnoses WHERE id = p_diagnosis_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Diagnosis not found';
  END IF;

  -- 2. Update the diagnosis
  UPDATE emr.diagnoses
  SET status = p_status, updated_at = now()
  WHERE id = p_diagnosis_id;

  -- 3. Insert into diagnosis_history
  INSERT INTO emr.diagnosis_history (
    clinic_id, patient_id, visit_id, diagnosis_name, diagnosis_date, status, resolved_date
  ) VALUES (
    v_diag.clinic_id,
    v_diag.patient_id,
    v_diag.visit_id,
    v_diag.diagnosis_name,
    v_diag.created_at,
    p_status,
    now()
  );

  RETURN jsonb_build_object('success', true, 'message', 'Diagnosis resolved transactionally');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
