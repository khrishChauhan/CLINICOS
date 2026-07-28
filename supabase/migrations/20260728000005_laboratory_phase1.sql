-- Laboratory Module Phase 1: Order Management Foundation
-- Schema: laboratory
-- ─────────────────────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS laboratory;

-- 1. LabOrders
CREATE TABLE IF NOT EXISTS laboratory.lab_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL, -- references core.clinics
    patient_id UUID NOT NULL, -- references patient.patients
    visit_id UUID NOT NULL, -- references emr.visits
    appointment_id UUID, -- references appointment.appointments (optional)
    doctor_id UUID NOT NULL, -- references doctor.doctors
    order_number VARCHAR(50) UNIQUE,
    order_date TIMESTAMPTZ DEFAULT NOW(),
    priority VARCHAR(20) DEFAULT 'Routine',
    status VARCHAR(50) DEFAULT 'Ordered',
    remarks TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sequence and Trigger for Order Number (LAB-YYYYMMDD-XXXX)
CREATE SEQUENCE IF NOT EXISTS laboratory_order_seq;

CREATE OR REPLACE FUNCTION laboratory.generate_lab_order_number()
RETURNS TRIGGER AS $$
DECLARE
    today_str TEXT;
    seq_val INT;
BEGIN
    today_str := to_char(CURRENT_DATE, 'YYYYMMDD');
    seq_val := nextval('laboratory_order_seq');
    NEW.order_number := 'LAB-' || today_str || '-' || lpad(seq_val::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lab_orders_number
BEFORE INSERT ON laboratory.lab_orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION laboratory.generate_lab_order_number();

-- 2. LabOrderItems
CREATE TABLE IF NOT EXISTS laboratory.lab_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_order_id UUID NOT NULL REFERENCES laboratory.lab_orders(id) ON DELETE CASCADE,
    test_id UUID NOT NULL, -- references master.laboratory_tests
    test_name VARCHAR(150) NOT NULL,
    sample_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Ordered',
    remarks TEXT
);

-- Indexes
CREATE INDEX idx_lab_orders_clinic ON laboratory.lab_orders(clinic_id);
CREATE INDEX idx_lab_orders_patient ON laboratory.lab_orders(patient_id);
CREATE INDEX idx_lab_orders_visit ON laboratory.lab_orders(visit_id);
CREATE INDEX idx_lab_orders_doctor ON laboratory.lab_orders(doctor_id);
CREATE INDEX idx_lab_order_items_order ON laboratory.lab_order_items(lab_order_id);

-- RLS
ALTER TABLE laboratory.lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.lab_order_items ENABLE ROW LEVEL SECURITY;

-- Policies for lab_orders
CREATE POLICY lab_orders_clinic_isolation_policy ON laboratory.lab_orders
    FOR ALL
    TO authenticated
    USING (clinic_id IN (
        SELECT clinic_id FROM public.users WHERE id = auth.uid()
    ));

-- Policies for lab_order_items (inherited from order via subquery)
CREATE POLICY lab_order_items_isolation_policy ON laboratory.lab_order_items
    FOR ALL
    TO authenticated
    USING (lab_order_id IN (
        SELECT id FROM laboratory.lab_orders WHERE clinic_id IN (
            SELECT clinic_id FROM public.users WHERE id = auth.uid()
        )
    ));

-- ─────────────────────────────────────────────────────────────────────────────
-- RPC: Transactional Creation of EMR Order + Lab Order + Lab Items
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION laboratory.create_clinical_and_lab_order(
  p_clinic_id UUID,
  p_patient_id UUID,
  p_visit_id UUID,
  p_doctor_id UUID,
  p_appointment_id UUID,
  p_priority VARCHAR,
  p_remarks TEXT,
  p_items JSONB, -- Array of { test_id, test_name, sample_type, remarks }
  p_created_by UUID
) RETURNS JSONB AS $$
DECLARE
  v_lab_order_id UUID;
  v_clinical_order_id UUID;
  v_item JSONB;
BEGIN
  -- 1. Create EMR Clinical Order
  INSERT INTO emr.clinical_orders (
    clinic_id, patient_id, visit_id, order_type, ordered_by, status
  ) VALUES (
    p_clinic_id, p_patient_id, p_visit_id, 'Laboratory', p_created_by, 'Ordered'
  ) RETURNING id INTO v_clinical_order_id;

  -- 2. Create Lab Order
  INSERT INTO laboratory.lab_orders (
    clinic_id, patient_id, visit_id, appointment_id, doctor_id, 
    priority, status, remarks, created_by
  ) VALUES (
    p_clinic_id, p_patient_id, p_visit_id, p_appointment_id, p_doctor_id,
    p_priority, 'Ordered', p_remarks, p_created_by
  ) RETURNING id INTO v_lab_order_id;

  -- Update EMR order reference
  UPDATE emr.clinical_orders 
  SET order_reference = v_lab_order_id::text 
  WHERE id = v_clinical_order_id;

  -- 3. Insert Lab Order Items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO laboratory.lab_order_items (
      lab_order_id, test_id, test_name, sample_type, status, remarks
    ) VALUES (
      v_lab_order_id, 
      (v_item->>'test_id')::uuid, 
      v_item->>'test_name', 
      v_item->>'sample_type', 
      'Ordered', 
      v_item->>'remarks'
    );
  END LOOP;

  RETURN jsonb_build_object(
    'lab_order_id', v_lab_order_id,
    'clinical_order_id', v_clinical_order_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
