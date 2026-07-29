import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { labTestService } from '@/services/laboratory/labTestService'
import TestProcessingClient from './TestProcessingClient'
import { notFound } from 'next/navigation'

export default async function TestDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <div className="p-6 text-red-600">Unauthorized</div>

  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) return <div className="p-6 text-red-600">Clinic not found</div>

  let test: any = null
  try {
    test = await labTestService.getLabTestById(supabase, profile.clinic_id, params.id)
  } catch {
    notFound()
  }

  return <TestProcessingClient test={test} currentUserId={user.id} />
}
