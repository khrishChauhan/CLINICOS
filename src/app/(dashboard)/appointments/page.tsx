'use client'

import React, { useState } from 'react';
import { BookAppointmentModal } from '@/components/appointments/BookAppointmentModal';
import WalkInRegistrationModal from '../queue/WalkInRegistrationModal';
import CancelAppointmentDialog from '@/components/appointments/CancelAppointmentDialog';
import RescheduleAppointmentDialog from '@/components/appointments/RescheduleAppointmentDialog';
import AppointmentDocumentsDialog from '@/components/appointments/AppointmentDocumentsDialog';
import AppointmentCommunicationDialog from '@/components/appointments/AppointmentCommunicationDialog';
import AppointmentFeedbackDialog from '@/components/appointments/AppointmentFeedbackDialog';
import AppointmentAuditTimeline from '@/components/appointments/AppointmentAuditTimeline';
import { CalendarDays, Filter, Plus, Search, Clock, FileText, Bell, Star, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { mockAppointments, mockDoctors } from '@/data/mockData';

export default function Appointments() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [cancelAptId, setCancelAptId] = useState<string | null>(null);
  const [rescheduleAptId, setRescheduleAptId] = useState<string | null>(null);
  const [docsAptId, setDocsAptId] = useState<string | null>(null);
  const [commAptId, setCommAptId] = useState<string | null>(null);
  const [feedbackAptId, setFeedbackAptId] = useState<string | null>(null);
  const [auditAptId, setAuditAptId] = useState<string | null>(null);

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <BookAppointmentModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      {isWalkInOpen && <WalkInRegistrationModal onClose={() => setIsWalkInOpen(false)} onSuccess={() => { setIsWalkInOpen(false); window.location.reload(); }} />}
      {cancelAptId && <CancelAppointmentDialog appointmentId={cancelAptId} onClose={() => setCancelAptId(null)} onSuccess={() => { setCancelAptId(null); window.location.reload(); }} />}
      {rescheduleAptId && <RescheduleAppointmentDialog appointmentId={rescheduleAptId} onClose={() => setRescheduleAptId(null)} onSuccess={() => { setRescheduleAptId(null); window.location.reload(); }} />}
      {docsAptId && <AppointmentDocumentsDialog appointmentId={docsAptId} onClose={() => setDocsAptId(null)} />}
      {commAptId && <AppointmentCommunicationDialog appointmentId={commAptId} onClose={() => setCommAptId(null)} />}
      {feedbackAptId && <AppointmentFeedbackDialog appointmentId={feedbackAptId} onClose={() => setFeedbackAptId(null)} />}
      {auditAptId && <AppointmentAuditTimeline appointmentId={auditAptId} onClose={() => setAuditAptId(null)} />}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-center p-3 border-r border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queue Total</p>
            <h4 className="text-2xl font-black text-slate-700 mt-1">{mockAppointments.length}</h4>
          </div>
          <div className="text-center p-3 border-r border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-blue-500">In Waiting</p>
            <h4 className="text-2xl font-black text-blue-600 mt-1">
              {mockAppointments.filter(a => a.status === 'Waiting').length}
            </h4>
          </div>
          <div className="text-center p-3 border-r border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-green-500">Served</p>
            <h4 className="text-2xl font-black text-green-600 mt-1">
              {mockAppointments.filter(a => a.status === 'Completed').length}
            </h4>
          </div>
          <div className="text-center p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-red-500">Cancelled</p>
            <h4 className="text-2xl font-black text-red-600 mt-1">0</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-500" />
                <input 
                  className="font-bold text-slate-700 bg-transparent focus:outline-none text-sm border-b border-slate-200" 
                  type="date" 
                  defaultValue="2026-06-24" 
                />
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">Doctor:</span>
                <select className="bg-transparent font-bold text-slate-700 focus:outline-none text-xs">
                  <option value="All">All Doctors</option>
                  {mockDoctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setIsWalkInOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-3.5 h-3.5" /> Book Walk-In
                </Button>
                <Button size="sm" onClick={() => setIsBookingOpen(true)}>
                  <Plus className="w-3.5 h-3.5" /> Book Appt
                </Button>
              </div>
            </Card>

            <div className="relative">
              <Input 
                icon={<Search className="w-4.5 h-4.5" />} 
                placeholder="Search appointments by Patient name..." 
                className="py-2.5 bg-white shadow-sm"
              />
            </div>

            <Card className="overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">Token Queue Schedule</h3>
                <span className="text-xs text-slate-400">{mockAppointments.length} Appointments scheduled</span>
              </div>
              <div className="divide-y divide-slate-100">
                {mockAppointments.map((apt, idx) => (
                  <div key={apt.id} className="p-4 hover:bg-slate-50/50 transition flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex gap-4 items-start">
                      <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                        <span className="text-[9px] uppercase tracking-wider font-semibold opacity-60">Token</span>
                        <span className="text-sm font-black leading-none mt-0.5">#{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm">{apt.patient}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({apt.id.replace('APT', 'PAT')})</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                          <span className="text-slate-700 font-medium">Dr: {apt.doctor}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {apt.time}
                          </span>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px]">{apt.type}</span>
                        </div>
                        <p className="text-xs text-slate-400 italic mt-1 line-clamp-1">"Routine checkup"</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                      <Badge variant={apt.status === 'Completed' ? 'success' : apt.status === 'In Progress' ? 'info' : 'warning'}>
                        {apt.status}
                      </Badge>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setDocsAptId(apt.id)}
                          className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-xs font-semibold transition" 
                          title="Documents"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setCommAptId(apt.id)}
                          className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-xs font-semibold transition" 
                          title="Comm History"
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                        {apt.status !== 'Completed' && (
                          <button 
                            onClick={() => setRescheduleAptId(apt.id)}
                            className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-xs font-semibold transition"
                          >
                            Reschedule
                          </button>
                        )}
                        {apt.status === 'Completed' && (
                          <button 
                            onClick={() => setFeedbackAptId(apt.id)}
                            className="px-2 py-1 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded text-xs font-semibold transition flex items-center gap-1"
                            title="Patient Feedback"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button 
                          onClick={() => setAuditAptId(apt.id)}
                          className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded text-xs font-semibold transition"
                          title="Audit Trail"
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setCancelAptId(apt.id)}
                          className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-semibold transition" 
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="p-5 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none">
              <h3 className="font-bold mb-1">Quick Actions</h3>
              <p className="text-xs text-blue-200 mb-4">Fast access to common tasks</p>
              <div className="space-y-2">
                <button className="w-full bg-white/10 hover:bg-white/20 transition px-3 py-2 rounded-lg text-sm text-left flex items-center justify-between">
                  <span>Block Doctor Calendar</span>
                  <CalendarDays className="w-4 h-4 opacity-70" />
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 transition px-3 py-2 rounded-lg text-sm text-left flex items-center justify-between">
                  <span>Reschedule Bulk Tokens</span>
                  <Clock className="w-4 h-4 opacity-70" />
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}