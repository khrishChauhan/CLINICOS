import type { SupabaseClient } from '@supabase/supabase-js'

export const masterRepository = {
  async getAll<T>(supabase: SupabaseClient, table: string): Promise<T[]> {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false })
    if (error) throw new Error(`Failed to fetch ${table}: ${error.message}`)
    return data as T[]
  },

  async getById<T>(supabase: SupabaseClient, table: string, id: string): Promise<T> {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
    if (error) throw new Error(`Failed to fetch ${table}: ${error.message}`)
    return data as T
  },

  async create<T>(supabase: SupabaseClient, table: string, payload: Partial<T>): Promise<T> {
    const { data, error } = await supabase.from(table).insert([payload as any]).select().single()
    if (error) throw new Error(`Failed to create ${table}: ${error.message}`)
    return data as T
  },

  async update<T>(supabase: SupabaseClient, table: string, id: string, payload: Partial<T>): Promise<T> {
    const { data, error } = await supabase.from(table).update(payload as any).eq('id', id).select().single()
    if (error) throw new Error(`Failed to update ${table}: ${error.message}`)
    return data as T
  },

  async delete(supabase: SupabaseClient, table: string, id: string): Promise<void> {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw new Error(`Failed to delete ${table}: ${error.message}`)
  },

  async getByFilter<T>(supabase: SupabaseClient, table: string, filters: Record<string, any>): Promise<T[]> {
    let query = supabase.from(table).select('*')
    Object.entries(filters).forEach(([key, val]) => {
      query = query.eq(key, val)
    })
    const { data, error } = await query
    if (error) throw new Error(`Failed to filter ${table}: ${error.message}`)
    return data as T[]
  }
}
