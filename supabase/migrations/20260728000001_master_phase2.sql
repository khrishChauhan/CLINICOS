-- Master Module Phase 2: Clinical Reference Masters
-- Schema: master
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Departments (Global)
CREATE TABLE IF NOT EXISTS master.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_code VARCHAR(50) UNIQUE,
    department_name VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Specializations
CREATE TABLE IF NOT EXISTS master.specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES master.departments(id) ON DELETE RESTRICT,
    specialization_code VARCHAR(50) UNIQUE,
    specialization_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(department_id, specialization_name)
);

-- 3. AppointmentTypes
CREATE TABLE IF NOT EXISTS master.appointment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_type VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ConsultationTypes
CREATE TABLE IF NOT EXISTS master.consultation_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_type VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VisitTypes
CREATE TABLE IF NOT EXISTS master.visit_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_type VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PriorityLevels
CREATE TABLE IF NOT EXISTS master.priority_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    priority_name VARCHAR(50) UNIQUE NOT NULL,
    display_order INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TokenStatuses
CREATE TABLE IF NOT EXISTS master.token_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_status VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AppointmentStatuses
CREATE TABLE IF NOT EXISTS master.appointment_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_status VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. VisitStatuses
CREATE TABLE IF NOT EXISTS master.visit_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_status VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_specializations_department ON master.specializations(department_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS Policies (Global, Open Read, Restricted Write)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE master.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.consultation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.visit_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.priority_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.token_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.appointment_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.visit_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY master_departments_select ON master.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY master_specializations_select ON master.specializations FOR SELECT TO authenticated USING (true);
CREATE POLICY master_appointment_types_select ON master.appointment_types FOR SELECT TO authenticated USING (true);
CREATE POLICY master_consultation_types_select ON master.consultation_types FOR SELECT TO authenticated USING (true);
CREATE POLICY master_visit_types_select ON master.visit_types FOR SELECT TO authenticated USING (true);
CREATE POLICY master_priority_levels_select ON master.priority_levels FOR SELECT TO authenticated USING (true);
CREATE POLICY master_token_statuses_select ON master.token_statuses FOR SELECT TO authenticated USING (true);
CREATE POLICY master_appointment_statuses_select ON master.appointment_statuses FOR SELECT TO authenticated USING (true);
CREATE POLICY master_visit_statuses_select ON master.visit_statuses FOR SELECT TO authenticated USING (true);

CREATE POLICY master_departments_all ON master.departments FOR ALL TO authenticated USING (true);
CREATE POLICY master_specializations_all ON master.specializations FOR ALL TO authenticated USING (true);
CREATE POLICY master_appointment_types_all ON master.appointment_types FOR ALL TO authenticated USING (true);
CREATE POLICY master_consultation_types_all ON master.consultation_types FOR ALL TO authenticated USING (true);
CREATE POLICY master_visit_types_all ON master.visit_types FOR ALL TO authenticated USING (true);
CREATE POLICY master_priority_levels_all ON master.priority_levels FOR ALL TO authenticated USING (true);
CREATE POLICY master_token_statuses_all ON master.token_statuses FOR ALL TO authenticated USING (true);
CREATE POLICY master_appointment_statuses_all ON master.appointment_statuses FOR ALL TO authenticated USING (true);
CREATE POLICY master_visit_statuses_all ON master.visit_statuses FOR ALL TO authenticated USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Data Seeding
-- ─────────────────────────────────────────────────────────────────────────────

-- Departments
INSERT INTO master.departments (department_code, department_name) VALUES
('CARD', 'Cardiology'), ('NEUR', 'Neurology'), ('PEDI', 'Pediatrics'), ('ORTH', 'Orthopedics'), ('GEN', 'General Medicine') ON CONFLICT DO NOTHING;

-- Specializations
DO $$
DECLARE
  dept_id UUID;
BEGIN
  SELECT id INTO dept_id FROM master.departments WHERE department_code = 'CARD';
  IF dept_id IS NOT NULL THEN
    INSERT INTO master.specializations (department_id, specialization_code, specialization_name) VALUES
    (dept_id, 'CARD-01', 'Interventional Cardiology'),
    (dept_id, 'CARD-02', 'Pediatric Cardiology') ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- AppointmentTypes
INSERT INTO master.appointment_types (appointment_type) VALUES
('New Consultation'), ('Follow-up'), ('Routine Checkup'), ('Procedure') ON CONFLICT DO NOTHING;

-- ConsultationTypes
INSERT INTO master.consultation_types (consultation_type) VALUES
('In-Person'), ('Video Consult'), ('Audio Consult'), ('Chat Consult') ON CONFLICT DO NOTHING;

-- VisitTypes
INSERT INTO master.visit_types (visit_type) VALUES
('OPD'), ('IPD'), ('Emergency'), ('Teleconsult') ON CONFLICT DO NOTHING;

-- PriorityLevels
INSERT INTO master.priority_levels (priority_name, display_order) VALUES
('Normal', 1), ('Emergency', 2), ('VIP', 3) ON CONFLICT DO NOTHING;

-- TokenStatuses
INSERT INTO master.token_statuses (token_status) VALUES
('Waiting'), ('Called'), ('In Consultation'), ('Completed'), ('Skipped'), ('Cancelled') ON CONFLICT DO NOTHING;

-- AppointmentStatuses
INSERT INTO master.appointment_statuses (appointment_status) VALUES
('Scheduled'), ('Confirmed'), ('Arrived'), ('In Progress'), ('Completed'), ('Cancelled'), ('No Show') ON CONFLICT DO NOTHING;

-- VisitStatuses
INSERT INTO master.visit_statuses (visit_status) VALUES
('Ongoing'), ('Completed'), ('Cancelled') ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Add UUID FKs to Existing Tables (Backwards Compatibility Mode)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. public.walk_in_registrations
ALTER TABLE public.walk_in_registrations 
ADD COLUMN priority_id UUID REFERENCES master.priority_levels(id) ON DELETE SET NULL,
ADD COLUMN token_status_id UUID REFERENCES master.token_statuses(id) ON DELETE SET NULL;

-- 2. public.online_appointments
ALTER TABLE public.online_appointments
ADD COLUMN token_status_id UUID REFERENCES master.token_statuses(id) ON DELETE SET NULL,
ADD COLUMN appointment_status_id UUID REFERENCES master.appointment_statuses(id) ON DELETE SET NULL;

-- 3. public.appointment_slots
ALTER TABLE public.appointment_slots
ADD COLUMN master_department_id UUID REFERENCES master.departments(id) ON DELETE SET NULL,
ADD COLUMN consultation_type_id UUID REFERENCES master.consultation_types(id) ON DELETE SET NULL,
ADD COLUMN visit_type_id UUID REFERENCES master.visit_types(id) ON DELETE SET NULL;

-- 4. appointment.appointment_status_history
ALTER TABLE appointment.appointment_status_history
ADD COLUMN status_id UUID REFERENCES master.appointment_statuses(id) ON DELETE SET NULL;

-- 5. emr.visits
ALTER TABLE emr.visits
ADD COLUMN master_department_id UUID REFERENCES master.departments(id) ON DELETE SET NULL,
ADD COLUMN visit_type_id UUID REFERENCES master.visit_types(id) ON DELETE SET NULL,
ADD COLUMN visit_status_id UUID REFERENCES master.visit_statuses(id) ON DELETE SET NULL;

-- 6. doctor.doctor_departments
ALTER TABLE doctor.doctor_departments
ADD COLUMN master_department_id UUID REFERENCES master.departments(id) ON DELETE CASCADE;

-- 7. doctor.doctor_specializations
ALTER TABLE doctor.doctor_specializations
ADD COLUMN master_department_id UUID REFERENCES master.departments(id) ON DELETE CASCADE,
ADD COLUMN specialization_id UUID REFERENCES master.specializations(id) ON DELETE CASCADE;

-- 8. doctor.doctors
ALTER TABLE doctor.doctors
ADD COLUMN consultation_type_id UUID REFERENCES master.consultation_types(id) ON DELETE SET NULL;

-- 9. doctor.doctor_consultation_fees
ALTER TABLE doctor.doctor_consultation_fees
ADD COLUMN consultation_type_id UUID REFERENCES master.consultation_types(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- Dynamic Migration for Constraints (Best Effort)
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  -- We don't drop the string columns right now to prevent breaking existing components,
  -- but we can map the data over if any exists.
  
  -- map priority
  UPDATE public.walk_in_registrations w SET
    priority_id = (SELECT id FROM master.priority_levels p WHERE p.priority_name = w.priority LIMIT 1)
  WHERE w.priority IS NOT NULL;
  
  -- map token status
  UPDATE public.walk_in_registrations w SET
    token_status_id = (SELECT id FROM master.token_statuses t WHERE t.token_status = w.token_status LIMIT 1)
  WHERE w.token_status IS NOT NULL;
  
  -- map visit type
  UPDATE emr.visits v SET
    visit_type_id = (SELECT id FROM master.visit_types vt WHERE vt.visit_type = v.visit_type LIMIT 1)
  WHERE v.visit_type IS NOT NULL;
  
END $$;
