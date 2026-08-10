'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { prescriptionService } from '@/services/emr/prescriptionService'
import type { PrescriptionRow, PrescriptionItemRow } from '@/types/emr'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getPrescriptionAction(visitId: string, doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await prescriptionService.getOrCreate(supabase, clinicId, visitId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function savePrescriptionAction(
  visitId: string,
  doctorId: string,
  updates: Partial<Pick<PrescriptionRow, 'advice' | 'dietary_advice' | 'next_visit'>>
) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await prescriptionService.savePrescription(supabase, clinicId, visitId, doctorId, updates)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addPrescriptionItemAction(
  prescriptionId: string,
  payload: Partial<Omit<PrescriptionItemRow, 'id' | 'clinic_id' | 'prescription_id' | 'created_at'>>
) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await prescriptionService.addItem(supabase, clinicId, prescriptionId, payload)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deletePrescriptionItemAction(itemId: string) {
  try {
    const { supabase } = await getAuthContext()
    await prescriptionService.removeItem(supabase, itemId)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
