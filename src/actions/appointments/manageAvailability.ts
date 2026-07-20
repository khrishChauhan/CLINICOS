'use server'

import { createClient } from '@/lib/supabase/server'
import { createAvailability, updateAvailability } from '@/repositories/appointments/doctorAvailabilityRepository'
import { createSlot } from '@/repositories/appointments/appointmentSlotRepository'
import type { DoctorAvailabilityRow, AppointmentSlotRow } from '@/types/appointments'

export async function createDoctorAvailabilityAction(payload: Partial<DoctorAvailabilityRow>) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const availability = await createAvailability(supabase, payload)
    return { ok: true, availability }
  } catch (error: any) {
    console.error('Failed to create availability:', error)
    return { ok: false, error: error.message }
  }
}

export async function updateDoctorAvailabilityAction(id: string, payload: Partial<DoctorAvailabilityRow>) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const availability = await updateAvailability(supabase, id, payload)
    return { ok: true, availability }
  } catch (error: any) {
    console.error('Failed to update availability:', error)
    return { ok: false, error: error.message }
  }
}

export async function createAppointmentSlotAction(payload: Partial<AppointmentSlotRow>) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const slot = await createSlot(supabase, payload)
    return { ok: true, slot }
  } catch (error: any) {
    console.error('Failed to create appointment slot:', error)
    return { ok: false, error: error.message }
  }
}
