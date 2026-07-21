'use server'

import { createClient } from '@/lib/supabase/server'
import { walkInService } from '@/services/appointments/walkInService'
import { revalidatePath } from 'next/cache'

export async function registerWalkInAction(
  patientId: string | null,
  doctorId: string | null,
  priority: 'Normal' | 'Emergency' | 'VIP',
  reason: string
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const result = await walkInService.registerWalkInAndJoinQueue(
      supabase,
      profile.clinic_id,
      patientId,
      doctorId,
      priority,
      reason,
      user.id
    )

    revalidatePath('/appointments')
    revalidatePath('/queue')
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Walk-In registration error:', error)
    return { success: false, error: error.message || 'Failed to register walk-in' }
  }
}
