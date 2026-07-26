import type { SupabaseClient } from '@supabase/supabase-js'
import { prescriptionRepository, prescriptionItemRepository } from '@/repositories/emr/prescriptionRepository'
import type { PrescriptionRow, PrescriptionItemRow } from '@/types/emr'

export const prescriptionService = {
  /** Get or create a prescription for a visit, auto-populating the doctor's digital signature */
  async getOrCreate(
    supabase: SupabaseClient,
    clinicId: string,
    visitId: string,
    doctorId: string
  ): Promise<{ prescription: PrescriptionRow; items: PrescriptionItemRow[] }> {
    let prescription = await prescriptionRepository.getByVisit(supabase, visitId)

    if (!prescription) {
      // Try to fetch doctor's digital signature from the doctor module
      const { data: sigData } = await supabase
        .schema('doctor')
        .from('doctor_digital_signature')
        .select('signature_path')
        .eq('doctor_id', doctorId)
        .eq('is_active', true)
        .maybeSingle()

      prescription = await prescriptionRepository.upsert(supabase, {
        clinic_id: clinicId,
        visit_id: visitId,
        doctor_id: doctorId,
        prescription_date: new Date().toISOString().split('T')[0],
        digital_signature: sigData?.signature_path || null
      })
    }

    const items = await prescriptionItemRepository.getByPrescription(supabase, prescription.id)
    return { prescription, items }
  },

  async savePrescription(
    supabase: SupabaseClient,
    clinicId: string,
    visitId: string,
    doctorId: string,
    updates: Partial<Pick<PrescriptionRow, 'advice' | 'dietary_advice' | 'next_visit'>>
  ): Promise<PrescriptionRow> {
    return await prescriptionRepository.upsert(supabase, {
      clinic_id: clinicId,
      visit_id: visitId,
      doctor_id: doctorId,
      prescription_date: new Date().toISOString().split('T')[0],
      ...updates
    })
  },

  async addItem(
    supabase: SupabaseClient,
    clinicId: string,
    prescriptionId: string,
    payload: Partial<Omit<PrescriptionItemRow, 'id' | 'clinic_id' | 'prescription_id' | 'created_at'>>
  ): Promise<PrescriptionItemRow> {
    if (!payload.medicine_name?.trim()) throw new Error('Medicine name is required')
    return await prescriptionItemRepository.create(supabase, {
      clinic_id: clinicId,
      prescription_id: prescriptionId,
      medicine_name: payload.medicine_name.trim(),
      medicine_id: payload.medicine_id || null,
      dosage: payload.dosage || null,
      frequency: payload.frequency || null,
      duration: payload.duration || null,
      quantity: payload.quantity || null,
      route: payload.route || null,
      before_after_food: payload.before_after_food || null,
      instructions: payload.instructions || null
    })
  },

  async removeItem(supabase: SupabaseClient, itemId: string): Promise<void> {
    await prescriptionItemRepository.delete(supabase, itemId)
  },

  async getItems(supabase: SupabaseClient, prescriptionId: string): Promise<PrescriptionItemRow[]> {
    return await prescriptionItemRepository.getByPrescription(supabase, prescriptionId)
  }
}
