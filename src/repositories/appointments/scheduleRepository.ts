import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorScheduleRow, DoctorLeaveRow } from '@/types/appointments'

/**
 * Fetch the recurring weekly schedule for a doctor.
 */
export async function getDoctorSchedules(
  supabase: SupabaseClient,
  clinicId: string,
  doctorId: string
): Promise<DoctorScheduleRow[]> {
  const { data, error } = await supabase
    .from('doctor_schedules')
    .select('*').limit(100)
    .eq('clinic_id', clinicId)
    .eq('doctor_id', doctorId)
    .eq('is_active', true)

  if (error) throw new Error(`Failed to fetch doctor schedules: ${error.message}`)
  return data as DoctorScheduleRow[]
}

/**
 * Fetch leaves for a doctor that overlap with a specific date range.
 */
export async function getDoctorLeaves(
  supabase: SupabaseClient,
  clinicId: string,
  doctorId: string,
  startDate: string,
  endDate: string
): Promise<DoctorLeaveRow[]> {
  const { data, error } = await supabase
    .from('doctor_leaves')
    .select('*').limit(100)
    .eq('clinic_id', clinicId)
    .eq('doctor_id', doctorId)
    .eq('status', 'Approved')
    .lte('start_date', endDate)
    .gte('end_date', startDate)

  if (error) throw new Error(`Failed to fetch doctor leaves: ${error.message}`)
  return data as DoctorLeaveRow[]
}
