'use client'

import React, { useState } from 'react'
import { createFollowUpAction } from '@/actions/appointments/createFollowUpAction'
import { X, AlertCircle } from 'lucide-react'

interface Props {
  parentAppointmentId: string
  patientId: string
  doctorId: string
  onClose: () => void
  onSuccess: () => void
}

export default function FollowUpCreationDialog({ parentAppointmentId, patientId, doctorId, onClose, onSuccess }: Props) {
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !reason) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setError(null)
    
    const res = await createFollowUpAction(parentAppointmentId, patientId, doctorId, date, reason)
    if (res.success) {
      onSuccess()
    } else {
      setError(res.error || 'Failed to create follow-up')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Schedule Follow-up</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              {error}
            </div>
          )}
          <form id="followup-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Follow-up Date *</label>
              <input 
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Reason / Notes *</label>
              <textarea 
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Check test results"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none h-24 resize-none"
                required
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="followup-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Create Follow-up'}
          </button>
        </div>
      </div>
    </div>
  )
}
