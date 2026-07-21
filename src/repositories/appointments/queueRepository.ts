import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppointmentQueueRow } from '@/types/appointments'

export const queueRepository = {
  async getQueueForDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string, statusIn?: string[]) {
    let query = supabase
      .from('appointment_queue')
      .select('*, appointments(*)')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
    
    if (statusIn && statusIn.length > 0) {
      query = query.in('queue_status', statusIn)
    }

    const { data, error } = await query.order('current_position', { ascending: true })
    if (error) throw new Error(error.message)
    return data
  },

  async getQueueItemByAppointmentId(supabase: SupabaseClient, appointmentId: string) {
    const { data, error } = await supabase
      .from('appointment_queue')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single()
    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data as AppointmentQueueRow | null
  },

  async addToQueue(supabase: SupabaseClient, payload: Omit<AppointmentQueueRow, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('appointment_queue')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as AppointmentQueueRow
  },

  async updateQueueItem(supabase: SupabaseClient, id: string, updates: Partial<AppointmentQueueRow>) {
    const { data, error } = await supabase
      .from('appointment_queue')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as AppointmentQueueRow
  },

  async getNextInQueue(supabase: SupabaseClient, clinicId: string, doctorId: string) {
    const { data, error } = await supabase
      .from('appointment_queue')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .eq('queue_status', 'Waiting')
      .order('current_position', { ascending: true })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data as AppointmentQueueRow | null
  },

  async getAllWaitingInQueue(supabase: SupabaseClient, clinicId: string, doctorId: string) {
    const { data, error } = await supabase
      .from('appointment_queue')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .eq('queue_status', 'Waiting')
      .order('current_position', { ascending: true })
    if (error) throw new Error(error.message)
    return data as AppointmentQueueRow[]
  }
}
