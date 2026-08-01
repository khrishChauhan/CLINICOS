'use server'

import { createClient } from '@/lib/supabase/server'
import { radiologyReportService } from '@/services/radiology/radiologyReportService'
import { revalidatePath } from 'next/cache'
import type { RadiologistFindingRow } from '@/types/radiology'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic not found')
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getRadiologyReportsAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyReportService.getReportsByClinic(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function getRadiologyReportByIdAction(reportId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await radiologyReportService.getReportById(supabase, clinicId, reportId)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function saveDraftReportAction(
  reportId: string | null,
  studyId: string,
  findingsPayload: Omit<RadiologistFindingRow, 'id' | 'clinic_id' | 'radiology_report_id' | 'created_at' | 'updated_at' | 'deleted_at'>
) {
  try {
    const { supabase, clinicId, user } = await getAuthContext()
    const data = await radiologyReportService.saveDraftReport(supabase, clinicId, reportId, studyId, user.id, findingsPayload)
    revalidatePath(`/radiology/reports`)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function approveRadiologyReportAction(
  reportId: string,
  digitalSignatureId: string,
  patientId: string,
  formData: FormData
) {
  try {
    const { supabase, clinicId, user } = await getAuthContext()
    const pdfFile = formData.get('pdf') as File
    if (!pdfFile) throw new Error('Missing PDF file')

    await radiologyReportService.approveReport(
      supabase,
      clinicId,
      reportId,
      pdfFile,
      digitalSignatureId,
      patientId,
      user.id
    )

    revalidatePath(`/radiology/reports`)
    revalidatePath(`/radiology/studies`)
    return { success: true }
  } catch (e: any) { return { success: false, error: e.message } }
}

export async function createReportAddendumAction(studyId: string) {
  try {
    const { supabase, clinicId, user } = await getAuthContext()
    const data = await radiologyReportService.createAddendum(supabase, clinicId, studyId, user.id)
    revalidatePath(`/radiology/reports`)
    return { success: true, data }
  } catch (e: any) { return { success: false, error: e.message } }
}
