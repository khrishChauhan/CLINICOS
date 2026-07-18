import React from 'react';
import { Stethoscope } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockDoctors } from '@/data/mockData';

export default function Doctors() {
  const departments = [
    'All Departments', 'General Medicine', 'Gynecology', 'Pediatrics', 
    'Cardiology', 'Dermatology', 'Orthopedics', 'General Surgery', 
    'Ophthalmology', 'Neurology', 'ENT Specialization'
  ];

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <div className="space-y-5 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Durga Clinic Specialist Panel</h1>
              <p className="text-slate-500 text-xs mt-0.5">Manage physician duties, availability schedules, and OPD queues</p>
            </div>
          </div>

          <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {departments.map((dept, idx) => (
                <button 
                  key={dept}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  {dept}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-slate-500 font-medium">Duty status:</span>
              <select className="bg-transparent font-bold text-slate-700 focus:outline-none">
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDoctors.map((doc) => (
              <Card key={doc.id} className="p-5 hover:border-blue-200 hover:shadow-md transition duration-300 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100 shadow-xs">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <Badge variant={doc.available ? 'success' : 'default'} className={!doc.available ? 'bg-slate-100 text-slate-500 border-slate-200' : ''}>
                      {doc.available ? 'Available' : 'On Leave'}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base leading-snug">{doc.name}</h3>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{doc.education}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div>
                      <span className="font-bold text-slate-400 text-[9px] uppercase tracking-wider block">Today's Token</span>
                      <span className="text-sm font-bold text-slate-800">{doc.patientsToday}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 text-[9px] uppercase tracking-wider block">Waiting</span>
                      <span className="text-sm font-bold text-amber-600">{Math.floor(doc.patientsToday / 3)}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full text-center py-2 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white rounded-lg text-xs font-bold transition shadow-2xs hover:shadow-xs border border-slate-100">
                  View Schedule & History
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}