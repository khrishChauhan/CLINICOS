'use client'

import React, { useState } from 'react'
import { registerWalkInAction } from '@/actions/appointments/walkInActions'
import { X, AlertCircle, CheckCircle } from 'lucide-react'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function WalkInRegistrationModal({ onClose, onSuccess }: Props) {
  const [doctorId, setDoctorId] = useState('')
  const [patientId, setPatientId] = useState('')
  const [priority, setPriority] = useState<'Normal' | 'Emergency' | 'VIP'>('Normal')
  const [reason, setReason] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientId || !reason) {
      setError("Please fill all required fields.")
      return
    }

    setLoading(true)
    setError(null)
    
    const res = await registerWalkInAction(
      patientId,
      doctorId || null,
      priority,
      reason
    )
    
    if (res.success) {
      onSuccess()
    } else {
      setError(res.error || 'Failed to register walk-in')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Walk-In Registration</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form id="walkin-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Patient ID (UUID) *</label>
                <input 
                  type="text" 
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  placeholder="e.g. 123e4567-..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Doctor ID (Optional)</label>
                <input 
                  type="text" 
                  value={doctorId}
                  onChange={e => setDoctorId(e.target.value)}
                  placeholder="Leave blank for any available doctor"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
                <select 
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                >
                  <option value="Normal">Normal</option>
                  <option value="VIP">VIP</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Reason for Visit *</label>
                <textarea 
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g. Fever and cough"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none h-24 resize-none"
                  required
                />
              </div>
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
            form="walkin-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register & Join Queue'}
          </button>
        </div>

      </div>
    </div>
  )
}
