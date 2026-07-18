'use client'

import React from 'react'
import { StepHeader, FormField, FormSelect } from '../FormComponents'

export default function Step01_RegistrationType() {
  return (
    <div>
      <StepHeader
        step={1}
        title="Registration Type"
        description="Select the type of visit and referral information."
      />
      <div className="grid grid-cols-1 gap-5">
        <FormSelect label="Patient Type" name="patient_type" required placeholder="Select patient type...">
          <option value="OPD">OPD – Out-Patient Department</option>
          <option value="IPD">IPD – In-Patient Department</option>
          <option value="Emergency">Emergency</option>
        </FormSelect>
        <FormField label="Referred By" name="referred_by" placeholder="Referring doctor or source (optional)" />
      </div>
    </div>
  )
}
