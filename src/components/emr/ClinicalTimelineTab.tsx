'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getClinicalTimelineAction } from '@/actions/emr/clinicalTimelineActions'
import type { TimelineEvent } from '@/types/emr'

export default function ClinicalTimelineTab({ visitId }: { visitId: string }) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)

  const loadEvents = useCallback(async () => {
    setLoading(true)
    const res = await getClinicalTimelineAction(visitId)
    if (res.success && res.data) setEvents(res.data)
    setLoading(false)
  }, [visitId])

  useEffect(() => { loadEvents() }, [loadEvents])

  if (loading) return <div className="text-center text-slate-400 py-6 text-sm">Loading clinical timeline...</div>

  return (
    <div className="max-w-2xl">
      <h3 className="font-semibold text-slate-800 mb-6">Clinical Timeline (This Visit)</h3>
      <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
        {events.map((e, index) => (
          <div key={e.id} className="relative pl-6">
            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${index === 0 ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-slate-400'}`}></div>
            <div className="text-xs font-semibold text-slate-400 mb-1">
              {new Date(e.event_date).toLocaleString()}
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="font-semibold text-slate-800 text-sm mb-1">{e.event_type}</div>
              <div className="text-sm text-slate-600">{e.event_description}</div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="pl-6 text-sm text-slate-400">No events recorded yet.</div>
        )}
      </div>
    </div>
  )
}
