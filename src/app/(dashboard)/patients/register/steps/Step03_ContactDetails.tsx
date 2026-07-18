'use client'

import React from 'react'
import { StepHeader, FormField, FormSelect } from '../FormComponents'

export default function Step03_ContactDetails() {
  return (
    <div>
      <StepHeader
        step={3}
        title="Contact Details"
        description="Mobile number is required and will be used for all communications."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          label="Mobile Number"
          name="mobile_number"
          required
          placeholder="+91 98765 43210"
          hint="10-digit Indian mobile number"
        />
        <FormField label="Alternate Mobile" name="alternate_mobile" placeholder="+91 98765 00000 (optional)" />
        <FormField label="Email Address" name="email" type="email" placeholder="patient@example.com (optional)" />
        <FormSelect label="Preferred Language" name="preferred_language">
          {['Hindi', 'English', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Gujarati', 'Punjabi', 'Other'].map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </FormSelect>
      </div>
    </div>
  )
}
