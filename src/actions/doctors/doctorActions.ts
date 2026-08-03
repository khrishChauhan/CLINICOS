'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { doctorProfileService } from '@/services/doctors/doctorProfileService'
import { doctorQualificationRepository } from '@/repositories/doctors/doctorQualificationRepository'
import { doctorRegistrationRepository } from '@/repositories/doctors/doctorRegistrationRepository'
import { doctorSpecializationRepository } from '@/repositories/doctors/doctorSpecializationRepository'
import { doctorDepartmentRepository } from '@/repositories/doctors/doctorDepartmentRepository'

async function getAuthContext() {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  
  let userId = 'system'
  let clinicId: string | null = null

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userId = user.id
      const { data: profile } = await adminClient.from('users').select('clinic_id').eq('id', user.id).single()
      if (profile?.clinic_id) {
        clinicId = profile.clinic_id
      }
    }
  } catch (err) {
    // Auth cookie missing or invalid, fallback to admin client
  }

  if (!clinicId) {
    const { data: clinics } = await adminClient.from('clinics').select('id').limit(1)
    if (clinics && clinics.length > 0) {
      clinicId = clinics[0].id
    }
  }

  if (!clinicId) {
    clinicId = '00000000-0000-0000-0000-000000000000'
  }

  return { supabase, adminClient, user: { id: userId }, userId, clinicId }
}

export async function getDoctorsAction() {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    const data = await doctorProfileService.getAllDoctors(adminClient, clinicId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createDoctorAction(payload: any) {
  try {
    const { adminClient, user, clinicId } = await getAuthContext()
    const data = await doctorProfileService.registerDoctor(adminClient, clinicId, payload, user.id)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Qualifications
export async function getDoctorQualificationsAction(doctorId: string) {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    const data = await doctorQualificationRepository.getQualificationsByDoctor(adminClient, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addDoctorQualificationAction(payload: any) {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    const data = await doctorQualificationRepository.createQualification(adminClient, { ...payload, clinic_id: clinicId })
    revalidatePath(`/doctors/${payload.doctor_id}/profile`)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Registrations
export async function getDoctorRegistrationsAction(doctorId: string) {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    const data = await doctorRegistrationRepository.getRegistrationsByDoctor(adminClient, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addDoctorRegistrationAction(payload: any) {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    const data = await doctorRegistrationRepository.createRegistration(adminClient, { ...payload, clinic_id: clinicId })
    revalidatePath(`/doctors/${payload.doctor_id}/profile`)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Specializations
export async function getDoctorSpecializationsAction(doctorId: string) {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    const data = await doctorSpecializationRepository.getSpecializationsByDoctor(adminClient, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addDoctorSpecializationAction(payload: any) {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    const data = await doctorSpecializationRepository.createSpecialization(adminClient, { ...payload, clinic_id: clinicId })
    revalidatePath(`/doctors/${payload.doctor_id}/profile`)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Departments
export async function getDoctorDepartmentsAction(doctorId: string) {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    const data = await doctorDepartmentRepository.getDepartmentsByDoctor(adminClient, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function assignDoctorDepartmentAction(payload: any) {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    const data = await doctorDepartmentRepository.createDepartment(adminClient, { ...payload, clinic_id: clinicId })
    revalidatePath(`/doctors/${payload.doctor_id}/profile`)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Get Single Doctor by ID
// ─────────────────────────────────────────────────────────────────────────────

export async function getDoctorByIdAction(doctorId: string) {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    const data = await doctorProfileService.getDoctorProfile(adminClient, clinicId, doctorId)
    if (!data) return { success: false, error: 'Doctor not found' }
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Update Doctor Profile
// ─────────────────────────────────────────────────────────────────────────────

export async function updateDoctorAction(doctorId: string, payload: any) {
  try {
    const { adminClient, user } = await getAuthContext()
    const data = await doctorProfileService.updateDoctorProfile(adminClient, doctorId, payload, user.id)
    revalidatePath(`/doctors/${doctorId}/profile`)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Update Doctor Status
// ─────────────────────────────────────────────────────────────────────────────

export async function updateDoctorStatusAction(doctorId: string, status: 'Active' | 'On Leave' | 'Inactive') {
  try {
    const { adminClient, user } = await getAuthContext()
    const data = await doctorProfileService.updateDoctorProfile(adminClient, doctorId, { status }, user.id)
    revalidatePath(`/doctors/${doctorId}/profile`)
    revalidatePath('/doctors')
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete Doctor
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteDoctorAction(doctorId: string) {
  try {
    const { adminClient, clinicId } = await getAuthContext()
    await doctorProfileService.deleteDoctor(adminClient, clinicId, doctorId)
    revalidatePath('/doctors')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
