import type { SupabaseClient } from '@supabase/supabase-js'
import { tokenRepository } from '@/repositories/appointments/tokenRepository'

export const tokenService = {
  async generateTokenForClinic(supabase: SupabaseClient, clinicId: string, appointmentId: string | null, doctorId: string | null) {
    // 1. Get today's tokens for the clinic to find the next number
    const today = new Date().toISOString()
    const dailyTokens = await tokenRepository.getDailyTokensForClinic(supabase, clinicId, today)
    
    // 2. Determine next sequence
    const nextSeq = dailyTokens.length + 1
    const tokenNumber = `T-${nextSeq.toString().padStart(3, '0')}`
    
    // 3. Create the token
    const token = await tokenRepository.createToken(supabase, {
      clinic_id: clinicId,
      token_number: tokenNumber,
      appointment_id: appointmentId,
      doctor_id: doctorId,
      generated_time: new Date().toISOString(),
      display_number: tokenNumber,
      token_status: 'Waiting',
      served_time: null,
      remarks: null
    })
    
    return token
  },

  async updateTokenStatus(supabase: SupabaseClient, tokenId: string, status: 'Waiting' | 'Called' | 'In Consultation' | 'Completed' | 'Skipped' | 'Cancelled') {
    return await tokenRepository.updateTokenStatus(supabase, tokenId, status)
  }
}
