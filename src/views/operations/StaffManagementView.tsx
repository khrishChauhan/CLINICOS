import React from 'react';
import { UserPlus, Search, Filter, Mail, Phone, Edit, BadgeCheck, ShieldAlert } from 'lucide-react';

const staffData = [
  { id: 'EMP-001', name: 'Dr. Alok Mehta', role: 'Chief Medical Officer', dept: 'Clinical', status: 'Active', email: 'alok.m@durgaclinic.com', phone: '+91 98000 00001' },
  { id: 'EMP-002', name: 'Dr. Sarah Smith', role: 'Senior Physician', dept: 'Clinical', status: 'Active', email: 'sarah.s@durgaclinic.com', phone: '+91 98000 00002' },
  { id: 'EMP-005', name: 'Ravi Teja', role: 'Head Nurse', dept: 'Nursing', status: 'On Leave', email: 'ravi.t@durgaclinic.com', phone: '+91 98000 00005' },
  { id: 'EMP-009', name: 'Anita Patel', role: 'Front Desk Lead', dept: 'Administration', status: 'Active', email: 'anita.p@durgaclinic.com', phone: '+91 98000 00009' },
  { id: 'EMP-012', name: 'Sanjay Gupta', role: 'Billing Specialist', dept: 'Finance', status: 'Suspended', email: 'sanjay.g@durgaclinic.com', phone: '+91 98000 00012' },
];

export default function StaffManagementView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Management</h1>
          <p className="text-sm text-slate-500 mt-1">Directory of all clinic employees, roles, and access levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <UserPlus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)] min-h-[400px]">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input type="text" placeholder="Search staff members..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white" />
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
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Role & Dept</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffData.map((row, i) => (
                <tr key={i} className="transition-colors group hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                        {row.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{row.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{row.role}</p>
                    <p className="text-xs text-slate-500">{row.dept}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-slate-600 flex items-center gap-1"><Mail className="w-3 h-3"/> {row.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3"/> {row.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                      row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      row.status === 'Suspended' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                       <button className="p-1.5 hover:text-blue-600 rounded" title="Edit Profile"><Edit className="w-4 h-4" /></button>
                       <button className="p-1.5 hover:text-indigo-600 rounded" title="Permissions"><BadgeCheck className="w-4 h-4" /></button>
                       {row.status === 'Suspended' && <button className="p-1.5 hover:text-rose-600 rounded" title="Alert"><ShieldAlert className="w-4 h-4 text-rose-500" /></button>}
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
