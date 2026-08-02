import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorLeaveRow } from '@/types/doctors'

export const doctorLeaveRepository = {
  async getLeavesByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorLeaveRow[]> {
    const { data, error } = await supabase
      .from('doctor_leaves')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .order('start_date', { ascending: false })

    if (error) throw new Error(`Failed to fetch leaves: ${error.message}`)
    return data as DoctorLeaveRow[]
  },

  async getApprovedLeavesByDateRange(supabase: SupabaseClient, clinicId: string, doctorId: string, dateStr: string): Promise<DoctorLeaveRow[]> {
    const { data, error } = await supabase
      .from('doctor_leaves')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)
      .eq('approval_status', 'Approved')
      .lte('start_date', dateStr)
      .gte('end_date', dateStr)

    if (error) throw new Error(`Failed to fetch overlapping leaves: ${error.message}`)
    return data as DoctorLeaveRow[]
  },

  async createLeave(supabase: SupabaseClient, payload: Partial<DoctorLeaveRow>): Promise<DoctorLeaveRow> {
    const { data, error } = await supabase
      .from('doctor_leaves')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to apply for leave: ${error.message}`)
    return data as DoctorLeaveRow
  },

  async updateLeaveStatus(supabase: SupabaseClient, id: string, status: string, approverId: string): Promise<DoctorLeaveRow> {
    const { data, error } = await supabase
      .from('doctor_leaves')
      .update({ approval_status: status, approved_by: approverId, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update leave status: ${error.message}`)
    return data as DoctorLeaveRow
  },

  async deleteLeave(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .from('doctor_leaves')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete leave: ${error.message}`)
  }
}
