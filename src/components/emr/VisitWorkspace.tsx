'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getVisitAction, updateVisitAction, completeVisitAction } from '@/actions/emr/visitActions'
import VitalsPanel from './VitalsPanel'
import ChiefComplaintsPanel from './ChiefComplaintsPanel'
import SoapNotesPanel from './SoapNotesPanel'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { VisitRow } from '@/types/emr'

type Tab = 'complaints' | 'vitals' | 'soap' | 'summary'

interface VisitWorkspaceProps {
  visitId: string
  onComplete?: (visit: VisitRow) => void
}

export default function VisitWorkspace({ visitId, onComplete }: VisitWorkspaceProps) {
  const [visit, setVisit] = useState<VisitRow | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('complaints')
  const [completing, setCompleting] = useState(false)
  const [notes, setNotes] = useState('')
  const [provDiag, setProvDiag] = useState('')
  const [followupRequired, setFollowupRequired] = useState(false)
  const [followupDate, setFollowupDate] = useState('')

  const loadVisit = useCallback(async () => {
    const res = await getVisitAction(visitId)
    if (res.success && res.data) {
      setVisit(res.data)
      setNotes(res.data.notes || '')
      setProvDiag(res.data.provisional_diagnosis || '')
      setFollowupRequired(res.data.followup_required)
      setFollowupDate(res.data.followup_date || '')
    }
  }, [visitId])

  useEffect(() => { loadVisit() }, [loadVisit])

  const handleComplete = async () => {
    if (!confirm('Mark this consultation as Complete? The linked appointment will also be updated.')) return
    setCompleting(true)
    const res = await completeVisitAction(visitId, {
      provisional_diagnosis: provDiag || undefined,
      notes: notes || undefined,
      followup_required: followupRequired,
      followup_date: followupDate || undefined
    })
    if (res.success && res.data) {
      setVisit(res.data)
      onComplete?.(res.data)
    }
    setCompleting(false)
  }

  const handleSaveSummary = async () => {
    await updateVisitAction(visitId, {
      provisional_diagnosis: provDiag || undefined,
      notes: notes || undefined,
      followup_required: followupRequired,
      followup_date: followupDate || undefined
    })
  }

  if (!visit) return <div className="p-6 text-center text-slate-400 animate-pulse">Loading consultation...</div>

  const isCompleted = visit.consultation_status === 'Completed'

  const TABS: { id: Tab; label: string }[] = [
    { id: 'complaints', label: 'Chief Complaints' },
    { id: 'vitals', label: 'Vitals' },
    { id: 'soap', label: 'SOAP Notes' },
    { id: 'summary', label: 'Summary & Diagnosis' },
  ]

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      {/* Visit Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-sm">{visit.visit_number}</span>
            <Badge variant={isCompleted ? 'success' : 'info'}>{visit.consultation_status}</Badge>
          </div>
          <div className="text-xs text-slate-500">
            Visit Date: {visit.visit_date} · Type: {visit.visit_type}
            {visit.consultation_start_time && ` · Started: ${new Date(visit.consultation_start_time).toLocaleTimeString()}`}
          </div>
        </div>
        {!isCompleted && (
          <Button onClick={handleComplete} disabled={completing} className="bg-green-600 hover:bg-green-700 text-white">
            {completing ? 'Completing...' : '✓ Complete Consultation'}
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-slate-200 mb-5 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-2 px-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === t.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'complaints' && <ChiefComplaintsPanel visitId={visitId} />}
        {activeTab === 'vitals' && <VitalsPanel visitId={visitId} />}
        {activeTab === 'soap' && <SoapNotesPanel visitId={visitId} />}
        {activeTab === 'summary' && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Provisional Diagnosis</label>
              <textarea
                rows={3}
                value={provDiag}
                onChange={e => setProvDiag(e.target.value)}
                disabled={isCompleted}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-500 resize-y bg-white disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter provisional diagnosis..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Consultation Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                disabled={isCompleted}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-500 resize-y bg-white disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="General notes..."
              />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={followupRequired}
                  onChange={e => setFollowupRequired(e.target.checked)}
                  disabled={isCompleted}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm font-semibold text-slate-700">Follow-up Required</span>
              </label>
              {followupRequired && (
                <input
                  type="date"
                  value={followupDate}
                  onChange={e => setFollowupDate(e.target.value)}
                  disabled={isCompleted}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              )}
            </div>
            {!isCompleted && (
              <Button variant="outline" onClick={handleSaveSummary}>Save Summary</Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
