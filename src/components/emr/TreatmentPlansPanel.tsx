'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getTreatmentPlansAction, createTreatmentPlanAction, updateTreatmentPlanStatusAction } from '@/actions/emr/treatmentPlanActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { TreatmentPlanRow } from '@/types/emr'

export default function TreatmentPlansPanel({ patientId, visitId }: { patientId: string; visitId: string }) {
  const [plans, setPlans] = useState<TreatmentPlanRow[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const [goal, setGoal] = useState('')
  const [desc, setDesc] = useState('')
  const [dur, setDur] = useState('')

  const loadPlans = useCallback(async () => {
    setLoading(true)
    const res = await getTreatmentPlansAction(patientId)
    if (res.success && res.data) setPlans(res.data)
    setLoading(false)
  }, [patientId])

  useEffect(() => { loadPlans() }, [loadPlans])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal || !desc) return
    setAdding(true)
    const res = await createTreatmentPlanAction(patientId, visitId, { treatment_goal: goal, treatment_description: desc, expected_duration: dur })
    if (res.success && res.data) {
      setPlans([res.data!, ...plans])
      setGoal(''); setDesc(''); setDur('')
    }
    setAdding(false)
  }

  const handleStatus = async (id: string, status: any) => {
    const res = await updateTreatmentPlanStatusAction(id, status)
    if (res.success) {
      setPlans(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <form onSubmit={handleAdd} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
        <h4 className="font-semibold text-slate-800 text-sm">Add Treatment Plan</h4>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Treatment Goal *</label>
          <Input required placeholder="e.g. Manage hypertension" value={goal} onChange={e => setGoal(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Treatment Description *</label>
          <textarea className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:border-blue-500 resize-y" rows={3} required value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Expected Duration (Optional)</label>
          <Input placeholder="e.g. 6 Months" value={dur} onChange={e => setDur(e.target.value)} className="w-1/2" />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={adding}>+ Add Plan</Button>
        </div>
      </form>

      <div className="space-y-3">
        {loading && <div className="text-sm text-slate-400">Loading plans...</div>}
        {plans.map(p => (
          <div key={p.id} className={`p-4 rounded-xl border flex flex-col gap-2 ${p.status === 'Completed' ? 'bg-green-50 border-green-200' : p.status === 'Discontinued' ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-start">
              <span className="font-bold text-slate-800">{p.treatment_goal}</span>
              <select 
                value={p.status} 
                onChange={(e) => handleStatus(p.id, e.target.value)}
                className="text-xs font-semibold bg-transparent border border-slate-300 rounded p-1"
              >
                <option>Active</option>
                <option>Completed</option>
                <option>Discontinued</option>
              </select>
            </div>
            <div className="text-sm text-slate-700">{p.treatment_description}</div>
            <div className="text-xs text-slate-500 flex gap-4">
              {p.expected_duration && <span>Duration: {p.expected_duration}</span>}
              <span>Started: {new Date(p.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
