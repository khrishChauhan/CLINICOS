-- Master Module Phase 1: Geographic & Demographic Data
-- Schema: master
-- ─────────────────────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS master;

-- 1. Countries
CREATE TABLE IF NOT EXISTS master.countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code VARCHAR(10) UNIQUE NOT NULL,
    country_name VARCHAR(100) UNIQUE NOT NULL,
    iso_code VARCHAR(3),
    phone_code VARCHAR(10),
    currency VARCHAR(10),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. States
CREATE TABLE IF NOT EXISTS master.states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL REFERENCES master.countries(id) ON DELETE RESTRICT,
    state_code VARCHAR(10) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(country_id, state_code),
    UNIQUE(country_id, state_name)
);

-- 3. Districts
CREATE TABLE IF NOT EXISTS master.districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID NOT NULL REFERENCES master.states(id) ON DELETE RESTRICT,
    district_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(state_id, district_name)
);

-- 4. Cities
CREATE TABLE IF NOT EXISTS master.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id UUID NOT NULL REFERENCES master.districts(id) ON DELETE RESTRICT,
    city_name VARCHAR(100) NOT NULL,
    pincode VARCHAR(20),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(district_id, city_name)
);

-- 5. Languages
CREATE TABLE IF NOT EXISTS master.languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_code VARCHAR(10) UNIQUE NOT NULL,
    language_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Genders
CREATE TABLE IF NOT EXISTS master.genders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gender_code VARCHAR(10) UNIQUE NOT NULL,
    gender_name VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MaritalStatuses
CREATE TABLE IF NOT EXISTS master.marital_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status_code VARCHAR(10) UNIQUE NOT NULL,
    status_name VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Religions
CREATE TABLE IF NOT EXISTS master.religions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    religion_code VARCHAR(10) UNIQUE NOT NULL,
    religion_name VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BloodGroups
CREATE TABLE IF NOT EXISTS master.blood_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blood_group VARCHAR(10) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Nationalities
CREATE TABLE IF NOT EXISTS master.nationalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nationality_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. RelationshipTypes
CREATE TABLE IF NOT EXISTS master.relationship_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relationship_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_states_country ON master.states(country_id);
CREATE INDEX IF NOT EXISTS idx_districts_state ON master.districts(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_district ON master.cities(district_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS Policies (Global, Open Read, Restricted Write)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE master.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.genders ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.marital_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.religions ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.blood_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.nationalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.relationship_types ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read master tables
CREATE POLICY master_countries_select ON master.countries FOR SELECT TO authenticated USING (true);
CREATE POLICY master_states_select ON master.states FOR SELECT TO authenticated USING (true);
CREATE POLICY master_districts_select ON master.districts FOR SELECT TO authenticated USING (true);
CREATE POLICY master_cities_select ON master.cities FOR SELECT TO authenticated USING (true);
CREATE POLICY master_languages_select ON master.languages FOR SELECT TO authenticated USING (true);
CREATE POLICY master_genders_select ON master.genders FOR SELECT TO authenticated USING (true);
CREATE POLICY master_marital_statuses_select ON master.marital_statuses FOR SELECT TO authenticated USING (true);
CREATE POLICY master_religions_select ON master.religions FOR SELECT TO authenticated USING (true);
CREATE POLICY master_blood_groups_select ON master.blood_groups FOR SELECT TO authenticated USING (true);
CREATE POLICY master_nationalities_select ON master.nationalities FOR SELECT TO authenticated USING (true);
CREATE POLICY master_relationship_types_select ON master.relationship_types FOR SELECT TO authenticated USING (true);

-- (Write policies would check for super_admin roles, but for now we enforce via Server Actions or restrict to authenticated)
CREATE POLICY master_countries_all ON master.countries FOR ALL TO authenticated USING (true);
CREATE POLICY master_states_all ON master.states FOR ALL TO authenticated USING (true);
CREATE POLICY master_districts_all ON master.districts FOR ALL TO authenticated USING (true);
CREATE POLICY master_cities_all ON master.cities FOR ALL TO authenticated USING (true);
CREATE POLICY master_languages_all ON master.languages FOR ALL TO authenticated USING (true);
CREATE POLICY master_genders_all ON master.genders FOR ALL TO authenticated USING (true);
CREATE POLICY master_marital_statuses_all ON master.marital_statuses FOR ALL TO authenticated USING (true);
CREATE POLICY master_religions_all ON master.religions FOR ALL TO authenticated USING (true);
CREATE POLICY master_blood_groups_all ON master.blood_groups FOR ALL TO authenticated USING (true);
CREATE POLICY master_nationalities_all ON master.nationalities FOR ALL TO authenticated USING (true);
CREATE POLICY master_relationship_types_all ON master.relationship_types FOR ALL TO authenticated USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Add UUID FKs to Existing Tables
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Patients
ALTER TABLE public.patients 
ADD COLUMN gender_id UUID REFERENCES master.genders(id) ON DELETE SET NULL,
ADD COLUMN blood_group_id UUID REFERENCES master.blood_groups(id) ON DELETE SET NULL,
ADD COLUMN marital_status_id UUID REFERENCES master.marital_statuses(id) ON DELETE SET NULL,
ADD COLUMN nationality_id UUID REFERENCES master.nationalities(id) ON DELETE SET NULL,
ADD COLUMN religion_id UUID REFERENCES master.religions(id) ON DELETE SET NULL,
ADD COLUMN preferred_language_id UUID REFERENCES master.languages(id) ON DELETE SET NULL;

-- 2. Patient Addresses
ALTER TABLE public.patient_addresses
ADD COLUMN city_id UUID REFERENCES master.cities(id) ON DELETE SET NULL,
ADD COLUMN district_id UUID REFERENCES master.districts(id) ON DELETE SET NULL,
ADD COLUMN state_id UUID REFERENCES master.states(id) ON DELETE SET NULL,
ADD COLUMN country_id UUID REFERENCES master.countries(id) ON DELETE SET NULL;

-- 3. Emergency Contacts
ALTER TABLE public.emergency_contacts
ADD COLUMN relationship_id UUID REFERENCES master.relationship_types(id) ON DELETE SET NULL;

-- 4. Doctors
ALTER TABLE doctor.doctors
ADD COLUMN gender_id UUID REFERENCES master.genders(id) ON DELETE SET NULL,
ADD COLUMN blood_group_id UUID REFERENCES master.blood_groups(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- Data Seeding & Migration
-- ─────────────────────────────────────────────────────────────────────────────

-- Seed Genders
INSERT INTO master.genders (gender_code, gender_name) VALUES
('M', 'Male'), ('F', 'Female'), ('O', 'Other') ON CONFLICT DO NOTHING;

-- Seed Blood Groups
INSERT INTO master.blood_groups (blood_group) VALUES
('A+'), ('A-'), ('B+'), ('B-'), ('O+'), ('O-'), ('AB+'), ('AB-') ON CONFLICT DO NOTHING;

-- Seed Marital Statuses
INSERT INTO master.marital_statuses (status_code, status_name) VALUES
('S', 'Single'), ('M', 'Married'), ('D', 'Divorced'), ('W', 'Widowed') ON CONFLICT DO NOTHING;

-- Seed Relationship Types
INSERT INTO master.relationship_types (relationship_name) VALUES
('Father'), ('Mother'), ('Spouse'), ('Son'), ('Daughter'), ('Brother'), ('Sister'), ('Friend'), ('Other') ON CONFLICT DO NOTHING;

-- Seed Default Country
INSERT INTO master.countries (country_code, country_name, iso_code, phone_code, currency) VALUES
('IN', 'India', 'IND', '+91', 'INR') ON CONFLICT DO NOTHING;

-- Dynamic data migration from legacy columns
DO $$
BEGIN
  -- Insert missing genders from patients
  INSERT INTO master.genders (gender_code, gender_name)
  SELECT DISTINCT UPPER(LEFT(gender, 1)), gender FROM public.patients WHERE gender IS NOT NULL AND gender != ''
  ON CONFLICT (gender_name) DO NOTHING;
  
  -- Insert missing genders from doctors
  INSERT INTO master.genders (gender_code, gender_name)
  SELECT DISTINCT UPPER(LEFT(gender, 1)), gender FROM doctor.doctors WHERE gender IS NOT NULL AND gender != ''
  ON CONFLICT (gender_name) DO NOTHING;
  
  -- Insert missing blood groups
  INSERT INTO master.blood_groups (blood_group)
  SELECT DISTINCT blood_group FROM public.patients WHERE blood_group IS NOT NULL AND blood_group != ''
  ON CONFLICT (blood_group) DO NOTHING;
  
  -- Update patients FKs
  UPDATE public.patients p SET
    gender_id = (SELECT id FROM master.genders g WHERE g.gender_name = p.gender LIMIT 1),
    blood_group_id = (SELECT id FROM master.blood_groups bg WHERE bg.blood_group = p.blood_group LIMIT 1);
    
  -- Update doctors FKs
  UPDATE doctor.doctors d SET
    gender_id = (SELECT id FROM master.genders g WHERE g.gender_name = d.gender LIMIT 1),
    blood_group_id = (SELECT id FROM master.blood_groups bg WHERE bg.blood_group = d.blood_group LIMIT 1);
    
END $$;
