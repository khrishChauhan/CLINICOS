-- ============================================================================
-- Click Aarambh ClinicOS - Phase 4: Billing Schema
-- ============================================================================

-- 1. Service Categories
CREATE TABLE IF NOT EXISTS public.billing_service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Services Catalog
CREATE TABLE IF NOT EXISTS public.billing_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.billing_service_categories(id) ON DELETE SET NULL,
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Billing Invoices
CREATE TABLE IF NOT EXISTS public.billing_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    visit_id UUID, -- Optional link to a specific visit
    invoice_number VARCHAR(50) UNIQUE,
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Issued, Partially Paid, Paid, Cancelled, Refunded
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    amount_due NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    due_date TIMESTAMPTZ,
    issued_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate Invoice Number Trigger
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    seq_val INT;
BEGIN
    IF NEW.status = 'Issued' AND OLD.status = 'Draft' THEN
        -- Basic generation logic (can be made safer with sequences)
        SELECT COUNT(*) + 1 INTO seq_val FROM public.billing_invoices WHERE clinic_id = NEW.clinic_id AND status != 'Draft';
        NEW.invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(seq_val::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_invoice_number
BEFORE UPDATE ON public.billing_invoices
FOR EACH ROW
EXECUTE FUNCTION generate_invoice_number();

-- 4. Billing Invoice Items
CREATE TABLE IF NOT EXISTS public.billing_invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.billing_invoices(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.billing_services(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent modification of Issued Invoices
CREATE OR REPLACE FUNCTION prevent_modify_issued_invoice()
RETURNS TRIGGER AS $$
DECLARE
    inv_status VARCHAR(50);
BEGIN
    SELECT status INTO inv_status FROM public.billing_invoices WHERE id = NEW.invoice_id;
    IF inv_status != 'Draft' THEN
        RAISE EXCEPTION 'Cannot modify items for an invoice that is already %', inv_status;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_modify_issued_invoice
BEFORE INSERT OR UPDATE OR DELETE ON public.billing_invoice_items
FOR EACH ROW
EXECUTE FUNCTION prevent_modify_issued_invoice();


-- 5. Billing Payments
CREATE TABLE IF NOT EXISTS public.billing_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    invoice_id UUID NOT NULL REFERENCES public.billing_invoices(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL, -- Cash, Card, UPI, Bank Transfer
    amount NUMERIC(12, 2) NOT NULL,
    transaction_reference VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Success', -- Success, Failed, Refunded
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    collected_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- RLS
ALTER TABLE public.billing_service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY billing_service_categories_auth_policy ON public.billing_service_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY billing_services_auth_policy ON public.billing_services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY billing_invoices_auth_policy ON public.billing_invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY billing_invoice_items_auth_policy ON public.billing_invoice_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY billing_payments_auth_policy ON public.billing_payments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX idx_billing_invoices_clinic ON public.billing_invoices(clinic_id);
CREATE INDEX idx_billing_invoices_patient ON public.billing_invoices(patient_id);
CREATE INDEX idx_billing_invoice_items_invoice ON public.billing_invoice_items(invoice_id);
CREATE INDEX idx_billing_payments_invoice ON public.billing_payments(invoice_id);
