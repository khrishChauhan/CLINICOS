'use server'

import { createClient } from '@/lib/supabase/server'
import { radiologyOrderService } from '@/services/radiology/radiologyOrderService'
import { revalidatePath } from 'next/cache'
import type { CreateRadiologyOrderPayload, RadiologyOrderRow } from '@/types/radiology'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic not found')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getRadiologyOrdersAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyOrderService.getOrders(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function getRadiologyOrderByIdAction(orderId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyOrderService.getOrderById(supabase, clinicId, orderId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function createRadiologyOrderAction(payload: CreateRadiologyOrderPayload) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await radiologyOrderService.createClinicalAndRadiologyOrder(supabase, clinicId, user.id, payload)
    revalidatePath('/radiology')
    revalidatePath('/emr')
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function cancelRadiologyOrderAction(orderId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    await radiologyOrderService.cancelOrder(supabase, clinicId, orderId)
    revalidatePath('/radiology')
    return { success: true }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function addRadiologyOrderItemAction(
  orderId: string,
  imagingTestId: string,
  imagingName: string,
  bodyPart?: string,
  contrastRequired: boolean = false,
  priority: string = 'Routine',
  remarks?: string
) {
  try {
    const { supabase } = await getAuthContext()
    const data = await radiologyOrderService.addOrderItem(
      supabase, orderId, imagingTestId, imagingName, bodyPart, contrastRequired, priority, remarks
    )
    revalidatePath('/radiology')
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function removeRadiologyOrderItemAction(itemId: string) {
  try {
    const { supabase } = await getAuthContext()
    await radiologyOrderService.removeOrderItem(supabase, itemId)
    revalidatePath('/radiology')
    return { success: true }
  } catch (e: any) { return { success: false, error: e.message } }
}
