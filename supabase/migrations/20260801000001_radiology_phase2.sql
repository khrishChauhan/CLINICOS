-- Radiology Module Phase 2: Operations Foundation
-- Schema: radiology
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. RadiologyEquipment
CREATE TABLE IF NOT EXISTS radiology.radiology_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    equipment_code VARCHAR(50) NOT NULL UNIQUE,
    equipment_name VARCHAR(150) NOT NULL,
    modality VARCHAR(50) NOT NULL, -- e.g. MRI, CT, X-Ray
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    installation_date DATE,
    warranty_expiry DATE,
    amc_expiry DATE,
    calibration_due DATE,
    maintenance_due DATE,
    status VARCHAR(50) DEFAULT 'Active', -- Active, Maintenance, Calibration, Out of Service, Retired
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. RadiologyTechnicians
CREATE TABLE IF NOT EXISTS radiology.radiology_technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    employee_id UUID NOT NULL, -- references public.users
    qualification VARCHAR(150),
    registration_number VARCHAR(100),
    specialization VARCHAR(150),
    assigned_equipment JSONB, -- list of modality/equipment types
    shift VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(clinic_id, employee_id)
);

-- 3. RadiologyQualityControl
CREATE TABLE IF NOT EXISTS radiology.radiology_quality_control (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    equipment_id UUID NOT NULL REFERENCES radiology.radiology_equipment(id),
    qc_date DATE NOT NULL,
    qc_type VARCHAR(50) NOT NULL, -- Daily, Weekly, Monthly, Calibration, Maintenance
    performed_by UUID NOT NULL, -- references public.users (technician)
    result VARCHAR(50) NOT NULL, -- Pass, Fail, Warning
    remarks TEXT,
    status VARCHAR(50) DEFAULT 'Completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_rad_equip_clinic ON radiology.radiology_equipment(clinic_id);
CREATE INDEX idx_rad_tech_clinic ON radiology.radiology_technicians(clinic_id);
CREATE INDEX idx_rad_tech_emp ON radiology.radiology_technicians(employee_id);
CREATE INDEX idx_rad_qc_clinic ON radiology.radiology_quality_control(clinic_id);
CREATE INDEX idx_rad_qc_equip ON radiology.radiology_quality_control(equipment_id);

-- RLS
ALTER TABLE radiology.radiology_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology.radiology_technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology.radiology_quality_control ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY radiology_equipment_clinic_isolation_policy ON radiology.radiology_equipment
    FOR ALL TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY radiology_technicians_clinic_isolation_policy ON radiology.radiology_technicians
    FOR ALL TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Strict Immutable Policy for QC
CREATE POLICY radiology_qc_insert_policy ON radiology.radiology_quality_control
    FOR INSERT TO authenticated
    WITH CHECK (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY radiology_qc_select_policy ON radiology.radiology_quality_control
    FOR SELECT TO authenticated
    USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Notice: NO UPDATE or DELETE policies are created for radiology_quality_control, making it immutable for standard authenticated users.


-- ─────────────────────────────────────────────────────────────────────────────
-- RPC Update: schedule_radiology_transaction with TOCTOU Prevention
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION radiology.schedule_radiology_transaction(
  p_radiology_order_item_id UUID,
  p_scheduled_date DATE,
  p_scheduled_time TIME,
  p_equipment_id UUID, -- using equipment_id instead of room_id for scheduling
  p_technician_id UUID,
  p_estimated_duration INT
) RETURNS UUID AS $$
DECLARE
  v_end_time TIME;
  v_conflict_count INT;
  v_schedule_id UUID;
  v_equip_status VARCHAR;
BEGIN
  -- Calculate end time
  v_end_time := p_scheduled_time + (p_estimated_duration || ' minutes')::interval;

  -- Equipment Lock & Verification
  IF p_equipment_id IS NOT NULL THEN
    -- SELECT FOR UPDATE prevents TOCTOU race conditions
    SELECT status INTO v_equip_status 
    FROM radiology.radiology_equipment 
    WHERE id = p_equipment_id 
    FOR UPDATE;

    IF v_equip_status IN ('Out of Service', 'Retired', 'Maintenance') THEN
      RAISE EXCEPTION 'Equipment % is currently % and cannot be scheduled.', p_equipment_id, v_equip_status;
    END IF;

    -- Room/Equipment Conflict Check
    SELECT COUNT(*) INTO v_conflict_count
    FROM radiology.radiology_schedule
    WHERE scheduled_date = p_scheduled_date
      AND room_id = p_equipment_id -- room_id mapped to equipment_id
      AND status != 'Cancelled'
      AND (
        (p_scheduled_time >= scheduled_time AND p_scheduled_time < (scheduled_time + (estimated_duration || ' minutes')::interval))
        OR 
        (v_end_time > scheduled_time AND v_end_time <= (scheduled_time + (estimated_duration || ' minutes')::interval))
        OR
        (p_scheduled_time <= scheduled_time AND v_end_time >= (scheduled_time + (estimated_duration || ' minutes')::interval))
      ) FOR UPDATE; -- lock overlapping schedules (if any) to prevent concurrent inserts

    IF v_conflict_count > 0 THEN
      RAISE EXCEPTION 'Equipment % is already booked during this time slot.', p_equipment_id;
    END IF;
  END IF;

  -- Technician Lock & Conflict Check
  IF p_technician_id IS NOT NULL THEN
    -- SELECT FOR UPDATE to lock technician row
    PERFORM 1 FROM radiology.radiology_technicians WHERE id = p_technician_id FOR UPDATE;

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
      ) FOR UPDATE;

    IF v_conflict_count > 0 THEN
      RAISE EXCEPTION 'Technician % is already booked during this time slot.', p_technician_id;
    END IF;
  END IF;

  -- Insert the schedule
  INSERT INTO radiology.radiology_schedule (
    radiology_order_item_id, scheduled_date, scheduled_time, room_id, technician_id, estimated_duration, status
  ) VALUES (
    p_radiology_order_item_id, p_scheduled_date, p_scheduled_time, p_equipment_id, p_technician_id, p_estimated_duration, 'Scheduled'
  ) RETURNING id INTO v_schedule_id;

  -- Update Order Item status
  UPDATE radiology.radiology_order_items
  SET status = 'Scheduled'
  WHERE id = p_radiology_order_item_id;

  RETURN v_schedule_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
