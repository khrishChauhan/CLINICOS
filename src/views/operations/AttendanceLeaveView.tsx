import React from 'react';
import { CalendarClock, CheckCircle, Clock, AlertTriangle, CalendarDays } from 'lucide-react';

const leaveData = [
  { id: 'L-01', staff: 'Ravi Teja', type: 'Sick Leave', duration: 'Oct 12 - Oct 13', days: 2, status: 'Approved' },
  { id: 'L-02', staff: 'Dr. Sarah Smith', type: 'Annual Leave', duration: 'Oct 20 - Oct 25', days: 6, status: 'Pending Approval' },
  { id: 'L-03', staff: 'Anita Patel', type: 'Casual Leave', duration: 'Oct 15', days: 1, status: 'Approved' },
  { id: 'L-04', staff: 'Sanjay Gupta', type: 'Unpaid Leave', duration: 'Oct 08 - Oct 10', days: 3, status: 'Rejected' },
];

export default function AttendanceLeaveView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance & Leave</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor staff checking in/out and manage leave requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
            <CalendarDays className="w-4 h-4" /> View Rooster
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Present Today</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">28 <span className="text-sm text-slate-400 font-medium">/ 32</span></h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Leave Requests</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">1</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Absent / On Leave</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">4</h3>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Leave Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 border-b border-slate-200 font-medium">
              <tr>
                <th className="px-5 py-3">Staff Member</th>
                <th className="px-5 py-3">Leave Type</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaveData.map((row, i) => (
                <tr key={i} className="transition-colors hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-slate-900">{row.staff}</td>
                  <td className="px-5 py-4 text-slate-700">{row.type}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{row.duration}</p>
                    <p className="text-xs text-slate-500">{row.days} days</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                      row.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      row.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {row.status === 'Pending Approval' && (
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded hover:bg-rose-100 transition-colors">Reject</button>
                        <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded hover:bg-emerald-100 transition-colors">Approve</button>
                      </div>
                    )}
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
