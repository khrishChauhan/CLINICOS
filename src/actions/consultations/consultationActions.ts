'use server'

import { createClient } from '@/lib/supabase/server'
import { consultationService } from '@/services/consultations/consultationService'
import { revalidatePath } from 'next/cache'

export async function fetchFullConsultationAction(patientId: string, appointmentId: string | null) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')

    const data = await consultationService.getFullConsultation(
      supabase,
      session.clinic_id,
      patientId,
      session.user_id,
      appointmentId
    )
    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function saveSoapNoteAction(consultationId: string, subjective: string, objective: string, assessment: string, plan: string) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')

    await consultationService.saveSoapNote(supabase, consultationId, session.user_id, {
      subjective, objective, assessment, plan
    })
    
    revalidatePath('/doctor/consultation/[id]', 'page')
    return { ok: true }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function addDiagnosisAction(consultationId: string, description: string, type: 'Primary' | 'Secondary', icdCode?: string, notes?: string) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')

    await consultationService.addDiagnosisToConsultation(supabase, consultationId, {
      description, type, icd_code: icdCode || null, notes: notes || null
    })
    
    revalidatePath('/doctor/consultation/[id]', 'page')
    return { ok: true }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function addPrescriptionItemAction(
  consultationId: string, 
  patientId: string,
  medicineName: string, 
  dosage: string, 
  frequency: string, 
  durationDays: number, 
  instructions: string
) {
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.rpc('get_session_context')
    if (!session) throw new Error('Unauthorized')

    await consultationService.addPrescriptionItemToConsultation(
      supabase,
      consultationId,
      session.clinic_id,
      patientId,
      session.user_id,
      {
        medicine_name: medicineName,
        dosage,
        frequency,
        duration_days: durationDays,
        instructions
      }
    )
    
    revalidatePath('/doctor/consultation/[id]', 'page')
    return { ok: true }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}

export async function lockConsultationAction(consultationId: string) {
  try {
    const supabase = await createClient()
    await consultationService.completeAndLockConsultation(supabase, consultationId)
    revalidatePath('/doctor/consultation/[id]', 'page')
    return { ok: true }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}
