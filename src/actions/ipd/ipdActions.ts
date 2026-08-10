'use server'

import { createClient } from '@/lib/supabase/server'
import { IPDRepository } from '@/repositories/ipd/ipdRepository'
import { AdmissionService } from '@/services/ipd/admissionService'
import { DischargeService } from '@/services/ipd/dischargeService'
import { revalidatePath } from 'next/cache'

// Using the standard getSessionContext auth fallback approach 
async function getSessionContext() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_session_context')
  if (!error && data?.length > 0) return data[0]

  // Fallback for SSR/Server Actions
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: userData } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!userData?.clinic_id) throw new Error('Clinic context not found')
  
  return { clinic_id: userData.clinic_id, user_id: user.id }
}

export async function fetchWardsMatrixAction() {
  try {
    await getSessionContext() // Ensure auth
    const supabase = await createClient()
    const repo = new IPDRepository(supabase)
    const { data, error } = await repo.getWards()
    if (error) throw error
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function getActiveAdmissionsAction() {
  try {
    await getSessionContext()
    const admissionService = await AdmissionService.create()
    const data = await admissionService.getActiveAdmissions()
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function admitPatientAction(patientId: string, doctorId: string, reason: string) {
  try {
    const ctx = await getSessionContext()
    const admissionService = await AdmissionService.create()
    const data = await admissionService.requestAdmission({
      patient_id: patientId,
      clinic_id: ctx.clinic_id,
      admitting_doctor_id: doctorId,
      reason_for_admission: reason,
      created_by: ctx.user_id
    })
    revalidatePath('/ipd/admissions')
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function allocateBedAction(admissionId: string, bedId: string) {
  try {
    const ctx = await getSessionContext()
    const admissionService = await AdmissionService.create()
    const data = await admissionService.allocateBed(admissionId, bedId, ctx.user_id)
    revalidatePath('/ipd/wards')
    revalidatePath('/ipd/admissions')
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function transferBedAction(admissionId: string, oldBedId: string, newBedId: string, allocationId: string) {
  try {
    const ctx = await getSessionContext()
    const admissionService = await AdmissionService.create()
    const data = await admissionService.transferBed(admissionId, oldBedId, newBedId, ctx.user_id, allocationId)
    revalidatePath('/ipd/wards')
    revalidatePath('/ipd/admissions')
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function dischargePatientAction(admissionId: string) {
  try {
    await getSessionContext()
    const dischargeService = await DischargeService.create()
    await dischargeService.initiateDischarge(admissionId)
    revalidatePath('/ipd/admissions')
    revalidatePath('/ipd/wards')
    return { ok: true }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function logNursingVitalsAction(admissionId: string, vitals: any) {
  try {
    const ctx = await getSessionContext()
    const supabase = await createClient()
    const repo = new IPDRepository(supabase)
    const { data, error } = await repo.addNursingVital({
      admission_id: admissionId,
      recorded_by: ctx.user_id,
      ...vitals
    })
    if (error) throw error
    revalidatePath('/ipd/nursing-station')
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}
