'use server'

import { createClient } from '@/lib/supabase/server'
import { labOrderService } from '@/services/laboratory/labOrderService'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const CreateLabOrderSchema = z.object({
  patient_id: z.string().uuid(),
  visit_id: z.string().uuid(),
  appointment_id: z.string().uuid().optional(),
  doctor_id: z.string().uuid(),
  priority: z.enum(['Routine', 'Urgent', 'Stat']),
  remarks: z.string().optional(),
  items: z.array(z.object({
    test_id: z.string().uuid(),
    test_name: z.string().min(1),
    sample_type: z.string().optional(),
    remarks: z.string().optional()
  })).min(1, 'At least one test must be selected')
})

export async function getLabOrdersAction() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const data = await labOrderService.getLabOrders(supabase, profile.clinic_id)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createLabOrderAction(payload: z.infer<typeof CreateLabOrderSchema>) {
  try {
    const validated = CreateLabOrderSchema.parse(payload)

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const data = await labOrderService.createClinicalAndLabOrder(
      supabase,
      profile.clinic_id,
      user.id,
      validated
    )

    revalidatePath('/laboratory')
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create lab order' }
  }
}

export async function cancelLabOrderAction(orderId: string, remarks?: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
      .from('users')
      .select('clinic_id')
      .eq('id', user.id)
      .single()

    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const data = await labOrderService.cancelLabOrder(supabase, profile.clinic_id, orderId, remarks)
    revalidatePath('/laboratory')
    revalidatePath(`/laboratory/${orderId}`)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addLabOrderItemAction(
  orderId: string, 
  testId: string, 
  testName: string, 
  sampleType?: string, 
  remarks?: string
) {
  try {
    const supabase = await createClient()
    const data = await labOrderService.addLabOrderItem(supabase, orderId, testId, testName, sampleType, remarks)
    revalidatePath(`/laboratory/${orderId}`)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function removeLabOrderItemAction(itemId: string, orderId: string) {
  try {
    const supabase = await createClient()
    await labOrderService.removeLabOrderItem(supabase, itemId)
    revalidatePath(`/laboratory/${orderId}`)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
