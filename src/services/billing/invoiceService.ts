import type { SupabaseClient } from '@supabase/supabase-js'
import { getInvoice, createDraftInvoice, addInvoiceItem, removeInvoiceItem, updateInvoiceTotals } from '@/repositories/billing/invoiceRepository'
import { getServices } from '@/repositories/billing/catalogRepository'

export const invoiceService = {
  
  async createDraftInvoiceFromVisit(
    supabase: SupabaseClient,
    clinicId: string,
    patientId: string,
    visitId: string,
    userId: string
  ) {
    const invoice = await createDraftInvoice(supabase, clinicId, patientId, visitId, userId)
    
    // Auto-Billing Hook: Fetch "Consultation Fee" from catalog
    const { data: services } = await supabase
      .from('billing_services')
      .select('*')
      .eq('clinic_id', clinicId)
      .ilike('name', '%Consultation%')
      .limit(1)

    if (services && services.length > 0) {
      const service = services[0]
      const unitPrice = service.base_price
      const taxAmount = (unitPrice * service.tax_rate) / 100
      const totalAmount = unitPrice + taxAmount

      await addInvoiceItem(supabase, {
        invoice_id: invoice.id,
        service_id: service.id,
        item_name: service.name,
        quantity: 1,
        unit_price: unitPrice,
        tax_rate: service.tax_rate,
        tax_amount: taxAmount,
        discount_amount: 0,
        total_amount: totalAmount
      })
      await this.recalculateInvoiceTotals(supabase, invoice.id)
    }

    // Auto-Billing Hook: Fetch Lab Orders for this consultation
    const { data: labOrders } = await supabase
      .from('lab_orders')
      .select(`
        id,
        items:lab_order_items(
          lab_test:lab_tests(name, price)
        )
      `)
      .eq('consultation_id', visitId)

    if (labOrders) {
      for (const order of labOrders) {
        if (order.items) {
          for (const item of order.items) {
            const test = Array.isArray(item.lab_test) ? item.lab_test[0] : item.lab_test
            if (test) {
              const unitPrice = test.price || 0
              if (unitPrice > 0) {
                await addInvoiceItem(supabase, {
                  invoice_id: invoice.id,
                  service_id: null,
                  item_name: `Lab: ${test.name}`,
                  quantity: 1,
                  unit_price: unitPrice,
                  tax_rate: 0,
                  tax_amount: 0,
                  discount_amount: 0,
                  total_amount: unitPrice
                })
              }
            }
          }
        }
      }
      await this.recalculateInvoiceTotals(supabase, invoice.id)
    }

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
  },

  async pushPharmacyToInvoice(
    supabase: SupabaseClient,
    clinicId: string,
    patientId: string,
    visitId: string | null,
    userId: string,
    items: { medicine_name: string; quantity: number; unit_price: number; total_price: number }[]
  ) {
    let targetInvoiceId = null

    if (visitId) {
      // Find existing open (Draft) invoice for this visit
      const { data: existingInvoices } = await supabase
        .from('billing_invoices')
        .select('id')
        .eq('visit_id', visitId)
        .eq('status', 'Draft')
        .order('created_at', { ascending: false })
        .limit(1)

      if (existingInvoices && existingInvoices.length > 0) {
        targetInvoiceId = existingInvoices[0].id
      }
    }

    if (!targetInvoiceId) {
      // Create new draft invoice if none exists (e.g. OTC Sale or completed consultation with issued invoice)
      const invoice = await createDraftInvoice(supabase, clinicId, patientId, visitId, userId)
      targetInvoiceId = invoice.id
    }

    for (const item of items) {
      // Medicines might not have a fixed tax rate in this MVP, defaulting to 0 tax
      await addInvoiceItem(supabase, {
        invoice_id: targetInvoiceId,
        service_id: null,
        item_name: `Rx: ${item.medicine_name}`,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: 0,
        tax_amount: 0,
        discount_amount: 0,
        total_amount: item.total_price
      })
    }

    await this.recalculateInvoiceTotals(supabase, targetInvoiceId)
  }
}
