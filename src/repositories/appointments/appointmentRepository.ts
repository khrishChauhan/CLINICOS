import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppointmentRow } from '@/types/appointments'

export async function getAppointmentsByDate(
  supabase: SupabaseClient,
  clinicId: string,
  doctorId: string,
  date: string
): Promise<AppointmentRow[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*').limit(100)
    .eq('clinic_id', clinicId)
    .eq('doctor_id', doctorId)
    .eq('appointment_date', date)
    .neq('status', 'Cancelled') // Ignore cancelled when checking overlaps

  if (error) throw new Error(`Failed to fetch appointments: ${error.message}`)
  return data as AppointmentRow[]
}

export async function getAppointmentsByPatient(
  supabase: SupabaseClient,
  clinicId: string,
  patientId: string
): Promise<AppointmentRow[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*').limit(100)
    .eq('clinic_id', clinicId)
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: false })
    .order('appointment_start_time', { ascending: false })

  if (error) throw new Error(`Failed to fetch patient appointments: ${error.message}`)
  return data as AppointmentRow[]
}

export async function getQueueForToday(
  supabase: SupabaseClient,
  clinicId: string,
  doctorId?: string
): Promise<AppointmentRow[]> {
  const today = new Date().toISOString().split('T')[0]
  let query = supabase
    .from('appointments')
    .select(`*, patient:patients(first_name, last_name, uhid)`)
    .eq('clinic_id', clinicId)
    .eq('appointment_date', today)

  if (doctorId) {
    query = query.eq('doctor_id', doctorId)
  }

  const { data, error } = await query.order('appointment_start_time', { ascending: true })

  if (error) throw new Error(`Failed to fetch queue: ${error.message}`)
  return data as AppointmentRow[]
}

export async function createAppointment(
  supabase: SupabaseClient,
  payload: Partial<AppointmentRow>
): Promise<AppointmentRow> {
  const { data, error } = await supabase
    .from('appointments')
    .insert([payload])
    .select()
    .single()

  if (error) throw new Error(`Failed to create appointment: ${error.message}`)
  return data as AppointmentRow
}

export async function updateAppointmentStatus(
  supabase: SupabaseClient,
  appointmentId: string,
  newStatus: AppointmentRow['status'],
  userId: string,
  remarks?: string
): Promise<AppointmentRow> {
  // We use a transaction-like approach or an RPC for this in production, but for now we'll do 2 steps.
  // Ideally, use an RPC to ensure atomicity with the log table.

  const { data: apt, error: fetchErr } = await supabase
    .from('appointments')
    .select('status')
    .eq('id', appointmentId)
    .single()

  if (fetchErr) throw fetchErr

  const { data, error } = await supabase
    .from('appointments')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', appointmentId)
    .select()
    .single()

  if (error) throw error

  // Insert log
  await supabase.from('appointment_status_logs').insert([{
    appointment_id: appointmentId,
    status_from: apt.status,
    status_to: newStatus,
    changed_by: userId,
    remarks
  }])

  return data as AppointmentRow
}
