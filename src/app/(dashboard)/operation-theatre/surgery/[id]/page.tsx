import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { OTRepository } from '@/repositories/ot/otRepository'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import dayjs from 'dayjs'
import { OTSurgeryDetailsClient } from './OTSurgeryDetailsClient'

export default async function OTSurgeryDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const repo = new OTRepository(supabase)
  
  const [surgRes, notesRes, consRes] = await Promise.all([
    repo.getSurgeryById(params.id),
    repo.getNotes(params.id),
    repo.getConsumables(params.id)
  ])

  if (surgRes.error) {
    return <div className="p-8 text-red-500">Error loading surgery: {surgRes.error.message}</div>
  }

  const surgery = surgRes.data
  const notes = notesRes.data || []
  const consumables = consRes.data || []

  // Get medicines for dropdown
  const { data: medicines } = await supabase.from('medicines').select('*').order('brand_name')

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                {surgery.patient?.first_name} {surgery.patient?.last_name}
              </h1>
              <Badge variant={surgery.status === 'Completed' ? 'success' : 'default'}>{surgery.status}</Badge>
            </div>
            <p className="text-lg text-slate-600 font-semibold mt-1">{surgery.procedure_name}</p>
            <div className="text-sm text-slate-500 mt-2 grid grid-cols-2 gap-x-8 gap-y-1">
              <p>Room: {surgery.room?.name}</p>
              <p>Surgeon: Dr. {surgery.lead_surgeon?.last_name}</p>
              <p>Time: {dayjs(surgery.scheduled_start_time).format('DD MMM YYYY, HH:mm')}</p>
              <p>Diagnosis: {surgery.diagnosis || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <OTSurgeryDetailsClient 
        surgery={surgery} 
        initialNotes={notes} 
        initialConsumables={consumables} 
        medicines={medicines || []} 
      />
      
    </div>
  )
}
