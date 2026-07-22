'use client'

import React, { useState, useEffect } from 'react'
import { getAppointmentAuditAction } from '@/actions/appointments/appointmentAuditActions'
import type { AppointmentAuditRow } from '@/types/appointments'
import { X, Activity, User, Monitor } from 'lucide-react'

interface Props {
  appointmentId: string
  onClose: () => void
}

export default function AppointmentAuditTimeline({ appointmentId, onClose }: Props) {
  const [logs, setLogs] = useState<(AppointmentAuditRow & { performed_by: any })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const res = await getAppointmentAuditAction(appointmentId)
      if (res.success) {
        setLogs(res.data)
      } else {
        setError(res.error)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" /> Audit Trail
            </h2>
            <p className="text-xs text-slate-500 mt-1">Immutable record of all appointment lifecycle events.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
          {loading ? (
            <p className="text-slate-500 text-center py-10">Loading audit logs...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-10 font-medium">Access Denied: {error}</p>
          ) : logs.length === 0 ? (
            <p className="text-slate-500 text-center py-10">No audit logs found.</p>
          ) : (
            <div className="relative border-l-2 border-indigo-100 ml-4 space-y-8 pb-8">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-6">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-50 shadow-sm" />
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800">{log.action}</h4>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 bg-slate-50 w-fit px-2 py-1 rounded-md">
                      {log.performed_by ? (
                        <>
                          <User className="w-3.5 h-3.5" />
                          <span>{log.performed_by.first_name} {log.performed_by.last_name} ({log.performed_by.role})</span>
                        </>
                      ) : (
                        <>
                          <Monitor className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-amber-700 font-semibold">System Action</span>
                        </>
                      )}
                    </div>

                    {(log.previous_value || log.new_value) && (
                      <div className="grid grid-cols-2 gap-4 text-xs mt-3 border-t border-slate-100 pt-3">
                        {log.previous_value && (
                          <div>
                            <span className="block font-semibold text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Previous Value</span>
                            <pre className="bg-slate-50 text-slate-600 p-2 rounded-lg border border-slate-100 overflow-x-auto">
                              {JSON.stringify(log.previous_value, null, 2)}
                            </pre>
                          </div>
                        )}
                        {log.new_value && (
                          <div>
                            <span className="block font-semibold text-slate-400 mb-1 uppercase tracking-wider text-[10px]">New Value</span>
                            <pre className="bg-indigo-50 text-indigo-700 p-2 rounded-lg border border-indigo-100 overflow-x-auto font-medium">
                              {JSON.stringify(log.new_value, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
