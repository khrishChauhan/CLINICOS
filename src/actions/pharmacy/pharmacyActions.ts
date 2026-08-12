'use server'

import { createClient } from '@/lib/supabase/server'
import { createMedicine, getMedicines } from '@/repositories/pharmacy/medicineRepository'
import { inventoryService } from '@/services/pharmacy/inventoryService'
import { purchaseService } from '@/services/pharmacy/purchaseService'
import { dispensingService } from '@/services/pharmacy/dispensingService'
import { revalidatePath } from 'next/cache'

async function getSessionContext(supabase: any) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('clinic_id')
    .eq('id', user.id)
    .single()

  if (userError || !userData?.clinic_id) {
    throw new Error('Unauthorized - No Clinic Associated')
  }

  return { clinic_id: userData.clinic_id, user_id: user.id }
}

export async function fetchMedicinesAction() {
  try {
    const supabase = await createClient()
    const session = await getSessionContext(supabase)
    
    const data = await getMedicines(supabase, session.clinic_id)
    return { ok: true, data }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function fetchPendingPrescriptionsAction() {
  try {
    const supabase = await createClient()
    const session = await getSessionContext(supabase)
    
    // Fetch prescriptions that don't have a Completed dispense_record
    const { data, error } = await supabase
      .from('prescriptions')
      // prescriptions -> visits -> appointments -> patients
      .select('*, visits(*, appointments(*, patients(*))), prescription_items(*)')
      .eq('clinic_id', session.clinic_id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw new Error(error.message)

    // Filter out dispensed ones manually for simplicity (in a real app, use a left join filter)
    const { data: dispensed } = await supabase
      .from('dispense_records')
      .select('prescription_id')
      .eq('clinic_id', session.clinic_id)

    const dispensedIds = new Set((dispensed || []).map((d: any) => d.prescription_id))
    const pending = (data || []).filter((p: any) => !dispensedIds.has(p.id))

    return { ok: true, data: pending }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function createMedicineAction(payload: any) {
  try {
    const supabase = await createClient()
    const session = await getSessionContext(supabase)
    
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
    const session = await getSessionContext(supabase)
    
    const data = await inventoryService.getDashboardAlerts(supabase, session.clinic_id)
    return { ok: true, data }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function fetchEnterpriseDashboardAction() {
  try {
    const supabase = await createClient()
    const session = await getSessionContext(supabase)

    // Fetch all required data in parallel to avoid waterfalls
    const [alertsResult, medicinesResult, transactionsResult] = await Promise.all([
      inventoryService.getDashboardAlerts(supabase, session.clinic_id),
      getMedicines(supabase, session.clinic_id),
      supabase.from('stock_transactions')
        .select('*, medicine_batches(batch_number), medicines(generic_name, brand_name)')
        .eq('clinic_id', session.clinic_id)
        .order('created_at', { ascending: false })
        .limit(20)
    ])

    return { 
      ok: true, 
      data: {
        alerts: alertsResult,
        medicines: medicinesResult,
        transactions: transactionsResult.data || []
      } 
    }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function receivePurchaseOrderAction(poId: string, batchData: any) {
  try {
    const supabase = await createClient()
    const session = await getSessionContext(supabase)
    
    await purchaseService.receivePO(supabase, poId, session.user_id, batchData)
    revalidatePath('/pharmacy/purchases')
    revalidatePath('/pharmacy')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function dispenseMedicineAction(patientId: string, visitId: string | null, prescriptionId: string | null, items: any[]) {
  try {
    const supabase = await createClient()
    const session = await getSessionContext(supabase)
    
    await dispensingService.dispenseMedicine(
      supabase,
      session.clinic_id,
      patientId,
      prescriptionId,
      visitId,
      session.user_id,
      items
    )
    revalidatePath('/pharmacy')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function addDirectBatchAction(payload: {
  medicine_id: string
  batch_number: string
  expiry_date: string
  quantity: number
}) {
  try {
    const supabase = await createClient()
    const session = await getSessionContext(supabase)

    // 1. Create Medicine Batch
    const { data: batch, error: batchErr } = await supabase
      .from('medicine_batches')
      .insert([{
        medicine_id: payload.medicine_id,
        batch_number: payload.batch_number,
        expiry_date: payload.expiry_date,
        status: 'Active'
      }])
      .select()
      .single()

    if (batchErr) throw new Error(batchErr.message)

    // 2. Record Stock Transaction (Triggers stock update)
    const { error: txErr } = await supabase
      .from('stock_transactions')
      .insert([{
        clinic_id: session.clinic_id,
        medicine_id: payload.medicine_id,
        batch_id: batch.id,
        transaction_type: 'Purchase', // Using Purchase for direct inventory entry
        quantity_change: payload.quantity,
        remarks: 'Direct Inventory Entry',
        created_by: session.user_id
      }])

    if (txErr) throw new Error(txErr.message)

    revalidatePath('/pharmacy/inventory')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}
