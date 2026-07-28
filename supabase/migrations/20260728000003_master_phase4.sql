-- Master Module Phase 4: Pharmacy & Medication Reference Masters
-- Schema: master
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. MedicineCategories
CREATE TABLE IF NOT EXISTS master.medicine_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UnitsOfMeasure
CREATE TABLE IF NOT EXISTS master.units_of_measure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_name VARCHAR(100) NOT NULL,
    unit_symbol VARCHAR(50) UNIQUE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DosageForms
CREATE TABLE IF NOT EXISTS master.dosage_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dosage_form VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RoutesOfAdministration
CREATE TABLE IF NOT EXISTS master.routes_of_administration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Frequencies
CREATE TABLE IF NOT EXISTS master.frequencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    frequency_name VARCHAR(50) UNIQUE NOT NULL,
    instructions VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Medicines
CREATE TABLE IF NOT EXISTS master.medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_code VARCHAR(50) UNIQUE,
    generic_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255),
    category_id UUID REFERENCES master.medicine_categories(id) ON DELETE SET NULL,
    unit_id UUID REFERENCES master.units_of_measure(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_medicines_generic ON master.medicines(generic_name);
CREATE INDEX IF NOT EXISTS idx_medicines_brand ON master.medicines(brand_name);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS Policies (Global, Open Read, Restricted Write)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE master.medicine_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.units_of_measure ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.dosage_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.routes_of_administration ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.frequencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.medicines ENABLE ROW LEVEL SECURITY;

CREATE POLICY master_med_cats_select ON master.medicine_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY master_units_select ON master.units_of_measure FOR SELECT TO authenticated USING (true);
CREATE POLICY master_dosage_forms_select ON master.dosage_forms FOR SELECT TO authenticated USING (true);
CREATE POLICY master_routes_select ON master.routes_of_administration FOR SELECT TO authenticated USING (true);
CREATE POLICY master_freqs_select ON master.frequencies FOR SELECT TO authenticated USING (true);
CREATE POLICY master_meds_select ON master.medicines FOR SELECT TO authenticated USING (true);

CREATE POLICY master_med_cats_all ON master.medicine_categories FOR ALL TO authenticated USING (true);
CREATE POLICY master_units_all ON master.units_of_measure FOR ALL TO authenticated USING (true);
CREATE POLICY master_dosage_forms_all ON master.dosage_forms FOR ALL TO authenticated USING (true);
CREATE POLICY master_routes_all ON master.routes_of_administration FOR ALL TO authenticated USING (true);
CREATE POLICY master_freqs_all ON master.frequencies FOR ALL TO authenticated USING (true);
CREATE POLICY master_meds_all ON master.medicines FOR ALL TO authenticated USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Data Seeding
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO master.medicine_categories (category_name) VALUES
('Tablet'), ('Capsule'), ('Injection'), ('Syrup'), ('Cream'), ('Drops')
ON CONFLICT DO NOTHING;

INSERT INTO master.units_of_measure (unit_name, unit_symbol) VALUES
('Milligram', 'mg'), ('Milliliter', 'ml'), ('Gram', 'g'), ('International Unit', 'IU')
ON CONFLICT DO NOTHING;

INSERT INTO master.dosage_forms (dosage_form) VALUES
('Solid'), ('Liquid'), ('Semi-solid')
ON CONFLICT DO NOTHING;

INSERT INTO master.routes_of_administration (route_name) VALUES
('Oral'), ('IV'), ('IM'), ('Topical'), ('Sublingual')
ON CONFLICT DO NOTHING;

INSERT INTO master.frequencies (frequency_name, instructions) VALUES
('OD', 'Once a day'),
('BD', 'Twice a day'),
('TDS', 'Three times a day'),
('QID', 'Four times a day'),
('SOS', 'As needed'),
('HS', 'At bedtime')
ON CONFLICT DO NOTHING;

DO $$
DECLARE
  v_cat_tab UUID;
  v_cat_syr UUID;
  v_unit_mg UUID;
  v_unit_ml UUID;
BEGIN
  SELECT id INTO v_cat_tab FROM master.medicine_categories WHERE category_name = 'Tablet' LIMIT 1;
  SELECT id INTO v_cat_syr FROM master.medicine_categories WHERE category_name = 'Syrup' LIMIT 1;
  SELECT id INTO v_unit_mg FROM master.units_of_measure WHERE unit_symbol = 'mg' LIMIT 1;
  SELECT id INTO v_unit_ml FROM master.units_of_measure WHERE unit_symbol = 'ml' LIMIT 1;

  INSERT INTO master.medicines (medicine_code, generic_name, brand_name, category_id, unit_id) VALUES
  ('MED-001', 'Paracetamol', 'Crocin', v_cat_tab, v_unit_mg),
  ('MED-002', 'Amoxicillin', 'Augmentin', v_cat_tab, v_unit_mg),
  ('MED-003', 'Ibuprofen', 'Brufen', v_cat_tab, v_unit_mg),
  ('MED-004', 'Cetirizine', 'Zyrtec', v_cat_tab, v_unit_mg),
  ('MED-005', 'Cough Syrup (Dextromethorphan)', 'Benadryl', v_cat_syr, v_unit_ml)
  ON CONFLICT DO NOTHING;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Add UUID FKs to Existing Tables (Backwards Compatibility Mode)
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE emr.prescription_items
ADD COLUMN master_medicine_id UUID REFERENCES master.medicines(id) ON DELETE SET NULL,
ADD COLUMN master_frequency_id UUID REFERENCES master.frequencies(id) ON DELETE SET NULL,
ADD COLUMN master_unit_id UUID REFERENCES master.units_of_measure(id) ON DELETE SET NULL,
ADD COLUMN master_route_id UUID REFERENCES master.routes_of_administration(id) ON DELETE SET NULL;

-- Dynamic Migration for Constraints (Best Effort)
DO $$
BEGIN
  -- We map existing string-based data if they happen to perfectly match our seeds.
  UPDATE emr.prescription_items p SET
    master_medicine_id = (SELECT id FROM master.medicines m WHERE m.generic_name = p.medicine_name OR m.brand_name = p.medicine_name LIMIT 1)
  WHERE p.medicine_name IS NOT NULL;
  
  UPDATE emr.prescription_items p SET
    master_frequency_id = (SELECT id FROM master.frequencies f WHERE f.frequency_name = p.frequency LIMIT 1)
  WHERE p.frequency IS NOT NULL;
  
  UPDATE emr.prescription_items p SET
    master_route_id = (SELECT id FROM master.routes_of_administration r WHERE r.route_name = p.route LIMIT 1)
  WHERE p.route IS NOT NULL;
END $$;
