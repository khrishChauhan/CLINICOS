'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { scheduleSurgeryAction } from '@/actions/ot/otActions'
import { toast } from 'sonner'
import dayjs from 'dayjs'

export function ScheduleSurgeryForm({ rooms, patients, doctors }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    patient_id: '',
    room_id: '',
    lead_surgeon_id: '',
    procedure_name: '',
    diagnosis: '',
    scheduled_start_time: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:00'),
    scheduled_end_time: dayjs().add(1, 'day').add(2, 'hour').format('YYYY-MM-DDTHH:00'),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      ...formData,
      scheduled_start_time: new Date(formData.scheduled_start_time).toISOString(),
      scheduled_end_time: new Date(formData.scheduled_end_time).toISOString(),
    }

    const res = await scheduleSurgeryAction(payload)
    setIsSubmitting(false)

    if (res.ok) {
      toast.success('Surgery scheduled successfully!')
      setIsOpen(false)
    } else {
      toast.error(res.error)
    }
  }

  if (!isOpen) {
    return <Button onClick={() => setIsOpen(true)}>+ Schedule Surgery</Button>
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Schedule Surgery</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Patient</label>
            <select
              required
              className="w-full p-2 border border-slate-300 rounded-lg text-sm"
              value={formData.patient_id}
              onChange={e => setFormData({ ...formData, patient_id: e.target.value })}
            >
              <option value="">-- Select Patient --</option>
              {patients.map((p: any) => (
                <option key={p.id} value={p.id}>{p.first_name} {p.last_name} ({p.uhid})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
            <select
              required
              className="w-full p-2 border border-slate-300 rounded-lg text-sm"
              value={formData.room_id}
              onChange={e => setFormData({ ...formData, room_id: e.target.value })}
            >
              <option value="">-- Select OT Room --</option>
              {rooms.map((r: any) => (
                <option key={r.id} value={r.id}>{r.name} - {r.type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lead Surgeon</label>
            <select
              required
              className="w-full p-2 border border-slate-300 rounded-lg text-sm"
              value={formData.lead_surgeon_id}
              onChange={e => setFormData({ ...formData, lead_surgeon_id: e.target.value })}
            >
              <option value="">-- Select Surgeon --</option>
              {doctors.map((d: any) => (
                <option key={d.id} value={d.id}>Dr. {d.username}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Procedure Name</label>
            <input
              required
              type="text"
              className="w-full p-2 border border-slate-300 rounded-lg text-sm"
              value={formData.procedure_name}
              onChange={e => setFormData({ ...formData, procedure_name: e.target.value })}
              placeholder="e.g., Appendectomy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
            <input
              type="text"
              className="w-full p-2 border border-slate-300 rounded-lg text-sm"
              value={formData.diagnosis}
              onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
              placeholder="e.g., Acute Appendicitis"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
              <input
                required
                type="datetime-local"
                className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                value={formData.scheduled_start_time}
                onChange={e => setFormData({ ...formData, scheduled_start_time: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
              <input
                required
                type="datetime-local"
                className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                value={formData.scheduled_end_time}
                onChange={e => setFormData({ ...formData, scheduled_end_time: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>Schedule</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
