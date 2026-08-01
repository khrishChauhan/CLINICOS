import type { SupabaseClient } from '@supabase/supabase-js'
import type { RadiologyReportRow } from '@/types/radiology'

export const radiologyReportRepository = {
  async getReportsByClinic(supabase: SupabaseClient, clinicId: string) {
    const { data, error } = await supabase
      .from('radiology_reports')
      .select(`
        *,
        study:imaging_studies(
          accession_number,
          modality,
          study_description,
          patient:patients(first_name, last_name, gender)
        ),
        radiologist:users!radiologist_id(first_name, last_name)
      `)
      .eq('clinic_id', clinicId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  async getReportById(supabase: SupabaseClient, clinicId: string, reportId: string) {
    const { data, error } = await supabase
      .from('radiology_reports')
      .select(`
        *,
        study:imaging_studies(
          *,
          patient:patients(first_name, last_name, date_of_birth, gender),
          order:radiology_order_items(id, radiology_order_id)
        ),
        radiologist:users!radiologist_id(first_name, last_name)
      `)
      .eq('clinic_id', clinicId)
      .eq('id', reportId)
      .is('deleted_at', null)
      .single()

    if (error) throw new Error(error.message)
    return data as RadiologyReportRow
  },

  async getReportsByStudyId(supabase: SupabaseClient, clinicId: string, studyId: string) {
    const { data, error } = await supabase
      .from('radiology_reports')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('imaging_study_id', studyId)
      .is('deleted_at', null)
      .order('version_number', { ascending: false })

    if (error) throw new Error(error.message)
    return data as RadiologyReportRow[]
  },

  async createReport(
    supabase: SupabaseClient,
    payload: Omit<RadiologyReportRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'report_number' | 'study' | 'radiologist'>
  ) {
    const { data, error } = await supabase
      .from('radiology_reports')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as RadiologyReportRow
  },

  async approveReportTransaction(
    supabase: SupabaseClient,
    reportId: string,
    pdfStoragePath: string,
    digitalSignatureId: string,
    isCritical: boolean,
    patientId: string,
    doctorId: string
  ) {
    const { error } = await supabase.rpc('approve_radiology_report', {
      p_report_id: reportId,
      p_pdf_storage_path: pdfStoragePath,
      p_digital_signature_id: digitalSignatureId,
      p_is_critical: isCritical,
      p_patient_id: patientId,
      p_doctor_id: doctorId
    })

    if (error) throw new Error(error.message)
    return true
  }
}
