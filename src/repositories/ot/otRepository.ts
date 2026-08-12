import { SupabaseClient } from '@supabase/supabase-js'
import { OTRoom, Surgery, OTTeamMember, OTChecklist, OTNote, OTConsumable, SurgeryStatus } from '@/types/ot'

export class OTRepository {
  constructor(private supabase: SupabaseClient) {}

  // --- Rooms ---
  async getRooms() {
    return this.supabase
      .from('rooms')
      .select('*')
      .order('name')
  }

  // --- Surgeries ---
  async getSurgeries(date?: string) {
    let query = this.supabase
      .from('surgeries')
      .select(`
        *,
        patient:patients(id, first_name, last_name, gender, date_of_birth),
        room:rooms(*),
        lead_surgeon:users!lead_surgeon_id(id, username, email),
        anesthetist:users!anesthetist_id(id, username, email),
        checklists:checklists(*)
      `)
      .order('scheduled_start_time', { ascending: true })

    if (date) {
      const start = new Date(date)
      start.setHours(0, 0, 0, 0)
      const end = new Date(date)
      end.setHours(23, 59, 59, 999)
      query = query.gte('scheduled_start_time', start.toISOString()).lte('scheduled_start_time', end.toISOString())
    }

    return query
  }

  async getSurgeryById(id: string) {
    return this.supabase
      .from('surgeries')
      .select(`
        *,
        patient:patients(*),
        room:rooms(*),
        lead_surgeon:users!lead_surgeon_id(id, username, email),
        anesthetist:users!anesthetist_id(id, username, email),
        checklists:checklists(*)
      `)
      .eq('id', id)
      .single()
  }

  async scheduleSurgery(data: Partial<Surgery>) {
    return this.supabase
      .from('surgeries')
      .insert(data)
      .select()
      .single()
  }

  async updateSurgeryStatus(id: string, status: SurgeryStatus, additionalUpdates: any = {}) {
    return this.supabase
      .from('surgeries')
      .update({ status, ...additionalUpdates })
      .eq('id', id)
      .select()
      .single()
  }

  // --- Checklists ---
  async upsertChecklist(data: Partial<OTChecklist>) {
    return this.supabase
      .from('checklists')
      .upsert(data, { onConflict: 'surgery_id' })
      .select()
      .single()
  }

  // --- Team ---
  async addTeamMember(data: Partial<OTTeamMember>) {
    return this.supabase
      .from('team_members')
      .insert(data)
      .select()
  }

  async getTeamMembers(surgeryId: string) {
    return this.supabase
      .from('team_members')
      .select('*, user:users(username, email)')
      .eq('surgery_id', surgeryId)
  }

  // --- Notes ---
  async addNote(data: Partial<OTNote>) {
    return this.supabase
      .from('notes')
      .insert(data)
      .select()
      .single()
  }

  async getNotes(surgeryId: string) {
    return this.supabase
      .from('notes')
      .select('*, recorder:users!recorded_by(username, email)')
      .eq('surgery_id', surgeryId)
      .order('recorded_at', { ascending: false })
  }

  // --- Consumables ---
  async addConsumable(data: Partial<OTConsumable>) {
    return this.supabase
      .from('consumables')
      .insert(data)
      .select()
      .single()
  }

  async getConsumables(surgeryId: string) {
    return this.supabase
      .from('consumables')
      .select('*, medicine:medicines(*)')
      .eq('surgery_id', surgeryId)
      .order('recorded_at', { ascending: false })
  }

  async markConsumablesAsBilled(surgeryId: string) {
    return this.supabase
      .from('consumables')
      .update({ is_billed: true })
      .eq('surgery_id', surgeryId)
      .eq('is_billed', false)
  }
}
