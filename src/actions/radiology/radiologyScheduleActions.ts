'use server'

import { createClient } from '@/lib/supabase/server'
import { radiologyScheduleService } from '@/services/radiology/radiologyScheduleService'
import { revalidatePath } from 'next/cache'
import type { ScheduleRadiologyPayload } from '@/types/radiology'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic not found')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getRadiologyScheduleByDateAction(date: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyScheduleService.getScheduleByDate(supabase, clinicId, date)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function scheduleRadiologyAction(payload: ScheduleRadiologyPayload) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyScheduleService.scheduleOrder(supabase, clinicId, payload)
    revalidatePath('/radiology/schedule')
    revalidatePath('/radiology')
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function cancelScheduleAction(scheduleId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    await radiologyScheduleService.updateScheduleStatus(supabase, clinicId, scheduleId, 'Cancelled')
    revalidatePath('/radiology/schedule')
    revalidatePath('/radiology')
    return { success: true }
  } catch (e: any) { return { success: false, error: e.message } }
}
