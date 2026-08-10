import React from 'react'
import { getActiveAdmissionsAction } from '@/actions/ipd/ipdActions'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { NursingClient } from './NursingClient'
import dayjs from 'dayjs'
import { createClient } from '@/lib/supabase/server'
import { IPDRepository } from '@/repositories/ipd/ipdRepository'

export default async function NursingStationPage() {
  const admRes = await getActiveAdmissionsAction()
  if (!admRes.ok) return <div className="p-8 text-red-500">Error: {admRes.error}</div>
  
  const admissions = admRes.data?.filter((adm: any) => adm.status === 'Admitted' || adm.status === 'Discharge Requested') || []

  // Pre-fetch vitals for the first active admission (or we can just fetch all or pass them to client)
  // For simplicity, we'll fetch vitals for all these active admissions
  const supabase = await createClient()
  const repo = new IPDRepository(supabase)
  
  const admissionsWithVitals = await Promise.all(
    admissions.map(async (adm: any) => {
      const { data: vitals } = await repo.getVitalsByAdmission(adm.id)
      return { ...adm, vitals: vitals || [] }
    })
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Nursing Station</h1>
          <p className="text-sm text-slate-500 mt-1">Record vitals and administer inpatient medications</p>
        </div>
      </div>

      <div className="space-y-4">
        {admissionsWithVitals.length === 0 ? (
          <Card className="p-12 text-center text-slate-500">
            No admitted patients currently.
          </Card>
        ) : (
          admissionsWithVitals.map((adm: any) => (
            <NursingClient key={adm.id} admission={adm} />
          ))
        )}
      </div>
    </div>
  )
}
