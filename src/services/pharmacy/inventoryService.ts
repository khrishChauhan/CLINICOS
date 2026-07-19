import type { SupabaseClient } from '@supabase/supabase-js'
import { getMedicineStock } from '@/repositories/pharmacy/inventoryRepository'

export const inventoryService = {
  async getDashboardAlerts(supabase: SupabaseClient, clinicId: string) {
    const stockData = await getMedicineStock(supabase, clinicId)

    // Aggregate stock by medicine
    const aggregated = new Map<string, any>()
    const expiringBatches: any[] = []

    const ninetyDaysFromNow = new Date()
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)

    for (const record of stockData) {
      const medId = record.medicine_id
      if (!aggregated.has(medId)) {
        aggregated.set(medId, {
          medicine: record.medicines,
          total_quantity: 0
        })
      }
      
      const agg = aggregated.get(medId)
      agg.total_quantity += record.current_quantity

      // Check Expiry
      const expiry = new Date(record.medicine_batches.expiry_date)
      if (expiry <= ninetyDaysFromNow) {
        expiringBatches.push({
          batch_number: record.medicine_batches.batch_number,
          medicine_name: record.medicines.name,
          expiry_date: record.medicine_batches.expiry_date,
          current_quantity: record.current_quantity
        })
      }
    }

    // Filter low stock
    const lowStock = Array.from(aggregated.values()).filter(a => 
      a.total_quantity <= (a.medicine.reorder_level || 10)
    )

    return {
      lowStock,
      expiringBatches
    }
  }
}
