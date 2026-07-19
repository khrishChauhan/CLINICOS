import type { SupabaseClient } from '@supabase/supabase-js'
import type { ConsultationRow } from '@/types/consultations'

export async function getConsultationById(
  supabase: SupabaseClient,
  consultationId: string
): Promise<ConsultationRow> {
  const { data, error } = await supabase
    .from('consultations')
    .select('*').limit(100)
    .eq('id', consultationId)
    .single()

  if (error) throw new Error(`Failed to fetch consultation: ${error.message}`)
  return data as ConsultationRow
}

export async function getOrCreateConsultation(
  supabase: SupabaseClient,
  clinicId: string,
  patientId: string,
  doctorId: string,
  appointmentId: string | null
): Promise<ConsultationRow> {
  // First, check if there's an active draft for this appointment or patient/doctor pair today?
  // Let's just create a new one for now if appointmentId is passed, or try to find an existing Draft.
  
  if (appointmentId) {
    const { data: existing } = await supabase
      .from('consultations')
      .select('*').limit(100)
      .eq('appointment_id', appointmentId)
      .single()

    if (existing) return existing as ConsultationRow
  }

  // Create new
  const { data, error } = await supabase
    .from('consultations')
    .insert([{
      clinic_id: clinicId,
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_id: appointmentId,
      status: 'Draft',
      created_by: doctorId
    }])
    .select()
    .single()

  if (error) throw new Error(`Failed to create consultation: ${error.message}`)
  return data as ConsultationRow
}

export async function lockConsultation(
  supabase: SupabaseClient,
  consultationId: string
): Promise<ConsultationRow> {
  const { data, error } = await supabase
    .from('consultations')
    .update({ 
      is_locked: true, 
      status: 'Completed', 
      completed_at: new Date().toISOString() 
    })
    .eq('id', consultationId)
    .select()
    .single()

  if (error) throw new Error(`Failed to lock consultation: ${error.message}`)
  return data as ConsultationRow
}
