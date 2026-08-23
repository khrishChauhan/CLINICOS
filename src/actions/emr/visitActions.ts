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

/** Get enriched patient encounters with doctor name and SOAP notes for display in patient profile. */
export async function getPatientEncountersAction(patientId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const adminClient = createAdminClient()

    // 1. Fetch all visits for this patient
    const visits = await visitRepository.getVisitsByPatient(supabase, clinicId, patientId)
    if (!visits || visits.length === 0) return { success: true, data: [] }

    const visitIds = visits.map(v => v.id)
    
    // 2. Batch-fetch Diagnoses
    const { data: diagnoses } = await supabase
      .from('diagnoses')
      .select('visit_id, diagnosis_name')
      .in('visit_id', visitIds)
      
    // 3. Batch-fetch Chief Complaints
    const { data: complaints } = await supabase
      .from('chief_complaints')
      .select('visit_id, complaint')
      .in('visit_id', visitIds)

    // 4. Batch-fetch Clinical Notes
    const { data: notesList } = await supabase
      .from('clinical_notes')
      .select('visit_id, note')
      .in('visit_id', visitIds)

    // Helper to group by visit_id
    const groupStrings = (data: any[] | null, field: string) => {
      const map: Record<string, string[]> = {}
      data?.forEach(item => {
        if (!map[item.visit_id]) map[item.visit_id] = []
        if (item[field]) map[item.visit_id].push(item[field])
      })
      return map
    }

    const diagMap = groupStrings(diagnoses, 'diagnosis_name')
    const compMap = groupStrings(complaints, 'complaint')
    const noteMap = groupStrings(notesList, 'note')

    // 5. Collect unique user_ids (stored as created_by) to resolve doctor names
    const userIds = [...new Set(visits.map(v => v.created_by).filter(Boolean))] as string[]
    const { data: userProfiles } = userIds.length > 0
      ? await adminClient.from('users').select('id, username, first_name, last_name').in('id', userIds)
      : { data: [] }

    const userMap: Record<string, string> = {}
    userProfiles?.forEach((u: any) => {
      userMap[u.id] = u.first_name && u.last_name ? `Dr. ${u.first_name} ${u.last_name}` : u.username || 'Unknown Doctor'
    })

    // 6. Combine into enriched encounters
    const encounters = visits.map(v => {
      // If no new structured data, fallback to old visits table data if it exists
      const dList = diagMap[v.id]?.length ? diagMap[v.id].join(', ') : v.provisional_diagnosis || null
      const cList = compMap[v.id]?.length ? compMap[v.id].join(', ') : null
      const nList = noteMap[v.id]?.length ? noteMap[v.id].join('\n\n') : v.notes || null

      return {
        id: v.id,
        visit_number: v.visit_number || v.id.slice(0, 6).toUpperCase(),
        visit_date: v.visit_date,
        consultation_status: v.consultation_status,
        provisional_diagnosis: dList,
        chief_complaints: cList,
        notes: nList,
        followup_date: v.followup_date || null,
        doctor_name: v.created_by ? (userMap[v.created_by] || null) : null,
      }
    })

    return { success: true, data: encounters }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
