import type { SupabaseClient } from '@supabase/supabase-js'
import { dispenseMedicinesFEFO } from '@/repositories/pharmacy/dispensingRepository'
import { appendAuditLog } from '@/repositories/platform/auditRepository'

export const dispensingService = {
  /**
   * Executes atomic FEFO dispensing via a Postgres RPC function.
   * This completely prevents double-dispensing and race conditions at the database level.
   * It also atomically handles billing integration inside the transaction.
   */
  async dispenseMedicine(
    supabase: SupabaseClient,
    clinicId: string,
    patientId: string,
    prescriptionId: string | null,
    visitId: string | null,
    userId: string,
    itemsToDispense: { 
      medicine_id: string; 
      medicine_name: string; 
      requested_quantity: number; 
      unit_price: number;
      substituted_medicine_id?: string | null;
      substitution_reason?: string | null;
    }[]
  ) {
    // 1. Format items for the RPC
    const rpcItems = itemsToDispense.map(item => ({
      medicine_id: item.medicine_id,
      quantity: item.requested_quantity,
      original_medicine_id: item.substituted_medicine_id || null,
      substitution_reason: item.substitution_reason || null
    }))

    // 2. Call the Atomic RPC
    const dispenseId = await dispenseMedicinesFEFO(
      supabase,
      clinicId,
      patientId,
      userId,
      visitId,
      prescriptionId,
      rpcItems
    )

    // 3. Audit Logging
    await appendAuditLog(supabase, userId, 'Pharmacy Dispense', 'dispense_records', dispenseId, {
      items_count: itemsToDispense.length,
      has_substitutions: itemsToDispense.some(i => i.substituted_medicine_id != null),
      is_otc: visitId == null
    })

    return { id: dispenseId }
  }
}
