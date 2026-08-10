import { SupabaseClient } from '@supabase/supabase-js'
import { Ward, Bed, Admission, BedAllocation, NursingVital, MedicationAdministration } from '@/types/ipd'

export class IPDRepository {
  constructor(private supabase: SupabaseClient) {}

  // --- Wards & Beds ---
  async getWards() {
    return this.supabase
      .schema('ipd')
      .from('wards')
      .select('*, beds:beds(*)')
      .order('name')
  }

  async getBedsByWard(wardId: string) {
    return this.supabase
      .schema('ipd')
      .from('beds')
      .select('*')
      .eq('ward_id', wardId)
      .order('bed_number')
  }

  async updateBedStatus(bedId: string, status: string) {
    return this.supabase
      .schema('ipd')
      .from('beds')
      .update({ status })
      .eq('id', bedId)
  }

  // --- Admissions ---
  async createAdmission(data: Partial<Admission>) {
    return this.supabase
      .schema('ipd')
      .from('admissions')
      .insert(data)
      .select()
      .single()
  }

  async updateAdmission(id: string, data: Partial<Admission>) {
    return this.supabase
      .schema('ipd')
      .from('admissions')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  async getActiveAdmissions() {
    // Note: Relations across schemas (ipd -> public) require correct foreign key setups.
    // Patients and users are in public.
    return this.supabase
      .schema('ipd')
      .from('admissions')
      .select(`
        *,
        bed_allocations:bed_allocations(*, bed:beds(*, ward:wards(*)))
      `)
      .in('status', ['Requested', 'Pending Bed Assignment', 'Admitted', 'Discharge Requested'])
      .order('admission_date', { ascending: false })
  }

  async getAdmissionById(id: string) {
    return this.supabase
      .schema('ipd')
      .from('admissions')
      .select(`
        *,
        bed_allocations:bed_allocations(*, bed:beds(*, ward:wards(*)))
      `)
      .eq('id', id)
      .single()
  }

  // --- Bed Allocations ---
  async allocateBed(data: Partial<BedAllocation>) {
    return this.supabase
      .schema('ipd')
      .from('bed_allocations')
      .insert(data)
      .select()
      .single()
  }

  async endBedAllocation(allocationId: string, endTime: string) {
    return this.supabase
      .schema('ipd')
      .from('bed_allocations')
      .update({ end_time: endTime })
      .eq('id', allocationId)
  }

  async getHistoricalBedAllocations(admissionId: string) {
    return this.supabase
      .schema('ipd')
      .from('bed_allocations')
      .select('*, bed:beds(*, ward:wards(*))')
      .eq('admission_id', admissionId)
      .order('start_time', { ascending: true })
  }

  // --- Nursing Vitals ---
  async addNursingVital(data: Partial<NursingVital>) {
    return this.supabase
      .schema('ipd')
      .from('nursing_vitals')
      .insert(data)
      .select()
      .single()
  }

  async getVitalsByAdmission(admissionId: string) {
    return this.supabase
      .schema('ipd')
      .from('nursing_vitals')
      .select('*')
      .eq('admission_id', admissionId)
      .order('timestamp', { ascending: false })
  }

  // --- Medication Administration ---
  async getMedicationsByAdmission(admissionId: string) {
    return this.supabase
      .schema('ipd')
      .from('medication_administrations')
      .select('*')
      .eq('admission_id', admissionId)
      .order('scheduled_time', { ascending: true })
  }

  async addMedicationAdministration(data: Partial<MedicationAdministration>) {
    return this.supabase
      .schema('ipd')
      .from('medication_administrations')
      .insert(data)
      .select()
      .single()
  }

  async updateMedicationStatus(id: string, data: Partial<MedicationAdministration>) {
    return this.supabase
      .schema('ipd')
      .from('medication_administrations')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }
}
