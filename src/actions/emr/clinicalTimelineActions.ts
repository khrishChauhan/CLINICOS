'use server'

import { createClient } from '@/lib/supabase/server'
import { clinicalTimelineService } from '@/services/emr/clinicalTimelineService'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return { supabase, user }
}

export async function getClinicalTimelineAction(visitId: string) {
  try {
    const { supabase } = await getAuthContext()
    const data = await clinicalTimelineService.getTimeline(supabase, visitId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
