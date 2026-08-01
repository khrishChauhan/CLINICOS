-- Radiology Module Phase 1: Order & Scheduling Foundation
-- Schema: radiology
-- ─────────────────────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS radiology;

-- 1. RadiologyOrders
CREATE TABLE IF NOT EXISTS radiology.radiology_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL, -- references core.clinics
    patient_id UUID NOT NULL, -- references patient.patients
    visit_id UUID NOT NULL, -- references emr.visits
    appointment_id UUID, -- references appointment.appointments (optional)
    doctor_id UUID NOT NULL, -- references doctor.doctors
    order_number VARCHAR(50) UNIQUE,
    order_date TIMESTAMPTZ DEFAULT NOW(),
    priority VARCHAR(20) DEFAULT 'Routine',
    clinical_indication TEXT,
    status VARCHAR(50) DEFAULT 'Ordered',
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Sequence and Trigger for Order Number (RAD-YYYYMMDD-XXXX)
CREATE SEQUENCE IF NOT EXISTS radiology_order_seq;

CREATE OR REPLACE FUNCTION radiology.generate_radiology_order_number()
RETURNS TRIGGER AS $$
DECLARE
    today_str TEXT;
    seq_val INT;
BEGIN
    today_str := to_char(CURRENT_DATE, 'YYYYMMDD');
    seq_val := nextval('radiology_order_seq');
    NEW.order_number := 'RAD-' || today_str || '-' || lpad(seq_val::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_radiology_orders_number
BEFORE INSERT ON radiology.radiology_orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION radiology.generate_radiology_order_number();

-- 2. RadiologyOrderItems
CREATE TABLE IF NOT EXISTS radiology.radiology_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    radiology_order_id UUID NOT NULL REFERENCES radiology.radiology_orders(id) ON DELETE CASCADE,
    imaging_test_id UUID NOT NULL, -- references master.radiology_tests
    imaging_name VARCHAR(150) NOT NULL,
    body_part VARCHAR(100),
    contrast_required BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'Routine',
    status VARCHAR(50) DEFAULT 'Ordered',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RadiologySchedule
CREATE TABLE IF NOT EXISTS radiology.radiology_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    radiology_order_item_id UUID NOT NULL REFERENCES radiology.radiology_order_items(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    room_id UUID, -- references generic rooms or users
    technician_id UUID, -- references public.users
    estimated_duration INT DEFAULT 30, -- in minutes
    status VARCHAR(50) DEFAULT 'Scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_rad_orders_clinic ON radiology.radiology_orders(clinic_id);
CREATE INDEX idx_rad_orders_patient ON radiology.radiology_orders(patient_id);
CREATE INDEX idx_rad_orders_visit ON radiology.radiology_orders(visit_id);
CREATE INDEX idx_rad_orders_doctor ON radiology.radiology_orders(doctor_id);
CREATE INDEX idx_rad_order_items_order ON radiology.radiology_order_items(radiology_order_id);
CREATE INDEX idx_rad_schedule_item ON radiology.radiology_schedule(radiology_order_item_id);
CREATE INDEX idx_rad_schedule_date ON radiology.radiology_schedule(scheduled_date);
CREATE INDEX idx_rad_schedule_room ON radiology.radiology_schedule(room_id);
CREATE INDEX idx_rad_schedule_tech ON radiology.radiology_schedule(technician_id);

-- RLS
ALTER TABLE radiology.radiology_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology.radiology_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology.radiology_schedule ENABLE ROW LEVEL SECURITY;

-- Policies for radiology_orders
CREATE POLICY radiology_orders_clinic_isolation_policy ON radiology.radiology_orders
    FOR ALL
    TO authenticated
    USING (clinic_id IN (
        SELECT clinic_id FROM public.users WHERE id = auth.uid()
    ));

-- Policies for radiology_order_items (inherited from order via subquery)
CREATE POLICY radiology_order_items_isolation_policy ON radiology.radiology_order_items
    FOR ALL
    TO authenticated
    USING (radiology_order_id IN (
        SELECT id FROM radiology.radiology_orders WHERE clinic_id IN (
            SELECT clinic_id FROM public.users WHERE id = auth.uid()
        )
    ));

-- Policies for radiology_schedule (inherited from order items via join)
CREATE POLICY radiology_schedule_isolation_policy ON radiology.radiology_schedule
    FOR ALL
    TO authenticated
    USING (radiology_order_item_id IN (
        SELECT roi.id 
        FROM radiology.radiology_order_items roi
        JOIN radiology.radiology_orders ro ON ro.id = roi.radiology_order_id
        WHERE ro.clinic_id IN (
            SELECT clinic_id FROM public.users WHERE id = auth.uid()
        )
    ));

-- ─────────────────────────────────────────────────────────────────────────────
-- RPC 1: Transactional Creation of EMR Order + Radiology Order + Items
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION radiology.create_clinical_and_radiology_order(
  p_clinic_id UUID,
  p_patient_id UUID,
  p_visit_id UUID,
  p_doctor_id UUID,
  p_appointment_id UUID,
  p_priority VARCHAR,
  p_clinical_indication TEXT,
  p_items JSONB, -- Array of { imaging_test_id, imaging_name, body_part, contrast_required, remarks }
  p_created_by UUID
) RETURNS JSONB AS $$
DECLARE
  v_rad_order_id UUID;
  v_clinical_order_id UUID;
  v_item JSONB;
BEGIN
  -- 1. Create EMR Clinical Order
  INSERT INTO emr.clinical_orders (
    clinic_id, patient_id, visit_id, order_type, ordered_by, status
  ) VALUES (
    p_clinic_id, p_patient_id, p_visit_id, 'Radiology', p_created_by, 'Ordered'
  ) RETURNING id INTO v_clinical_order_id;

  -- 2. Create Radiology Order
  INSERT INTO radiology.radiology_orders (
    clinic_id, patient_id, visit_id, appointment_id, doctor_id, 
    priority, clinical_indication, status, created_by
  ) VALUES (
    p_clinic_id, p_patient_id, p_visit_id, p_appointment_id, p_doctor_id,
    p_priority, p_clinical_indication, 'Ordered', p_created_by
  ) RETURNING id INTO v_rad_order_id;

  -- Update EMR order reference
  UPDATE emr.clinical_orders 
  SET order_reference = v_rad_order_id::text 
  WHERE id = v_clinical_order_id;

  -- 3. Insert Radiology Order Items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO radiology.radiology_order_items (
      radiology_order_id, imaging_test_id, imaging_name, body_part, contrast_required, priority, status, remarks
    ) VALUES (
      v_rad_order_id, 
      (v_item->>'imaging_test_id')::uuid, 
      v_item->>'imaging_name', 
      v_item->>'body_part', 
      COALESCE((v_item->>'contrast_required')::boolean, FALSE),
      p_priority,
      'Ordered', 
      v_item->>'remarks'
    );
  END LOOP;

  RETURN jsonb_build_object(
    'radiology_order_id', v_rad_order_id,
    'clinical_order_id', v_clinical_order_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────────────────────────────────────────
-- RPC 2: Transactional Schedule Creation with Conflict Detection
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION radiology.schedule_radiology_transaction(
  p_radiology_order_item_id UUID,
  p_scheduled_date DATE,
  p_scheduled_time TIME,
  p_room_id UUID,
  p_technician_id UUID,
  p_estimated_duration INT
) RETURNS UUID AS $$
DECLARE
  v_end_time TIME;
  v_conflict_count INT;
  v_schedule_id UUID;
BEGIN
  -- Calculate end time
  v_end_time := p_scheduled_time + (p_estimated_duration || ' minutes')::interval;

  -- Room Conflict Check
  IF p_room_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_conflict_count
    FROM radiology.radiology_schedule
    WHERE scheduled_date = p_scheduled_date
      AND room_id = p_room_id
      AND status != 'Cancelled'
      AND (
        (p_scheduled_time >= scheduled_time AND p_scheduled_time < (scheduled_time + (estimated_duration || ' minutes')::interval))
        OR 
        (v_end_time > scheduled_time AND v_end_time <= (scheduled_time + (estimated_duration || ' minutes')::interval))
        OR
        (p_scheduled_time <= scheduled_time AND v_end_time >= (scheduled_time + (estimated_duration || ' minutes')::interval))
      );

    IF v_conflict_count > 0 THEN
      RAISE EXCEPTION 'Room % is already booked during this time slot.', p_room_id;
    END IF;
  END IF;

  -- Technician Conflict Check
  IF p_technician_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_conflict_count
    FROM radiology.radiology_schedule
    WHERE scheduled_date = p_scheduled_date
      AND technician_id = p_technician_id
      AND status != 'Cancelled'
      AND (
        (p_scheduled_time >= scheduled_time AND p_scheduled_time < (scheduled_time + (estimated_duration || ' minutes')::interval))
        OR 
        (v_end_time > scheduled_time AND v_end_time <= (scheduled_time + (estimated_duration || ' minutes')::interval))
        OR
        (p_scheduled_time <= scheduled_time AND v_end_time >= (scheduled_time + (estimated_duration || ' minutes')::interval))
      );

    IF v_conflict_count > 0 THEN
      RAISE EXCEPTION 'Technician % is already booked during this time slot.', p_technician_id;
    END IF;
  END IF;

  -- Insert the schedule
  INSERT INTO radiology.radiology_schedule (
    radiology_order_item_id, scheduled_date, scheduled_time, room_id, technician_id, estimated_duration, status
  ) VALUES (
    p_radiology_order_item_id, p_scheduled_date, p_scheduled_time, p_room_id, p_technician_id, p_estimated_duration, 'Scheduled'
  ) RETURNING id INTO v_schedule_id;

  -- Update Order Item status
  UPDATE radiology.radiology_order_items
  SET status = 'Scheduled'
  WHERE id = p_radiology_order_item_id;

  RETURN v_schedule_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
