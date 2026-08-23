'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Stethoscope, Calendar, User } from 'lucide-react'

interface EncounterCardProps {
  visitNumber: string
  visitDate: string
  doctorName: string | null
  consultationStatus: string
  provisionalDiagnosis: string | null
  notes: string | null
  chiefComplaints: string | null
  followupDate: string | null
}

export default function EncounterCard({
  visitNumber,
  visitDate,
  doctorName,
  consultationStatus,
  provisionalDiagnosis,
  notes,
  chiefComplaints,
  followupDate,
}: EncounterCardProps) {
  const [expanded, setExpanded] = useState(false)

  const statusColor =
    consultationStatus === 'Completed'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : consultationStatus === 'In Progress'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-slate-100 text-slate-500 border-slate-200'

  const summary = provisionalDiagnosis || chiefComplaints || notes

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-slate-300 transition">
      {/* Header row */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">Visit #{visitNumber}</span>
              <span className={`text-[10px] font-bold uppercase border px-1.5 py-0.5 rounded ${statusColor}`}>
                {consultationStatus}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              {doctorName && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {doctorName}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {!expanded && summary && (
            <p className="text-xs text-slate-400 italic max-w-[200px] truncate hidden sm:block">{summary}</p>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50/50">
          {provisionalDiagnosis && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Diagnosis</p>
              <p className="text-sm text-slate-700 font-medium">{provisionalDiagnosis}</p>
            </div>
          )}
          {chiefComplaints && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Chief Complaints</p>
              <p className="text-sm text-slate-600">{chiefComplaints}</p>
            </div>
          )}
          {notes && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Clinical Notes</p>
              <p className="text-sm text-slate-600">{notes}</p>
            </div>
          )}
          {followupDate && (
            <div className="pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                Follow-up scheduled: {new Date(followupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          )}
          {!summary && !followupDate && (
            <p className="text-sm text-slate-400 italic">No summary recorded for this visit.</p>
          )}
        </div>
      )}
    </div>
  )
}
