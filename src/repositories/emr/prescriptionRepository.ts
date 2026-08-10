import type { SupabaseClient } from '@supabase/supabase-js'
import type { PrescriptionRow, PrescriptionItemRow } from '@/types/emr'

export const prescriptionRepository = {
  async getByVisit(supabase: SupabaseClient, visitId: string): Promise<PrescriptionRow | null> {
    const { data, error } = await supabase
      
      .from('prescriptions')
      .select('*')
      .eq('visit_id', visitId)
      .maybeSingle()
    if (error) throw new Error(`Failed to fetch prescription: ${error.message}`)
    return data as PrescriptionRow | null
  },

  async upsert(supabase: SupabaseClient, payload: Partial<PrescriptionRow>): Promise<PrescriptionRow> {
    const { data, error } = await supabase
      
      .from('prescriptions')
      .upsert([{ ...payload, updated_at: new Date().toISOString() }], { onConflict: 'visit_id' })
      .select()
      .single()
    if (error) throw new Error(`Failed to save prescription: ${error.message}`)
    return data as PrescriptionRow
  }
}

export const prescriptionItemRepository = {
  async getByPrescription(supabase: SupabaseClient, prescriptionId: string): Promise<PrescriptionItemRow[]> {
    const { data, error } = await supabase
      
      .from('prescription_items')
      .select('*')
      .eq('prescription_id', prescriptionId)
      .order('created_at', { ascending: true })
    if (error) throw new Error(`Failed to fetch prescription items: ${error.message}`)
    return data as PrescriptionItemRow[]
  },

  async create(supabase: SupabaseClient, payload: Partial<PrescriptionItemRow>): Promise<PrescriptionItemRow> {
    const { data, error } = await supabase
      
      .from('prescription_items')
      .insert([payload])
      .select()
      .single()
    if (error) throw new Error(`Failed to add prescription item: ${error.message}`)
    return data as PrescriptionItemRow
  },

  async delete(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      
      .from('prescription_items')
      .delete()
      .eq('id', id)
    if (error) throw new Error(`Failed to delete prescription item: ${error.message}`)
  },

  async deleteByPrescription(supabase: SupabaseClient, prescriptionId: string): Promise<void> {
    const { error } = await supabase
      
      .from('prescription_items')
      .delete()
      .eq('prescription_id', prescriptionId)
    if (error) throw new Error(`Failed to clear prescription items: ${error.message}`)
  }
}
