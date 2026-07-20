'use client'

import React, { useState } from 'react'
import { X, CalendarDays, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function BookAppointmentModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <h2 className="font-bold text-slate-800">Book Appointment</h2>
            <p className="text-xs text-slate-500 mt-0.5">Schedule a new consultation</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Patient</label>
            <Input icon={<User className="w-4 h-4" />} placeholder="Select Patient..." />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Doctor</label>
            <select className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
              <option value="">Select Doctor</option>
              <option value="dr-neha">Dr. Neha Patel</option>
              <option value="dr-amit">Dr. Amit Shah</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Date</label>
              <div className="relative flex items-center">
                <CalendarDays className="w-4 h-4 text-slate-400 absolute left-3" />
                <input type="date" className="w-full text-sm border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Time Slot</label>
              <div className="relative flex items-center">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3" />
                <select className="w-full text-sm border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700 bg-white">
                  <option value="">Select Slot</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:15">10:15 AM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Visit Type</label>
              <select className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 outline-none">
                <option value="New">New</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Routine">Routine</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Consultation</label>
              <select className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 outline-none">
                <option value="In-Person">In-Person</option>
                <option value="Tele-consult">Tele-consult</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Source</label>
              <select className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 outline-none">
                <option value="Walk-in">Walk-in</option>
                <option value="Phone">Phone</option>
                <option value="App">App</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Reason for Visit</label>
            <textarea 
              rows={2} 
              className="w-full text-sm border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700 resize-none"
              placeholder="Brief description..."
            ></textarea>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 shrink-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onClose()} className="px-6">Book Appointment</Button>
        </div>
      </div>
    </div>
  )
}
