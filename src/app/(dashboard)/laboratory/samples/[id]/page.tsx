import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { labSampleService } from '@/services/laboratory/labSampleService'
import SampleDetailsClient from './SampleDetailsClient'

export default async function SampleDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <div>Unauthorized</div>

  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) return <div>Clinic ID not found</div>

  let sample: any = null
  let errorMsg = null

  try {
    sample = await labSampleService.getSampleById(supabase, profile.clinic_id, params.id)
  } catch (e: any) {
    errorMsg = e.message
  }

  if (errorMsg || !sample) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">Error: {errorMsg || 'Sample not found'}</div>
      </div>
    )
  }

  return <SampleDetailsClient sample={sample} />
}
