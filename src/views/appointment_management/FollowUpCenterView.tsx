import React from 'react';
import { Phone, Calendar, User, Search, Filter, Bell, MessageSquare, CheckCircle, Clock } from 'lucide-react';

const followUpData = [
  { id: 'F-1', patient: 'Rahul Sharma', phone: '+91 98765 43210', condition: 'Post-Surgery Check', dateDue: 'Today', status: 'Pending', doctor: 'Dr. Alok Mehta' },
  { id: 'F-2', patient: 'Anjali Desai', phone: '+91 91234 56789', condition: 'Annual Wellness Report', dateDue: 'Tomorrow', status: 'Pending', doctor: 'Dr. Sarah Smith' },
  { id: 'F-3', patient: 'Vikram Sethi', phone: '+91 99887 76655', condition: 'Diabetes Management', dateDue: 'Today', status: 'Called - No Answer', doctor: 'Dr. Alok Mehta' },
  { id: 'F-4', patient: 'Priya Verma', phone: '+91 98888 77777', condition: 'Lab Results Review', dateDue: 'Yesterday', status: 'Overdue', doctor: 'Dr. K. L. Rao' },
  { id: 'F-5', patient: 'Sunil Gavaskar', phone: '+91 90000 11111', condition: 'Orthopedic Follow-up', dateDue: 'Today', status: 'Completed', doctor: 'Dr. Sarah Smith' },
];

export default function FollowUpCenterView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Follow-up Center</h1>
          <p className="text-sm text-slate-500 mt-1">Manage outbound calls and patient return visits.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Phone className="w-4 h-4" /> Start Auto-Dialer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Due Today</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">12</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Overdue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">4</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">8</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">64%</h3>
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
                  placeholder="Search patients..." 
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
                />
             </div>
             <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 border-b border-slate-200 font-medium sticky top-0 z-10 w-full">
              <tr>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Follow-up Reason</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {followUpData.map((row, i) => (
                <tr key={i} className="transition-colors group hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{row.patient}</p>
                    <p className="text-xs text-slate-500">{row.doctor}</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700">{row.phone}</td>
                  <td className="px-5 py-4 text-slate-700">{row.condition}</td>
                  <td className="px-5 py-4 font-medium text-slate-900">{row.dateDue}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                      row.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      row.status === 'Overdue' ? 'bg-rose-100 text-rose-700' :
                      row.status === 'Called - No Answer' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Message">
                         <MessageSquare className="w-5 h-5" />
                       </button>
                       <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Log Call">
                         <Phone className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
