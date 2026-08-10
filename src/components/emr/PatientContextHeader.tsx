'use client'

import React, { useState, useEffect } from 'react'
import { getPatientByIdAction } from '@/actions/patients/patientActions'
import type { PatientListItem } from '@/types/patients'

export default function PatientContextHeader({ patientId }: { patientId: string }) {
  const [patient, setPatient] = useState<PatientListItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await getPatientByIdAction(patientId)
      if (res.ok && res.patient) {
        setPatient(res.patient)
      }
      setLoading(false)
    }
    load()
  }, [patientId])

  if (loading) {
    return <div className="h-16 bg-slate-100 animate-pulse rounded-xl mb-4 border border-slate-200"></div>
  }

  if (!patient) return null

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
          {patient.initials}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {patient.fullName}
          </h2>
          <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
            <span>UHID: {patient.uhid || 'N/A'}</span>
            <span>&bull;</span>
            <span>{patient.gender || 'Unknown'}</span>
            {patient.age ? (
              <>
                <span>&bull;</span>
                <span>{patient.age} {patient.ageUnit || 'Yrs'}</span>
              </>
            ) : null}
            {patient.bloodGroup ? (
              <>
                <span>&bull;</span>
                <span className="text-red-500 font-bold">{patient.bloodGroup}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
