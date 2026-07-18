'use server'

import { createClient } from '@/lib/supabase/server'

export type UploadDocumentResult =
  | { ok: true; documentId: string; fileUrl: string }
  | { ok: false; error: string }

/**
 * Server Action: Link an already-uploaded Supabase Storage file to a patient record.
 * The actual file upload happens client-side. This action only writes the DB records.
 */
export async function linkPatientDocument(params: {
  patientId: string
  filePath: string       // storage path: e.g. "{clinic_id}/{patient_id}/aadhaar.pdf"
  fileUrl: string        // public or signed URL
  fileName: string
  originalFileName: string
  fileExtension: string
  mimeType: string
  fileSizeBytes: number
  documentType?: string
  documentName: string
  remarks?: string
}): Promise<UploadDocumentResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'UNAUTHENTICATED' }

  const { data: ctx } = await supabase.rpc('get_session_context')

  // 1. Create file_attachments record
  const { data: attachment, error: attachErr } = await supabase
    .from('file_attachments')
    .insert({
      clinic_id: ctx?.clinic_id,
      module_name: 'Patients',
      reference_table: 'patients',
      reference_id: params.patientId,
      file_name: params.fileName,
      original_file_name: params.originalFileName,
      file_extension: params.fileExtension,
      mime_type: params.mimeType,
      file_size_bytes: params.fileSizeBytes,
      storage_provider: 'supabase',
      file_path: params.filePath,
      file_url: params.fileUrl,
      uploaded_by: user.id,
      status: 'Active',
    })
    .select('id')
    .single()

  if (attachErr) return { ok: false, error: attachErr.message }

  // 2. Create patient_documents record
  const { data: doc, error: docErr } = await supabase
    .from('patient_documents')
    .insert({
      patient_id: params.patientId,
      attachment_id: attachment.id,
      document_type: params.documentType ?? 'General',
      document_name: params.documentName,
      remarks: params.remarks ?? null,
    })
    .select('id')
    .single()

  if (docErr) return { ok: false, error: docErr.message }

  // 3. Log activity
  await supabase.from('activity_logs').insert({
    clinic_id: ctx?.clinic_id,
    user_id: user.id,
    employee_name: ctx?.full_name ?? 'Staff',
    module_name: 'Patients',
    action: 'UPLOAD',
    reference_table: 'patient_documents',
    reference_id: doc.id,
    activity_description: `Document uploaded: ${params.documentName} for patient ${params.patientId}`,
  })

  return { ok: true, documentId: doc.id, fileUrl: params.fileUrl }
}
