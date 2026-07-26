'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorAuditTimelineAction } from '@/actions/doctors/auditActions'

export default function AuditTimeline({ doctorId }: { doctorId: string }) {
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    getDoctorAuditTimelineAction(doctorId).then(res => {
      if (res.success) setLogs(res.data)
    })
  }, [doctorId])

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h3 className="font-semibold text-slate-800">Security & Audit Log</h3>
        <p className="text-sm text-slate-500">Immutable record of all modifications to this profile.</p>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {logs.map((log, i) => (
          <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-slate-900 text-sm">{log.action}</div>
                <time className="text-xs font-medium text-blue-600">{new Date(log.action_time).toLocaleString()}</time>
              </div>
              
              <div className="text-xs text-slate-500 mb-2">Performed By: {log.action_by || 'System'} {log.ip_address && `(${log.ip_address})`}</div>
              
              {(log.previous_value || log.new_value || log.metadata) && (
                <div className="mt-2 bg-slate-50 p-2 rounded border border-slate-100 text-xs overflow-x-auto font-mono">
                  {log.previous_value && <div className="text-red-500 mb-1">- {JSON.stringify(log.previous_value)}</div>}
                  {log.new_value && <div className="text-green-600 mb-1">+ {JSON.stringify(log.new_value)}</div>}
                  {log.metadata && <div className="text-slate-400">Info: {JSON.stringify(log.metadata)}</div>}
                </div>
              )}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center text-slate-400 py-8 relative z-10 bg-white">No audit history found.</div>
        )}
      </div>
    </div>
  )
}
