'use client'

import React, { useState, useEffect } from 'react'
import { StepHeader, FormField, FormSelect } from '../FormComponents'
import { getMasterDataAction } from '@/actions/master/masterActions'
import type { MasterNationality, MasterReligion } from '@/types/master'

export default function Step04_Demographics() {
  const [nationalities, setNationalities] = useState<MasterNationality[]>([])
  const [religions, setReligions] = useState<MasterReligion[]>([])

  useEffect(() => {
    async function loadMasterData() {
      const [nRes, rRes] = await Promise.all([
        getMasterDataAction<MasterNationality>('nationalities'),
        getMasterDataAction<MasterReligion>('religions')
      ])
      if (nRes.success && nRes.data) setNationalities(nRes.data)
      if (rRes.success && rRes.data) setReligions(rRes.data)
    }
    loadMasterData()
  }, [])

  return (
    <div>
      <StepHeader
        step={4}
        title="Identity & Demographics"
        description="Government ID and demographic information for records."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          label="Aadhaar Number"
          name="aadhaar_number"
          placeholder="12-digit Aadhaar number"
          hint="Must be exactly 12 digits"
        />
        <FormField label="Passport Number" name="passport_number" placeholder="Optional" />
        <FormField label="Occupation" name="occupation" placeholder="e.g. Teacher, Farmer, Business" />
        <FormSelect label="Nationality" name="nationality">
          {(nationalities.length > 0
            ? nationalities.map(n => ({ id: n.id, label: n.nationality_name || (n as any).name || (n as any).label }))
            : [{ id: 'in', label: 'Indian' }, { id: 'ot', label: 'Other' }]
          ).map(n => (
            <option key={n.id} value={n.label}>{n.label}</option>
          ))}
        </FormSelect>
        <FormSelect label="Religion" name="religion" placeholder="Select religion (optional)...">
          <option value="">-- None --</option>
          {(religions.length > 0
            ? religions.map(r => ({ id: r.id, label: r.religion_name || (r as any).name || (r as any).label }))
            : ['Hinduism', 'Islam', 'Christianity', 'Sikhism', 'Buddhism', 'Jainism', 'Other'].map(r => ({ id: r, label: r }))
          ).map(r => (
            <option key={r.id} value={r.label}>{r.label}</option>
          ))}
        </FormSelect>
      </div>
    </div>
  )
}
