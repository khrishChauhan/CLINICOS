import type { SupabaseClient } from '@supabase/supabase-js'
import { createDispenseRecord, createDispenseItem } from '@/repositories/pharmacy/dispensingRepository'
import { recordStockTransaction } from '@/repositories/pharmacy/inventoryRepository'

export const dispensingService = {
  /**
   * Evaluates available batches using FEFO and executes stock deduction.
   */
  async dispenseMedicine(
    supabase: SupabaseClient,
    clinicId: string,
    patientId: string,
    prescriptionId: string | null,
    userId: string,
    itemsToDispense: { medicine_id: string; requested_quantity: number; unit_price: number }[]
  ) {
    // 1. Create Dispense Record Wrapper
    const record = await createDispenseRecord(supabase, clinicId, patientId, prescriptionId, userId)

    for (const item of itemsToDispense) {
      let remainingQuantity = item.requested_quantity

      // 2. Fetch available stock for this medicine, ordered by expiry_date ASC (FEFO)
      const { data: stockBatches, error } = await supabase
        .from('medicine_stock')
        .select('*, medicine_batches(expiry_date)')
        .eq('medicine_id', item.medicine_id)
        .gt('current_quantity', 0)
        .order('medicine_batches(expiry_date)', { ascending: true }) // <--- FEFO Engine Logic

      if (error) throw new Error(error.message)

      let availableTotal = stockBatches.reduce((sum, b) => sum + b.current_quantity, 0)
      if (availableTotal < remainingQuantity) {
        throw new Error(`Insufficient stock for medicine ID ${item.medicine_id}`)
      }

      // 3. Deduct stock sequentially from batches
      for (const batch of stockBatches) {
        if (remainingQuantity <= 0) break

        const deductQty = Math.min(batch.current_quantity, remainingQuantity)
        remainingQuantity -= deductQty

        // Record stock transaction (Triggers auto-deduction in medicine_stock)
        await recordStockTransaction(supabase, {
          clinic_id: clinicId,
          medicine_id: item.medicine_id,
          batch_id: batch.batch_id,
          transaction_type: 'Dispense',
          quantity_change: -deductQty, // Negative because dispensing
          reference_id: record.id,
          remarks: 'Dispensed to patient',
          created_by: userId
        })

        // Record dispense item
        await createDispenseItem(supabase, {
          dispense_record_id: record.id,
          medicine_id: item.medicine_id,
          batch_id: batch.batch_id,
          quantity: deductQty,
          unit_price: item.unit_price,
          total_price: deductQty * item.unit_price
        })
      }
    }

    return record
  }
}
