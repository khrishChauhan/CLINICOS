import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { labReportService } from '@/services/laboratory/labOperationsService'
import ReportViewerClient from './ReportViewerClient'
import { notFound } from 'next/navigation'

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <div className="p-6 text-red-600">Unauthorized</div>

  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) return <div className="p-6 text-red-600">Clinic not found</div>

  let report: any = null
  try {
    report = await labReportService.getReportById(supabase, profile.clinic_id, params.id)
  } catch {
    notFound()
  }

  return <ReportViewerClient report={report} currentUserId={user.id} />
}
