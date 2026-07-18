import { consultationService } from '@/services/consultations/consultationService'
import { invoiceService } from '@/services/billing/invoiceService'

// Wrap the original lock method to include the Auto-Billing Hook
const originalLockConsultation = consultationService.completeAndLockConsultation

consultationService.completeAndLockConsultation = async function (supabase, consultationId) {
  // 1. Lock the consultation
  const consultation = await originalLockConsultation(supabase, consultationId)
  
  // 2. Auto-Billing Hook: Create a Draft Invoice automatically
  try {
    await invoiceService.createDraftInvoiceFromConsultation(
      supabase,
      consultation.clinic_id,
      consultation.patient_id,
      consultation.id,
      consultation.doctor_id // Use doctor as creator of the draft
    )
  } catch (error) {
    console.error('Failed to auto-generate draft invoice', error)
    // Don't fail the consultation lock if billing fails
  }

  return consultation
}
