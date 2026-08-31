import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const TABLES = [
  // OT
  { schema: 'ot', name: 'consumables' },
  { schema: 'ot', name: 'notes' },
  { schema: 'ot', name: 'checklists' },
  { schema: 'ot', name: 'team_members' },
  { schema: 'ot', name: 'surgeries' },
  // IPD
  { schema: 'ipd', name: 'medication_administrations' },
  { schema: 'ipd', name: 'nursing_vitals' },
  { schema: 'ipd', name: 'bed_allocations' },
  { schema: 'ipd', name: 'admissions' },
  // Radiology
  { schema: 'radiology', name: 'radiology_attachments' },
  { schema: 'radiology', name: 'radiology_notifications' },
  { schema: 'radiology', name: 'radiologist_findings' },
  { schema: 'radiology', name: 'radiology_reports' },
  { schema: 'radiology', name: 'imaging_images' },
  { schema: 'radiology', name: 'imaging_series' },
  { schema: 'radiology', name: 'imaging_studies' },
  { schema: 'radiology', name: 'radiology_schedule' },
  { schema: 'radiology', name: 'radiology_order_items' },
  { schema: 'radiology', name: 'radiology_orders' },
  // Lab
  { schema: 'laboratory', name: 'lab_results' },
  { schema: 'laboratory', name: 'lab_result_parameters' },
  { schema: 'laboratory', name: 'lab_reports' },
  { schema: 'laboratory', name: 'lab_sample_tracking' },
  { schema: 'laboratory', name: 'lab_sample_collections' },
  { schema: 'laboratory', name: 'lab_samples' },
  { schema: 'laboratory', name: 'lab_order_items' },
  { schema: 'laboratory', name: 'lab_orders' },
  // EMR
  { schema: 'public', name: 'emr_audit' },
  { schema: 'public', name: 'diagnosis_history' },
  { schema: 'public', name: 'treatment_plans' },
  { schema: 'public', name: 'clinical_alerts' },
  { schema: 'public', name: 'referrals' },
  { schema: 'public', name: 'clinical_attachments' },
  { schema: 'public', name: 'follow_up_plans' },
  { schema: 'public', name: 'clinical_notes' },
  { schema: 'public', name: 'clinical_orders' },
  { schema: 'public', name: 'prescription_items' },
  { schema: 'public', name: 'prescriptions' },
  { schema: 'public', name: 'procedures' },
  { schema: 'public', name: 'diagnoses' },
  { schema: 'public', name: 'soap_notes' },
  { schema: 'public', name: 'vitals' },
  { schema: 'public', name: 'chief_complaints' },
  { schema: 'public', name: 'visits' },
  // Pharmacy
  { schema: 'public', name: 'dispense_items' },
  { schema: 'public', name: 'dispense_records' },
  { schema: 'public', name: 'stock_transactions' },
  { schema: 'public', name: 'medicine_stock' },
  { schema: 'public', name: 'medicine_batches' },
  { schema: 'public', name: 'medicines' },
  { schema: 'public', name: 'suppliers' },
  // Billing
  { schema: 'public', name: 'billing_payments' },
  { schema: 'public', name: 'billing_invoice_items' },
  { schema: 'public', name: 'billing_invoices' },
  // Appointments
  { schema: 'appointment', name: 'appointment_cancellation' },
  { schema: 'appointment', name: 'follow_up_appointments' },
  { schema: 'appointment', name: 'online_appointments' },
  { schema: 'public', name: 'appointment_slots' },
  { schema: 'public', name: 'appointments' },
  { schema: 'public', name: 'queue_entries' },
  { schema: 'public', name: 'clinic_queues' },
  // Patients
  { schema: 'public', name: 'patient_documents' },
  { schema: 'public', name: 'patient_allergies' },
  { schema: 'public', name: 'patient_emergency_contacts' },
  { schema: 'public', name: 'patient_insurance' },
  { schema: 'public', name: 'patient_tags' },
  { schema: 'public', name: 'patient_audit' },
  { schema: 'public', name: 'patients' },
  // Doctors
  { schema: 'doctor', name: 'doctor_availability' },
  { schema: 'doctor', name: 'doctor_departments' },
  { schema: 'doctor', name: 'doctor_specializations' },
  { schema: 'doctor', name: 'doctor_registrations' },
  { schema: 'doctor', name: 'doctor_qualifications' },
  { schema: 'doctor', name: 'doctors' },
  // Users
  { schema: 'public', name: 'users' },
]

async function run() {
  console.log('🚀 Wiping database via API...')

  for (const t of TABLES) {
    const { error } = await supabase.schema(t.schema).from(t.name).delete().not('id', 'is', null)
    if (error) {
      console.warn(`⚠️  Failed to wipe ${t.schema}.${t.name}:`, error.message)
    } else {
      console.log(`✅ Wiped ${t.schema}.${t.name}`)
    }
  }

  console.log('\n🧹 Deleting all Auth Users...')
  const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers()
  if (listErr) {
    console.error('Failed to list users', listErr)
  } else {
    for (const u of users) {
      await supabase.auth.admin.deleteUser(u.id)
      console.log(`✅ Deleted user: ${u.email}`)
    }
  }

  console.log('\n🎉 Wipe Complete!')
}

run().catch(console.error)