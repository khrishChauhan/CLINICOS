import type { SupabaseClient } from '@supabase/supabase-js'
import { labOrderRepository } from '@/repositories/laboratory/labOrderRepository'
import { labOrderItemRepository } from '@/repositories/laboratory/labOrderItemRepository'
import type { CreateLabOrderPayload, LabOrderRow } from '@/types/laboratory'

export const labOrderService = {
  async getLabOrders(supabase: SupabaseClient, clinicId: string) {
    return labOrderRepository.getLabOrders(supabase, clinicId)
  },

  async getLabOrderById(supabase: SupabaseClient, clinicId: string, orderId: string) {
    return labOrderRepository.getLabOrderById(supabase, clinicId, orderId)
  },

  async createClinicalAndLabOrder(
    supabase: SupabaseClient,
    clinicId: string,
    userId: string,
    payload: CreateLabOrderPayload
  ) {
    // We use the RPC defined in Phase 1 to execute in a single transaction
    const { data, error } = await supabase.rpc('create_clinical_and_lab_order', {
      p_clinic_id: clinicId,
      p_patient_id: payload.patient_id,
      p_visit_id: payload.visit_id,
      p_doctor_id: payload.doctor_id,
      p_appointment_id: payload.appointment_id || null,
      p_priority: payload.priority,
      p_remarks: payload.remarks || null,
      p_items: payload.items,
      p_created_by: userId
    })

    if (error) throw new Error(error.message)
    return data
  },

  async updateLabOrder(
    supabase: SupabaseClient,
    clinicId: string,
    orderId: string,
    payload: Partial<Omit<LabOrderRow, 'id' | 'clinic_id' | 'order_number' | 'created_at'>>
  ) {
    return labOrderRepository.updateLabOrder(supabase, clinicId, orderId, payload)
  },

  async cancelLabOrder(
    supabase: SupabaseClient,
    clinicId: string,
    orderId: string,
    remarks?: string
  ) {
    const updated = await labOrderRepository.updateLabOrder(supabase, clinicId, orderId, {
      status: 'Cancelled',
      remarks
    })
    
    // Also cancel all active items
    const { error: itemsErr } = await supabase
      .from('lab_order_items')
      .update({ status: 'Cancelled' })
      .eq('lab_order_id', orderId)
      .neq('status', 'Cancelled')

    if (itemsErr) throw new Error(itemsErr.message)

    return updated
  },

  async addLabOrderItem(
    supabase: SupabaseClient,
    labOrderId: string,
    testId: string,
    testName: string,
    sampleType?: string,
    remarks?: string
  ) {
    // Duplicate check
    const existing = await labOrderItemRepository.getLabOrderItems(supabase, labOrderId)
    if (existing.some(i => i.test_id === testId)) {
      throw new Error(`Test ${testName} is already in this order`)
    }

    return labOrderItemRepository.addLabOrderItem(supabase, {
      lab_order_id: labOrderId,
      test_id: testId,
      test_name: testName,
      sample_type: sampleType,
      status: 'Ordered',
      remarks
    })
  },

  async removeLabOrderItem(supabase: SupabaseClient, itemId: string) {
    return labOrderItemRepository.removeLabOrderItem(supabase, itemId)
  }
}
