'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { labTestService } from '@/services/laboratory/labTestService'
import { revalidatePath } from 'next/cache'
import type { CreateLabTestPayload, RecordLabResultPayload } from '@/types/laboratory'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic not found')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getLabTestsAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labTestService.getLabTests(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function createLabTestAction(payload: CreateLabTestPayload) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labTestService.createLabTest(supabase, clinicId, payload)
    revalidatePath('/laboratory/tests')
    revalidatePath('/laboratory')
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function updateTestStatusAction(testId: string, status: 'Ordered' | 'In Progress' | 'Completed' | 'Verified' | 'Cancelled') {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labTestService.updateTestStatus(supabase, clinicId, testId, status)
    revalidatePath('/laboratory/tests')
    revalidatePath(`/laboratory/tests/${testId}`)
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function recordLabResultAction(payload: RecordLabResultPayload) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await labTestService.recordLabResult(supabase, clinicId, user.id, payload)
    revalidatePath('/laboratory/tests')
    revalidatePath(`/laboratory/tests/${payload.lab_test_id}`)
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function verifyLabResultAction(resultId: string, labTestId: string) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await labTestService.verifyLabResult(supabase, clinicId, resultId, user.id)
    revalidatePath('/laboratory/tests')
    revalidatePath(`/laboratory/tests/${labTestId}`)
    revalidatePath('/laboratory')
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
