-- 20260810000000_ot_schema_init.sql
-- Operation Theatre (OT) & Surgery Management Schema

CREATE SCHEMA IF NOT EXISTS ot;

-- Enable btree_gist for exclusion constraints on UUIDs
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. OT Rooms
CREATE TABLE IF NOT EXISTS ot.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- e.g., 'Major OT', 'Minor OT', 'Cath Lab'
    status VARCHAR(50) NOT NULL DEFAULT 'Active', -- 'Active', 'Maintenance', 'Inactive'
    base_price_per_hour NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ot_rooms_clinic ON ot.rooms(clinic_id);

-- 2. Surgeries (Core transactional table)
CREATE TABLE IF NOT EXISTS ot.surgeries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    room_id UUID NOT NULL REFERENCES ot.rooms(id) ON DELETE RESTRICT,
    admission_id UUID REFERENCES ipd.admissions(id) ON DELETE SET NULL, -- Nullable for day care surgeries
    lead_surgeon_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    anesthetist_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    procedure_name VARCHAR(255) NOT NULL,
    diagnosis TEXT,
    
    status VARCHAR(50) NOT NULL DEFAULT 'Scheduled', 
    -- 'Scheduled', 'Pre-Op', 'Intra-Op', 'Post-Op', 'Completed', 'Cancelled'
    
    scheduled_start_time TIMESTAMPTZ NOT NULL,
    scheduled_end_time TIMESTAMPTZ NOT NULL,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    
    is_emergency BOOLEAN DEFAULT false,
    cancellation_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Constraint: End time must be after start time
    CONSTRAINT check_time_order CHECK (scheduled_end_time > scheduled_start_time),
    
    -- Concurrency Protection: No overlapping active surgeries in the same room
    CONSTRAINT exclude_overlapping_room_booking EXCLUDE USING gist (
        room_id WITH =,
        tstzrange(scheduled_start_time, scheduled_end_time) WITH &&
    ) WHERE (status != 'Cancelled'),
    
    -- Concurrency Protection: Same Lead Surgeon cannot be booked for overlapping active surgeries
    CONSTRAINT exclude_overlapping_surgeon_booking EXCLUDE USING gist (
        lead_surgeon_id WITH =,
        tstzrange(scheduled_start_time, scheduled_end_time) WITH &&
    ) WHERE (status != 'Cancelled')
);
CREATE INDEX idx_ot_surgeries_patient ON ot.surgeries(patient_id);
CREATE INDEX idx_ot_surgeries_room ON ot.surgeries(room_id);
CREATE INDEX idx_ot_surgeries_surgeon ON ot.surgeries(lead_surgeon_id);
CREATE INDEX idx_ot_surgeries_status ON ot.surgeries(status);
CREATE INDEX idx_ot_surgeries_date ON ot.surgeries(scheduled_start_time);

-- 3. Team Members (Assistants, Scrub Nurses, Circulating Nurses, etc.)
CREATE TABLE IF NOT EXISTS ot.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surgery_id UUID NOT NULL REFERENCES ot.surgeries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    role VARCHAR(100) NOT NULL, -- e.g., 'Scrub Nurse', 'Assistant Surgeon', 'Perfusionist'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(surgery_id, user_id, role)
);
CREATE INDEX idx_ot_team_surgery ON ot.team_members(surgery_id);

-- 4. Pre-Op Checklists (Safety Prerequisite Verification)
CREATE TABLE IF NOT EXISTS ot.checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surgery_id UUID NOT NULL UNIQUE REFERENCES ot.surgeries(id) ON DELETE CASCADE,
    identity_verified BOOLEAN DEFAULT false,
    consent_signed BOOLEAN DEFAULT false,
    site_marked BOOLEAN DEFAULT false,
    fasting_confirmed BOOLEAN DEFAULT false,
    allergies_checked BOOLEAN DEFAULT false,
    blood_arranged BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    verified_at TIMESTAMPTZ,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Clinical Notes (Pre-Op, Intra-Op, Post-Op)
CREATE TABLE IF NOT EXISTS ot.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surgery_id UUID NOT NULL REFERENCES ot.surgeries(id) ON DELETE CASCADE,
    note_type VARCHAR(50) NOT NULL, -- 'Pre-Op', 'Intra-Op', 'Post-Op', 'Anesthesia'
    content TEXT NOT NULL,
    recorded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ot_notes_surgery ON ot.notes(surgery_id);

-- 6. Consumables & Implants
CREATE TABLE IF NOT EXISTS ot.consumables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surgery_id UUID NOT NULL REFERENCES ot.surgeries(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE RESTRICT,
    quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
    batch_number VARCHAR(100), -- Explicitly track which batch/serial was used
    inventory_transaction_id UUID, -- Link to Pharmacy/Inventory stock transaction
    recorded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_billed BOOLEAN DEFAULT false, -- To prevent duplicate billing
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ot_consumables_surgery ON ot.consumables(surgery_id);

-- RLS Enablement
ALTER TABLE ot.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE ot.surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ot.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ot.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE ot.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ot.consumables ENABLE ROW LEVEL SECURITY;

-- Policies using get_session_context()
CREATE POLICY "Clinic isolation for ot rooms" ON ot.rooms FOR ALL USING (clinic_id = (SELECT clinic_id FROM get_session_context()));
CREATE POLICY "Clinic isolation for ot surgeries" ON ot.surgeries FOR ALL USING (clinic_id = (SELECT clinic_id FROM get_session_context()));
CREATE POLICY "Clinic isolation for ot team" ON ot.team_members FOR ALL USING (surgery_id IN (SELECT id FROM ot.surgeries WHERE clinic_id = (SELECT clinic_id FROM get_session_context())));
CREATE POLICY "Clinic isolation for ot checklists" ON ot.checklists FOR ALL USING (surgery_id IN (SELECT id FROM ot.surgeries WHERE clinic_id = (SELECT clinic_id FROM get_session_context())));
CREATE POLICY "Clinic isolation for ot notes" ON ot.notes FOR ALL USING (surgery_id IN (SELECT id FROM ot.surgeries WHERE clinic_id = (SELECT clinic_id FROM get_session_context())));
CREATE POLICY "Clinic isolation for ot consumables" ON ot.consumables FOR ALL USING (surgery_id IN (SELECT id FROM ot.surgeries WHERE clinic_id = (SELECT clinic_id FROM get_session_context())));
