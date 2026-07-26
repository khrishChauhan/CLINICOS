'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getFollowUpPlanAction, saveFollowUpPlanAction } from '@/actions/emr/followUpPlanActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { FollowUpPlanRow } from '@/types/emr'

export default function FollowUpPlanPanel({ visitId }: { visitId: string }) {
  const [plan, setPlan] = useState<FollowUpPlanRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')
  const [instructions, setInstructions] = useState('')
  const [reminder, setReminder] = useState(false)

  const loadPlan = useCallback(async () => {
    setLoading(true)
    const res = await getFollowUpPlanAction(visitId)
    if (res.success && res.data) {
      setPlan(res.data)
      setDate(res.data.followup_date)
      setReason(res.data.followup_reason || '')
      setInstructions(res.data.instructions || '')
      setReminder(res.data.reminder_required)
    }
    setLoading(false)
  }, [visitId])

  useEffect(() => { loadPlan() }, [loadPlan])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) return
    setSaving(true)
    const res = await saveFollowUpPlanAction(visitId, {
      followup_date: date,
      followup_reason: reason || undefined,
      instructions: instructions || undefined,
      reminder_required: reminder
    })
    if (res.success && res.data) {
      setPlan(res.data)
      alert('Follow-up plan saved successfully.')
    } else {
      alert(res.error || 'Failed to save')
    }
    setSaving(false)
  }

  if (loading) return <div className="text-center text-sm text-slate-400 py-6">Loading follow-up plan...</div>

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-5">
        <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Schedule Follow-up</h3>
        
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Follow-up Date *</label>
          <Input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full md:w-1/2" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Reason for Follow-up</label>
          <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Review blood test reports" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Special Instructions for Patient</label>
          <textarea
            className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:border-blue-500 resize-y"
            rows={3}
            placeholder="e.g. Fasting required, bring old reports..."
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-blue-600"
            checked={reminder}
            onChange={e => setReminder(e.target.checked)}
          />
          <span className="text-sm font-semibold text-slate-700">Enable automated SMS/Email reminders for this follow-up</span>
        </label>

        <div className="pt-2">
          <Button type="submit" disabled={saving || !date}>
            {saving ? 'Saving...' : '💾 Save Follow-up Plan'}
          </Button>
        </div>
      </div>
    </form>
  )
}
