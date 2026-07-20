'use client'

import React, { useState } from 'react'
import { CalendarDays, Clock, Plus, Trash2, Edit2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { mockDoctors } from '@/data/mockData'

export default function AvailabilityManager() {
  const [selectedDoctor, setSelectedDoctor] = useState(mockDoctors[0]?.id || '')

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Availability Manager</h1>
          <p className="text-sm text-slate-500 mt-1">Manage doctor working hours, breaks, and appointment slots</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="text-sm font-bold border border-slate-200 rounded-xl px-4 py-2 bg-white text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {mockDoctors.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </select>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              General Availability
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <button key={day} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${day !== 'Sun' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Available From</label>
                  <input type="time" defaultValue="09:00" className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none text-slate-700" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Available To</label>
                  <input type="time" defaultValue="17:00" className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none text-slate-700" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Break Start</label>
                  <input type="time" defaultValue="13:00" className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none text-slate-700" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Break End</label>
                  <input type="time" defaultValue="14:00" className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none text-slate-700" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Consultation Mode</label>
                  <select className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none text-slate-700">
                    <option value="In-Person">In-Person</option>
                    <option value="Tele-consult">Tele-consult</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Appointment Slots Templates
              </h3>
              <Button size="sm" variant="outline">
                <Plus className="w-3.5 h-3.5" /> Add Template
              </Button>
            </div>

            <div className="space-y-4">
              {/* Mock slot template 1 */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-200 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="success">Active</Badge>
                    <span className="font-bold text-slate-700 text-sm">Morning Slots (Mon-Fri)</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>09:00 AM - 01:00 PM</span>
                    <span>•</span>
                    <span>15 min duration</span>
                    <span>•</span>
                    <span>Max 1 patient/slot</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mock slot template 2 */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-200 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="success">Active</Badge>
                    <span className="font-bold text-slate-700 text-sm">Afternoon Slots (Mon-Fri)</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>02:00 PM - 05:00 PM</span>
                    <span>•</span>
                    <span>15 min duration</span>
                    <span>•</span>
                    <span>Max 1 patient/slot</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
