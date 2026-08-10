'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
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
    const adminClient = createAdminClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await adminClient
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    let clinicId = profile?.clinic_id;
    if (!clinicId) {
      throw new Error('Clinic ID not found for this user.')
    }

    const result = await walkInService.registerWalkInAndJoinQueue(
      adminClient,
      clinicId,
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
