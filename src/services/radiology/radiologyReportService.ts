import type { SupabaseClient } from '@supabase/supabase-js'
import { radiologyReportRepository } from '@/repositories/radiology/radiologyReportRepository'
import { radiologistFindingRepository } from '@/repositories/radiology/radiologistFindingRepository'
import type { RadiologyReportRow, RadiologistFindingRow } from '@/types/radiology'

export const radiologyReportService = {
  async getReportsByClinic(supabase: SupabaseClient, clinicId: string) {
    return radiologyReportRepository.getReportsByClinic(supabase, clinicId)
  },

  async getReportById(supabase: SupabaseClient, clinicId: string, reportId: string) {
    const report = await radiologyReportRepository.getReportById(supabase, clinicId, reportId)
    const findings = await radiologistFindingRepository.getFindingsByReportId(supabase, clinicId, reportId)
    return { report, findings }
  },

  async saveDraftReport(
    supabase: SupabaseClient,
    clinicId: string,
    reportId: string | null,
    studyId: string,
    radiologistId: string,
    findingsPayload: Omit<RadiologistFindingRow, 'id' | 'clinic_id' | 'radiology_report_id' | 'created_at' | 'updated_at' | 'deleted_at'>
  ) {
    let report: RadiologyReportRow

    // 1. Create or get Draft Report
    if (reportId) {
      report = await radiologyReportRepository.getReportById(supabase, clinicId, reportId)
      if (report.status === 'Approved') throw new Error('Cannot edit an approved report.')
    } else {
      report = await radiologyReportRepository.createReport(supabase, {
        clinic_id: clinicId,
        imaging_study_id: studyId,
        radiologist_id: radiologistId,
        version_number: 1,
        status: 'Draft'
      })
    }

    // 2. Save findings
    const findings = await radiologistFindingRepository.upsertFindings(supabase, {
      ...findingsPayload,
      clinic_id: clinicId,
      radiology_report_id: report.id
    })

    return { report, findings }
  },

  async uploadReportPdf(supabase: SupabaseClient, clinicId: string, reportId: string, file: File) {
    const storagePath = `${clinicId}/reports/${reportId}_${Date.now()}.pdf`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('radiology_reports')
      .upload(storagePath, file, { contentType: 'application/pdf', upsert: false })

    if (uploadError) throw new Error(`PDF Upload Error: ${uploadError.message}`)
    return uploadData.path
  },

  async approveReport(
    supabase: SupabaseClient,
    clinicId: string,
    reportId: string,
    pdfFile: File,
    digitalSignatureId: string,
    patientId: string,
    doctorId: string
  ) {
    // 1. Check if report is already approved
    const report = await radiologyReportRepository.getReportById(supabase, clinicId, reportId)
    if (report.status === 'Approved') throw new Error('Report is already approved.')

    // 2. Upload PDF
    const pdfStoragePath = await this.uploadReportPdf(supabase, clinicId, reportId, pdfFile)

    // 3. Get findings to check if critical
    const findings = await radiologistFindingRepository.getFindingsByReportId(supabase, clinicId, reportId)
    const isCritical = findings?.is_critical_finding || false

    // 4. Execute Transactional Approval via RPC
    await radiologyReportRepository.approveReportTransaction(
      supabase,
      reportId,
      pdfStoragePath,
      digitalSignatureId,
      isCritical,
      patientId,
      doctorId
    )

    return true
  },

  async createAddendum(
    supabase: SupabaseClient,
    clinicId: string,
    studyId: string,
    radiologistId: string
  ) {
    // 1. Get the latest report version
    const existingReports = await radiologyReportRepository.getReportsByStudyId(supabase, clinicId, studyId)
    if (existingReports.length === 0) throw new Error('No approved report found to addendum.')

    const latest = existingReports[0]
    if (latest.status !== 'Approved') throw new Error('Latest report must be approved to create an addendum.')

    // 2. Create a new draft with incremented version
    const newReport = await radiologyReportRepository.createReport(supabase, {
      clinic_id: clinicId,
      imaging_study_id: studyId,
      radiologist_id: radiologistId,
      version_number: latest.version_number + 1,
      status: 'Draft'
    })

    // 3. Copy old findings to the new draft
    const oldFindings = await radiologistFindingRepository.getFindingsByReportId(supabase, clinicId, latest.id)
    if (oldFindings) {
      await radiologistFindingRepository.upsertFindings(supabase, {
        clinic_id: clinicId,
        radiology_report_id: newReport.id,
        clinical_history: oldFindings.clinical_history,
        technique: oldFindings.technique,
        findings: oldFindings.findings,
        impression: oldFindings.impression,
        recommendations: oldFindings.recommendations,
        is_critical_finding: oldFindings.is_critical_finding,
        follow_up_recommendation: oldFindings.follow_up_recommendation
      })
    }

    return newReport
  }
}
