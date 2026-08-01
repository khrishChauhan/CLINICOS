'use server'

import { createClient } from '@/lib/supabase/server'
import { radiologyClinicalService } from '@/services/radiology/radiologyClinicalService'
import { revalidatePath } from 'next/cache'
import type { ContrastAdministrationRow, RadiationDoseRow } from '@/types/radiology'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic not found')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function recordContrastAction(payload: Omit<ContrastAdministrationRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'administrator'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyClinicalService.recordContrast(supabase, clinicId, payload)
    revalidatePath(`/radiology/clinical`)
    revalidatePath(`/radiology/studies/${payload.imaging_study_id}`)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function recordRadiationDoseAction(payload: Omit<RadiationDoseRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'equipment' | 'operator'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyClinicalService.recordRadiationDose(supabase, clinicId, payload)
    revalidatePath(`/radiology/clinical`)
    revalidatePath(`/radiology/studies/${payload.imaging_study_id}`)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}
