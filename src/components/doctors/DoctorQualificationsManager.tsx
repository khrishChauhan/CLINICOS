'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorQualificationsAction, addDoctorQualificationAction } from '@/actions/doctors/doctorActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'

export default function DoctorQualificationsManager({ doctorId }: { doctorId: string }) {
  const [qualifications, setQualifications] = useState<any[]>([])
  const [newQual, setNewQual] = useState({ qualification: '', university: '', passing_year: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDoctorQualificationsAction(doctorId).then(res => {
      if (res.success) setQualifications(res.data)
    })
  }, [doctorId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const payload = {
      doctor_id: doctorId,
      qualification: newQual.qualification,
      university: newQual.university,
      passing_year: parseInt(newQual.passing_year) || null
    }
    const res = await addDoctorQualificationAction(payload)
    if (res.success) {
      setQualifications([res.data, ...qualifications])
      setNewQual({ qualification: '', university: '', passing_year: '' })
    } else {
      setError(res.error || 'Failed to add qualification')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
      <form onSubmit={handleAdd} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl">
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Degree/Qualification *</label>
          <Input required value={newQual.qualification} onChange={e => setNewQual({...newQual, qualification: e.target.value})} placeholder="e.g. MBBS, MD" />
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">University/Institution *</label>
          <Input required value={newQual.university} onChange={e => setNewQual({...newQual, university: e.target.value})} placeholder="e.g. AIIMS" />
        </div>
        <div className="w-32">
          <label className="text-xs font-semibold text-slate-500 uppercase">Year</label>
          <Input type="number" value={newQual.passing_year} onChange={e => setNewQual({...newQual, passing_year: e.target.value})} placeholder="YYYY" />
        </div>
        <Button type="submit" disabled={loading}>{loading ? '...' : 'Add'}</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Qualification</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Passing Year</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qualifications.map(q => (
            <TableRow key={q.id}>
              <TableCell className="font-semibold">{q.qualification}</TableCell>
              <TableCell>{q.university}</TableCell>
              <TableCell>{q.passing_year}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
