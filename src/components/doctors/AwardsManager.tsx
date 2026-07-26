'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorAwardsAction, createDoctorAwardAction, deleteDoctorAwardAction } from '@/actions/doctors/awardActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'

export default function AwardsManager({ doctorId }: { doctorId: string }) {
  const [awards, setAwards] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    award_name: '',
    organization: '',
    award_date: '',
    description: ''
  })

  useEffect(() => {
    getDoctorAwardsAction(doctorId).then(res => {
      if (res.success) setAwards(res.data)
    })
  }, [doctorId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await createDoctorAwardAction({
      doctor_id: doctorId,
      ...form
    })
    if (res.success) {
      setAwards([res.data, ...awards])
      setForm({ award_name: '', organization: '', award_date: '', description: '' })
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete award?')) return
    const res = await deleteDoctorAwardAction(id)
    if (res.success) setAwards(awards.filter(a => a.id !== id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end bg-slate-50 p-4 rounded-xl">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Award Name *</label>
          <Input required value={form.award_name} onChange={e => setForm({...form, award_name: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Organization *</label>
          <Input required value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Date</label>
          <Input type="date" value={form.award_date} onChange={e => setForm({...form, award_date: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
          <Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Award'}</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Award</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {awards.map(a => (
            <TableRow key={a.id}>
              <TableCell className="font-semibold">{a.award_name}</TableCell>
              <TableCell>{a.organization}</TableCell>
              <TableCell>{a.award_date}</TableCell>
              <TableCell className="text-sm text-slate-500">{a.description}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(a.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
          {awards.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-slate-500 py-4">No awards added.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
