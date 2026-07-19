'use server'

import { createClient } from '@/lib/supabase/server'
import { labOrderService } from '@/services/laboratory/labOrderService'
import { sampleService } from '@/services/laboratory/sampleService'
import { resultService } from '@/services/laboratory/resultService'
import { createLabTest } from '@/repositories/laboratory/testCatalogRepository'
import { getLabTests } from '@/repositories/laboratory/testCatalogRepository'
import { revalidatePath } from 'next/cache'

// ── Catalog ──────────────────────────────────────────────────────────────────

export async function fetchLabTestsAction() {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    const data = await getLabTests(supabase, session.clinic_id)
    return { ok: true, data }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function createLabTestAction(
  name: string,
  specimenType: string,
  unit: string,
  resultType: string,
  price: number
) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    await createLabTest(supabase, {
      clinic_id: session.clinic_id,
      category_id: null,
      name,
      code: null,
      specimen_type: specimenType,
      unit,
      result_type: resultType as any,
      price,
      is_active: true
    })
    revalidatePath('/lab/catalog')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

// ── Orders ───────────────────────────────────────────────────────────────────

export async function createLabOrderAction(
  patientId: string,
  consultationId: string | null,
  testIds: string[],
  priority: string
) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    const order = await labOrderService.createOrder(
      supabase,
      session.clinic_id,
      patientId,
      consultationId,
      session.user_id,
      testIds,
      priority
    )
    revalidatePath('/lab')
    return { ok: true, data: order }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

// ── Sample ───────────────────────────────────────────────────────────────────

export async function collectSampleAction(
  labOrderId: string,
  specimenType: string
) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    const sample = await sampleService.collectSample(supabase, labOrderId, specimenType, session.user_id)
    revalidatePath(`/lab/orders/${labOrderId}`)
    return { ok: true, data: sample }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

// ── Results ──────────────────────────────────────────────────────────────────

export async function enterResultsAction(
  labOrderId: string,
  inputs: { labOrderItemId: string; labTestId: string; valueNumeric?: number; valueText?: string }[],
  patient: { date_of_birth: string; gender: string }
) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    const result = await resultService.enterResults(supabase, labOrderId, session.user_id, inputs, patient)
    revalidatePath(`/lab/orders/${labOrderId}`)
    return { ok: true, data: result }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function verifyResultAction(
  labOrderId: string,
  labResultId: string,
  remarks: string
) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')
    await resultService.verifyAndFinalize(supabase, labOrderId, labResultId, session.user_id, remarks || null)
    revalidatePath(`/lab/orders/${labOrderId}`)
    revalidatePath('/lab')
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}
