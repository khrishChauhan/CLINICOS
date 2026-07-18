import type { SupabaseClient } from '@supabase/supabase-js'
import type { BillingInvoiceRow, BillingInvoiceItemRow } from '@/types/billing'

export async function getInvoice(supabase: SupabaseClient, invoiceId: string): Promise<{ invoice: BillingInvoiceRow, items: BillingInvoiceItemRow[] }> {
  const { data: invoice, error } = await supabase
    .from('billing_invoices')
    .select('*')
    .eq('id', invoiceId)
    .single()

  if (error) throw new Error(`Failed to fetch invoice: ${error.message}`)

  const { data: items, error: itemsErr } = await supabase
    .from('billing_invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('created_at', { ascending: true })

  if (itemsErr) throw new Error(`Failed to fetch invoice items: ${itemsErr.message}`)

  return { invoice: invoice as BillingInvoiceRow, items: items as BillingInvoiceItemRow[] }
}

export async function createDraftInvoice(
  supabase: SupabaseClient,
  clinicId: string,
  patientId: string,
  consultationId: string | null,
  userId: string
): Promise<BillingInvoiceRow> {
  const { data, error } = await supabase
    .from('billing_invoices')
    .insert([{
      clinic_id: clinicId,
      patient_id: patientId,
      consultation_id: consultationId,
      status: 'Draft',
      created_by: userId
    }])
    .select()
    .single()

  if (error) throw new Error(`Failed to create invoice: ${error.message}`)
  return data as BillingInvoiceRow
}

export async function updateInvoiceTotals(
  supabase: SupabaseClient,
  invoiceId: string,
  updates: Partial<BillingInvoiceRow>
) {
  const { error } = await supabase
    .from('billing_invoices')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', invoiceId)

  if (error) throw new Error(`Failed to update invoice totals: ${error.message}`)
}

export async function addInvoiceItem(
  supabase: SupabaseClient,
  payload: Omit<BillingInvoiceItemRow, 'id' | 'created_at'>
): Promise<BillingInvoiceItemRow> {
  const { data, error } = await supabase
    .from('billing_invoice_items')
    .insert([payload])
    .select()
    .single()

  if (error) throw new Error(`Failed to add invoice item: ${error.message}`)
  return data as BillingInvoiceItemRow
}

export async function removeInvoiceItem(
  supabase: SupabaseClient,
  itemId: string
) {
  const { error } = await supabase
    .from('billing_invoice_items')
    .delete()
    .eq('id', itemId)

  if (error) throw new Error(`Failed to delete invoice item: ${error.message}`)
}
