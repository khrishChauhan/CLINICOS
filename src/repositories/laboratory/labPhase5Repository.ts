import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  ReferenceRangeRow, SpecimenTypeRow, LabConsumableRow,
  LabAttachmentRow, LabNotificationRow, LabAuditRow
} from '@/types/laboratory'

// ─────────────────────────────────────────────────────────────────────────────
// ReferenceRangeRepository
// ─────────────────────────────────────────────────────────────────────────────
export const referenceRangeRepository = {
  async getRanges(supabase: SupabaseClient, clinicId: string, testId?: string) {
    let q = supabase.from('reference_ranges').select('*').eq('clinic_id', clinicId).eq('is_active', true)
    if (testId) q = q.eq('test_id', testId)
    const { data, error } = await q.order('age_from')
    if (error) throw new Error(error.message)
    return data as ReferenceRangeRow[]
  },

  async createRange(supabase: SupabaseClient, clinicId: string, payload: Omit<ReferenceRangeRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('reference_ranges')
      .insert([{ ...payload, clinic_id: clinicId }])
      .select().single()
    if (error) throw new Error(error.message)
    return data as ReferenceRangeRow
  },

  async deleteRange(supabase: SupabaseClient, clinicId: string, rangeId: string) {
    const { error } = await supabase
      .from('reference_ranges')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('clinic_id', clinicId).eq('id', rangeId)
    if (error) throw new Error(error.message)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SpecimenTypeRepository
// ─────────────────────────────────────────────────────────────────────────────
export const specimenTypeRepository = {
  async getSpecimenTypes(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('specimen_types').select('*').eq('clinic_id', clinicId).order('specimen_name')
    if (error) throw new Error(error.message)
    return data as SpecimenTypeRow[]
  },

  async createSpecimenType(supabase: SupabaseClient, clinicId: string, payload: Omit<SpecimenTypeRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('specimen_types').insert([{ ...payload, clinic_id: clinicId }]).select().single()
    if (error) throw new Error(error.message)
    return data as SpecimenTypeRow
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LabConsumableRepository
// ─────────────────────────────────────────────────────────────────────────────
export const labConsumableRepository = {
  async getConsumables(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('lab_consumables').select('*').eq('clinic_id', clinicId).order('item_name')
    if (error) throw new Error(error.message)
    return data as LabConsumableRow[]
  },

  async createConsumable(supabase: SupabaseClient, clinicId: string, payload: Omit<LabConsumableRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('lab_consumables').insert([{ ...payload, clinic_id: clinicId }]).select().single()
    if (error) throw new Error(error.message)
    return data as LabConsumableRow
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LabAttachmentRepository
// ─────────────────────────────────────────────────────────────────────────────
export const labAttachmentRepository = {
  async getAttachments(supabase: SupabaseClient, clinicId: string, labOrderId: string) {
    const { data, error } = await supabase
      .from('lab_attachments').select('*, uploader:users!lab_attachments_uploaded_by_fkey(first_name, last_name)')
      .eq('clinic_id', clinicId).eq('lab_order_id', labOrderId)
      .order('uploaded_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  },

  async createAttachment(supabase: SupabaseClient, clinicId: string, payload: Omit<LabAttachmentRow, 'id' | 'clinic_id' | 'uploaded_at'>) {
    const { data, error } = await supabase
      .from('lab_attachments').insert([{ ...payload, clinic_id: clinicId }]).select().single()
    if (error) throw new Error(error.message)
    return data as LabAttachmentRow
  },

  async deleteAttachment(supabase: SupabaseClient, clinicId: string, attachmentId: string) {
    const { data: att, error: fe } = await supabase
      .from('lab_attachments').select('storage_path').eq('clinic_id', clinicId).eq('id', attachmentId).single()
    if (fe) throw new Error(fe.message)
    await supabase.storage.from('lab-attachments').remove([att.storage_path])
    const { error } = await supabase.from('lab_attachments').delete().eq('id', attachmentId)
    if (error) throw new Error(error.message)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LabNotificationRepository
// ─────────────────────────────────────────────────────────────────────────────
export const labNotificationRepository = {
  async getNotifications(supabase: SupabaseClient, clinicId: string, labOrderId?: string) {
    let q = supabase.from('lab_notifications').select('*').eq('clinic_id', clinicId).order('created_at', { ascending: false })
    if (labOrderId) q = q.eq('lab_order_id', labOrderId)
    const { data, error } = await q
    if (error) throw new Error(error.message)
    return data as LabNotificationRow[]
  },

  async createNotification(supabase: SupabaseClient, clinicId: string, payload: Omit<LabNotificationRow, 'id' | 'clinic_id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('lab_notifications').insert([{ ...payload, clinic_id: clinicId }]).select().single()
    if (error) throw new Error(error.message)
    return data as LabNotificationRow
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LabAuditRepository — INSERT & SELECT ONLY (immutable by RLS)
// ─────────────────────────────────────────────────────────────────────────────
export const labAuditRepository = {
  async getAuditLog(supabase: SupabaseClient, clinicId: string, labOrderId?: string) {
    let q = supabase
      .from('lab_audit')
      .select('*, actor:users!lab_audit_action_by_fkey(first_name, last_name)')
      .eq('clinic_id', clinicId)
      .order('action_time', { ascending: false })
    if (labOrderId) q = q.eq('lab_order_id', labOrderId)
    const { data, error } = await q
    if (error) throw new Error(error.message)
    return data
  },

  async logAction(supabase: SupabaseClient, clinicId: string, payload: Omit<LabAuditRow, 'id' | 'clinic_id' | 'action_time'>) {
    const { data, error } = await supabase
      .from('lab_audit')
      .insert([{ ...payload, clinic_id: clinicId }])
      .select().single()
    if (error) throw new Error(error.message)
    return data as LabAuditRow
  }
}
