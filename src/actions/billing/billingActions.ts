'use server'

import { createClient } from '@/lib/supabase/server'
import { invoiceService } from '@/services/billing/invoiceService'
import { paymentService } from '@/services/billing/paymentService'
import { revalidatePath } from 'next/cache'

export async function addServiceToInvoiceAction(invoiceId: string, serviceId: string, quantity: number, discountAmount: number) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')

    await invoiceService.addServiceToInvoice(supabase, invoiceId, serviceId, quantity, discountAmount)
    revalidatePath('/billing/invoice/[id]', 'page')
    return { ok: true }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function removeServiceFromInvoiceAction(invoiceId: string, itemId: string) {
  try {
    const supabase = await createClient()
    await invoiceService.removeServiceFromInvoice(supabase, invoiceId, itemId)
    revalidatePath('/billing/invoice/[id]', 'page')
    return { ok: true }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function issueInvoiceAction(invoiceId: string) {
  try {
    const supabase = await createClient()
    await invoiceService.issueInvoice(supabase, invoiceId)
    revalidatePath('/billing/invoice/[id]', 'page')
    return { ok: true }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function collectPaymentAction(
  invoiceId: string,
  patientId: string,
  amount: number,
  paymentMethod: string,
  reference: string
) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')

    await paymentService.collectPayment(
      supabase,
      invoiceId,
      session.clinic_id,
      patientId,
      session.user_id,
      amount,
      paymentMethod,
      reference || null
    )
    
    revalidatePath('/billing/invoice/[id]', 'page')
    return { ok: true }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}
