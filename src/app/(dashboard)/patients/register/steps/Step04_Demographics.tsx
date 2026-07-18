'use client'

import React from 'react'
import { StepHeader, FormField, FormSelect } from '../FormComponents'

export default function Step04_Demographics() {
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
          {['Indian', 'NRI', 'Foreign National', 'Other'].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </FormSelect>
        <FormField label="Religion" name="religion" placeholder="e.g. Hindu, Muslim, Christian (optional)" />
      </div>
    </div>
  )
}
