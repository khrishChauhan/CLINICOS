import type { SupabaseClient } from '@supabase/supabase-js'
import type { PurchaseOrderRow, PurchaseOrderItemRow } from '@/types/pharmacy'

export async function createPurchaseOrder(
  supabase: SupabaseClient,
  clinicId: string,
  supplierId: string,
  userId: string,
  items: { medicine_id: string; quantity: number; unit_price: number }[]
): Promise<PurchaseOrderRow> {
  const { data: po, error: poErr } = await supabase
    .from('purchase_orders')
    .insert([{ clinic_id: clinicId, supplier_id: supplierId, created_by: userId, status: 'Ordered' }])
    .select()
    .single()
    
  if (poErr) throw new Error(`PO creation failed: ${poErr.message}`)

  const poItems = items.map(item => ({
    po_id: po.id,
    medicine_id: item.medicine_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.quantity * item.unit_price
  }))

  const { error: itemsErr } = await supabase.from('purchase_order_items').insert(poItems)
  if (itemsErr) throw new Error(`Failed to add PO items: ${itemsErr.message}`)

  return po as PurchaseOrderRow
}

export async function updatePurchaseOrderStatus(
  supabase: SupabaseClient,
  poId: string,
  status: 'Draft' | 'Ordered' | 'Received' | 'Cancelled'
) {
  const { error } = await supabase
    .from('purchase_orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', poId)
    
  if (error) throw new Error(`Failed to update PO status: ${error.message}`)
}

export async function getPurchaseOrderWithItems(
  supabase: SupabaseClient,
  poId: string
) {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*, purchase_order_items(*, medicines(name))')
    .eq('id', poId)
    .single()
    
  if (error) throw new Error(`Failed to fetch PO: ${error.message}`)
  return data
}
