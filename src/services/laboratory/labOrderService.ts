import type { SupabaseClient } from '@supabase/supabase-js'
import type { LabOrderStatus } from '@/types/laboratory'
import { createLabOrder, getLabOrders, getLabOrderById, transitionOrderStatus } from '@/repositories/laboratory/labOrderRepository'

// Valid state transitions
const VALID_TRANSITIONS: Record<LabOrderStatus, LabOrderStatus[]> = {
  'Ordered': ['Sample Collected'],
  'Sample Collected': ['Processing'],
  'Processing': ['Result Ready'],
  'Result Ready': ['Verified'],
  'Verified': []
}

export const labOrderService = {
  async getQueue(supabase: SupabaseClient, clinicId: string) {
    return await getLabOrders(supabase, clinicId)
  },

  async getOrderDetail(supabase: SupabaseClient, orderId: string) {
    return await getLabOrderById(supabase, orderId)
  },

  async createOrder(
    supabase: SupabaseClient,
    clinicId: string,
    patientId: string,
    consultationId: string | null,
    orderedBy: string,
    testIds: string[],
    priority: string
  ) {
    if (!testIds || testIds.length === 0) throw new Error('Must select at least one test')
    return await createLabOrder(supabase, clinicId, patientId, consultationId, orderedBy, testIds, priority)
  },

  async advanceStatus(
    supabase: SupabaseClient,
    orderId: string,
    targetStatus: LabOrderStatus,
    userId: string,
    remarks?: string
  ) {
    const order = await getLabOrderById(supabase, orderId)
    const allowed = VALID_TRANSITIONS[order.status as LabOrderStatus] ?? []

    if (!allowed.includes(targetStatus)) {
      throw new Error(`Invalid transition: ${order.status} -> ${targetStatus}. Allowed: [${allowed.join(', ')}]`)
    }

    await transitionOrderStatus(supabase, orderId, targetStatus, userId, remarks)
  }
}
