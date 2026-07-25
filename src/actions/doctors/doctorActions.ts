'use server'

import { createClient } from '@/lib/supabase/server'
import { doctorProfileService } from '@/services/doctors/doctorProfileService'
import { doctorQualificationRepository } from '@/repositories/doctors/doctorQualificationRepository'
import { doctorRegistrationRepository } from '@/repositories/doctors/doctorRegistrationRepository'
import { doctorSpecializationRepository } from '@/repositories/doctors/doctorSpecializationRepository'
import { doctorDepartmentRepository } from '@/repositories/doctors/doctorDepartmentRepository'

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) throw new Error('Clinic context missing')
  
  return { supabase, user, clinicId: profile.clinic_id }
}

export async function getDoctorsAction() {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorProfileService.getAllDoctors(supabase, clinicId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createDoctorAction(payload: any) {
  try {
    const { supabase, user, clinicId } = await getAuthContext()
    const data = await doctorProfileService.registerDoctor(supabase, clinicId, payload, user.id)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Qualifications
export async function getDoctorQualificationsAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorQualificationRepository.getQualificationsByDoctor(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addDoctorQualificationAction(payload: any) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorQualificationRepository.createQualification(supabase, { ...payload, clinic_id: clinicId })
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Registrations
export async function getDoctorRegistrationsAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorRegistrationRepository.getRegistrationsByDoctor(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addDoctorRegistrationAction(payload: any) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorRegistrationRepository.createRegistration(supabase, { ...payload, clinic_id: clinicId })
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Specializations
export async function getDoctorSpecializationsAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorSpecializationRepository.getSpecializationsByDoctor(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addDoctorSpecializationAction(payload: any) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorSpecializationRepository.createSpecialization(supabase, { ...payload, clinic_id: clinicId })
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Departments
export async function getDoctorDepartmentsAction(doctorId: string) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorDepartmentRepository.getDepartmentsByDoctor(supabase, clinicId, doctorId)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function assignDoctorDepartmentAction(payload: any) {
  try {
    const { supabase, clinicId } = await getAuthContext()
    const data = await doctorDepartmentRepository.createDepartment(supabase, { ...payload, clinic_id: clinicId })
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
