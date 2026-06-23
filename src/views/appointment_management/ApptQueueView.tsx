import React from 'react';
import { Users, Clock, AlertCircle, ArrowRight, MonitorPlay, Search, Filter, MoreHorizontal, UserCheck, PlayCircle } from 'lucide-react';

const queueData = [
  { id: 'Q-101', token: 'A-14', patient: 'Rajesh Kumar', doctor: 'Dr. Alok Mehta', timeIn: '09:15 AM', waitTime: '45 mins', status: 'Waiting', type: 'Consultation' },
  { id: 'Q-102', token: 'A-15', patient: 'Priya Sharma', doctor: 'Dr. Alok Mehta', timeIn: '09:30 AM', waitTime: '30 mins', status: 'Waiting', type: 'Follow-up' },
  { id: 'Q-103', token: 'B-04', patient: 'Amit Singh', doctor: 'Dr. Sarah Smith', timeIn: '09:45 AM', waitTime: '15 mins', status: 'Triage', type: 'Consultation' },
  { id: 'Q-104', token: 'A-13', patient: 'Sneha Patel', doctor: 'Dr. Alok Mehta', timeIn: '09:00 AM', waitTime: '60 mins', status: 'In Consultation', type: 'Consultation' },
  { id: 'Q-105', token: 'C-08', patient: 'Vikram Verma', doctor: 'Dr. K. L. Rao', timeIn: '09:50 AM', waitTime: '10 mins', status: 'Waiting', type: 'Report Review' },
  { id: 'Q-106', token: 'B-05', patient: 'Anjali Desai', doctor: 'Dr. Sarah Smith', timeIn: '09:55 AM', waitTime: '5 mins', status: 'Waiting', type: 'Consultation' },
];

export default function ApptQueueView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Queue Management</h1>
          <p className="text-sm text-slate-500 mt-1">Live tracking of patients waiting in the clinic.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm">
            <MonitorPlay className="w-4 h-4" /> Open TV Display
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total in Waiting Room</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">14</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Average Wait Time</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">22m</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">SLA Breached {`(>45m)`}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">1</h3>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-18rem)] min-h-[400px]">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Search token or patient..." 
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
                />
             </div>
             <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />
             </button>
          </div>
          <div className="flex bg-white rounded-md border border-slate-200 p-1 w-full sm:w-auto">
             <button className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-800 rounded">All Waiting (14)</button>
             <button className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 rounded">Dr. Mehta (6)</button>
             <button className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 rounded">Dr. Smith (3)</button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 border-b border-slate-200 font-medium sticky top-0 z-10 w-full">
              <tr>
                <th className="px-5 py-3">Token #</th>
                <th className="px-5 py-3">Patient Details</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Wait Time</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queueData.map((row, i) => {
                const isBreach = row.waitTime === '45 mins' || row.waitTime === '60 mins';
                return (
                  <tr key={i} className={`transition-colors group hover:bg-slate-50 ${isBreach ? 'bg-rose-50/30' : ''}`}>
                    <td className="px-5 py-4">
                      <span className="font-bold text-lg text-slate-900 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                        {row.token}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{row.patient}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{row.type}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">{row.doctor}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isBreach ? 'text-rose-600' : 'text-slate-700'}`}>
                          {row.waitTime}
                        </span>
                        {isBreach && <AlertCircle className="w-4 h-4 text-rose-500" />}
                      </div>
                      <p className="text-[11px] text-slate-500">In at: {row.timeIn}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                        row.status === 'Waiting' ? 'bg-amber-100 text-amber-700' :
                        row.status === 'Triage' ? 'bg-blue-100 text-blue-700' :
                        row.status === 'In Consultation' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         {row.status === 'Waiting' && (
                           <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Send to Triage">
                             <UserCheck className="w-5 h-5" />
                           </button>
                         )}
                         <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Call Now (Override)">
                           <PlayCircle className="w-5 h-5" />
                         </button>
                         <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors">
                           <MoreHorizontal className="w-5 h-5" />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
