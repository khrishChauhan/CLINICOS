'use server'

import { createClient } from '@/lib/supabase/server'
import { referralService } from '@/services/emr/referralService'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getReferralsAction(visitId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await referralService.getByVisit(supabase, visitId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createReferralAction(visitId: string, payload: any) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await referralService.add(supabase, clinicId, visitId, payload)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
