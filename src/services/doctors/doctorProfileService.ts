import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorRepository } from '@/repositories/doctors/doctorRepository'
import type { DoctorRow } from '@/types/doctors'

export const doctorProfileService = {
  async getAllDoctors(supabase: SupabaseClient, clinicId: string) {
    return await doctorRepository.getDoctors(supabase, clinicId)
  },

  async getDoctorProfile(supabase: SupabaseClient, clinicId: string, doctorId: string) {
    return await doctorRepository.getDoctorById(supabase, clinicId, doctorId)
  },

  async registerDoctor(supabase: SupabaseClient, clinicId: string, payload: Partial<DoctorRow>, creatorUserId: string) {
    // 1. Auto-generate Doctor Code if missing
    let doctorCode = payload.doctor_code
    if (!doctorCode) {
      // Collision-safe: find the highest existing numeric suffix for this clinic
      // and increment it, rather than using row-count (which breaks on deletions/conflicts).
      const docs = await doctorRepository.getDoctors(supabase, clinicId)
      let maxNum = 0
      for (const d of docs) {
        const match = d.doctor_code?.match(/(\d+)$/)
        if (match) {
          const n = parseInt(match[1], 10)
          if (n > maxNum) maxNum = n
        }
      }
      // Keep trying until we find an unused code (handles gaps from deletions)
      let candidate = maxNum + 1
      const existingCodes = new Set(docs.map((d: DoctorRow) => d.doctor_code))
      while (existingCodes.has(`DOC-${candidate.toString().padStart(3, '0')}`)) {
        candidate++
      }
      doctorCode = `DOC-${candidate.toString().padStart(3, '0')}`
    }

    // 2. Insert into doctor.doctors
    const newDoc = await doctorRepository.createDoctor(supabase, {
      ...payload,
      clinic_id: clinicId,
      doctor_code: doctorCode,
      created_by: creatorUserId,
      updated_by: creatorUserId
    })

    return newDoc
  },

  async updateDoctorProfile(supabase: SupabaseClient, doctorId: string, payload: Partial<DoctorRow>, updaterUserId: string) {
    return await doctorRepository.updateDoctor(supabase, doctorId, {
      ...payload,
      updated_by: updaterUserId
    })
  },

  async deleteDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string) {
    return await doctorRepository.deleteDoctor(supabase, clinicId, doctorId)
  }
}
