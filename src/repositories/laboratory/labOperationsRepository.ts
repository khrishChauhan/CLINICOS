import type { SupabaseClient } from '@supabase/supabase-js'
import type { LabInstrumentRow, LabQualityControlRow, LabTechnicianRow } from '@/types/laboratory'

export const labInstrumentRepository = {
  async getInstruments(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('lab_instruments')
      .select('*')
      .eq('clinic_id', clinicId)
      .order('instrument_name', { ascending: true })
    if (error) throw new Error(error.message)
    return data as LabInstrumentRow[]
  },

  async createInstrument(supabase: SupabaseClient, clinicId: string, payload: Omit<LabInstrumentRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('lab_instruments')
      .insert([{ ...payload, clinic_id: clinicId }])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as LabInstrumentRow
  },

  async updateInstrumentStatus(supabase: SupabaseClient, clinicId: string, instrumentId: string, status: string) {
    const { data, error } = await supabase
      .from('lab_instruments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('clinic_id', clinicId)
      .eq('id', instrumentId)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as LabInstrumentRow
  }
}

export const labQualityControlRepository = {
  async getQcHistory(supabase: SupabaseClient, clinicId: string, instrumentId?: string) {
    let query = supabase
      .from('lab_quality_control')
      .select(`*, instrument:lab_instruments(instrument_name, instrument_code), performer:users!lab_quality_control_performed_by_fkey(first_name, last_name)`)
      .eq('clinic_id', clinicId)
      .order('qc_date', { ascending: false })
    if (instrumentId) query = query.eq('instrument_id', instrumentId)
    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data
  },

  async recordQc(supabase: SupabaseClient, clinicId: string, payload: Omit<LabQualityControlRow, 'id' | 'clinic_id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('lab_quality_control')
      .insert([{ ...payload, clinic_id: clinicId }])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as LabQualityControlRow
  }
}

export const labTechnicianRepository = {
  async getTechnicians(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('lab_technicians')
      .select('*, user:users(first_name, last_name, email, phone)')
      .eq('clinic_id', clinicId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  },

  async registerTechnician(supabase: SupabaseClient, clinicId: string, payload: Omit<LabTechnicianRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('lab_technicians')
      .insert([{ ...payload, clinic_id: clinicId }])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as LabTechnicianRow
  }
}
