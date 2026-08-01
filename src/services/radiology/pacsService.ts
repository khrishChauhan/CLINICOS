import type { SupabaseClient } from '@supabase/supabase-js'
import { pacsIntegrationRepository } from '@/repositories/radiology/pacsIntegrationRepository'
import { MockPACSAdapter } from '@/lib/pacs/MockPACSAdapter'
import type { PACSIntegrationRow } from '@/types/radiology'

const pacsAdapter = new MockPACSAdapter() // Using Mock Adapter for now

export const pacsService = {
  async getIntegrationRecord(supabase: SupabaseClient, studyId: string) {
    return pacsIntegrationRepository.getIntegrationRecord(supabase, studyId)
  },

  async syncStudyToPACS(supabase: SupabaseClient, clinicId: string, studyId: string, studyUid: string) {
    // 1. Mark as InProgress
    let record = await pacsIntegrationRepository.upsertIntegrationRecord(supabase, {
      clinic_id: clinicId,
      imaging_study_id: studyId,
      pacs_server: 'MockPACS',
      dicom_uid: studyUid,
      transfer_status: 'InProgress',
      retry_count: 0
    })

    // 2. Delegate to Adapter
    try {
      await pacsAdapter.sendStudy(studyUid)
      const status = await pacsAdapter.queryStatus(studyUid)

      // 3. Update final status
      record = await pacsIntegrationRepository.upsertIntegrationRecord(supabase, {
        ...record,
        transfer_status: status,
        transfer_date: new Date().toISOString(),
        error_log: status === 'Failed' ? 'PACS Server rejected transfer' : undefined
      })
    } catch (e: any) {
      record = await pacsIntegrationRepository.upsertIntegrationRecord(supabase, {
        ...record,
        transfer_status: 'Failed',
        transfer_date: new Date().toISOString(),
        error_log: e.message
      })
    }

    return record
  },

  async retrySync(supabase: SupabaseClient, clinicId: string, studyId: string) {
    const record = await this.getIntegrationRecord(supabase, studyId)
    if (!record) throw new Error('Integration record not found')

    // Mark retrying
    await pacsIntegrationRepository.upsertIntegrationRecord(supabase, {
      ...record,
      transfer_status: 'InProgress',
      retry_count: record.retry_count + 1
    })

    try {
      await pacsAdapter.retryTransfer(record.dicom_uid)
      const status = await pacsAdapter.queryStatus(record.dicom_uid)

      return pacsIntegrationRepository.upsertIntegrationRecord(supabase, {
        ...record,
        transfer_status: status,
        transfer_date: new Date().toISOString(),
        retry_count: record.retry_count + 1,
        error_log: status === 'Failed' ? 'Retry failed' : undefined
      })
    } catch (e: any) {
      return pacsIntegrationRepository.upsertIntegrationRecord(supabase, {
        ...record,
        transfer_status: 'Failed',
        transfer_date: new Date().toISOString(),
        retry_count: record.retry_count + 1,
        error_log: `Retry Error: ${e.message}`
      })
    }
  }
}
