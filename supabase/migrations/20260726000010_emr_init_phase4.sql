-- EMR Module Phase 4: Clinical Workflow & Care Management
-- Schema: emr
-- Creates: referrals, clinical_alerts, treatment_plans, clinical_orders

-- ─────────────────────────────────────────────────────────────────────────────
-- Referrals
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
    
    referred_doctor TEXT,
    referred_hospital TEXT,
    referral_reason TEXT NOT NULL,
    referral_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referrals_visit ON public.referrals(visit_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Clinical Alerts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clinical_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES public.visits(id) ON DELETE SET NULL, -- Can be linked to visit, but fundamentally belongs to patient
    
    alert_type VARCHAR(100) NOT NULL, -- Allergy Alert, Drug Interaction, etc.
    alert_message TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL DEFAULT 'Medium', -- High, Medium, Low
    resolved BOOLEAN NOT NULL DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clinical_alerts_patient ON public.clinical_alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_alerts_unresolved ON public.clinical_alerts(patient_id) WHERE resolved = false;

-- ─────────────────────────────────────────────────────────────────────────────
-- Treatment Plans
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
    
    treatment_goal TEXT NOT NULL,
    treatment_description TEXT NOT NULL,
    expected_duration VARCHAR(100),
    review_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Active', -- Active, Completed, Discontinued
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_treatment_plans_patient ON public.treatment_plans(patient_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Clinical Orders
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clinical_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
    
    order_type VARCHAR(100) NOT NULL, -- Laboratory, Radiology, Procedure, External
    order_reference TEXT, -- LOINC/CPT/internal code
    ordered_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    order_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    status VARCHAR(50) NOT NULL DEFAULT 'Ordered', -- Ordered, In Progress, Resulted, Cancelled
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clinical_orders_visit ON public.clinical_orders(visit_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS Policies
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY emr_referrals_policy ON public.referrals FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY emr_clinical_alerts_policy ON public.clinical_alerts FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY emr_treatment_plans_policy ON public.treatment_plans FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY emr_clinical_orders_policy ON public.clinical_orders FOR ALL USING (clinic_id = (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
