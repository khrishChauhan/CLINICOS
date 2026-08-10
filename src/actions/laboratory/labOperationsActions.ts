'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { labReportService, labInstrumentService, labQualityControlService, labTechnicianService } from '@/services/laboratory/labOperationsService'
import { revalidatePath } from 'next/cache'
import type { LabInstrumentRow, LabQualityControlRow, LabTechnicianRow } from '@/types/laboratory'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic not found')
  return { supabase, user, clinicId: profile.clinic_id }
}

// ─────────────────────────────────────────────────────────────────────────────
// Reports
// ─────────────────────────────────────────────────────────────────────────────
export async function getLabReportsAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labReportService.getReports(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function getLabReportByIdAction(reportId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labReportService.getReportById(supabase, clinicId, reportId)
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function generateLabReportAction(labOrderId: string, storagePath: string, remarks?: string) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await labReportService.generateReport(supabase, clinicId, labOrderId, user.id, storagePath, remarks)
    revalidatePath('/laboratory/reports')
    revalidatePath('/laboratory')
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function approveLabReportAction(reportId: string) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await labReportService.approveReport(supabase, clinicId, reportId, user.id)
    revalidatePath('/laboratory/reports')
    revalidatePath(`/laboratory/reports/${reportId}`)
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Instruments
// ─────────────────────────────────────────────────────────────────────────────
export async function getLabInstrumentsAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labInstrumentService.getInstruments(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function createLabInstrumentAction(payload: Omit<LabInstrumentRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labInstrumentService.createInstrument(supabase, clinicId, payload)
    revalidatePath('/laboratory/instruments')
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function updateInstrumentStatusAction(instrumentId: string, status: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labInstrumentService.updateStatus(supabase, clinicId, instrumentId, status)
    revalidatePath('/laboratory/instruments')
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Quality Control
// ─────────────────────────────────────────────────────────────────────────────
export async function getQcHistoryAction(instrumentId?: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labQualityControlService.getQcHistory(supabase, clinicId, instrumentId)
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function recordQualityControlAction(payload: Omit<LabQualityControlRow, 'id' | 'clinic_id' | 'created_at'>) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await labQualityControlService.recordQc(supabase, clinicId, { ...payload, performed_by: user.id })
    revalidatePath('/laboratory/qc')
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Technicians
// ─────────────────────────────────────────────────────────────────────────────
export async function getLabTechniciansAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labTechnicianService.getTechnicians(supabase, clinicId)
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function registerLabTechnicianAction(payload: Omit<LabTechnicianRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await labTechnicianService.registerTechnician(supabase, clinicId, payload)
    revalidatePath('/laboratory/reports')
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
