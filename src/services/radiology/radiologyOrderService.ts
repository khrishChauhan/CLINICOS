import type { SupabaseClient } from '@supabase/supabase-js'
import { radiologyOrderRepository } from '@/repositories/radiology/radiologyOrderRepository'
import { radiologyOrderItemRepository } from '@/repositories/radiology/radiologyOrderItemRepository'
import type { CreateRadiologyOrderPayload, RadiologyOrderRow } from '@/types/radiology'

export const radiologyOrderService = {
  async getOrders(supabase: SupabaseClient, clinicId: string) {
    return radiologyOrderRepository.getOrders(supabase, clinicId)
  },

  async getOrderById(supabase: SupabaseClient, clinicId: string, orderId: string) {
    return radiologyOrderRepository.getOrderById(supabase, clinicId, orderId)
  },

  async createClinicalAndRadiologyOrder(
    supabase: SupabaseClient,
    clinicId: string,
    userId: string,
    payload: CreateRadiologyOrderPayload
  ) {
    // Atomic transaction for EMR clinical order + radiology order + items
    const { data, error } = await supabase.rpc('create_clinical_and_radiology_order', {
      p_clinic_id: clinicId,
      p_patient_id: payload.patient_id,
      p_visit_id: payload.visit_id,
      p_doctor_id: payload.doctor_id,
      p_appointment_id: payload.appointment_id || null,
      p_priority: payload.priority,
      p_clinical_indication: payload.clinical_indication || null,
      p_items: payload.items,
      p_created_by: userId
    })

    if (error) throw new Error(error.message)
    return data
  },

  async updateOrder(
    supabase: SupabaseClient,
    clinicId: string,
    orderId: string,
    payload: Partial<Omit<RadiologyOrderRow, 'id' | 'clinic_id' | 'order_number' | 'created_at'>>
  ) {
    return radiologyOrderRepository.updateOrder(supabase, clinicId, orderId, payload)
  },

  async cancelOrder(
    supabase: SupabaseClient,
    clinicId: string,
    orderId: string
  ) {
    // Update order status
    const updated = await radiologyOrderRepository.updateOrder(supabase, clinicId, orderId, {
      status: 'Cancelled'
    })
    
    // Also cancel all active items
    const { error: itemsErr } = await supabase
      .from('radiology_order_items')
      .update({ status: 'Cancelled' })
      .eq('radiology_order_id', orderId)
      .neq('status', 'Cancelled')

    if (itemsErr) throw new Error(itemsErr.message)

    return updated
  },

  async addOrderItem(
    supabase: SupabaseClient,
    radiologyOrderId: string,
    imagingTestId: string,
    imagingName: string,
    bodyPart?: string,
    contrastRequired: boolean = false,
    priority: string = 'Routine',
    remarks?: string
  ) {
    // Duplicate check
    const existing = await radiologyOrderItemRepository.getOrderItems(supabase, radiologyOrderId)
    if (existing.some(i => i.imaging_test_id === imagingTestId && i.body_part === bodyPart)) {
      throw new Error(`${imagingName} for ${bodyPart || 'this part'} is already in this order`)
    }

    return radiologyOrderItemRepository.addOrderItem(supabase, {
      radiology_order_id: radiologyOrderId,
      imaging_test_id: imagingTestId,
      imaging_name: imagingName,
      body_part: bodyPart,
      contrast_required: contrastRequired,
      priority: priority as any,
      status: 'Ordered',
      remarks
    })
  },

  async removeOrderItem(supabase: SupabaseClient, itemId: string) {
    return radiologyOrderItemRepository.removeOrderItem(supabase, itemId)
  }
}
