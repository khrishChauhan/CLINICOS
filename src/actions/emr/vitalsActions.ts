'use server'

import { createClient } from '@/lib/supabase/server'
import { vitalsService } from '@/services/emr/vitalsService'
import type { VitalsRow } from '@/types/emr'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getVitalsAction(visitId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await vitalsService.getAll(supabase, visitId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function recordVitalsAction(
  visitId: string,
  payload: Partial<Omit<VitalsRow, 'id' | 'clinic_id' | 'visit_id' | 'bmi' | 'recorded_by' | 'recorded_at'>>
) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await vitalsService.record(supabase, clinicId, visitId, user.id, payload)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
