'use server'

import { createClient } from '@/lib/supabase/server'
import { appointmentDocumentService } from '@/services/appointments/appointmentDocumentService'

export async function linkAppointmentDocumentAction(
  appointmentId: string,
  storagePath: string,
  documentType: string,
  remarks?: string
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
    if (!profile?.clinic_id) throw new Error('Clinic ID not found')

    const data = await appointmentDocumentService.linkDocument(
      supabase,
      profile.clinic_id,
      appointmentId,
      storagePath,
      documentType,
      remarks
    )
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to link document' }
  }
}

export async function fetchAppointmentDocumentsAction(appointmentId: string) {
  try {
    const supabase = await createClient()
    const data = await appointmentDocumentService.getDocuments(supabase, appointmentId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch documents' }
  }
}

export async function deleteAppointmentDocumentAction(documentId: string, storagePath: string) {
  try {
    const supabase = await createClient()
    await appointmentDocumentService.deleteDocument(supabase, documentId, storagePath)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete document' }
  }
}
