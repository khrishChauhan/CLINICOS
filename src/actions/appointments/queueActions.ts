'use server'

import { createClient } from '@/lib/supabase/server'
import { queueService } from '@/services/appointments/queueService'
import { revalidatePath } from 'next/cache'

export async function checkInPatientAction(appointmentId: string, doctorId: string | null) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { data: profile } = await supabase
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    if (!profile?.clinic_id) {
      throw new Error('Clinic ID not found')
    }

    const result = await queueService.checkInPatient(supabase, appointmentId, profile.clinic_id, doctorId, user.id)
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { data: profile } = await supabase
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    if (!profile?.clinic_id) {
      throw new Error('Clinic ID not found')
    }

    const result = await queueService.callNextPatient(supabase, profile.clinic_id, doctorId, user.id)
    revalidatePath('/doctor')
    revalidatePath('/queue')
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Call next error:', error)
    return { success: false, error: error.message || 'Failed to call next patient' }
  }
}

export async function startConsultationAction(appointmentId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) throw new Error('Unauthorized')

    const result = await queueService.startConsultation(supabase, appointmentId, user.id)
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

    const result = await queueService.completeConsultation(supabase, appointmentId, user.id)
    revalidatePath('/doctor')
    revalidatePath('/queue')
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Complete consultation error:', error)
    return { success: false, error: error.message || 'Failed to complete consultation' }
  }
}
