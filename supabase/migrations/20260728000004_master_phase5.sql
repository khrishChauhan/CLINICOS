-- Master Module Phase 5: Business Reference Masters
-- Schema: master
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. AllergyTypes
CREATE TABLE IF NOT EXISTS master.allergy_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allergy_type VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. InsuranceProviders
CREATE TABLE IF NOT EXISTS master.insurance_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name VARCHAR(150) UNIQUE NOT NULL,
    contact_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PaymentModes
CREATE TABLE IF NOT EXISTS master.payment_modes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_mode VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TaxRates
CREATE TABLE IF NOT EXISTS master.tax_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tax_name VARCHAR(100) UNIQUE NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Currencies
CREATE TABLE IF NOT EXISTS master.currencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    currency_code VARCHAR(10) UNIQUE NOT NULL,
    currency_name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DocumentTypes
CREATE TABLE IF NOT EXISTS master.document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type VARCHAR(100) UNIQUE NOT NULL,
    module_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FileTypes
CREATE TABLE IF NOT EXISTS master.file_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_extension VARCHAR(50) UNIQUE NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NotificationChannels
CREATE TABLE IF NOT EXISTS master.notification_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_name VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. LeaveTypes
CREATE TABLE IF NOT EXISTS master.leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leave_type VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ShiftTypes
CREATE TABLE IF NOT EXISTS master.shift_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_name VARCHAR(100) UNIQUE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. VendorCategories
CREATE TABLE IF NOT EXISTS master.vendor_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. InventoryCategories
CREATE TABLE IF NOT EXISTS master.inventory_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ExpenseCategories
CREATE TABLE IF NOT EXISTS master.expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ServiceCatalog
CREATE TABLE IF NOT EXISTS master.service_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code VARCHAR(50) UNIQUE NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES master.departments(id) ON DELETE SET NULL,
    default_price DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. ReferralSources
CREATE TABLE IF NOT EXISTS master.referral_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CancellationReasons
CREATE TABLE IF NOT EXISTS master.cancellation_reasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reason VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS Policies (Global, Open Read, Restricted Write)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE master.allergy_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.payment_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.file_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.notification_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.shift_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.vendor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.service_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.referral_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE master.cancellation_reasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY master_b_select ON master.allergy_types FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b_all ON master.allergy_types FOR ALL TO authenticated USING (true);

CREATE POLICY master_b1_select ON master.insurance_providers FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b1_all ON master.insurance_providers FOR ALL TO authenticated USING (true);

CREATE POLICY master_b2_select ON master.payment_modes FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b2_all ON master.payment_modes FOR ALL TO authenticated USING (true);

CREATE POLICY master_b3_select ON master.tax_rates FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b3_all ON master.tax_rates FOR ALL TO authenticated USING (true);

CREATE POLICY master_b4_select ON master.currencies FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b4_all ON master.currencies FOR ALL TO authenticated USING (true);

CREATE POLICY master_b5_select ON master.document_types FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b5_all ON master.document_types FOR ALL TO authenticated USING (true);

CREATE POLICY master_b6_select ON master.file_types FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b6_all ON master.file_types FOR ALL TO authenticated USING (true);

CREATE POLICY master_b7_select ON master.notification_channels FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b7_all ON master.notification_channels FOR ALL TO authenticated USING (true);

CREATE POLICY master_b8_select ON master.leave_types FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b8_all ON master.leave_types FOR ALL TO authenticated USING (true);

CREATE POLICY master_b9_select ON master.shift_types FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b9_all ON master.shift_types FOR ALL TO authenticated USING (true);

CREATE POLICY master_b10_select ON master.vendor_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b10_all ON master.vendor_categories FOR ALL TO authenticated USING (true);

CREATE POLICY master_b11_select ON master.inventory_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b11_all ON master.inventory_categories FOR ALL TO authenticated USING (true);

CREATE POLICY master_b12_select ON master.expense_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b12_all ON master.expense_categories FOR ALL TO authenticated USING (true);

CREATE POLICY master_b13_select ON master.service_catalog FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b13_all ON master.service_catalog FOR ALL TO authenticated USING (true);

CREATE POLICY master_b14_select ON master.referral_sources FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b14_all ON master.referral_sources FOR ALL TO authenticated USING (true);

CREATE POLICY master_b15_select ON master.cancellation_reasons FOR SELECT TO authenticated USING (true);
CREATE POLICY master_b15_all ON master.cancellation_reasons FOR ALL TO authenticated USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Data Seeding
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO master.payment_modes (payment_mode) VALUES
('Cash'), ('Card'), ('UPI'), ('Net Banking'), ('Insurance')
ON CONFLICT DO NOTHING;

INSERT INTO master.notification_channels (channel_name) VALUES
('Email'), ('SMS'), ('WhatsApp'), ('Push')
ON CONFLICT DO NOTHING;

INSERT INTO master.referral_sources (source_name) VALUES
('Walk-in'), ('Doctor Referral'), ('Google'), ('Facebook'), ('Website')
ON CONFLICT DO NOTHING;

INSERT INTO master.cancellation_reasons (reason) VALUES
('Patient No-show'),
('Doctor Unavailable'),
('Rescheduled'),
('Weather / Travel Issue'),
('Emergency')
ON CONFLICT DO NOTHING;

INSERT INTO master.currencies (currency_code, currency_name, symbol) VALUES
('INR', 'Indian Rupee', '₹'),
('USD', 'US Dollar', '$')
ON CONFLICT DO NOTHING;

INSERT INTO master.allergy_types (allergy_type) VALUES
('Drug'), ('Food'), ('Environmental'), ('Other')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Add UUID FKs to Existing Tables (Backwards Compatibility Mode)
-- ─────────────────────────────────────────────────────────────────────────────

-- Appointments Cancellation integration
ALTER TABLE appointment.appointments
ADD COLUMN master_cancellation_reason_id UUID REFERENCES master.cancellation_reasons(id) ON DELETE SET NULL;

ALTER TABLE appointment.appointment_cancellation
ADD COLUMN master_cancellation_reason_id UUID REFERENCES master.cancellation_reasons(id) ON DELETE SET NULL;

-- Dynamic Migration for Appointments
DO $$
BEGIN
  -- We map existing string-based data if they happen to perfectly match our seeds.
  UPDATE appointment.appointments a SET
    master_cancellation_reason_id = (SELECT id FROM master.cancellation_reasons m WHERE m.reason = a.cancellation_reason LIMIT 1)
  WHERE a.cancellation_reason IS NOT NULL;
  
  UPDATE appointment.appointment_cancellation a SET
    master_cancellation_reason_id = (SELECT id FROM master.cancellation_reasons m WHERE m.reason = a.cancellation_reason LIMIT 1)
  WHERE a.cancellation_reason IS NOT NULL;
END $$;
