import type { SupabaseClient } from '@supabase/supabase-js'
import { getInvoice, updateInvoiceTotals } from '@/repositories/billing/invoiceRepository'
import { recordPayment } from '@/repositories/billing/paymentRepository'
import { appendAuditLog } from '@/repositories/platform/auditRepository'

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

    // 3. Audit Log
    try {
      await appendAuditLog(
        supabase,
        userId,
        'Payment Collected',
        'billing_invoices',
        invoiceId,
        { amount, paymentMethod, newStatus }
      )
      
      if (newStatus === 'Paid') {
        await appendAuditLog(
          supabase,
          userId,
          'Invoice Fully Paid',
          'billing_invoices',
          invoiceId,
          { grandTotal: invoice.grand_total }
        )
      }
    } catch (auditErr) {
      console.error('Failed to log audit for payment', auditErr)
    }
  }

}
