'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { queueService } from '@/services/appointments/queueService'
import { revalidatePath } from 'next/cache'

export async function checkInPatientAction(appointmentId: string, doctorId: string | null) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { data: profile } = await adminClient
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    let clinicId = profile?.clinic_id;
    if (!clinicId) {
      throw new Error('Clinic ID not found for this user.')
    }

    const result = await queueService.checkInPatient(adminClient, appointmentId, clinicId, doctorId, user.id)
    revalidatePath('/appointments')
    revalidatePath('/queue')
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Check-in error:', error)
    return { success: false, error: error.message || 'Failed to check in patient' }
  }
}

export async function callNextPatientAction(doctorId: string) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { data: profile } = await adminClient
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    let clinicId = profile?.clinic_id;
    if (!clinicId) {
      throw new Error('Clinic ID not found for this user.')
    }

    const result = await queueService.callNextPatient(adminClient, clinicId, doctorId, user.id)
    revalidatePath('/doctor')
    revalidatePath('/queue')
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Call next error:', error)
    return { success: false, error: error.message || 'Failed to call next patient' }
  }
}

export async function startConsultationFromQueueAction(appointmentId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) throw new Error('Unauthorized')
    const adminClient = createAdminClient()
    const result = await queueService.startConsultation(adminClient, appointmentId, user.id)
    revalidatePath('/doctor')
    revalidatePath('/queue')
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Start consultation error:', error)
    return { success: false, error: error.message || 'Failed to start consultation' }
  }
}

export async function completeConsultationAction(appointmentId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) throw new Error('Unauthorized')

    const adminClient = createAdminClient()
    const result = await queueService.completeConsultation(adminClient, appointmentId, user.id)
    revalidatePath('/doctor')
    revalidatePath('/queue')
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Complete consultation error:', error)
    return { success: false, error: error.message || 'Failed to complete consultation' }
  }
}
