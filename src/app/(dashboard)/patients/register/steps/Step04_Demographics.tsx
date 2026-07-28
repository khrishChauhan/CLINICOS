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
          {nationalities.map(n => (
            <option key={n.id} value={n.nationality_name}>{n.nationality_name}</option>
          ))}
        </FormSelect>
        <FormSelect label="Religion" name="religion" placeholder="Select religion (optional)...">
          <option value="">-- None --</option>
          {religions.map(r => (
            <option key={r.id} value={r.religion_name}>{r.religion_name}</option>
          ))}
        </FormSelect>
      </div>
    </div>
  )
}
