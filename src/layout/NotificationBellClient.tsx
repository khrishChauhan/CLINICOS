'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, CheckCircle2 } from 'lucide-react'
import { fetchMyNotificationsAction, markNotificationReadAction } from '@/actions/notifications/notificationActions'
import type { NotificationRow } from '@/types/notifications'

export default function NotificationBellClient() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      const res = await fetchMyNotificationsAction()
      if (res.ok && res.data) {
        setNotifications(res.data)
      }
      setLoading(false)
    }
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.is_read).length

  async function handleMarkRead(id: string) {
    const res = await markNotificationReadAction(id)
    if (res.ok) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/80 rounded-lg relative transition border border-transparent hover:border-slate-200/50"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full ring-2 ring-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="bg-slate-50 p-3 border-b flex justify-between items-center">
            <h3 className="font-bold text-slate-700 text-sm">Notifications</h3>
            {unreadCount > 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} New</span>}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 flex gap-3 ${n.is_read ? 'opacity-60 bg-white' : 'bg-blue-50/50'}`}>
                    <div className="mt-1 flex-shrink-0">
                      {n.type === 'Alert' ? <div className="w-2 h-2 mt-1 rounded-full bg-red-500" /> : 
                       n.type === 'Success' ? <div className="w-2 h-2 mt-1 rounded-full bg-emerald-500" /> :
                       <div className="w-2 h-2 mt-1 rounded-full bg-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${n.is_read ? 'text-slate-600' : 'text-slate-800 font-semibold'}`}>{n.title}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                    {!n.is_read && (
                      <button 
                        onClick={() => handleMarkRead(n.id)}
                        className="text-slate-400 hover:text-blue-600 p-1"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
