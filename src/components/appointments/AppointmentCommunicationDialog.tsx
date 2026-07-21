'use client'

import React, { useState, useEffect } from 'react'
import { fetchAppointmentRemindersAction, fetchAppointmentNotificationsAction } from '@/actions/appointments/appointmentCommunicationActions'
import type { AppointmentReminderRow, AppointmentNotificationRow } from '@/types/appointments'
import { X, Bell, MessageSquare, Clock } from 'lucide-react'

interface Props {
  appointmentId: string
  onClose: () => void
}

export default function AppointmentCommunicationDialog({ appointmentId, onClose }: Props) {
  const [reminders, setReminders] = useState<AppointmentReminderRow[]>([])
  const [notifications, setNotifications] = useState<AppointmentNotificationRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [remRes, notRes] = await Promise.all([
        fetchAppointmentRemindersAction(appointmentId),
        fetchAppointmentNotificationsAction(appointmentId)
      ])
      if (remRes.success) setReminders(remRes.data)
      if (notRes.success) setNotifications(notRes.data)
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Communication History</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Reminders Column */}
          <div className="flex-1 border-r border-slate-100 p-6 overflow-y-auto bg-slate-50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-500" /> Scheduled Reminders
            </h3>
            {loading ? <p className="text-sm text-slate-400">Loading...</p> : reminders.length === 0 ? <p className="text-sm text-slate-400">No reminders scheduled.</p> : (
              <div className="space-y-3">
                {reminders.map(r => (
                  <div key={r.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-800">{r.reminder_type}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${r.delivery_status === 'Scheduled' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {r.delivery_status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> via {r.reminder_channel}
                    </p>
                    <p className="text-slate-400 text-[10px] mt-2">
                      Target: {new Date(r.scheduled_time).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Column */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-indigo-500" /> Notifications Sent
            </h3>
            {loading ? <p className="text-sm text-slate-400">Loading...</p> : notifications.length === 0 ? <p className="text-sm text-slate-400">No notifications dispatched.</p> : (
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm relative">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-800">{n.notification_type}</span>
                    </div>
                    <p className="text-slate-500 text-xs">
                      Channel: <span className="font-medium text-slate-700">{n.channel}</span>
                    </p>
                    <p className="text-slate-400 text-[10px] mt-2">
                      Sent at: {n.sent_at ? new Date(n.sent_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
