'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getEMRAuditLogsAction } from '@/actions/emr/emrAuditActions'
import type { EMRAuditRow } from '@/types/emr'
import { Shield } from 'lucide-react'

export default function EMRAuditPanel({ patientId }: { patientId: string }) {
  const [logs, setLogs] = useState<EMRAuditRow[]>([])
  const [loading, setLoading] = useState(true)

  const loadLogs = useCallback(async () => {
    setLoading(true)
    const res = await getEMRAuditLogsAction(patientId)
    if (res.success && res.data) setLogs(res.data)
    setLoading(false)
  }, [patientId])

  useEffect(() => { loadLogs() }, [loadLogs])

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center gap-2 bg-slate-800 text-white p-4 rounded-xl shadow-inner">
        <Shield className="w-6 h-6 text-emerald-400" />
        <div>
          <h3 className="font-bold">Immutable Audit Trail</h3>
          <p className="text-xs text-slate-300">All actions are cryptographically sealed at the database level.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="p-3 font-semibold">Timestamp</th>
              <th className="p-3 font-semibold">Action</th>
              <th className="p-3 font-semibold">Table</th>
              <th className="p-3 font-semibold">Record ID</th>
              <th className="p-3 font-semibold">Changes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && <tr><td colSpan={5} className="p-4 text-center text-slate-400">Loading immutable logs...</td></tr>}
            {!loading && logs.map(l => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="p-3 whitespace-nowrap text-slate-500 text-xs font-mono">{new Date(l.action_time).toLocaleString()}</td>
                <td className="p-3 font-bold text-slate-700">{l.action}</td>
                <td className="p-3 text-slate-600">{l.table_name}</td>
                <td className="p-3 text-slate-400 text-xs font-mono">{l.record_id.slice(0, 8)}...</td>
                <td className="p-3">
                  {l.new_value && (
                    <pre className="text-[10px] bg-slate-100 p-1.5 rounded text-slate-600 max-w-[200px] overflow-hidden text-ellipsis">
                      {JSON.stringify(l.new_value)}
                    </pre>
                  )}
                </td>
              </tr>
            ))}
            {!loading && logs.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-slate-400">No audit logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
