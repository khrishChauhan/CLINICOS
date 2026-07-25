import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorBlockedSlotRow } from '@/types/doctors'

export const doctorBlockedSlotRepository = {
  async getBlockedSlotsByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorBlockedSlotRow[]> {
    const { data, error } = await supabase
      .schema('doctor')
      .from('doctor_blocked_slots')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('block_date', { ascending: false })

    if (error) throw new Error(`Failed to fetch blocked slots: ${error.message}`)
    return data as DoctorBlockedSlotRow[]
  },

  async getBlockedSlotsByDate(supabase: SupabaseClient, clinicId: string, doctorId: string, dateStr: string): Promise<DoctorBlockedSlotRow[]> {
    const { data, error } = await supabase
      .schema('doctor')
      .from('doctor_blocked_slots')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .eq('block_date', dateStr)

    if (error) throw new Error(`Failed to fetch blocked slots by date: ${error.message}`)
    return data as DoctorBlockedSlotRow[]
  },

  async createBlockedSlot(supabase: SupabaseClient, payload: Partial<DoctorBlockedSlotRow>): Promise<DoctorBlockedSlotRow> {
    const { data, error } = await supabase
      .schema('doctor')
      .from('doctor_blocked_slots')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to create blocked slot: ${error.message}`)
    return data as DoctorBlockedSlotRow
  },

  async deleteBlockedSlot(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .schema('doctor')
      .from('doctor_blocked_slots')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete blocked slot: ${error.message}`)
  }
}
