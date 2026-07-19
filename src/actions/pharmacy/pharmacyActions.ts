'use server'

import { createClient } from '@/lib/supabase/server'
import { createMedicine, getMedicines } from '@/repositories/pharmacy/medicineRepository'
import { inventoryService } from '@/services/pharmacy/inventoryService'
import { purchaseService } from '@/services/pharmacy/purchaseService'
import { dispensingService } from '@/services/pharmacy/dispensingService'
import { revalidatePath } from 'next/cache'

export async function fetchMedicinesAction() {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    
    const data = await getMedicines(supabase, session.clinic_id)
    return { ok: true, data }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function createMedicineAction(payload: any) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    
    await createMedicine(supabase, { ...payload, clinic_id: session.clinic_id })
    revalidatePath('/pharmacy/medicines')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function fetchInventoryAlertsAction() {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    
    const data = await inventoryService.getDashboardAlerts(supabase, session.clinic_id)
    return { ok: true, data }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function receivePurchaseOrderAction(poId: string, batchData: any) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    
    await purchaseService.receivePO(supabase, poId, session.user_id, batchData)
    revalidatePath('/pharmacy/purchases')
    revalidatePath('/pharmacy')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function dispenseMedicineAction(patientId: string, prescriptionId: string | null, items: any[]) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    
    await dispensingService.dispenseMedicine(
      supabase,
      session.clinic_id,
      patientId,
      prescriptionId,
      session.user_id,
      items
    )
    revalidatePath('/pharmacy')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}
