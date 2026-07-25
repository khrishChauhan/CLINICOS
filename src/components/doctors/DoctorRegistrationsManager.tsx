'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorRegistrationsAction, addDoctorRegistrationAction } from '@/actions/doctors/doctorActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'

export default function DoctorRegistrationsManager({ doctorId }: { doctorId: string }) {
  const [registrations, setRegistrations] = useState<any[]>([])
  const [newReg, setNewReg] = useState({ registration_number: '', registration_council: '', registration_state: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDoctorRegistrationsAction(doctorId).then(res => {
      if (res.success) setRegistrations(res.data)
    })
  }, [doctorId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const payload = {
      doctor_id: doctorId,
      ...newReg
    }
    const res = await addDoctorRegistrationAction(payload)
    if (res.success) {
      setRegistrations([...registrations, res.data])
      setNewReg({ registration_number: '', registration_council: '', registration_state: '' })
    } else {
      setError(res.error) // Usually duplicate constraint error
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded">{error}</div>}
      <form onSubmit={handleAdd} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl">
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Registration No *</label>
          <Input required value={newReg.registration_number} onChange={e => setNewReg({...newReg, registration_number: e.target.value})} placeholder="e.g. 12345" />
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Medical Council *</label>
          <Input required value={newReg.registration_council} onChange={e => setNewReg({...newReg, registration_council: e.target.value})} placeholder="e.g. Medical Council of India" />
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">State</label>
          <Input value={newReg.registration_state} onChange={e => setNewReg({...newReg, registration_state: e.target.value})} placeholder="e.g. Delhi" />
        </div>
        <Button type="submit" disabled={loading}>{loading ? '...' : 'Register'}</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reg. Number</TableHead>
            <TableHead>Council</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Verification</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map(r => (
            <TableRow key={r.id}>
              <TableCell className="font-mono">{r.registration_number}</TableCell>
              <TableCell className="font-semibold">{r.registration_council}</TableCell>
              <TableCell>{r.registration_state}</TableCell>
              <TableCell>{r.verification_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
