import type { SupabaseClient } from '@supabase/supabase-js'
import { getInvoice, createDraftInvoice, addInvoiceItem, removeInvoiceItem, updateInvoiceTotals } from '@/repositories/billing/invoiceRepository'
import { getServices } from '@/repositories/billing/catalogRepository'

export const invoiceService = {
  
  async createDraftInvoiceFromConsultation(
    supabase: SupabaseClient,
    clinicId: string,
    patientId: string,
    consultationId: string,
    userId: string
  ) {
    // This is the Auto-Billing hook called by the EMR
    // Create Draft
    const invoice = await createDraftInvoice(supabase, clinicId, patientId, consultationId, userId)
    
    // Optionally: fetch a default "Consultation Fee" service from catalog and add it automatically.
    // For now, we'll just create the blank draft invoice.
    return invoice
  },

  async addServiceToInvoice(
    supabase: SupabaseClient,
    invoiceId: string,
    serviceId: string,
    quantity: number,
    discountAmount: number
  ) {
    const { invoice, items } = await getInvoice(supabase, invoiceId)
    if (invoice.status !== 'Draft') throw new Error('Can only add items to Draft invoices')

    const services = await getServices(supabase, invoice.clinic_id)
    const service = services.find(s => s.id === serviceId)
    if (!service) throw new Error('Service not found in catalog')

    // Calculation Engine (Server-Side Math)
    const unitPrice = service.base_price
    const preTaxTotal = (unitPrice * quantity) - discountAmount
    const taxAmount = (preTaxTotal * service.tax_rate) / 100
    const totalAmount = preTaxTotal + taxAmount

    await addInvoiceItem(supabase, {
      invoice_id: invoiceId,
      service_id: serviceId,
      item_name: service.name,
      quantity,
      unit_price: unitPrice,
      tax_rate: service.tax_rate,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount
    })

    await this.recalculateInvoiceTotals(supabase, invoiceId)
  },

  async removeServiceFromInvoice(
    supabase: SupabaseClient,
    invoiceId: string,
    itemId: string
  ) {
    const { invoice } = await getInvoice(supabase, invoiceId)
    if (invoice.status !== 'Draft') throw new Error('Can only remove items from Draft invoices')

    await removeInvoiceItem(supabase, itemId)
    await this.recalculateInvoiceTotals(supabase, invoiceId)
  },

  async recalculateInvoiceTotals(supabase: SupabaseClient, invoiceId: string) {
    const { invoice, items } = await getInvoice(supabase, invoiceId)
    
    let subtotal = 0
    let tax_total = 0
    let discount_total = 0
    let grand_total = 0

    for (const item of items) {
      subtotal += (item.unit_price * item.quantity)
      discount_total += item.discount_amount
      tax_total += item.tax_amount
      grand_total += item.total_amount
    }

    const amount_due = grand_total - invoice.amount_paid

    await updateInvoiceTotals(supabase, invoiceId, {
      subtotal, tax_total, discount_total, grand_total, amount_due
    })
  },

  async issueInvoice(supabase: SupabaseClient, invoiceId: string) {
    const { invoice } = await getInvoice(supabase, invoiceId)
    if (invoice.status !== 'Draft') throw new Error('Invoice is already issued')

    await updateInvoiceTotals(supabase, invoiceId, {
      status: 'Issued',
      issued_at: new Date().toISOString()
    })
  }

}
