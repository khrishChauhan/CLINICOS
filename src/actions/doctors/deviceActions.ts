'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorLoginDeviceRepository } from '@/repositories/doctors/doctorLoginDeviceRepository'
import { doctorLoginDeviceService } from '@/services/doctors/doctorLoginDeviceService'
import { headers } from 'next/headers'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, clinicId: profile.clinic_id }
}

export async function getDoctorDevicesAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorLoginDeviceRepository.getDevicesByDoctor(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function trackDoctorLoginAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || 'Unknown'
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'Unknown IP'
    
    const data = await doctorLoginDeviceService.trackDevice(supabase, clinicId, doctorId, userAgent, ip)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function revokeDoctorDeviceAction(deviceId: string) {
  try {
    const { supabase } = await getAuthContext()
    await doctorLoginDeviceService.revokeDevice(supabase, deviceId)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
