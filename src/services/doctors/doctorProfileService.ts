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

    // 2. Create User record if missing (needed for OT, appointments, etc. which reference public.users)
    let finalUserId = payload.user_id
    if (!finalUserId) {
      const { data: roleData } = await supabase.from('roles').select('id').eq('role_name', 'Doctor').single()
      if (roleData) {
        const dummyUsername = `dr.${payload.first_name?.toLowerCase().replace(/\s+/g, '') || 'doc'}.${payload.last_name?.toLowerCase().replace(/\s+/g, '') || Date.now()}`
        const newUserId = crypto.randomUUID()
        const { error: userError } = await supabase.from('users').insert({
          id: newUserId,
          clinic_id: clinicId,
          role_id: roleData.id,
          username: dummyUsername,
          email: payload.email || `${dummyUsername}@clinic.local`,
          mobile: payload.mobile_number || null,
          status: 'Active'
        })
        
        if (!userError) {
          finalUserId = newUserId
        } else {
          console.error("Failed to auto-create user for doctor:", userError)
        }
      }
    }

    // 3. Insert into doctor.doctors
    const newDoc = await doctorRepository.createDoctor(supabase, {
      ...payload,
      user_id: finalUserId,
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

  async deleteDoctor(supabase: SupabaseClient, clinicId: string, doctorId: string, updaterUserId: string) {
    return await doctorRepository.deleteDoctor(supabase, clinicId, doctorId, updaterUserId)
  }
}
