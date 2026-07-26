import type { SupabaseClient } from '@supabase/supabase-js'
import type { VisitRow, CreateVisitPayload } from '@/types/emr'

export const visitRepository = {
  async getVisitById(supabase: SupabaseClient, id: string): Promise<VisitRow | null> {
    const { data, error } = await supabase
      .schema('emr')
      .from('visits')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw new Error(`Failed to fetch visit: ${error.message}`)
    return data as VisitRow
  },

  async getVisitsByPatient(supabase: SupabaseClient, clinicId: string, patientId: string): Promise<VisitRow[]> {
    const { data, error } = await supabase
      .schema('emr')
      .from('visits')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('patient_id', patientId)
      .order('visit_date', { ascending: false })
    if (error) throw new Error(`Failed to fetch visits: ${error.message}`)
    return data as VisitRow[]
  },

  async getVisitByAppointmentId(supabase: SupabaseClient, appointmentId: string): Promise<VisitRow | null> {
    const { data, error } = await supabase
      .schema('emr')
      .from('visits')
      .select('*')
      .eq('appointment_id', appointmentId)
      .maybeSingle()
    if (error) throw new Error(`Failed to fetch visit by appointment: ${error.message}`)
    return data as VisitRow | null
  },

  async getVisitsByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string, limit = 20): Promise<VisitRow[]> {
    const { data, error } = await supabase
      .schema('emr')
      .from('visits')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('visit_date', { ascending: false })
      .limit(limit)
    if (error) throw new Error(`Failed to fetch visits: ${error.message}`)
    return data as VisitRow[]
  },

  async createVisit(supabase: SupabaseClient, payload: CreateVisitPayload): Promise<VisitRow> {
    // Generate the clinic-isolated visit number
    const { data: numberData, error: numberError } = await supabase.rpc('next_visit_number', {
      p_clinic_id: payload.clinic_id
    })
    if (numberError) throw new Error(`Failed to generate visit number: ${numberError.message}`)

    const { data, error } = await supabase
      .schema('emr')
      .from('visits')
      .insert([{ ...payload, visit_number: numberData }])
      .select()
      .single()
    if (error) throw new Error(`Failed to create visit: ${error.message}`)
    return data as VisitRow
  },

  async updateVisit(supabase: SupabaseClient, id: string, updates: Partial<VisitRow>): Promise<VisitRow> {
    const { data, error } = await supabase
      .schema('emr')
      .from('visits')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to update visit: ${error.message}`)
    return data as VisitRow
  },

  async listVisits(supabase: SupabaseClient, clinicId: string, filters?: { status?: string; date?: string }): Promise<VisitRow[]> {
    let query = supabase
      .schema('emr')
      .from('visits')
      .select('*')
      .eq('clinic_id', clinicId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (filters?.status) query = query.eq('consultation_status', filters.status)
    if (filters?.date) query = query.eq('visit_date', filters.date)

    const { data, error } = await query
    if (error) throw new Error(`Failed to list visits: ${error.message}`)
    return data as VisitRow[]
  }
}
