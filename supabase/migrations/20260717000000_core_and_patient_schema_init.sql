-- ============================================================================
-- Click Aarambh ClinicOS - Initial Database Migration (Core & Patient Schema)
-- ============================================================================

-- 1. Setup Extensions & Base Functions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SCHEMA: CORE (Public)
-- ============================================================================

-- 1. Clinics
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_code VARCHAR(50) UNIQUE NOT NULL,
    clinic_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    logo_url TEXT,
    registration_number VARCHAR(100),
    gst_number VARCHAR(50),
    pan_number VARCHAR(50),
    email VARCHAR(255),
    mobile VARCHAR(20),
    alternate_mobile VARCHAR(20),
    website VARCHAR(255),
    address_line1 TEXT,
    address_line2 TEXT,
    landmark TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(20),
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    timezone VARCHAR(50) DEFAULT 'UTC',
    currency VARCHAR(10) DEFAULT 'INR',
    financial_year_start DATE,
    subscription_plan VARCHAR(50),
    subscription_status VARCHAR(50) DEFAULT 'Active',
    license_expiry_date DATE,
    max_users INTEGER DEFAULT 10,
    max_storage_gb INTEGER DEFAULT 10,
    clinic_status VARCHAR(50) DEFAULT 'Active',
    
    -- Audit & Soft Delete
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID, -- References users(id) later
    updated_by UUID,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

-- 2. Clinic Branches
CREATE TABLE clinic_branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    branch_code VARCHAR(50) NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    manager_id UUID, -- References users(id) later
    is_main_branch BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'Active',

    -- Audit & Soft Delete
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

-- 3. Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE, -- NULL for system roles
    role_name VARCHAR(100) NOT NULL,
    role_description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'Active',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

-- 4. Permissions
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name VARCHAR(100) NOT NULL,
    permission_name VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT
);

-- 5. Role Permissions
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    department_code VARCHAR(50),
    department_name VARCHAR(255) NOT NULL,
    department_head UUID, -- References users(id) later
    description TEXT,
    status VARCHAR(50) DEFAULT 'Active',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

-- 7. Designations
CREATE TABLE designations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    designation_name VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Active'
);

-- 8. Users (Public mapping for auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY, -- Will map exactly to auth.users.id
    clinic_id UUID REFERENCES clinics(id) ON DELETE RESTRICT,
    employee_id VARCHAR(50),
    username VARCHAR(100) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(20),
    password_hash TEXT, -- Included as per schema, though Supabase handles auth
    role_id UUID REFERENCES roles(id) ON DELETE RESTRICT,
    profile_photo TEXT,
    last_login TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked BOOLEAN DEFAULT false,
    is_email_verified BOOLEAN DEFAULT false,
    is_mobile_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'Active',

    -- Audit & Soft Delete
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

-- Add deferred foreign keys for self-referencing / circular refs
ALTER TABLE clinics ADD CONSTRAINT fk_clinics_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE clinics ADD CONSTRAINT fk_clinics_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE clinic_branches ADD CONSTRAINT fk_branch_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE departments ADD CONSTRAINT fk_dept_head FOREIGN KEY (department_head) REFERENCES users(id) ON DELETE SET NULL;

-- 9. User Sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    login_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    logout_time TIMESTAMPTZ,
    ip_address INET,
    browser VARCHAR(255),
    operating_system VARCHAR(100),
    device_type VARCHAR(100),
    session_token TEXT,
    is_active BOOLEAN DEFAULT true
);

-- 10. Login History
CREATE TABLE login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    login_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    logout_time TIMESTAMPTZ,
    ip_address INET,
    browser VARCHAR(255),
    operating_system VARCHAR(100),
    device_name VARCHAR(100),
    login_status VARCHAR(50),
    failure_reason TEXT
);

-- 11. System Settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE, -- NULL for global
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_category VARCHAR(100),
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. System Configurations
CREATE TABLE system_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    data_type VARCHAR(50),
    description TEXT,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Feature Flags
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. File Attachments
CREATE TABLE file_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    module_name VARCHAR(100),
    reference_table VARCHAR(100),
    reference_id UUID,
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255),
    file_extension VARCHAR(20),
    mime_type VARCHAR(100),
    file_size_bytes BIGINT,
    storage_provider VARCHAR(50),
    file_path TEXT NOT NULL,
    file_url TEXT,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    remarks TEXT,
    status VARCHAR(50) DEFAULT 'Active'
);

-- 15. Activity Logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    employee_name VARCHAR(255),
    module_name VARCHAR(100),
    action VARCHAR(100),
    reference_table VARCHAR(100),
    reference_id UUID,
    activity_description TEXT,
    ip_address INET,
    device_name VARCHAR(100),
    activity_time TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Notification Templates
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    template_name VARCHAR(100) NOT NULL,
    template_code VARCHAR(100) UNIQUE NOT NULL,
    notification_type VARCHAR(50), -- SMS, EMAIL, PUSH
    subject VARCHAR(255),
    message_body TEXT NOT NULL,
    variables JSONB,
    language VARCHAR(20) DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Notification Queue
CREATE TABLE notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    template_id UUID REFERENCES notification_templates(id) ON DELETE SET NULL,
    recipient_type VARCHAR(50),
    recipient_id UUID,
    recipient_mobile VARCHAR(20),
    recipient_email VARCHAR(255),
    notification_type VARCHAR(50),
    message_body TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0
);

-- ============================================================================
-- SCHEMA: PATIENT
-- ============================================================================

-- 1. Patients
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE RESTRICT,
    uhid VARCHAR(100) UNIQUE NOT NULL,
    patient_type VARCHAR(50),
    title VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(20),
    date_of_birth DATE,
    age INTEGER,
    age_unit VARCHAR(20),
    blood_group VARCHAR(10),
    marital_status VARCHAR(50),
    occupation VARCHAR(100),
    nationality VARCHAR(100),
    religion VARCHAR(100),
    aadhaar_number VARCHAR(20),
    passport_number VARCHAR(50),
    email VARCHAR(255),
    mobile_number VARCHAR(20) NOT NULL,
    alternate_mobile VARCHAR(20),
    preferred_language VARCHAR(50),
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    referred_by VARCHAR(255),
    primary_doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Active',
    remarks TEXT,

    -- Audit & Soft Delete
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

-- 2. Patient Addresses
CREATE TABLE patient_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    address_type VARCHAR(50),
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    landmark TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(20),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Emergency Contacts
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    contact_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    mobile_number VARCHAR(20) NOT NULL,
    alternate_mobile VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Patient Family Members
CREATE TABLE patient_family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    family_member_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    gender VARCHAR(20),
    date_of_birth DATE,
    mobile_number VARCHAR(20),
    occupation VARCHAR(100),
    is_dependent BOOLEAN DEFAULT false,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Patient Identifiers
CREATE TABLE patient_identifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    identifier_type VARCHAR(50) NOT NULL,
    identifier_number VARCHAR(100) NOT NULL,
    issuing_authority VARCHAR(255),
    expiry_date DATE,
    verified BOOLEAN DEFAULT false,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Patient Insurance
CREATE TABLE patient_insurance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    insurance_provider VARCHAR(255) NOT NULL,
    policy_number VARCHAR(100) NOT NULL,
    member_id VARCHAR(100),
    coverage_amount NUMERIC(15, 2),
    valid_from DATE,
    valid_to DATE,
    insurance_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    remarks TEXT
);

-- 7. Patient Medical History
CREATE TABLE patient_medical_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    disease_name VARCHAR(255) NOT NULL,
    diagnosis_date DATE,
    treated_by VARCHAR(255),
    hospital_name VARCHAR(255),
    treatment_status VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Patient Allergies
CREATE TABLE patient_allergies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    allergy_type VARCHAR(100),
    allergen VARCHAR(255) NOT NULL,
    severity VARCHAR(50),
    reaction TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Patient Medications
CREATE TABLE patient_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    prescribed_by VARCHAR(255),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    remarks TEXT
);

-- 10. Patient Immunizations
CREATE TABLE patient_immunizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(255) NOT NULL,
    dose VARCHAR(50),
    administered_date DATE,
    administered_by VARCHAR(255),
    next_due_date DATE,
    remarks TEXT
);

-- 11. Patient Lifestyle
CREATE TABLE patient_lifestyle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    smoking_status VARCHAR(50),
    alcohol_consumption VARCHAR(50),
    tobacco_use VARCHAR(50),
    exercise_frequency VARCHAR(100),
    diet_type VARCHAR(100),
    sleep_hours INTEGER,
    occupation_risk TEXT,
    remarks TEXT
);

-- 12. Patient Vitals Baseline
CREATE TABLE patient_vitals_baseline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    height NUMERIC(5, 2), -- e.g. cm
    weight NUMERIC(5, 2), -- e.g. kg
    bmi NUMERIC(5, 2),
    blood_pressure VARCHAR(20),
    pulse_rate INTEGER,
    respiratory_rate INTEGER,
    oxygen_saturation INTEGER,
    body_temperature NUMERIC(5, 2),
    recorded_date TIMESTAMPTZ DEFAULT NOW(),
    recorded_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- 13. Patient Documents
CREATE TABLE patient_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    attachment_id UUID REFERENCES file_attachments(id) ON DELETE RESTRICT,
    document_type VARCHAR(100),
    document_name VARCHAR(255) NOT NULL,
    remarks TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Patient Consents
CREATE TABLE patient_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL,
    consent_date TIMESTAMPTZ DEFAULT NOW(),
    signed_by VARCHAR(255),
    witness_name VARCHAR(255),
    attachment_id UUID REFERENCES file_attachments(id) ON DELETE RESTRICT,
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'Active'
);

-- 15. Patient Alerts
CREATE TABLE patient_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL,
    alert_message TEXT NOT NULL,
    severity VARCHAR(50),
    active_from TIMESTAMPTZ DEFAULT NOW(),
    active_to TIMESTAMPTZ,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Active'
);

-- 16. Patient Tags
CREATE TABLE patient_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    tag_color VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Patient Portal Accounts
CREATE TABLE patient_portal_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE,
    password_hash TEXT,
    last_login TIMESTAMPTZ,
    email_verified BOOLEAN DEFAULT false,
    mobile_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- INDEXES & PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Core Schema Indexes
CREATE INDEX idx_clinics_code ON clinics(clinic_code);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_clinic ON users(clinic_id);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_roles_clinic ON roles(clinic_id);
CREATE INDEX idx_departments_clinic ON departments(clinic_id);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_activity_logs_clinic ON activity_logs(clinic_id);
CREATE INDEX idx_notification_queue_clinic ON notification_queue(clinic_id);

-- Patient Schema Indexes
CREATE INDEX idx_patients_clinic ON patients(clinic_id);
CREATE INDEX idx_patients_uhid ON patients(uhid);
CREATE INDEX idx_patients_mobile ON patients(mobile_number);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patient_addresses_patient ON patient_addresses(patient_id);
CREATE INDEX idx_emergency_contacts_patient ON emergency_contacts(patient_id);
CREATE INDEX idx_patient_medications_patient ON patient_medications(patient_id);
CREATE INDEX idx_patient_medical_history_patient ON patient_medical_history(patient_id);


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) & TRIGGERS
-- ============================================================================

DO $$ 
DECLARE
    t_name text;
BEGIN
    FOR t_name IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        -- Enable RLS
        EXECUTE 'ALTER TABLE ' || t_name || ' ENABLE ROW LEVEL SECURITY';
        -- Base Policy (Allow authenticated access initially)
        EXECUTE 'CREATE POLICY ' || t_name || '_auth_policy ON ' || t_name || ' FOR ALL TO authenticated USING (true) WITH CHECK (true)';
        
        -- Add updated_at trigger if the column exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t_name AND column_name = 'updated_at') THEN
            EXECUTE 'CREATE TRIGGER set_updated_at BEFORE UPDATE ON ' || t_name || ' FOR EACH ROW EXECUTE FUNCTION update_modified_column()';
        END IF;
    END LOOP;
END $$;
