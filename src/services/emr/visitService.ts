import type { SupabaseClient } from '@supabase/supabase-js'
import { visitRepository } from '@/repositories/emr/visitRepository'
import type { VisitRow, CreateVisitPayload } from '@/types/emr'
import { queueService } from '@/services/appointments/queueService'
import { invoiceService } from '@/services/billing/invoiceService'

export const visitService = {
  /**
   * Start or retrieve a visit for a given appointment.
   * This is the primary entry point for the doctor consultation workflow.
   * If a visit already exists for the appointment, return it immediately.
   */
  async startOrGetVisit(
    supabase: SupabaseClient,
    clinicId: string,
    appointmentId: string,
    patientId: string,
    doctorId: string,
    userId: string,
    departmentId?: string | null
  ): Promise<VisitRow> {
    // 1. Check if visit already exists for this appointment
    const existing = await visitRepository.getVisitByAppointmentId(supabase, appointmentId)
    if (existing) return existing

    // 2. Create fresh visit — visit_number is generated inside repository via DB function
    const visit = await visitRepository.createVisit(supabase, {
      clinic_id: clinicId,
      patient_id: patientId,
      appointment_id: appointmentId,
      doctor_id: doctorId,
      department_id: departmentId ?? null,
      visit_type: 'OPD',
      visit_date: new Date().toISOString().split('T')[0],
      consultation_start_time: new Date().toISOString(),
      created_by: userId
    })

    // 3. Connect to Queue System
    try {
      await queueService.startConsultation(supabase, appointmentId, userId)
    } catch (e) {
      console.error('Failed to update queue status for startConsultation', e)
    }

    return visit
  },

  /**
   * Complete a visit — also syncs the linked appointment status to 'Completed'.
   */
  async completeVisit(
    supabase: SupabaseClient,
    visitId: string,
    updates?: { provisional_diagnosis?: string; notes?: string; followup_required?: boolean; followup_date?: string }
  ): Promise<VisitRow> {
    const visit = await visitRepository.updateVisit(supabase, visitId, {
      consultation_status: 'Completed',
      consultation_end_time: new Date().toISOString(),
      ...updates
    })

    // Sync appointment status if linked
    if (visit.appointment_id) {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Completed', consultation_completed_at: new Date().toISOString() })
        .eq('id', visit.appointment_id)
      if (error) console.error('Failed to sync appointment status:', error.message)

      try {
        await queueService.completeConsultation(supabase, visit.appointment_id, visit.created_by || '')
      } catch (e) {
        console.error('Failed to sync queue/appointment status:', e)
      }
    }

    // Auto-Billing Hook: Generate Draft Invoice from this completed visit
    if (visit.clinic_id && visit.patient_id) {
       try {
         await invoiceService.createDraftInvoiceFromVisit(
           supabase, 
           visit.clinic_id, 
           visit.patient_id, 
           visitId, 
           'system' // Replace with actual userId if passed down
         )
       } catch (err) {
         console.error('Failed to create draft invoice on visit complete', err)
       }
    }

    return visit
  },

  async updateVisit(supabase: SupabaseClient, visitId: string, updates: Partial<VisitRow>): Promise<VisitRow> {
    return await visitRepository.updateVisit(supabase, visitId, updates)
  }
}
