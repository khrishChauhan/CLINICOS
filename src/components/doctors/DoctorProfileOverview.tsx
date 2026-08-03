'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorByIdAction } from '@/actions/doctors/doctorActions'
import type { DoctorRow } from '@/types/doctors'
import { Edit, Mail, Phone, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import DoctorProfileForm from './DoctorProfileForm'

interface Props {
  doctorId: string
}

export default function DoctorProfileOverview({ doctorId }: Props) {
  const [doctor, setDoctor] = useState<DoctorRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const loadDoctor = async () => {
    setLoading(true)
    const res = await getDoctorByIdAction(doctorId)
    if (res.success && res.data) {
      setDoctor(res.data)
    } else {
      setError(res.error || 'Failed to load doctor details')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadDoctor()
  }, [doctorId])

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center text-slate-400 text-sm">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
        Loading overview...
      </div>
    )
  }

  if (error || !doctor) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error || 'Doctor not found'}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Doctor Information</h2>
          <p className="text-sm text-slate-500">Demographics and contact details</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="flex items-center gap-2">
          <Edit className="w-4 h-4" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-2">
            <User className="w-4 h-4 text-blue-500" /> Basic Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Full Name</span>
              <span className="font-medium text-slate-800">Dr. {doctor.first_name} {doctor.last_name}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Doctor Code</span>
              <span className="font-mono text-slate-700">{doctor.doctor_code}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Gender</span>
              <span className="font-medium text-slate-700">{doctor.gender || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Blood Group</span>
              <span className="font-medium text-slate-700">{doctor.blood_group || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Experience</span>
              <span className="font-medium text-slate-700">{doctor.experience_years ? `${doctor.experience_years} Years` : '—'}</span>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Phone className="w-4 h-4 text-emerald-500" /> Contact Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">{doctor.mobile_number || '—'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">{doctor.email || '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-slate-800">Edit Doctor Profile</h2>
              <button onClick={() => { setIsEditOpen(false); loadDoctor(); }} className="text-slate-400 hover:text-slate-600 transition">
                ✕
              </button>
            </div>
            <div className="p-6">
              <DoctorProfileForm doctorId={doctorId} onSaveSuccess={() => { setIsEditOpen(false); loadDoctor(); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
