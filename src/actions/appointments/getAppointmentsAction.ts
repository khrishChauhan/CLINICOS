'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

async function getAuthContext() {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
  
  let clinicId = profile?.clinic_id;
  if (!clinicId) {
    const { data: clinics } = await adminClient.from('clinics').select('id').limit(1)
    if (clinics && clinics.length > 0) {
      clinicId = clinics[0].id
    } else {
      throw new Error('Clinic context missing')
    }
  }
  
  return { supabase, adminClient, user, clinicId }
}

export async function getAppointmentsAction(date?: string, doctorId?: string) {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    const targetDate = date || new Date().toISOString().split('T')[0]

    let query = adminClient
      .from('appointments')
      .select(`
        *,
        patient:patients(id, first_name, last_name, uhid, mobile_number)
      `)
      .eq('clinic_id', clinicId)
      .eq('appointment_date', targetDate)
      .order('appointment_start_time', { ascending: true })

    if (doctorId) {
      query = query.eq('doctor_id', doctorId)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)

    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error('getAppointmentsAction error:', error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getAppointmentStatsAction(date?: string) {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    const targetDate = date || new Date().toISOString().split('T')[0]

    const { data, error } = await adminClient
      .from('appointments')
      .select('status')
      .eq('clinic_id', clinicId)
      .eq('appointment_date', targetDate)

    if (error) throw new Error(error.message)

    const stats = {
      total: data?.length || 0,
      scheduled: data?.filter(a => a.status === 'Scheduled').length || 0,
      checkedIn: data?.filter(a => a.status === 'Checked In').length || 0,
      inConsultation: data?.filter(a => a.status === 'In Consultation').length || 0,
      completed: data?.filter(a => a.status === 'Completed').length || 0,
      cancelled: data?.filter(a => a.status === 'Cancelled').length || 0,
    }

    return { success: true, stats }
  } catch (error: any) {
    return { success: false, error: error.message, stats: { total: 0, scheduled: 0, checkedIn: 0, inConsultation: 0, completed: 0, cancelled: 0 } }
  }
}
