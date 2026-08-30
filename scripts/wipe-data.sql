-- ============================================================
-- ClinicOS Production Launch — Full Data Wipe Script
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ⚠️  IRREVERSIBLE — All transactional data will be permanently deleted
-- ============================================================

-- ────────────────────────────────────────────────
-- STEP 1: OT Schema
-- ────────────────────────────────────────────────
TRUNCATE TABLE ot.consumables     CASCADE;
TRUNCATE TABLE ot.notes           CASCADE;
TRUNCATE TABLE ot.checklists      CASCADE;
TRUNCATE TABLE ot.team_members    CASCADE;
TRUNCATE TABLE ot.surgeries       CASCADE;

-- ────────────────────────────────────────────────
-- STEP 2: IPD Schema
-- ────────────────────────────────────────────────
TRUNCATE TABLE ipd.medication_administrations CASCADE;
TRUNCATE TABLE ipd.nursing_vitals             CASCADE;
TRUNCATE TABLE ipd.bed_allocations            CASCADE;
TRUNCATE TABLE ipd.admissions                 CASCADE;

-- ────────────────────────────────────────────────
-- STEP 3: Radiology Schema
-- ────────────────────────────────────────────────
TRUNCATE TABLE radiology.radiology_attachments    CASCADE;
TRUNCATE TABLE radiology.radiology_notifications  CASCADE;
TRUNCATE TABLE radiology.radiologist_findings     CASCADE;
TRUNCATE TABLE radiology.radiology_reports        CASCADE;
TRUNCATE TABLE radiology.imaging_images           CASCADE;
TRUNCATE TABLE radiology.imaging_series           CASCADE;
TRUNCATE TABLE radiology.imaging_studies          CASCADE;
TRUNCATE TABLE radiology.radiology_schedule       CASCADE;
TRUNCATE TABLE radiology.radiology_order_items    CASCADE;
TRUNCATE TABLE radiology.radiology_orders         CASCADE;

-- ────────────────────────────────────────────────
-- STEP 4: Laboratory Schema
-- ────────────────────────────────────────────────
TRUNCATE TABLE laboratory.lab_results             CASCADE;
TRUNCATE TABLE laboratory.lab_result_parameters   CASCADE;
TRUNCATE TABLE laboratory.lab_reports             CASCADE;
TRUNCATE TABLE laboratory.lab_sample_tracking     CASCADE;
TRUNCATE TABLE laboratory.lab_sample_collections  CASCADE;
TRUNCATE TABLE laboratory.lab_samples             CASCADE;
TRUNCATE TABLE laboratory.lab_order_items         CASCADE;
TRUNCATE TABLE laboratory.lab_orders              CASCADE;

-- ────────────────────────────────────────────────
-- STEP 5: EMR Schema
-- ────────────────────────────────────────────────
TRUNCATE TABLE public.emr_audit            CASCADE;
TRUNCATE TABLE public.diagnosis_history    CASCADE;
TRUNCATE TABLE public.treatment_plans      CASCADE;
TRUNCATE TABLE public.clinical_alerts      CASCADE;
TRUNCATE TABLE public.referrals            CASCADE;
TRUNCATE TABLE public.clinical_attachments CASCADE;
TRUNCATE TABLE public.follow_up_plans      CASCADE;
TRUNCATE TABLE public.clinical_notes       CASCADE;
TRUNCATE TABLE public.clinical_orders      CASCADE;
TRUNCATE TABLE public.prescription_items   CASCADE;
TRUNCATE TABLE public.prescriptions        CASCADE;
TRUNCATE TABLE public.procedures           CASCADE;
TRUNCATE TABLE public.diagnoses            CASCADE;
TRUNCATE TABLE public.soap_notes           CASCADE;
TRUNCATE TABLE public.vitals               CASCADE;
TRUNCATE TABLE public.chief_complaints     CASCADE;
TRUNCATE TABLE public.visits               CASCADE;

-- ────────────────────────────────────────────────
-- STEP 6: Pharmacy / Stock
-- ────────────────────────────────────────────────
TRUNCATE TABLE public.dispense_items      CASCADE;
TRUNCATE TABLE public.dispense_records    CASCADE;
TRUNCATE TABLE public.stock_transactions  CASCADE;
TRUNCATE TABLE public.medicine_stock      CASCADE;
TRUNCATE TABLE public.medicine_batches    CASCADE;
TRUNCATE TABLE public.medicines           CASCADE;
TRUNCATE TABLE public.suppliers           CASCADE;

-- ────────────────────────────────────────────────
-- STEP 7: Billing
-- ────────────────────────────────────────────────
TRUNCATE TABLE public.billing_payments      CASCADE;
TRUNCATE TABLE public.billing_invoice_items CASCADE;
TRUNCATE TABLE public.billing_invoices      CASCADE;

-- ────────────────────────────────────────────────
-- STEP 8: Appointments & Queue
-- ────────────────────────────────────────────────
TRUNCATE TABLE appointment.appointment_cancellation  CASCADE;
TRUNCATE TABLE appointment.follow_up_appointments    CASCADE;
TRUNCATE TABLE appointment.online_appointments       CASCADE;
TRUNCATE TABLE public.appointment_slots              CASCADE;
TRUNCATE TABLE public.appointments                   CASCADE;
TRUNCATE TABLE public.queue_entries                  CASCADE;
TRUNCATE TABLE public.clinic_queues                  CASCADE;

-- ────────────────────────────────────────────────
-- STEP 9: Patient Records
-- ────────────────────────────────────────────────
TRUNCATE TABLE public.patient_documents          CASCADE;
TRUNCATE TABLE public.patient_allergies          CASCADE;
TRUNCATE TABLE public.patient_emergency_contacts CASCADE;
TRUNCATE TABLE public.patient_insurance          CASCADE;
TRUNCATE TABLE public.patient_tags               CASCADE;
TRUNCATE TABLE public.patient_audit              CASCADE;
TRUNCATE TABLE public.patients                   CASCADE;

-- ────────────────────────────────────────────────
-- STEP 10: Doctors
-- ────────────────────────────────────────────────
TRUNCATE TABLE doctor.doctor_availability CASCADE;
TRUNCATE TABLE doctor.doctors             CASCADE;

-- ────────────────────────────────────────────────
-- STEP 11: Remove ALL existing user accounts
-- (public.users first due to FK → auth.users)
-- ────────────────────────────────────────────────
DELETE FROM public.users;

-- Clear auth users (requires service role in SQL editor)
-- If this fails with permission error, delete users manually via:
-- Supabase Dashboard → Authentication → Users → Select All → Delete
DELETE FROM auth.users;

-- ============================================================
-- DONE. Database is now clean.
-- Run: npx tsx scripts/seed-production-users.ts
-- ============================================================