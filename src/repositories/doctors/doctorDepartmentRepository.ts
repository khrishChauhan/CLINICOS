import type { SupabaseClient } from '@supabase/supabase-js'
import type { DoctorDepartmentRow } from '@/types/doctors'

export const doctorDepartmentRepository = {
  async getDepartmentsByDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string): Promise<DoctorDepartmentRow[]> {
    const { data, error } = await supabase
      .from('doctor_departments')
      .select(`
        *,
        department:public.departments(department_name)
      `)
      .eq('clinic_id', clinicId)
      .eq('doctor_id', doctorId)

    if (error) throw new Error(`Failed to fetch departments: ${error.message}`)
    return data as any[]
  },

  async createDepartment(supabase: SupabaseClient, payload: Partial<DoctorDepartmentRow>): Promise<DoctorDepartmentRow> {
    const { data, error } = await supabase
      .from('doctor_departments')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(`Failed to assign department: ${error.message}`)
    return data as DoctorDepartmentRow
  },

  async deleteDepartment(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .from('doctor_departments')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to unassign department: ${error.message}`)
  }
}
