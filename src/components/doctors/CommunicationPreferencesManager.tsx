'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorPreferencesAction, updateCommunicationPreferenceAction } from '@/actions/doctors/communicationPreferenceActions'

export default function CommunicationPreferencesManager({ doctorId }: { doctorId: string }) {
  const [prefs, setPrefs] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDoctorPreferencesAction(doctorId).then(res => {
      if (res.success) setPrefs(res.data)
      setLoading(false)
    })
  }, [doctorId])

  const togglePref = async (field: string, val: boolean) => {
    setPrefs((prev: any) => ({ ...prev, [field]: val }))
    await updateCommunicationPreferenceAction(doctorId, { [field]: val })
  }

  if (loading) return <div>Loading preferences...</div>
  if (!prefs) return <div className="text-red-500">Failed to load preferences.</div>

  return (
    <div className="space-y-6 max-w-lg">
      <p className="text-sm text-slate-500">Configure how this doctor receives alerts and notifications from ClinicOS.</p>
      
      <div className="space-y-4">
        <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
          <div>
            <div className="font-semibold text-slate-800">In-App Notifications</div>
            <div className="text-xs text-slate-500">Receive bell icon alerts inside the ClinicOS dashboard.</div>
          </div>
          <input type="checkbox" checked={prefs.in_app_enabled} onChange={e => togglePref('in_app_enabled', e.target.checked)} className="w-5 h-5 accent-blue-600" />
        </label>

        <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
          <div>
            <div className="font-semibold text-slate-800">Email Notifications</div>
            <div className="text-xs text-slate-500">Receive daily summaries and critical alerts via email.</div>
          </div>
          <input type="checkbox" checked={prefs.email_enabled} onChange={e => togglePref('email_enabled', e.target.checked)} className="w-5 h-5 accent-blue-600" />
        </label>

        <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
          <div>
            <div className="font-semibold text-slate-800">SMS Alerts</div>
            <div className="text-xs text-slate-500">Instant SMS for new emergency appointments.</div>
          </div>
          <input type="checkbox" checked={prefs.sms_enabled} onChange={e => togglePref('sms_enabled', e.target.checked)} className="w-5 h-5 accent-blue-600" />
        </label>

        <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
          <div>
            <div className="font-semibold text-slate-800">WhatsApp Messages</div>
            <div className="text-xs text-slate-500">Direct integration with WhatsApp Business API.</div>
          </div>
          <input type="checkbox" checked={prefs.whatsapp_enabled} onChange={e => togglePref('whatsapp_enabled', e.target.checked)} className="w-5 h-5 accent-blue-600" />
        </label>
      </div>
    </div>
  )
}
