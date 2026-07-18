import type { SupabaseClient } from '@supabase/supabase-js'
import { getInvoice, updateInvoiceTotals } from '@/repositories/billing/invoiceRepository'
import { recordPayment } from '@/repositories/billing/paymentRepository'

export const paymentService = {

  async collectPayment(
    supabase: SupabaseClient,
    invoiceId: string,
    clinicId: string,
    patientId: string,
    userId: string,
    amount: number,
    paymentMethod: string,
    reference: string | null
  ) {
    const { invoice } = await getInvoice(supabase, invoiceId)

    if (invoice.status === 'Draft' || invoice.status === 'Cancelled' || invoice.status === 'Paid') {
      throw new Error(`Cannot collect payment for invoice in status: ${invoice.status}`)
    }

    if (amount <= 0) throw new Error('Amount must be positive')
    if (amount > invoice.amount_due) throw new Error('Amount exceeds amount due')

    // 1. Record Payment
    await recordPayment(supabase, {
      clinic_id: clinicId,
      patient_id: patientId,
      invoice_id: invoiceId,
      payment_method: paymentMethod,
      amount,
      transaction_reference: reference,
      collected_by: userId
    })

    // 2. Update Invoice
    const newAmountPaid = Number(invoice.amount_paid) + Number(amount)
    const newAmountDue = Number(invoice.grand_total) - newAmountPaid
    
    let newStatus: any = invoice.status
    if (newAmountDue <= 0) {
      newStatus = 'Paid'
    } else if (newAmountPaid > 0) {
      newStatus = 'Partially Paid'
    }

    await updateInvoiceTotals(supabase, invoiceId, {
      amount_paid: newAmountPaid,
      amount_due: newAmountDue,
      status: newStatus as any
    })
  }

}
