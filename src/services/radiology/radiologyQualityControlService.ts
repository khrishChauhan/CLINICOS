import type { SupabaseClient } from '@supabase/supabase-js'
import { radiologyQualityControlRepository } from '@/repositories/radiology/radiologyQualityControlRepository'
import { radiologyEquipmentRepository } from '@/repositories/radiology/radiologyEquipmentRepository'
import type { RadiologyQualityControlRow } from '@/types/radiology'

export const radiologyQualityControlService = {
  async getQualityControls(supabase: SupabaseClient, clinicId: string) {
    return radiologyQualityControlRepository.getQualityControls(supabase, clinicId)
  },

  async recordQualityControl(
    supabase: SupabaseClient,
    clinicId: string,
    payload: Omit<RadiologyQualityControlRow, 'id' | 'clinic_id' | 'created_at' | 'equipment' | 'technician'>
  ) {
    // 1. Record the immutable QC log
    const qcRecord = await radiologyQualityControlRepository.recordQualityControl(supabase, {
      ...payload,
      clinic_id: clinicId
    })

    // 2. If QC is 'Calibration' and 'Pass', we can auto-update the equipment calibration date
    if (payload.qc_type === 'Calibration' && payload.result === 'Pass') {
      // Calculate next calibration due (e.g. 1 year from now)
      const nextYear = new Date()
      nextYear.setFullYear(nextYear.getFullYear() + 1)
      
      await radiologyEquipmentRepository.updateEquipment(supabase, clinicId, payload.equipment_id, {
        calibration_due: nextYear.toISOString().split('T')[0],
        status: 'Active'
      })
    }

    return qcRecord
  }
}
