import type { SupabaseClient } from '@supabase/supabase-js'
import { createMedicineBatch, recordStockTransaction } from '@/repositories/pharmacy/inventoryRepository'
import { getPurchaseOrderWithItems, updatePurchaseOrderStatus } from '@/repositories/pharmacy/purchaseRepository'

export const purchaseService = {
  async receivePO(
    supabase: SupabaseClient,
    poId: string,
    userId: string,
    batchData: { [itemId: string]: { batch_number: string; expiry_date: string; mfg_date?: string } }
  ) {
    const po = await getPurchaseOrderWithItems(supabase, poId)
    if (!po) throw new Error('PO not found')
    if (po.status !== 'Ordered') throw new Error('Only Ordered POs can be received')

    for (const item of po.purchase_order_items) {
      const bData = batchData[item.id]
      if (!bData) throw new Error(`Batch data missing for item ${item.medicines.name}`)

      // 1. Create Medicine Batch
      const batch = await createMedicineBatch(supabase, {
        medicine_id: item.medicine_id,
        batch_number: bData.batch_number,
        expiry_date: bData.expiry_date,
        mfg_date: bData.mfg_date || null,
        barcode: null
      })

      // 2. Record Stock Transaction (this triggers medicine_stock update)
      await recordStockTransaction(supabase, {
        clinic_id: po.clinic_id,
        medicine_id: item.medicine_id,
        batch_id: batch.id,
        transaction_type: 'Purchase',
        quantity_change: item.quantity,
        reference_id: po.id,
        remarks: 'Received via PO',
        created_by: userId
      })
    }

    // 3. Mark PO as Received
    await updatePurchaseOrderStatus(supabase, poId, 'Received')
  }
}
