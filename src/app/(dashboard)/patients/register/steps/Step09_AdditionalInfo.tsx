'use client'

import React from 'react'
import { StepHeader, FormTextarea } from '../FormComponents'

export default function Step09_AdditionalInfo() {
  return (
    <div>
      <StepHeader
        step={9}
        title="Additional Information"
        description="Any other remarks or notes about the patient."
      />
      <div className="grid grid-cols-1 gap-5">
        <FormTextarea label="Remarks" name="remarks" placeholder="Enter any general remarks or notes here..." />
      </div>
    </div>
  )
}
