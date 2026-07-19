import type { SupabaseClient } from '@supabase/supabase-js'
import type { LabOrderRow, LabOrderItemRow, LabStatusLogRow, LabOrderStatus } from '@/types/laboratory'

export async function getLabOrders(supabase: SupabaseClient, clinicId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('lab_orders')
    .select('*, patients(first_name, last_name), lab_order_items(*, lab_tests(name, unit))')
    .eq('clinic_id', clinicId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Failed to fetch lab orders: ${error.message}`)
  return data
}

export async function getLabOrderById(supabase: SupabaseClient, orderId: string): Promise<any> {
  const { data, error } = await supabase
    .from('lab_orders')
    .select(`
      *,
      patients(id, first_name, last_name, date_of_birth, gender),
      lab_order_items(*, lab_tests(id, name, unit, result_type, specimen_type)),
      lab_samples(*),
      lab_results(*, lab_result_values(*))
    `)
    .eq('id', orderId)
    .single()
  if (error) throw new Error(`Failed to fetch lab order: ${error.message}`)
  return data
}

export async function createLabOrder(
  supabase: SupabaseClient,
  clinicId: string,
  patientId: string,
  consultationId: string | null,
  orderedBy: string,
  testIds: string[],
  priority: string = 'Routine'
): Promise<LabOrderRow> {
  const { data: order, error } = await supabase
    .from('lab_orders')
    .insert([{ clinic_id: clinicId, patient_id: patientId, consultation_id: consultationId, ordered_by: orderedBy, priority }])
    .select()
    .single()
  if (error) throw new Error(`Failed to create lab order: ${error.message}`)

  const items = testIds.map(tid => ({ lab_order_id: order.id, lab_test_id: tid }))
  const { error: itemsErr } = await supabase.from('lab_order_items').insert(items)
  if (itemsErr) throw new Error(`Failed to add order items: ${itemsErr.message}`)

  return order as LabOrderRow
}

export async function transitionOrderStatus(
  supabase: SupabaseClient,
  orderId: string,
  newStatus: LabOrderStatus,
  changedBy: string,
  remarks?: string
): Promise<void> {
  const { data: existing, error: fetchErr } = await supabase
    .from('lab_orders')
    .select('status')
    .eq('id', orderId)
    .single()
  if (fetchErr) throw new Error(`Order not found: ${fetchErr.message}`)

  // Update status
  const { error: updateErr } = await supabase
    .from('lab_orders')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId)
  if (updateErr) throw new Error(`Failed to update status: ${updateErr.message}`)

  // Audit log
  const { error: logErr } = await supabase
    .from('lab_status_logs')
    .insert([{ lab_order_id: orderId, status_from: existing.status, status_to: newStatus, changed_by: changedBy, remarks: remarks ?? null }])
  if (logErr) throw new Error(`Failed to log status change: ${logErr.message}`)
}
