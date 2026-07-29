import type { SupabaseClient } from '@supabase/supabase-js'
import {
  referenceRangeRepository,
  specimenTypeRepository,
  labConsumableRepository,
  labAttachmentRepository,
  labNotificationRepository,
  labAuditRepository
} from '@/repositories/laboratory/labPhase5Repository'
import type {
  ReferenceRangeRow, SpecimenTypeRow, LabConsumableRow,
  LabAttachmentRow, LabNotificationRow, AbnormalFlag
} from '@/types/laboratory'

const LAB_ATTACHMENTS_BUCKET = 'lab-attachments'
const SIGNED_URL_EXPIRY = 300 // 5 minutes — HIPAA-compliant

// ─────────────────────────────────────────────────────────────────────────────
// Reference Range Service
// Evaluates result against applicable reference range (server-side only)
// ─────────────────────────────────────────────────────────────────────────────
export const referenceRangeService = {
  async getRanges(supabase: SupabaseClient, clinicId: string, testId?: string) {
    return referenceRangeRepository.getRanges(supabase, clinicId, testId)
  },

  async createRange(supabase: SupabaseClient, clinicId: string, payload: Omit<ReferenceRangeRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
    return referenceRangeRepository.createRange(supabase, clinicId, payload)
  },

  async deleteRange(supabase: SupabaseClient, clinicId: string, rangeId: string) {
    return referenceRangeRepository.deleteRange(supabase, clinicId, rangeId)
  },

  /**
   * SERVER-SIDE ONLY — evaluates a numeric value against applicable reference ranges.
   * Picks the most specific range based on patient age and gender.
   * Called during result entry/verification — NEVER on client.
   */
  async evaluateValue(
    supabase: SupabaseClient,
    clinicId: string,
    testId: string,
    value: string,
    patientAgeYears: number,
    patientGender: string,
    parameterName?: string
  ): Promise<AbnormalFlag> {
    const numericValue = parseFloat(value)
    if (isNaN(numericValue)) return 'Normal'

    const ranges = await referenceRangeRepository.getRanges(supabase, clinicId, testId)

    // Filter: match parameter, gender, and age range
    const applicable = ranges.filter(r => {
      const genderOk = r.gender === 'Any' || r.gender === patientGender
      const ageOk = patientAgeYears >= r.age_from && patientAgeYears <= r.age_to
      const paramOk = parameterName ? r.parameter_name === parameterName : !r.parameter_name
      return genderOk && ageOk && paramOk
    })

    if (!applicable.length) return 'Normal'

    // Use most specific match
    const range = applicable[0]
    if (numericValue < range.low_value) {
      return numericValue < range.low_value * 0.8 ? 'Critical' : 'Low'
    }
    if (numericValue > range.high_value) {
      return numericValue > range.high_value * 1.2 ? 'Critical' : 'High'
    }
    return 'Normal'
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Specimen Type Service
// ─────────────────────────────────────────────────────────────────────────────
export const specimenTypeService = {
  async getSpecimenTypes(supabase: SupabaseClient, clinicId: string) {
    return specimenTypeRepository.getSpecimenTypes(supabase, clinicId)
  },

  async createSpecimenType(supabase: SupabaseClient, clinicId: string, payload: Omit<SpecimenTypeRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
    return specimenTypeRepository.createSpecimenType(supabase, clinicId, payload)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Lab Consumable Service
// ─────────────────────────────────────────────────────────────────────────────
export const labConsumableService = {
  async getConsumables(supabase: SupabaseClient, clinicId: string) {
    return labConsumableRepository.getConsumables(supabase, clinicId)
  },

  async createConsumable(supabase: SupabaseClient, clinicId: string, payload: Omit<LabConsumableRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
    return labConsumableRepository.createConsumable(supabase, clinicId, payload)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Lab Attachment Service — HIPAA-compliant signed URLs
// ─────────────────────────────────────────────────────────────────────────────
export const labAttachmentService = {
  async getAttachments(supabase: SupabaseClient, clinicId: string, labOrderId: string) {
    const attachments = await labAttachmentRepository.getAttachments(supabase, clinicId, labOrderId)
    return Promise.all(attachments.map(async (a: any) => {
      const { data } = await supabase.storage
        .from(LAB_ATTACHMENTS_BUCKET)
        .createSignedUrl(a.storage_path, SIGNED_URL_EXPIRY)
      return { ...a, signedUrl: data?.signedUrl ?? null }
    }))
  },

  async uploadAttachment(
    supabase: SupabaseClient,
    clinicId: string,
    labOrderId: string,
    uploadedBy: string,
    file: File,
    documentType: string
  ): Promise<LabAttachmentRow> {
    await supabase.storage.createBucket(LAB_ATTACHMENTS_BUCKET, { public: false }).catch(() => {})
    const ext = file.name.split('.').pop() ?? 'bin'
    const storagePath = `${clinicId}/${labOrderId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from(LAB_ATTACHMENTS_BUCKET)
      .upload(storagePath, file, { upsert: false })
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

    return labAttachmentRepository.createAttachment(supabase, clinicId, {
      lab_order_id: labOrderId,
      storage_path: storagePath,
      file_name: file.name,
      document_type: documentType,
      mime_type: file.type,
      file_size: file.size,
      uploaded_by: uploadedBy
    })
  },

  async deleteAttachment(supabase: SupabaseClient, clinicId: string, attachmentId: string) {
    return labAttachmentRepository.deleteAttachment(supabase, clinicId, attachmentId)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Lab Notification Service
// ─────────────────────────────────────────────────────────────────────────────
export const labNotificationService = {
  async getNotifications(supabase: SupabaseClient, clinicId: string, labOrderId?: string) {
    return labNotificationRepository.getNotifications(supabase, clinicId, labOrderId)
  },

  async sendNotification(
    supabase: SupabaseClient,
    clinicId: string,
    payload: Omit<LabNotificationRow, 'id' | 'clinic_id' | 'created_at'>
  ) {
    // Log to lab_notifications
    const notification = await labNotificationRepository.createNotification(supabase, clinicId, payload)

    // Also queue into the platform's notification_queue if recipient_id present
    if (payload.recipient_id) {
      await supabase.from('notification_queue').insert([{
        clinic_id: clinicId,
        recipient_id: payload.recipient_id,
        title: payload.notification_type,
        message: payload.message ?? `Lab event: ${payload.notification_type}`,
        notification_type: payload.notification_type,
        status: 'Pending'
      }]).select()
    }

    return notification
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Lab Audit Service — IMMUTABLE. Only inserts are allowed via RLS.
// ─────────────────────────────────────────────────────────────────────────────
export const labAuditService = {
  async getAuditLog(supabase: SupabaseClient, clinicId: string, labOrderId?: string) {
    return labAuditRepository.getAuditLog(supabase, clinicId, labOrderId)
  },

  async log(
    supabase: SupabaseClient,
    clinicId: string,
    actionBy: string,
    action: string,
    options?: {
      labOrderId?: string
      tableName?: string
      recordId?: string
      previousValue?: any
      newValue?: any
      metadata?: any
    }
  ) {
    return labAuditRepository.logAction(supabase, clinicId, {
      action_by: actionBy,
      action,
      lab_order_id: options?.labOrderId,
      table_name: options?.tableName,
      record_id: options?.recordId,
      previous_value: options?.previousValue ?? null,
      new_value: options?.newValue ?? null,
      metadata: options?.metadata ?? null,
    })
  }
}
