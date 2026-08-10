'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { allocateBedAction, transferBedAction, dischargePatientAction } from '@/actions/ipd/ipdActions'
import { Button } from '@/components/ui/Button'

export function AdmissionsClient({ admission, availableBeds }: { admission: any, availableBeds: any[] }) {
  const [showAssign, setShowAssign] = useState(false)
  const [selectedBed, setSelectedBed] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeAllocation = admission.bed_allocations?.find((ba: any) => !ba.end_time)

  const handleAssignBed = async () => {
    if (!selectedBed) return toast.error('Please select a bed')
    setIsSubmitting(true)
    
    let res
    if (activeAllocation) {
      res = await transferBedAction(admission.id, activeAllocation.bed_id, selectedBed, activeAllocation.id)
    } else {
      res = await allocateBedAction(admission.id, selectedBed)
    }

    setIsSubmitting(false)
    if (res.ok) {
      toast.success(activeAllocation ? 'Patient transferred successfully!' : 'Bed allocated successfully!')
      setShowAssign(false)
    } else {
      toast.error(res.error)
    }
  }

  const handleDischarge = async () => {
    if (!confirm('Are you sure you want to initiate discharge? This will end the bed allocation and generate the billing invoice.')) return
    
    setIsSubmitting(true)
    const res = await dischargePatientAction(admission.id)
    setIsSubmitting(false)
    
    if (res.ok) {
      toast.success('Discharge initiated and invoice generated!')
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {!showAssign ? (
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button 
            variant="outline" 
            onClick={() => setShowAssign(true)}
            disabled={admission.status === 'Discharged' || admission.status === 'Billing Pending'}
          >
            {activeAllocation ? 'Transfer Bed' : 'Assign Bed'}
          </Button>
          
          <Button 
            variant="danger"
            onClick={handleDischarge}
            disabled={admission.status === 'Discharged' || admission.status === 'Billing Pending' || !activeAllocation}
          >
            Initiate Discharge
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <label className="text-sm font-semibold text-slate-700">Select Available Bed</label>
          <select 
            className="p-2 border border-slate-300 rounded-lg text-sm"
            value={selectedBed}
            onChange={e => setSelectedBed(e.target.value)}
          >
            <option value="">-- Choose Bed --</option>
            {availableBeds.map(b => (
              <option key={b.id} value={b.id}>{b.wardName} - Bed {b.bed_number} (${b.base_price_per_day}/day)</option>
            ))}
          </select>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setShowAssign(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAssignBed} disabled={!selectedBed || isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Confirm'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
