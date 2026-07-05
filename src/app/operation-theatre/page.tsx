import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function OperationTheatre() {
  const currentOperations = [
    { 
      id: 'OT-001', 
      procedure: 'Appendectomy', 
      patient: 'Anjali Pillai (PAT-0100)',
      surgeon: 'Dr. Priya Rao',
      anesthesiologist: 'Kiran Pillai',
      time: '08:00 AM',
      duration: '1.2 Hours',
      staff: 'Isha Srivastava, Senior Nurse Jyoti',
      status: 'In Progress'
    }
  ];

  const upcomingOperations = [
    { procedure: 'Inguinal Hernia Repair', date: '2026-06-26', patient: 'Vikram Singh Gill', surgeon: 'Dr. Sanjay Nair' },
    { procedure: 'Laparoscopic Cholecystectomy', date: '2026-06-26', patient: 'Neha Shah', surgeon: 'Dr. Priya Rao' },
    { procedure: 'Laparoscopic Cholecystectomy', date: '2026-06-30', patient: 'Ritu Chatterjee', surgeon: 'Dr. Vikram Shah' },
    { procedure: 'Arthroscopic Knee Menisectomy', date: '2026-06-29', patient: 'Deepak Pandey', surgeon: 'Dr. Priya Rao' },
  ];

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs p-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Durga Clinic Major Operation Theatre</h1>
            <p className="text-slate-500 text-xs mt-0.5">Oversee surgery calendar bookings, clinical surgeons and anesthesiologist duty slots</p>
          </div>
          <div className="flex items-center gap-2 border-b border-slate-200">
            <Calendar className="w-4 h-4 text-blue-500" />
            <input className="font-bold text-slate-700 bg-transparent focus:outline-none" type="date" defaultValue="2026-06-24" />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2">OT Operations scheduled on 2026-06-24</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {currentOperations.map((op) => (
                  <div key={op.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-slate-400 font-bold block text-[10px]">{op.id}</span>
                        <h4 className="text-sm font-bold text-slate-800 mt-1">{op.procedure}</h4>
                        <p className="text-slate-500 font-medium mt-0.5">Patient: <span className="font-bold text-slate-700">{op.patient}</span></p>
                      </div>
                      <Badge variant="info" className="text-[10px] bg-blue-50 border-blue-100">
                        {op.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-3 rounded-lg text-[11px] text-slate-600">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Lead Surgeon</span>
                        <span className="font-bold text-slate-800">{op.surgeon}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Anesthesia Assistant</span>
                        <span className="font-bold text-slate-800">{op.anesthesiologist}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Scheduled Time</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {op.time} ({op.duration})
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>OT Staff: {op.staff}</span>
                      <Button variant="primary" className="px-2 py-1 text-[9px] bg-green-600 hover:bg-green-700">Mark Completed</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2">Upcoming Operations</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {upcomingOperations.map((op, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span className="truncate max-w-[120px]">{op.procedure}</span>
                    <span className="text-[10px] text-blue-600 font-semibold">{op.date}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Patient: {op.patient}</p>
                  <p className="text-[10px] text-slate-400">Surgeon: {op.surgeon}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}