'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorBlockedSlotsAction, createBlockedSlotAction, deleteBlockedSlotAction } from '@/actions/doctors/blockedSlotActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'

export default function BlockedSlotManager({ doctorId }: { doctorId: string }) {
  const [slots, setSlots] = useState<any[]>([])
  const [newBlock, setNewBlock] = useState({ block_date: '', start_time: '', end_time: '', reason: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDoctorBlockedSlotsAction(doctorId).then(res => {
      if (res.success) setSlots(res.data)
    })
  }, [doctorId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      doctor_id: doctorId,
      ...newBlock
    }
    const res = await createBlockedSlotAction(payload)
    if (res.success) {
      setSlots([res.data, ...slots])
      setNewBlock({ block_date: '', start_time: '', end_time: '', reason: '' })
      if (res.conflicts && res.conflicts.length > 0) {
        alert(`Warning: This block conflicts with ${res.conflicts.length} existing appointment(s). Please review them manually.`)
      }
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to unblock this slot?')) return
    const res = await deleteBlockedSlotAction(id)
    if (res.success) {
      setSlots(slots.filter(s => s.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl flex-wrap">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Date *</label>
          <Input type="date" required value={newBlock.block_date} onChange={e => setNewBlock({...newBlock, block_date: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Start Time *</label>
          <Input type="time" required value={newBlock.start_time} onChange={e => setNewBlock({...newBlock, start_time: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">End Time *</label>
          <Input type="time" required value={newBlock.end_time} onChange={e => setNewBlock({...newBlock, end_time: e.target.value})} />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-slate-500 uppercase">Reason</label>
          <Input value={newBlock.reason} onChange={e => setNewBlock({...newBlock, reason: e.target.value})} placeholder="e.g. Emergency OT" />
        </div>
        <Button type="submit" disabled={loading}>{loading ? '...' : 'Block Slot'}</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time Range</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slots.map(s => (
            <TableRow key={s.id}>
              <TableCell className="font-semibold">{s.block_date}</TableCell>
              <TableCell>{s.start_time} - {s.end_time}</TableCell>
              <TableCell>{s.reason}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => handleDelete(s.id)}>Remove</Button>
              </TableCell>
            </TableRow>
          ))}
          {slots.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-slate-500 py-4">No blocked slots.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
