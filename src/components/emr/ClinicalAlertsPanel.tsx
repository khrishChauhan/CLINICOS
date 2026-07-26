'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getClinicalAlertsAction, createClinicalAlertAction, resolveClinicalAlertAction } from '@/actions/emr/clinicalAlertActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { ClinicalAlertRow } from '@/types/emr'

export default function ClinicalAlertsPanel({ patientId, visitId }: { patientId: string; visitId: string }) {
  const [alerts, setAlerts] = useState<ClinicalAlertRow[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const [type, setType] = useState('Allergy Alert')
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<'High' | 'Medium' | 'Low'>('High')

  const loadAlerts = useCallback(async () => {
    setLoading(true)
    const res = await getClinicalAlertsAction(patientId)
    if (res.success && res.data) setAlerts(res.data)
    setLoading(false)
  }, [patientId])

  useEffect(() => { loadAlerts() }, [loadAlerts])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setAdding(true)
    const res = await createClinicalAlertAction(patientId, visitId, { alert_type: type, alert_message: message, severity })
    if (res.success && res.data) {
      setAlerts([res.data!, ...alerts])
      setMessage('')
      // refresh banner optionally (would need a context or global state, simple reload for now)
    }
    setAdding(false)
  }

  const handleResolve = async (id: string) => {
    const res = await resolveClinicalAlertAction(id)
    if (res.success) {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a))
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-amber-50 p-4 rounded-xl border border-amber-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-amber-800 mb-1">Alert Type</label>
          <select className="w-full border border-amber-300 rounded-lg p-2 text-sm outline-none" value={type} onChange={e => setType(e.target.value)}>
            <option>Allergy Alert</option>
            <option>Drug Interaction</option>
            <option>High-Risk Patient</option>
            <option>Custom Alert</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-amber-800 mb-1">Message</label>
          <Input required placeholder="e.g. Penicillin Allergy" value={message} onChange={e => setMessage(e.target.value)} className="border-amber-300 focus:border-amber-500" />
        </div>
        <div className="flex gap-2">
          <select className="flex-1 border border-amber-300 rounded-lg p-2 text-sm outline-none" value={severity} onChange={e => setSeverity(e.target.value as any)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <Button type="submit" disabled={adding} className="bg-amber-600 hover:bg-amber-700 text-white shrink-0">
            {adding ? '...' : 'Add Alert'}
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        {loading && <div className="text-sm text-slate-400">Loading alerts...</div>}
        {alerts.map(a => (
          <div key={a.id} className={`p-4 rounded-xl border ${a.resolved ? 'bg-slate-50 border-slate-200 opacity-60' : a.severity === 'High' ? 'bg-red-50 border-red-200' : 'bg-white border-amber-200'} flex justify-between items-center`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${a.severity === 'High' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'}`}>{a.severity}</span>
                <span className="font-semibold text-slate-800 text-sm">{a.alert_type}</span>
                {a.resolved && <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">Resolved</span>}
              </div>
              <div className="text-sm text-slate-700">{a.alert_message}</div>
            </div>
            {!a.resolved && (
              <Button size="sm" variant="outline" onClick={() => handleResolve(a.id)}>Mark Resolved</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
