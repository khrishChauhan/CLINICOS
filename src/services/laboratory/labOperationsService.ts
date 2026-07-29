import type { SupabaseClient } from '@supabase/supabase-js'
import { labReportRepository } from '@/repositories/laboratory/labReportRepository'
import { labInstrumentRepository, labQualityControlRepository, labTechnicianRepository } from '@/repositories/laboratory/labOperationsRepository'
import type { LabInstrumentRow, LabQualityControlRow, LabTechnicianRow } from '@/types/laboratory'

const LAB_REPORTS_BUCKET = 'lab_reports'
const SIGNED_URL_EXPIRY = 300 // 5 minutes — HIPAA-compliant short-lived access

export const labReportService = {
  // ─────────────────────────────────────────────────────────────────────────────
  // Get all reports — enrich each with a short-lived signed URL for the PDF
  // ─────────────────────────────────────────────────────────────────────────────
  async getReports(supabase: SupabaseClient, clinicId: string) {
    const reports = await labReportRepository.getReports(supabase, clinicId)
    return Promise.all(reports.map(async (r: any) => {
      if (!r.storage_path) return { ...r, signedUrl: null }
      const { data } = await supabase.storage
        .from(LAB_REPORTS_BUCKET)
        .createSignedUrl(r.storage_path, SIGNED_URL_EXPIRY)
      return { ...r, signedUrl: data?.signedUrl ?? null }
    }))
  },

  async getReportById(supabase: SupabaseClient, clinicId: string, reportId: string) {
    const report = await labReportRepository.getReportById(supabase, clinicId, reportId)
    if (!report) throw new Error('Report not found')
    let signedUrl: string | null = null
    if (report.storage_path) {
      const { data } = await supabase.storage
        .from(LAB_REPORTS_BUCKET)
        .createSignedUrl(report.storage_path, SIGNED_URL_EXPIRY)
      signedUrl = data?.signedUrl ?? null
    }
    return { ...report, signedUrl }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Atomic report generation via RPC — wraps order completion + EMR timeline
  // ─────────────────────────────────────────────────────────────────────────────
  async generateReport(
    supabase: SupabaseClient,
    clinicId: string,
    labOrderId: string,
    generatedBy: string,
    storagePath: string,
    remarks?: string
  ) {
    const { data, error } = await supabase.rpc('generate_lab_report_transaction', {
      p_lab_order_id: labOrderId,
      p_generated_by: generatedBy,
      p_clinic_id: clinicId,
      p_storage_path: storagePath,
      p_remarks: remarks ?? null
    })
    if (error) throw new Error(error.message)
    return data
  },

  async approveReport(supabase: SupabaseClient, clinicId: string, reportId: string, approvedBy: string) {
    return labReportRepository.approveReport(supabase, clinicId, reportId, approvedBy)
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Upload PDF to private bucket; returns the storage path
  // ─────────────────────────────────────────────────────────────────────────────
  async uploadReportPdf(
    supabase: SupabaseClient,
    clinicId: string,
    reportNumber: string,
    file: File
  ): Promise<string> {
    // Ensure bucket exists (private by default)
    await supabase.storage.createBucket(LAB_REPORTS_BUCKET, { public: false }).catch(() => {})
    const storagePath = `${clinicId}/${reportNumber}_${Date.now()}.pdf`
    const { error } = await supabase.storage
      .from(LAB_REPORTS_BUCKET)
      .upload(storagePath, file, { contentType: 'application/pdf', upsert: false })
    if (error) throw new Error(`Storage upload failed: ${error.message}`)
    return storagePath
  }
}

export const labInstrumentService = {
  async getInstruments(supabase: SupabaseClient, clinicId: string) {
    return labInstrumentRepository.getInstruments(supabase, clinicId)
  },
  async createInstrument(supabase: SupabaseClient, clinicId: string, payload: Omit<LabInstrumentRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
    return labInstrumentRepository.createInstrument(supabase, clinicId, payload)
  },
  async updateStatus(supabase: SupabaseClient, clinicId: string, instrumentId: string, status: string) {
    return labInstrumentRepository.updateInstrumentStatus(supabase, clinicId, instrumentId, status)
  }
}

export const labQualityControlService = {
  async getQcHistory(supabase: SupabaseClient, clinicId: string, instrumentId?: string) {
    return labQualityControlRepository.getQcHistory(supabase, clinicId, instrumentId)
  },
  async recordQc(supabase: SupabaseClient, clinicId: string, payload: Omit<LabQualityControlRow, 'id' | 'clinic_id' | 'created_at'>) {
    return labQualityControlRepository.recordQc(supabase, clinicId, payload)
  }
}

export const labTechnicianService = {
  async getTechnicians(supabase: SupabaseClient, clinicId: string) {
    return labTechnicianRepository.getTechnicians(supabase, clinicId)
  },
  async registerTechnician(supabase: SupabaseClient, clinicId: string, payload: Omit<LabTechnicianRow, 'id' | 'clinic_id' | 'created_at' | 'updated_at'>) {
    return labTechnicianRepository.registerTechnician(supabase, clinicId, payload)
  }
}
