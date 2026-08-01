import React from 'react'
import { RadiologyTabs } from '../RadiologyTabs'
import { Bell, Activity, Send } from 'lucide-react'
import { getRadiologyNotificationsAction } from '@/actions/radiology/radiologyPhase5Actions'
import dayjs from 'dayjs'

export default async function RadiologyNotificationsPage() {
  const { data: notifications } = await getRadiologyNotificationsAction()
  const list = notifications || []

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-500" /> Notifications History
        </h1>
        <p className="text-sm text-slate-500 mt-1">Track delivery status of radiology alerts and messages.</p>
      </div>

      <RadiologyTabs />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-500" /> Dispatch Log
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Order / Patient</th>
                <th className="px-6 py-4 font-semibold">Recipient</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!list.length ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-800">No notifications dispatched.</p>
                  </td>
                </tr>
              ) : (
                list.map((n: any) => (
                  <tr key={n.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-slate-900">{n.order?.order_number}</div>
                      <div className="text-xs text-slate-500">{n.order?.patient?.first_name} {n.order?.patient?.last_name}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{n.recipient_type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        n.notification_type === 'Critical Findings' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {n.notification_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{n.status}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                      {n.sent_at ? dayjs(n.sent_at).format('DD MMM YYYY, HH:mm:ss') : '-'}
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
