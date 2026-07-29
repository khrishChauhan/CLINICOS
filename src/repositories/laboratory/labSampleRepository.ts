import type { SupabaseClient } from '@supabase/supabase-js'
import type { LabSampleRow } from '@/types/laboratory'

export const labSampleRepository = {
  async getSamples(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('lab_samples')
      .select(`
        *,
        lab_order_item:lab_order_items(
          *,
          lab_order:lab_orders(
            order_number,
            patient:patients(first_name, last_name)
          )
        )
      `)
      .eq('clinic_id', clinicId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  async getSampleById(supabase: SupabaseClient, clinicId: string, sampleId: string) {
    const { data, error } = await supabase
      .from('lab_samples')
      .select(`
        *,
        lab_order_item:lab_order_items(
          *,
          lab_order:lab_orders(
            order_number,
            patient:patients(first_name, last_name)
          )
        ),
        collections:lab_sample_collections(*),
        tracking:lab_sample_tracking(*)
      `)
      .eq('clinic_id', clinicId)
      .eq('id', sampleId)
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async createSample(
    supabase: SupabaseClient, 
    clinicId: string, 
    payload: Omit<LabSampleRow, 'id' | 'clinic_id' | 'sample_barcode' | 'created_at' | 'updated_at' | 'collection_date' | 'collected_by'>
  ) {
    const { data, error } = await supabase
      .from('lab_samples')
      .insert([{ ...payload, clinic_id: clinicId }])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as LabSampleRow
  },

  async updateSample(
    supabase: SupabaseClient,
    clinicId: string,
    sampleId: string,
    payload: Partial<Omit<LabSampleRow, 'id' | 'clinic_id' | 'sample_barcode' | 'created_at'>>
  ) {
    const { data, error } = await supabase
      .from('lab_samples')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('clinic_id', clinicId)
      .eq('id', sampleId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as LabSampleRow
  }
}
