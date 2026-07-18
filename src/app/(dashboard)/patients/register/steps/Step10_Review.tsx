'use client'

import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { AlertTriangle, CheckCircle2, UserCheck, Loader2 } from 'lucide-react'
import { StepHeader } from '../FormComponents'
import { checkPatientDuplicates } from '@/actions/patients/checkDuplicates'
import type { PatientRegistrationInput } from '@/services/patients/validation'

export default function Step10_Review() {
  const { getValues } = useFormContext<PatientRegistrationInput>()
  const data = getValues()
  
  const [isChecking, setIsChecking] = useState(true)
  const [duplicates, setDuplicates] = useState<Array<{ id: string; uhid: string; fullName: string; mobile_number: string }>>([])
  
  useEffect(() => {
    async function check() {
      setIsChecking(true)
      const res = await checkPatientDuplicates(data.mobile_number, data.aadhaar_number)
      if (res.ok) {
        setDuplicates(res.duplicates)
      }
      setIsChecking(false)
    }
    check()
  }, [data.mobile_number, data.aadhaar_number])

  return (
    <div className="space-y-6">
      <StepHeader
        step={10}
        title="Review & Confirm"
        description="Please review the patient details and duplicate checks before final submission."
      />

      {/* Duplicate Check Section */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm border-b pb-3">
          <UserCheck className="w-4 h-4 text-slate-500" /> Duplicate Check
        </h3>
        
        {isChecking ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> Checking for existing patients...
          </div>
        ) : duplicates.length > 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-800 text-sm">Potential Duplicates Found</h4>
                <p className="text-xs text-amber-700 mt-1 mb-3">
                  Patients with the same Mobile Number or Aadhaar Number already exist. Proceed only if you are sure this is a new patient.
                </p>
                <div className="space-y-2">
                  {duplicates.map(dup => (
                    <div key={dup.id} className="bg-white border border-amber-100 rounded p-2 text-xs flex justify-between items-center">
                      <span className="font-semibold text-slate-700">{dup.fullName}</span>
                      <span className="text-slate-500 font-mono">{dup.uhid}</span>
                      <span className="text-slate-500 font-mono">{dup.mobile_number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-800 text-sm">No Duplicates Found</h4>
              <p className="text-xs text-emerald-600 mt-0.5">This appears to be a new patient record.</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm border-b pb-3">Patient Summary</h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div>
            <span className="block text-xs text-slate-500 mb-1">Patient Type</span>
            <span className="font-medium text-slate-800">{data.patient_type}</span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 mb-1">Full Name</span>
            <span className="font-medium text-slate-800">
              {[data.title, data.first_name, data.middle_name, data.last_name].filter(Boolean).join(' ')}
            </span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 mb-1">Mobile Number</span>
            <span className="font-medium text-slate-800">{data.mobile_number}</span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 mb-1">Addresses</span>
            <span className="font-medium text-slate-800">{data.addresses?.length || 0} Added</span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 mb-1">Emergency Contacts</span>
            <span className="font-medium text-slate-800">{data.emergency_contacts?.length || 0} Added</span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 mb-1">Insurances</span>
            <span className="font-medium text-slate-800">{data.insurance?.length || 0} Added</span>
          </div>
        </div>
      </div>
    </div>
  )
}
