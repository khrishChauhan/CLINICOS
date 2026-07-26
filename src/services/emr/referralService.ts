import type { SupabaseClient } from '@supabase/supabase-js'
import { referralRepository } from '@/repositories/emr/referralRepository'
import type { ReferralRow } from '@/types/emr'

export const referralService = {
  async getByVisit(supabase: SupabaseClient, visitId: string): Promise<ReferralRow[]> {
    return await referralRepository.getByVisit(supabase, visitId)
  },

  async add(
    supabase: SupabaseClient,
    clinicId: string,
    visitId: string,
    payload: {
      referred_doctor?: string
      referred_hospital?: string
      referral_reason: string
      referral_date?: string
    }
  ): Promise<ReferralRow> {
    if (!payload.referral_reason) throw new Error('Referral reason is required')
    if (!payload.referred_doctor && !payload.referred_hospital) {
      throw new Error('Must specify either doctor or hospital')
    }

    return await referralRepository.create(supabase, {
      clinic_id: clinicId,
      visit_id: visitId,
      referred_doctor: payload.referred_doctor || null,
      referred_hospital: payload.referred_hospital || null,
      referral_reason: payload.referral_reason,
      referral_date: payload.referral_date || new Date().toISOString().split('T')[0],
      status: 'Pending'
    })
  }
}
