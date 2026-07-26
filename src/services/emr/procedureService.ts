import type { SupabaseClient } from '@supabase/supabase-js'
import { procedureRepository } from '@/repositories/emr/procedureRepository'
import type { ProcedureRow, ProcedureStatus } from '@/types/emr'

export const procedureService = {
  async getAll(supabase: SupabaseClient, visitId: string): Promise<ProcedureRow[]> {
    return await procedureRepository.getByVisit(supabase, visitId)
  },

  async add(
    supabase: SupabaseClient,
    clinicId: string,
    visitId: string,
    payload: {
      procedure_name: string
      procedure_code?: string
      procedure_date?: string
      performed_by?: string
      remarks?: string
      status?: ProcedureStatus
    }
  ): Promise<ProcedureRow> {
    if (!payload.procedure_name?.trim()) throw new Error('Procedure name is required')
    return await procedureRepository.create(supabase, {
      clinic_id: clinicId,
      visit_id: visitId,
      procedure_name: payload.procedure_name.trim(),
      procedure_code: payload.procedure_code || null,
      procedure_date: payload.procedure_date || null,
      performed_by: payload.performed_by || null,
      remarks: payload.remarks || null,
      status: payload.status || 'Planned'
    })
  },

  async update(supabase: SupabaseClient, id: string, updates: Partial<ProcedureRow>): Promise<ProcedureRow> {
    return await procedureRepository.update(supabase, id, updates)
  },

  async remove(supabase: SupabaseClient, id: string): Promise<void> {
    await procedureRepository.delete(supabase, id)
  }
}
