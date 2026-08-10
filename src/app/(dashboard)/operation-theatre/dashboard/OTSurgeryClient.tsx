'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { transitionSurgeryStatusAction, verifyChecklistAction } from '@/actions/ot/otActions'
import { toast } from 'sonner'
import dayjs from 'dayjs'

export function OTSurgeryClient({ surgery }: { surgery: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showChecklist, setShowChecklist] = useState(false)
  
  // Basic checklist state
  const checklistObj = surgery.checklists?.[0] || {}
  const [checklist, setChecklist] = useState({
    identity_verified: checklistObj.identity_verified || false,
    consent_signed: checklistObj.consent_signed || false,
    site_marked: checklistObj.site_marked || false,
    fasting_confirmed: checklistObj.fasting_confirmed || false,
    remarks: checklistObj.remarks || ''
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'default'
      case 'Pre-Op': return 'warning'
      case 'Intra-Op': return 'danger'
      case 'Post-Op': return 'info'
      case 'Completed': return 'success'
      case 'Cancelled': return 'default'
      default: return 'default'
    }
  }

  const handleTransition = async (newStatus: string) => {
    if (!confirm(`Transition surgery to ${newStatus}?`)) return
    setIsSubmitting(true)
    const res = await transitionSurgeryStatusAction(surgery.id, newStatus)
    setIsSubmitting(false)
    if (res.ok) {
      toast.success(`Surgery moved to ${newStatus}`)
    } else {
      toast.error(res.error)
    }
  }

  const handleVerifyChecklist = async () => {
    setIsSubmitting(true)
    const res = await verifyChecklistAction(surgery.id, checklist)
    setIsSubmitting(false)
    if (res.ok) {
      toast.success('Checklist verified successfully')
      setShowChecklist(false)
    } else {
      toast.error(res.error)
    }
  }

  const renderActions = () => {
    if (surgery.status === 'Scheduled') {
      return <Button size="sm" onClick={() => handleTransition('Pre-Op')} disabled={isSubmitting}>Begin Pre-Op</Button>
    }
    if (surgery.status === 'Pre-Op') {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowChecklist(!showChecklist)}>Safety Checklist</Button>
          <Button size="sm" onClick={() => handleTransition('Intra-Op')} disabled={isSubmitting}>Start Surgery (Intra-Op)</Button>
        </div>
      )
    }
    if (surgery.status === 'Intra-Op') {
      return <Button size="sm" variant="primary" onClick={() => handleTransition('Post-Op')} disabled={isSubmitting}>End Surgery (Post-Op)</Button>
    }
    if (surgery.status === 'Post-Op') {
      return <Button size="sm" variant="primary" onClick={() => handleTransition('Completed')} disabled={isSubmitting}>Mark Completed</Button>
    }
    return null
  }

  return (
    <Card className="p-5 flex flex-col gap-4 border-l-4" style={{ borderLeftColor: surgery.status === 'Intra-Op' ? '#ef4444' : surgery.status === 'Completed' ? '#10b981' : '#3b82f6' }}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            {surgery.patient?.first_name} {surgery.patient?.last_name}
            {surgery.is_emergency && <Badge variant="danger" className="ml-2">EMERGENCY</Badge>}
          </h3>
          <p className="text-sm font-semibold text-slate-700 mt-1">{surgery.procedure_name}</p>
          <p className="text-xs text-slate-500 mt-1">
            Room: {surgery.room?.name} | Surgeon: Dr. {surgery.lead_surgeon?.last_name}
          </p>
          <p className="text-xs text-slate-500">
            Time: {dayjs(surgery.scheduled_start_time).format('HH:mm')} - {dayjs(surgery.scheduled_end_time).format('HH:mm')}
          </p>
        </div>
        <Badge variant={getStatusColor(surgery.status)}>{surgery.status}</Badge>
      </div>

      {showChecklist && (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-2 space-y-3">
          <h4 className="font-semibold text-sm text-slate-800">Pre-Operative Safety Checklist</h4>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={checklist.identity_verified} onChange={e => setChecklist({...checklist, identity_verified: e.target.checked})} />
              Identity Verified
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={checklist.consent_signed} onChange={e => setChecklist({...checklist, consent_signed: e.target.checked})} />
              Consent Signed
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={checklist.site_marked} onChange={e => setChecklist({...checklist, site_marked: e.target.checked})} />
              Site Marked
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={checklist.fasting_confirmed} onChange={e => setChecklist({...checklist, fasting_confirmed: e.target.checked})} />
              Fasting Confirmed
            </label>
          </div>
          
          <Button size="sm" className="mt-2 w-full" onClick={handleVerifyChecklist} disabled={isSubmitting}>Save Checklist</Button>
        </div>
      )}

      <div className="flex justify-end border-t border-slate-100 pt-3 mt-1">
        {renderActions()}
      </div>
    </Card>
  )
}
