'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorFeesAction, createDoctorFeeAction } from '@/actions/doctors/consultationFeeActions'
import { getMasterDataAction } from '@/actions/master/masterActions'
import type { MasterConsultationType } from '@/types/master'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'

export default function ConsultationFeeManager({ doctorId }: { doctorId: string }) {
  const [fees, setFees] = useState<any[]>([])
  const [newFee, setNewFee] = useState({
    consultation_type: 'Standard OPD',
    consultation_fee: 0,
    followup_fee: 0,
    emergency_fee: 0,
    teleconsultation_fee: 0,
    effective_from: ''
  })
  const [loading, setLoading] = useState(false)

  const fetchFees = async () => {
    const res = await getDoctorFeesAction(doctorId)
    if (res.success) setFees(res.data)
  }

  const [consultationTypes, setConsultationTypes] = useState<MasterConsultationType[]>([])
  useEffect(() => {
    async function loadMaster() {
      const res = await getMasterDataAction<MasterConsultationType>('consultation_types')
      if (res.success && res.data) {
        setConsultationTypes(res.data)
        if (res.data.length > 0) {
          setNewFee(prev => ({ ...prev, consultation_type: res.data[0].consultation_type }))
        }
      }
    }
    loadMaster()
    fetchFees()
  }, [doctorId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await createDoctorFeeAction({
      doctor_id: doctorId,
      ...newFee
    })
    if (res.success) {
      // Re-fetch to see old ones become inactive properly
      await fetchFees()
      setNewFee({
        consultation_type: 'Standard OPD',
        consultation_fee: 0, followup_fee: 0, emergency_fee: 0, teleconsultation_fee: 0, effective_from: ''
      })
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl items-end">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Consultation Type *</label>
          <select 
            className="flex h-10 w-full mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            value={newFee.consultation_type} onChange={e => setNewFee({...newFee, consultation_type: e.target.value})}
          >
            {consultationTypes.length === 0 && (
              <option value="Standard OPD">Standard OPD</option>
            )}
            {consultationTypes.map(c => (
              <option key={c.id} value={c.consultation_type}>{c.consultation_type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Effective From *</label>
          <Input type="date" required value={newFee.effective_from} onChange={e => setNewFee({...newFee, effective_from: e.target.value})} />
        </div>
        <div></div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Consultation Fee *</label>
          <Input type="number" step="0.01" required value={newFee.consultation_fee} onChange={e => setNewFee({...newFee, consultation_fee: parseFloat(e.target.value)})} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Follow-up Fee *</label>
          <Input type="number" step="0.01" required value={newFee.followup_fee} onChange={e => setNewFee({...newFee, followup_fee: parseFloat(e.target.value)})} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Emergency Fee *</label>
          <Input type="number" step="0.01" required value={newFee.emergency_fee} onChange={e => setNewFee({...newFee, emergency_fee: parseFloat(e.target.value)})} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Teleconsultation Fee *</label>
          <Input type="number" step="0.01" required value={newFee.teleconsultation_fee} onChange={e => setNewFee({...newFee, teleconsultation_fee: parseFloat(e.target.value)})} />
        </div>
        <div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? '...' : 'Add Fee Structure'}</Button>
        </div>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Effective From</TableHead>
            <TableHead>Base Fee</TableHead>
            <TableHead>Follow-up</TableHead>
            <TableHead>Emergency</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fees.map(f => (
            <TableRow key={f.id} className={f.status === 'Inactive' ? 'opacity-50' : ''}>
              <TableCell className="font-semibold">{f.consultation_type}</TableCell>
              <TableCell>{f.effective_from}</TableCell>
              <TableCell>${f.consultation_fee}</TableCell>
              <TableCell>${f.followup_fee}</TableCell>
              <TableCell>${f.emergency_fee}</TableCell>
              <TableCell>
                <Badge variant={f.status === 'Active' ? 'success' : 'default'}>{f.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
          {fees.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-slate-500 py-4">No fee structures found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
