-- 20260808000000_pharmacy_schema_init.sql
-- Phase 5: Pharmacy & Inventory Schema

-- 1. Suppliers
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    contact_number VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    gst_number VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_suppliers_clinic ON public.suppliers(clinic_id);

-- 2. Clinic-specific Medicines Catalog
CREATE TABLE IF NOT EXISTS public.medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    master_medicine_id UUID,
    generic_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255),
    category_id UUID,
    unit_id UUID,
    reorder_level INTEGER DEFAULT 10,
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_medicines_clinic ON public.medicines(clinic_id);
CREATE INDEX idx_medicines_master ON public.medicines(master_medicine_id);

-- 3. Medicine Batches
CREATE TABLE IF NOT EXISTS public.medicine_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
    batch_number VARCHAR(100) NOT NULL,
    mrp NUMERIC(10,2) NOT NULL,
    purchase_price NUMERIC(10,2) NOT NULL,
    expiry_date DATE NOT NULL,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(medicine_id, batch_number)
);
CREATE INDEX idx_batches_expiry ON public.medicine_batches(expiry_date);

-- 4. Medicine Stock
CREATE TABLE IF NOT EXISTS public.medicine_stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL UNIQUE REFERENCES public.medicine_batches(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_stock_clinic ON public.medicine_stock(clinic_id);

-- 5. Stock Transactions (Audit Log)
CREATE TABLE IF NOT EXISTS public.stock_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES public.medicine_batches(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'Purchase', 'Dispense', 'Adjustment', 'Return'
    quantity_change INTEGER NOT NULL,
    reference_id UUID, -- E.g. invoice_id, dispense_id
    remarks TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Dispense Records
CREATE TABLE IF NOT EXISTS public.dispense_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    visit_id UUID, -- Link to EMR visit
    prescription_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'Completed',
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    dispensed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    dispensed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Dispense Items
CREATE TABLE IF NOT EXISTS public.dispense_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispense_record_id UUID NOT NULL REFERENCES public.dispense_records(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE RESTRICT,
    batch_id UUID NOT NULL REFERENCES public.medicine_batches(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    is_substituted BOOLEAN DEFAULT false,
    original_medicine_id UUID REFERENCES public.medicines(id) ON DELETE SET NULL,
    substitution_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Enablement
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispense_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispense_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinic isolation for suppliers" ON public.suppliers FOR ALL USING (clinic_id = (SELECT clinic_id FROM get_session_context()));
CREATE POLICY "Clinic isolation for medicines" ON public.medicines FOR ALL USING (clinic_id = (SELECT clinic_id FROM get_session_context()));
CREATE POLICY "Clinic isolation for medicine_stock" ON public.medicine_stock FOR ALL USING (clinic_id = (SELECT clinic_id FROM get_session_context()));
CREATE POLICY "Clinic isolation for stock_transactions" ON public.stock_transactions FOR ALL USING (clinic_id = (SELECT clinic_id FROM get_session_context()));
CREATE POLICY "Clinic isolation for dispense_records" ON public.dispense_records FOR ALL USING (clinic_id = (SELECT clinic_id FROM get_session_context()));

-- Batches don't have clinic_id directly, they join via medicines
CREATE POLICY "Clinic isolation for medicine_batches" ON public.medicine_batches FOR ALL USING (
    medicine_id IN (SELECT id FROM public.medicines WHERE clinic_id = (SELECT clinic_id FROM get_session_context()))
);

CREATE POLICY "Clinic isolation for dispense_items" ON public.dispense_items FOR ALL USING (
    dispense_record_id IN (SELECT id FROM public.dispense_records WHERE clinic_id = (SELECT clinic_id FROM get_session_context()))
);


-- 8. Postgres RPC Function for Atomic FEFO Dispensing
CREATE OR REPLACE FUNCTION public.dispense_medicines_fefo(
    p_clinic_id UUID,
    p_patient_id UUID,
    p_user_id UUID,
    p_visit_id UUID,
    p_prescription_id UUID,
    p_items JSONB -- Array of { medicine_id, quantity, original_medicine_id, substitution_reason }
) RETURNS UUID AS $$
DECLARE
    v_dispense_id UUID;
    v_total_amount NUMERIC(10,2) := 0;
    v_item RECORD;
    v_remaining_qty INTEGER;
    v_batch RECORD;
    v_deduct_qty INTEGER;
    v_item_total NUMERIC(10,2);
    v_billing_invoice_id UUID;
    
    -- Substitution check variables
    v_target_med RECORD;
    v_orig_med RECORD;
BEGIN
    -- 1. Create Dispense Record (Draft)
    INSERT INTO public.dispense_records (clinic_id, patient_id, visit_id, prescription_id, dispensed_by, status, total_amount)
    VALUES (p_clinic_id, p_patient_id, p_visit_id, p_prescription_id, p_user_id, 'Completed', 0)
    RETURNING id INTO v_dispense_id;

    -- 2. Loop through requested items
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(medicine_id UUID, quantity INTEGER, original_medicine_id UUID, substitution_reason TEXT)
    LOOP
        v_remaining_qty := v_item.quantity;
        
        -- Substitution Verification
        IF v_item.original_medicine_id IS NOT NULL AND v_item.original_medicine_id != v_item.medicine_id THEN
            SELECT * INTO v_target_med FROM public.medicines WHERE id = v_item.medicine_id;
            SELECT * INTO v_orig_med FROM public.medicines WHERE id = v_item.original_medicine_id;
            
            IF v_target_med.generic_name != v_orig_med.generic_name THEN
                RAISE EXCEPTION 'Substitution failed: Generic names do not match (% vs %)', v_target_med.generic_name, v_orig_med.generic_name;
            END IF;
        END IF;

        -- FEFO Batch Selection (Locking to prevent race conditions)
        FOR v_batch IN 
            SELECT b.id, b.mrp, s.quantity, s.id as stock_id
            FROM public.medicine_batches b
            JOIN public.medicine_stock s ON s.batch_id = b.id
            WHERE b.medicine_id = v_item.medicine_id 
              AND s.quantity > 0 
              AND b.expiry_date >= CURRENT_DATE
            ORDER BY b.expiry_date ASC
            FOR UPDATE OF s -- Row level lock on stock!
        LOOP
            IF v_remaining_qty <= 0 THEN
                EXIT;
            END IF;

            IF v_batch.quantity >= v_remaining_qty THEN
                v_deduct_qty := v_remaining_qty;
            ELSE
                v_deduct_qty := v_batch.quantity;
            END IF;

            -- Deduct stock
            UPDATE public.medicine_stock 
            SET quantity = quantity - v_deduct_qty, updated_at = NOW()
            WHERE id = v_batch.stock_id;

            -- Record transaction log
            INSERT INTO public.stock_transactions (clinic_id, batch_id, transaction_type, quantity_change, reference_id, created_by)
            VALUES (p_clinic_id, v_batch.id, 'Dispense', -v_deduct_qty, v_dispense_id, p_user_id);

            -- Record dispense item
            v_item_total := v_deduct_qty * v_batch.mrp;
            v_total_amount := v_total_amount + v_item_total;

            INSERT INTO public.dispense_items (dispense_record_id, medicine_id, batch_id, quantity, unit_price, total_price, is_substituted, original_medicine_id, substitution_reason)
            VALUES (v_dispense_id, v_item.medicine_id, v_batch.id, v_deduct_qty, v_batch.mrp, v_item_total, 
                    (v_item.original_medicine_id IS NOT NULL AND v_item.original_medicine_id != v_item.medicine_id), 
                    v_item.original_medicine_id, v_item.substitution_reason);

            v_remaining_qty := v_remaining_qty - v_deduct_qty;
        END LOOP;

        IF v_remaining_qty > 0 THEN
            RAISE EXCEPTION 'Insufficient unexpired stock for medicine_id %', v_item.medicine_id;
        END IF;
    END LOOP;

    -- Update total amount in dispense record
    UPDATE public.dispense_records SET total_amount = v_total_amount WHERE id = v_dispense_id;

    -- 3. Atomic Billing Integration
    -- If amount > 0, generate an invoice and invoice items
    IF v_total_amount > 0 THEN
        INSERT INTO public.billing_invoices (clinic_id, patient_id, type, status, subtotal, total_amount, created_at)
        VALUES (p_clinic_id, p_patient_id, 'Pharmacy', 'Draft', v_total_amount, v_total_amount, NOW())
        RETURNING id INTO v_billing_invoice_id;

        INSERT INTO public.billing_invoice_items (invoice_id, item_type, description, quantity, unit_price, total_amount)
        SELECT 
            v_billing_invoice_id,
            'Medicine',
            m.brand_name || ' (Batch: ' || b.batch_number || ')',
            di.quantity,
            di.unit_price,
            di.total_price
        FROM public.dispense_items di
        JOIN public.medicines m ON m.id = di.medicine_id
        JOIN public.medicine_batches b ON b.id = di.batch_id
        WHERE di.dispense_record_id = v_dispense_id;
    END IF;

    RETURN v_dispense_id;
END;
$$ LANGUAGE plpgsql;
