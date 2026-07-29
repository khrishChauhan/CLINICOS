import type { SupabaseClient } from '@supabase/supabase-js'
import type { LabTestRow, CreateLabTestPayload } from '@/types/laboratory'

export const labTestRepository = {
  async getLabTests(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('lab_tests')
      .select(`
        *,
        lab_order_item:lab_order_items(
          *,
          lab_order:lab_orders(
            order_number,
            patient:patients(first_name, last_name),
            visit_id
          )
        ),
        lab_results(*)
      `)
      .eq('clinic_id', clinicId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  async getLabTestById(supabase: SupabaseClient, clinicId: string, testId: string) {
    const { data, error } = await supabase
      .from('lab_tests')
      .select(`
        *,
        lab_order_item:lab_order_items(
          *,
          lab_order:lab_orders(
            order_number,
            patient:patients(first_name, last_name, date_of_birth, gender),
            visit_id,
            doctor:doctors(first_name, last_name)
          )
        ),
        lab_results(
          *,
          lab_result_parameters(*)
        )
      `)
      .eq('clinic_id', clinicId)
      .eq('id', testId)
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async createLabTest(supabase: SupabaseClient, clinicId: string, payload: CreateLabTestPayload) {
    const { data, error } = await supabase
      .from('lab_tests')
      .insert([{ ...payload, clinic_id: clinicId, status: 'Ordered' }])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as LabTestRow
  },

  async updateStatus(supabase: SupabaseClient, clinicId: string, testId: string, status: string) {
    const updates: any = { status, updated_at: new Date().toISOString() }
    if (status === 'In Progress') updates.started_at = new Date().toISOString()
    if (status === 'Completed') updates.completed_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('lab_tests')
      .update(updates)
      .eq('clinic_id', clinicId)
      .eq('id', testId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as LabTestRow
  }
}
