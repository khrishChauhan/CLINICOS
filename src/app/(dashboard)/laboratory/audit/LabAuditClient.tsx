'use client'

import React, { useState } from 'react'
import { History, Search, ShieldCheck } from 'lucide-react'
import dayjs from 'dayjs'
import { LaboratoryTabs } from '../LaboratoryTabs'

export default function LabAuditClient({ auditLogs }: { auditLogs: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.actor?.first_name + ' ' + log.actor?.last_name).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-blue-500" /> Laboratory Audit Log
          </h1>
          <p className="text-sm text-slate-500">Immutable record of all laboratory actions</p>
        </div>
      </div>

      <LaboratoryTabs />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by action or user..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Performed By</th>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!filteredLogs.length ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-800">No audit records found.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {dayjs(log.action_time).format('DD MMM YYYY, h:mm:ss A')}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {log.action}
                    </td>
                    <td className="px-6 py-4">
                      {log.actor?.first_name} {log.actor?.last_name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {log.lab_order_id ? log.lab_order_id.substring(0, 8) + '...' : '—'}
                    </td>
                    <td className="px-6 py-4 text-xs max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {log.metadata ? JSON.stringify(log.metadata) : (log.table_name || '—')}
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
