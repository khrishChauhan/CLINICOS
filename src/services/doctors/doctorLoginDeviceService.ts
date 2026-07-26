import type { SupabaseClient } from '@supabase/supabase-js'
import { doctorLoginDeviceRepository } from '@/repositories/doctors/doctorLoginDeviceRepository'

export const doctorLoginDeviceService = {
  async trackDevice(supabase: SupabaseClient, clinicId: string, doctorId: string, userAgent: string, ip: string) {
    // Basic parser for User-Agent (In production, use a lib like `ua-parser-js`)
    const browserMatch = userAgent.match(/(firefox|msie|chrome|safari|trident)/i)
    const browser = browserMatch ? browserMatch[1] : 'Unknown Browser'
    
    const osMatch = userAgent.match(/(windows|macintosh|linux|android|iphone)/i)
    const os = osMatch ? osMatch[1] : 'Unknown OS'

    return await doctorLoginDeviceRepository.upsertDevice(supabase, {
      clinic_id: clinicId,
      doctor_id: doctorId,
      device_name: `${os} Device`,
      operating_system: os,
      browser,
      ip_address: ip,
      trusted_device: true // Default to true when successfully tracking from an authenticated context
    })
  },

  async revokeDevice(supabase: SupabaseClient, deviceId: string) {
    return await doctorLoginDeviceRepository.revokeDevice(supabase, deviceId)
  }
}
