'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getReferralsAction, createReferralAction } from '@/actions/emr/referralActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { ReferralRow } from '@/types/emr'

export default function ReferralsPanel({ visitId }: { visitId: string }) {
  const [referrals, setReferrals] = useState<ReferralRow[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const [doc, setDoc] = useState('')
  const [hosp, setHosp] = useState('')
  const [reason, setReason] = useState('')

  const loadReferrals = useCallback(async () => {
    setLoading(true)
    const res = await getReferralsAction(visitId)
    if (res.success && res.data) setReferrals(res.data)
    setLoading(false)
  }, [visitId])

  useEffect(() => { loadReferrals() }, [loadReferrals])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason || (!doc && !hosp)) return alert('Reason and (Doctor or Hospital) are required')
    setAdding(true)
    const res = await createReferralAction(visitId, { referred_doctor: doc, referred_hospital: hosp, referral_reason: reason })
    if (res.success && res.data) {
      setReferrals([res.data!, ...referrals])
      setDoc(''); setHosp(''); setReason('')
    }
    setAdding(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <form onSubmit={handleAdd} className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Referred Doctor (Optional)</label>
          <Input placeholder="e.g. Dr. Jane Smith" value={doc} onChange={e => setDoc(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Referred Hospital (Optional)</label>
          <Input placeholder="e.g. City General" value={hosp} onChange={e => setHosp(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Reason for Referral *</label>
          <Input required placeholder="e.g. Needs specialized cardiology evaluation" value={reason} onChange={e => setReason(e.target.value)} />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" disabled={adding}>+ Create Referral</Button>
        </div>
      </form>

      <div className="space-y-3">
        {loading && <div className="text-sm text-slate-400">Loading referrals...</div>}
        {referrals.map(r => (
          <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-slate-800">{r.referred_doctor || 'N/A'} {r.referred_hospital ? `at ${r.referred_hospital}` : ''}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{r.status}</span>
            </div>
            <div className="text-sm text-slate-600 mb-2">{r.referral_reason}</div>
            <div className="text-xs text-slate-400">Referred on: {new Date(r.created_at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
