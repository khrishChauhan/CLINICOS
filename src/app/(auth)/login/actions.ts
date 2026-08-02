'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    if (error.message.includes('fetch failed')) {
      return { error: 'Unable to connect to authentication server. Please check your internet connection or restart your dev server.' }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
