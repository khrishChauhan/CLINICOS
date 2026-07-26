'use server'

import { createClient } from '@/lib/supabase/server'
import { followUpPlanService } from '@/services/emr/followUpPlanService'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getFollowUpPlanAction(visitId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await followUpPlanService.get(supabase, visitId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function saveFollowUpPlanAction(
  visitId: string,
  payload: {
    followup_date: string
    followup_reason?: string
    instructions?: string
    reminder_required?: boolean
  }
) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await followUpPlanService.save(supabase, clinicId, visitId, payload)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
