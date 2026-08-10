'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { visitService } from '@/services/emr/visitService'
import { visitRepository } from '@/repositories/emr/visitRepository'
import type { VisitRow } from '@/types/emr'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  return { supabase, user, clinicId: profile.clinic_id }
}

/** Start a consultation — creates a Visit row if it doesn't exist. */
export async function startConsultationAction(
  appointmentId: string,
  patientId: string,
  appointmentDoctorUserId?: string | null,
  departmentId?: string | null
) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    
    // The frontend passes appt.doctor_id, which in the appointments table is actually a reference to users(id).
    // If it's unassigned, we default to the currently logged-in user.
    const activeUserId = appointmentDoctorUserId || user.id

    // We MUST map this user_id to the actual doctor.doctors(id) for the visits table
    const { data: doctor } = await supabase
      .schema('doctor')
      .from('doctors')
      .select('id')
      .eq('user_id', activeUserId)
      .single()
    
    if (!doctor) throw new Error('Selected user is not registered as a doctor')
    const actualDoctorId = doctor.id

    const visit = await visitService.startOrGetVisit(
      supabase, clinicId, appointmentId, patientId, actualDoctorId, user.id, departmentId
    )
    return { success: true, data: visit }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/** Retrieve a visit by its ID. */
export async function getVisitAction(visitId: string) {
  try {
    const { supabase } = await getAuthContext()
    const visit = await visitRepository.getVisitById(supabase, visitId)
    return { success: true, data: visit }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/** Retrieve a visit linked to a specific appointment. */
export async function getVisitByAppointmentAction(appointmentId: string) {
  try {
    const { supabase } = await getAuthContext()
    const visit = await visitRepository.getVisitByAppointmentId(supabase, appointmentId)
    return { success: true, data: visit }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/** List all visits for a patient. */
export async function getPatientVisitsAction(patientId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const visits = await visitRepository.getVisitsByPatient(supabase, clinicId, patientId)
    return { success: true, data: visits }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/** Update visit fields (e.g. diagnosis, notes). */
export async function updateVisitAction(visitId: string, updates: Partial<VisitRow>) {
  try {
    const { supabase } = await getAuthContext()
    const visit = await visitService.updateVisit(supabase, visitId, updates)
    return { success: true, data: visit }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/** Complete a visit and automatically sync the appointment status to Completed. */
export async function completeVisitAction(
  visitId: string,
  updates?: { provisional_diagnosis?: string; notes?: string; followup_required?: boolean; followup_date?: string }
) {
  try {
    const { supabase } = await getAuthContext()
    const visit = await visitService.completeVisit(supabase, visitId, updates)
    return { success: true, data: visit }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/** List all visits for today. */
export async function getTodaysVisitsAction(filters?: { status?: string }) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const today = new Date().toISOString().split('T')[0]
    const visits = await visitRepository.listVisits(supabase, clinicId, { date: today, ...filters })
    return { success: true, data: visits }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
