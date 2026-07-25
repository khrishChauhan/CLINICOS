'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorLeavesAction, createDoctorLeaveAction, deleteDoctorLeaveAction } from '@/actions/doctors/doctorLeaveActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'

export default function LeaveManagement({ doctorId }: { doctorId: string }) {
  const [leaves, setLeaves] = useState<any[]>([])
  const [newLeave, setNewLeave] = useState({ leave_type: 'Annual', start_date: '', end_date: '', reason: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDoctorLeavesAction(doctorId).then(res => {
      if (res.success) setLeaves(res.data)
    })
  }, [doctorId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      doctor_id: doctorId,
      ...newLeave
    }
    const res = await createDoctorLeaveAction(payload)
    if (res.success) {
      setLeaves([res.data, ...leaves])
      setNewLeave({ leave_type: 'Annual', start_date: '', end_date: '', reason: '' })
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Cancel this leave request?')) return
    const res = await deleteDoctorLeaveAction(id)
    if (res.success) {
      setLeaves(leaves.filter(l => l.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl flex-wrap">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Leave Type</label>
          <select 
            className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm outline-none"
            value={newLeave.leave_type} onChange={e => setNewLeave({...newLeave, leave_type: e.target.value})}
          >
            <option>Annual</option>
            <option>Sick</option>
            <option>Conference</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Start Date *</label>
          <Input type="date" required value={newLeave.start_date} onChange={e => setNewLeave({...newLeave, start_date: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">End Date *</label>
          <Input type="date" required value={newLeave.end_date} onChange={e => setNewLeave({...newLeave, end_date: e.target.value})} />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-slate-500 uppercase">Reason</label>
          <Input value={newLeave.reason} onChange={e => setNewLeave({...newLeave, reason: e.target.value})} placeholder="e.g. Personal" />
        </div>
        <Button type="submit" disabled={loading}>{loading ? '...' : 'Apply'}</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map(l => (
            <TableRow key={l.id}>
              <TableCell className="font-semibold">{l.leave_type}</TableCell>
              <TableCell>{l.start_date} to {l.end_date}</TableCell>
              <TableCell>
                <Badge variant={l.approval_status === 'Approved' ? 'success' : 'default'}>{l.approval_status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => handleDelete(l.id)}>Cancel</Button>
              </TableCell>
            </TableRow>
          ))}
          {leaves.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-slate-500 py-4">No leaves found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
