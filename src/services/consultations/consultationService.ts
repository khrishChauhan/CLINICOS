import type { SupabaseClient } from '@supabase/supabase-js'
import {
  getConsultationById,
  getOrCreateConsultation,
  lockConsultation
} from '@/repositories/consultations/consultationRepository'
import { getSoapNote, upsertSoapNote } from '@/repositories/consultations/soapRepository'
import { getPrescription, ensurePrescriptionExists, addPrescriptionItem, removePrescriptionItem } from '@/repositories/consultations/prescriptionRepository'
import { getDiagnoses, addDiagnosis, removeDiagnosis } from '@/repositories/consultations/diagnosisRepository'
import type { FullConsultationData, SoapNoteRow, DiagnosisRow, PrescriptionItemRow } from '@/types/consultations'

export const consultationService = {

  async getFullConsultation(
    supabase: SupabaseClient,
    clinicId: string,
    patientId: string,
    doctorId: string,
    appointmentId: string | null
  ): Promise<FullConsultationData> {
    // 1. Get or create the active consultation wrapper
    const consultation = await getOrCreateConsultation(supabase, clinicId, patientId, doctorId, appointmentId)

    // 2. Fetch components
    const soap = await getSoapNote(supabase, consultation.id)
    const diagnoses = await getDiagnoses(supabase, consultation.id)
    const { prescription, items: prescriptionItems } = await getPrescription(supabase, consultation.id)
    
    // Stub for investigations & follow_ups
    const investigations = [] as any[]
    const followUp = null

    return {
      consultation,
      soap,
      diagnoses,
      prescription,
      prescriptionItems,
      investigations,
      followUp
    }
  },

  async saveSoapNote(
    supabase: SupabaseClient,
    consultationId: string,
    userId: string,
    payload: Partial<SoapNoteRow>
  ) {
    // Rely on database triggers to block if `is_locked` is true.
    return await upsertSoapNote(supabase, consultationId, userId, payload)
  },

  async addDiagnosisToConsultation(
    supabase: SupabaseClient,
    consultationId: string,
    payload: Omit<DiagnosisRow, 'id' | 'consultation_id' | 'created_at'>
  ) {
    return await addDiagnosis(supabase, consultationId, payload)
  },

  async addPrescriptionItemToConsultation(
    supabase: SupabaseClient,
    consultationId: string,
    clinicId: string,
    patientId: string,
    doctorId: string,
    payload: Omit<PrescriptionItemRow, 'id' | 'prescription_id' | 'created_at'>
  ) {
    const prescription = await ensurePrescriptionExists(supabase, consultationId, clinicId, patientId, doctorId)
    return await addPrescriptionItem(supabase, prescription.id, payload)
  },

  async completeAndLockConsultation(
    supabase: SupabaseClient,
    consultationId: string
  ) {
    // DB Trigger handles blocking further edits, we just update the status to 'Completed' and is_locked to true.
    const consultation = await lockConsultation(supabase, consultationId)

    // Auto-Billing Hook: Create Draft Invoice
    try {
      // Import dynamically to avoid circular dependencies at boot
      const { invoiceService } = await import('@/services/billing/invoiceService')
      await invoiceService.createDraftInvoiceFromConsultation(
        supabase,
        consultation.clinic_id,
        consultation.patient_id,
        consultation.id,
        consultation.doctor_id
      )
    } catch (error) {
      console.error('Failed to auto-generate draft invoice', error)
    }

    return consultation
  },

  async removePrescriptionItemFromConsultation(
    supabase: SupabaseClient,
    itemId: string
  ) {
    return await removePrescriptionItem(supabase, itemId)
  },
  
  async removeDiagnosisFromConsultation(
    supabase: SupabaseClient,
    diagnosisId: string
  ) {
    return await removeDiagnosis(supabase, diagnosisId)
  }
}
