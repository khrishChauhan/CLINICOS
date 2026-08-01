import React from 'react'
import { RadiologyTabs } from '../RadiologyTabs'
import { Shield, Activity, Lock } from 'lucide-react'
import { getRadiologyAuditAction } from '@/actions/radiology/radiologyPhase5Actions'
import dayjs from 'dayjs'

export default async function RadiologyAuditPage() {
  const { data: auditLogs } = await getRadiologyAuditAction()
  const list = auditLogs || []

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-500" /> Immutable Audit Log
        </h1>
        <p className="text-sm text-slate-500 mt-1">Append-only compliance tracking for the entire radiology module.</p>
      </div>

      <RadiologyTabs />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-500" /> System Events
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Performed By</th>
                <th className="px-6 py-4 font-semibold">Order Ref</th>
                <th className="px-6 py-4 font-semibold">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!list.length ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-800">No audit events logged.</p>
                  </td>
                </tr>
              ) : (
                list.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {dayjs(log.action_time).format('YYYY-MM-DD HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{log.action}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{log.user?.first_name} {log.user?.last_name}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">{log.user?.role}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-bold">
                      {log.order?.order_number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate text-xs text-slate-500 bg-slate-50 p-1 rounded font-mono" title={JSON.stringify(log.new_value)}>
                        {log.new_value ? JSON.stringify(log.new_value) : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
