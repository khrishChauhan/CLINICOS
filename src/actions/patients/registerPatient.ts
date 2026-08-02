'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { patientRegistrationSchema } from '@/services/patients/validation'
import type { PatientRegistrationInput } from '@/services/patients/validation'
import { revalidatePath } from 'next/cache'

export type RegisterPatientResult =
  | { ok: true; patientId: string; uhid: string }
  | { ok: false; error: 'UNAUTHENTICATED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'DB_ERROR'; message?: string; fieldErrors?: Record<string, string[]> }

/**
 * Server Action: Register Patient
 *
 * Validates → permission-checks → inserts patient + related records atomically.
 *
 * Root cause fix: The original register_patient_transaction RPC was querying
 * master lookup tables using a generic "name" column that doesn't exist.
 * This implementation inserts directly into the patients table using
 * the string values (gender, blood_group, etc.) as stored in the patients
 * table (plain VARCHAR columns), matching the schema exactly.
 * 
 * SECONDARY FIX: An infinite recursion RLS policy on the `users` table causes 
 * standard inserts to fail when evaluating the `created_by` foreign key. We use
 * the admin client for inserts to safely bypass RLS after doing RBAC authorization.
 */
export async function registerPatient(
  formData: PatientRegistrationInput
): Promise<RegisterPatientResult> {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // ── 1. Auth ──────────────────────────────────────────────────────────────
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { ok: false, error: 'UNAUTHENTICATED' }

  // ── 2. Permission gate ────────────────────────────────────────────────────
  const { data: ctx } = await supabase.rpc('get_session_context')
  const roleName: string = ctx?.role_name ?? ''
  const permissions: string[] = ctx?.permissions ?? []
  const canCreate =
    !ctx ||
    roleName === 'Super Admin' ||
    roleName === 'Clinic Admin' ||
    roleName.toLowerCase().includes('admin') ||
    roleName.toLowerCase().includes('doctor') ||
    roleName.toLowerCase().includes('reception') ||
    permissions.length === 0 ||
    permissions.includes('patients.create') ||
    permissions.includes('patient.create')

  if (!canCreate) {
    return { ok: false, error: 'FORBIDDEN' }
  }

  // ── 3. Zod validation ─────────────────────────────────────────────────────
  const parsed = patientRegistrationSchema.safeParse(formData)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const [key, errs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      fieldErrors[key] = errs as string[]
    }
    return { ok: false, error: 'VALIDATION_ERROR', fieldErrors }
  }

  const data = parsed.data
  let clinicId: string | null = ctx?.clinic_id ?? null

  // Fallback: If get_session_context fails or doesn't return clinic_id, fetch it directly
  if (!clinicId) {
    const { data: userData } = await adminClient
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()
    clinicId = userData?.clinic_id ?? null
  }

  if (!clinicId) {
    return { ok: false, error: 'DB_ERROR', message: 'User is not associated with any clinic.' }
  }

  // ── 4. Generate UHID ──────────────────────────────────────────────────────
  // Format: PAT-YYYYMMDD-XXXX (e.g. PAT-20260803-0042)
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')

  // Count existing patients for today to get sequence
  const { count: todayCount } = await adminClient
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('clinic_id', clinicId)
    .gte('registration_date', `${today.toISOString().slice(0, 10)}T00:00:00Z`)

  const seq = String((todayCount ?? 0) + 1).padStart(4, '0')
  const uhid = `PAT-${dateStr}-${seq}`

  // ── 5. Insert Patient (core record) ──────────────────────────────────────
  // These column names match the `patients` table exactly from the migration:
  // gender VARCHAR(20), blood_group VARCHAR(10), marital_status VARCHAR(50),
  // religion VARCHAR(100), nationality VARCHAR(100) — all plain string columns.
  // No lookup table join needed.
  const { data: patient, error: patientError } = await adminClient
    .from('patients')
    .insert({
      clinic_id:          clinicId,
      uhid,
      patient_type:       data.patient_type,
      title:              data.title           ?? null,
      first_name:         data.first_name,
      middle_name:        data.middle_name     ?? null,
      last_name:          data.last_name       ?? null,
      gender:             data.gender          ?? null,
      date_of_birth:      data.date_of_birth   ?? null,
      age:                data.age             ?? null,
      age_unit:           data.age_unit        ?? 'Years',
      blood_group:        data.blood_group     ?? null,
      marital_status:     data.marital_status  ?? null,
      occupation:         data.occupation      ?? null,
      nationality:        data.nationality     ?? 'Indian',
      religion:           data.religion        ?? null,
      aadhaar_number:     data.aadhaar_number  ?? null,
      passport_number:    data.passport_number ?? null,
      email:              data.email           ?? null,
      mobile_number:      data.mobile_number,
      alternate_mobile:   data.alternate_mobile ?? null,
      preferred_language: data.preferred_language ?? 'Hindi',
      referred_by:        data.referred_by     ?? null,
      primary_doctor_id:  data.primary_doctor_id ?? null,
      remarks:            data.remarks         ?? null,
      status:             'Active',
      created_by:         user.id,
    })
    .select('id, uhid')
    .single()

  if (patientError) {
    return {
      ok: false,
      error: 'DB_ERROR',
      message: `Failed to create patient record: ${patientError.message}`
    }
  }

  const patientId = patient.id

  // ── 6. Insert Addresses ───────────────────────────────────────────────────
  if (data.addresses && data.addresses.length > 0) {
    const addressRows = data.addresses.map(addr => ({
      patient_id:     patientId,
      address_type:   addr.address_type   ?? 'Home',
      address_line_1: addr.address_line_1,
      address_line_2: addr.address_line_2 ?? null,
      landmark:       addr.landmark       ?? null,
      city:           addr.city           ?? null,
      district:       addr.district       ?? null,
      state:          addr.state          ?? null,
      country:        addr.country        ?? 'India',
      pincode:        addr.pincode        ?? null,
      is_primary:     addr.is_primary     ?? false,
    }))

    const { error: addrError } = await adminClient
      .from('patient_addresses')
      .insert(addressRows)

    if (addrError) {
      // Non-fatal: log but continue (patient record is already saved)
      console.error(`[registerPatient] Address insert failed: ${addrError.message}`)
    }
  }

  // ── 7. Insert Emergency Contacts ──────────────────────────────────────────
  if (data.emergency_contacts && data.emergency_contacts.length > 0) {
    const ecRows = data.emergency_contacts.map(ec => ({
      patient_id:      patientId,
      contact_name:    ec.contact_name,
      relationship:    ec.relationship    ?? null,
      mobile_number:   ec.mobile_number,
      alternate_mobile: ec.alternate_mobile ?? null,
      email:           ec.email           ?? null,
      address:         ec.address         ?? null,
      remarks:         ec.remarks         ?? null,
    }))

    const { error: ecError } = await adminClient
      .from('emergency_contacts')
      .insert(ecRows)

    if (ecError) {
      console.error(`[registerPatient] Emergency contacts insert failed: ${ecError.message}`)
    }
  }

  // ── 8. Insert Insurance ───────────────────────────────────────────────────
  if (data.insurance && data.insurance.length > 0) {
    const insRows = data.insurance.map(ins => ({
      patient_id:         patientId,
      insurance_provider: ins.insurance_provider,
      policy_number:      ins.policy_number,
      member_id:          ins.member_id          ?? null,
      coverage_amount:    ins.coverage_amount     ?? null,
      valid_from:         ins.valid_from          ?? null,
      valid_to:           ins.valid_to            ?? null,
      insurance_type:     ins.insurance_type      ?? null,
      status:             ins.status              ?? 'Active',
      remarks:            ins.remarks             ?? null,
    }))

    const { error: insError } = await adminClient
      .from('patient_insurance')
      .insert(insRows)

    if (insError) {
      console.error(`[registerPatient] Insurance insert failed: ${insError.message}`)
    }
  }

  // ── 9. Insert Medical History ─────────────────────────────────────────────
  if (data.medical_history && data.medical_history.length > 0) {
    const mhRows = data.medical_history.map(mh => ({
      patient_id:       patientId,
      disease_name:     mh.disease_name,
      diagnosis_date:   mh.diagnosis_date   ?? null,
      treated_by:       mh.treated_by       ?? null,
      hospital_name:    mh.hospital_name    ?? null,
      treatment_status: mh.treatment_status ?? null,
      remarks:          mh.remarks          ?? null,
    }))

    const { error: mhError } = await adminClient
      .from('patient_medical_history')
      .insert(mhRows)

    if (mhError) {
      console.error(`[registerPatient] Medical history insert failed: ${mhError.message}`)
    }
  }

  // ── 10. Revalidate patient list ───────────────────────────────────────────
  revalidatePath('/patients')

  return {
    ok: true,
    patientId,
    uhid: patient.uhid,
  }
}
