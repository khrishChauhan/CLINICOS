import type { SupabaseClient } from '@supabase/supabase-js'
import { clinicalOrderRepository } from '@/repositories/emr/clinicalOrderRepository'
import type { ClinicalOrderRow } from '@/types/emr'

export const clinicalOrderService = {
  async getByVisit(supabase: SupabaseClient, visitId: string): Promise<ClinicalOrderRow[]> {
    return await clinicalOrderRepository.getByVisit(supabase, visitId)
  },

  async add(
    supabase: SupabaseClient,
    clinicId: string,
    visitId: string,
    userId: string,
    payload: {
      order_type: string
      order_reference?: string
    }
  ): Promise<ClinicalOrderRow> {
    if (!payload.order_type) throw new Error('Order type is required')

    return await clinicalOrderRepository.create(supabase, {
      clinic_id: clinicId,
      visit_id: visitId,
      ordered_by: userId,
      order_type: payload.order_type,
      order_reference: payload.order_reference || null,
      status: 'Ordered'
    })
  }
}
