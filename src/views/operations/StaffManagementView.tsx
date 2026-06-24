import React, { useState } from 'react';
import { UserPlus, Search, Filter, Mail, Phone, Edit, BadgeCheck, ShieldAlert, X, Activity, Calendar, Download, MoreVertical, MapPin, CheckSquare, MessageSquare, Trash2 } from 'lucide-react';

const staffData = [
  { id: 'EMP-001', name: 'Dr. Alok Mehta', role: 'Chief Medical Officer', dept: 'Clinical', status: 'Active', email: 'alok.m@durgaclinic.com', phone: '+91 98000 00001', specialty: 'Cardiology', experience: '15 Yrs', education: 'MBBS, MD', joined: '2015-04-12' },
  { id: 'EMP-002', name: 'Dr. Sarah Smith', role: 'Senior Physician', dept: 'Clinical', status: 'Active', email: 'sarah.s@durgaclinic.com', phone: '+91 98000 00002', specialty: 'General Medicine', experience: '10 Yrs', education: 'MBBS', joined: '2018-09-01' },
  { id: 'EMP-005', name: 'Ravi Teja', role: 'Head Nurse', dept: 'Nursing', status: 'On Leave', email: 'ravi.t@durgaclinic.com', phone: '+91 98000 00005', specialty: 'Emergency Care', experience: '8 Yrs', education: 'B.Sc Nursing', joined: '2019-11-20' },
  { id: 'EMP-009', name: 'Anita Patel', role: 'Front Desk Lead', dept: 'Administration', status: 'Active', email: 'anita.p@durgaclinic.com', phone: '+91 98000 00009', specialty: 'Admin', experience: '5 Yrs', education: 'BBA', joined: '2021-02-15' },
  { id: 'EMP-012', name: 'Sanjay Gupta', role: 'Billing Specialist', dept: 'Finance', status: 'Suspended', email: 'sanjay.g@durgaclinic.com', phone: '+91 98000 00012', specialty: 'Finance', experience: '4 Yrs', education: 'B.Com', joined: '2022-06-10' },
];

export default function StaffManagementView() {
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleSelectAll = () => {
    if (selectedRows.length === staffData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(staffData.map((_, i) => i));
    }
  };

  const toggleSelectRow = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const isAllSelected = selectedRows.length > 0 && selectedRows.length === staffData.length;
  const hasSelection = selectedRows.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Management</h1>
          <p className="text-sm text-slate-500 mt-1">Directory of all clinic employees, roles, and access levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <UserPlus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)] min-h-[400px]">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 transition-all">
          {hasSelection ? (
            <div className="flex items-center gap-4 w-full animate-in fade-in slide-in-from-left-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-indigo-700">{selectedRows.length} selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  <Mail className="w-4 h-4" /> Email All
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors">
                  <Trash2 className="w-4 h-4" /> Suspend
                </button>
              </div>
              <button onClick={() => setSelectedRows([])} className="text-sm text-slate-500 font-medium hover:text-slate-700 ml-auto mr-2">Clear</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto animate-in fade-in">
               <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="text" placeholder="Search staff members..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white" />
               </div>
               <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors">
                  <Filter className="w-4 h-4" />
               </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-x-auto relative">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 border-b border-slate-200 font-medium sticky top-0 z-10 w-full">
              <tr>
                <th className="px-5 py-3 w-12 text-center border-r border-slate-100">
                  <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" checked={isAllSelected} onChange={toggleSelectAll} />
                </th>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Role & Dept</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffData.map((row, i) => {
                const isSelected = selectedRows.includes(i);
                return (
                <tr key={i} className={`transition-colors group cursor-pointer ${isSelected ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`} onClick={() => setSelectedStaff(row)}>
                  <td className="px-5 py-4 text-center border-r border-slate-100" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" checked={isSelected} onChange={() => toggleSelectRow(i)} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs flex-shrink-0">
                        {row.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{row.name}</p>
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
                  <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                       <button className="p-1.5 hover:text-blue-600 rounded" title="Edit Profile"><Edit className="w-4 h-4" /></button>
                       <button className="p-1.5 hover:text-indigo-600 rounded" title="Permissions"><BadgeCheck className="w-4 h-4" /></button>
                       {row.status === 'Suspended' && <button className="p-1.5 hover:text-rose-600 rounded" title="Alert"><ShieldAlert className="w-4 h-4 text-rose-500" /></button>}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Profile Side Drawer Overlay */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
             
             {/* Drawer Header */}
             <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Staff Profile</h2>
                <button onClick={() => setSelectedStaff(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>

             {/* Drawer Content */}
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Profile Header Card */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-sm flex items-center justify-center mb-4 text-3xl font-bold text-slate-400">
                    {selectedStaff.name.split(' ').map((n:any)=>n[0]).join('').substring(0,2)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedStaff.name}</h3>
                  <p className="text-primary font-medium text-sm mt-0.5">{selectedStaff.role}</p>
                  <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600 tracking-wider font-mono">
                    {selectedStaff.id}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Department</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedStaff.dept}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</p>
                    <p className="text-sm font-bold text-emerald-600 mt-0.5">{selectedStaff.status}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                   <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Contact Details</h4>
                   <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Mail className="w-4 h-4"/></div>
                        <div>
                          <p className="text-xs text-slate-500">Email Address</p>
                          <p className="text-sm font-medium text-slate-900">{selectedStaff.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Phone className="w-4 h-4"/></div>
                        <div>
                          <p className="text-xs text-slate-500">Phone Number</p>
                          <p className="text-sm font-medium text-slate-900">{selectedStaff.phone}</p>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Professional Info */}
                {selectedStaff.dept === 'Clinical' && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Professional Credentials</h4>
                    <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">Specialty</span>
                          <span className="text-sm font-bold text-slate-900">{selectedStaff.specialty}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">Experience</span>
                          <span className="text-sm font-bold text-slate-900">{selectedStaff.experience}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">Education</span>
                          <span className="text-sm font-bold text-slate-900">{selectedStaff.education}</span>
                        </div>
                    </div>
                  </div>
                )}

                {/* Activity Summary */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Activity Summary</h4>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                       <Activity className="w-5 h-5 text-indigo-500 mb-2" />
                       <span className="text-xl font-bold text-slate-900">142</span>
                       <span className="text-xs text-slate-500">Cases this month</span>
                     </div>
                     <div className="border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                       <Calendar className="w-5 h-5 text-emerald-500 mb-2" />
                       <span className="text-xl font-bold text-slate-900">98%</span>
                       <span className="text-xs text-slate-500">Attendance Rate</span>
                     </div>
                  </div>
                </div>

             </div>

             {/* Drawer Footer Actions */}
             <div className="p-4 border-t border-slate-100 flex gap-3">
               <button className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                 Edit Details
               </button>
               <button className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                 <MessageSquare className="w-4 h-4" /> Message
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
