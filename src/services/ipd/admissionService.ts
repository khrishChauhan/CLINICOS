import { createClient } from '@/lib/supabase/server'
import { IPDRepository } from '@/repositories/ipd/ipdRepository'
import { Admission, BedAllocation } from '@/types/ipd'

export class AdmissionService {
  private repo: IPDRepository

  constructor(supabase: any) {
    this.repo = new IPDRepository(supabase)
  }

  static async create() {
    const supabase = await createClient()
    return new AdmissionService(supabase)
  }

  // --- Wards & Beds ---
  async getWardsMatrix() {
    const { data: wards, error } = await this.repo.getWards()
    if (error) throw new Error(`Failed to fetch wards: ${error.message}`)
    return wards
  }

  // --- Admissions ---
  async requestAdmission(data: Partial<Admission>) {
    const { data: admission, error } = await this.repo.createAdmission({
      ...data,
      status: 'Requested'
    })
    if (error) throw new Error(`Failed to request admission: ${error.message}`)
    return admission
  }

  async getActiveAdmissions() {
    const { data: admissions, error } = await this.repo.getActiveAdmissions()
    if (error) throw new Error(`Failed to fetch active admissions: ${error.message}`)
    return admissions
  }

  // --- Bed Allocation & Transfer (Atomic concurrency) ---
  async allocateBed(admissionId: string, bedId: string, assignedBy: string) {
    // 1. Mark bed as occupied
    const { error: bedError } = await this.repo.updateBedStatus(bedId, 'Occupied')
    if (bedError) throw new Error(`Failed to lock bed: ${bedError.message}`)

    // 2. Create allocation record (Will fail at DB level if bed is already actively allocated due to unique index)
    const { data: allocation, error: allocError } = await this.repo.allocateBed({
      admission_id: admissionId,
      bed_id: bedId,
      assigned_by: assignedBy,
      start_time: new Date().toISOString()
    })
    
    if (allocError) {
      // Rollback bed status on conflict
      await this.repo.updateBedStatus(bedId, 'Available')
      throw new Error(`Bed allocation failed due to concurrency conflict: ${allocError.message}`)
    }

    // 3. Update Admission status
    const { error: admError } = await this.repo.updateAdmission(admissionId, { status: 'Admitted' })
    if (admError) throw new Error(`Failed to update admission status: ${admError.message}`)

    return allocation
  }

  async transferBed(admissionId: string, oldBedId: string, newBedId: string, assignedBy: string, currentAllocationId: string) {
    // 1. End old allocation
    const now = new Date().toISOString()
    const { error: endError } = await this.repo.endBedAllocation(currentAllocationId, now)
    if (endError) throw new Error(`Failed to end current allocation: ${endError.message}`)

    // 2. Set old bed to cleaning
    await this.repo.updateBedStatus(oldBedId, 'Cleaning')

    // 3. Allocate new bed
    return this.allocateBed(admissionId, newBedId, assignedBy)
  }
}
