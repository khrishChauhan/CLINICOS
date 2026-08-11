import React from 'react'
import VisitWorkspace from '@/components/emr/VisitWorkspace'
import { getVisitAction } from '@/actions/emr/visitActions'
import { redirect } from 'next/navigation'

export default async function EMRVisitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: visitId } = await params
  const res = await getVisitAction(visitId)

  if (!res.success || !res.data) {
    redirect('/emr')
  }

  return (
    <main className="flex-1 w-full bg-slate-50 min-h-screen">
      <VisitWorkspace visitId={visitId} />
    </main>
  )
}
