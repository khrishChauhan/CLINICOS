import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, ChevronDown, Calendar, MoreHorizontal } from 'lucide-react';

const chartData = [
  { name: 'Mon', patients: 40, revenue: 2400 },
  { name: 'Tue', patients: 30, revenue: 1398 },
  { name: 'Wed', patients: 20, revenue: 9800 },
  { name: 'Thu', patients: 27, revenue: 3908 },
  { name: 'Fri', patients: 18, revenue: 4800 },
  { name: 'Sat', patients: 23, revenue: 3800 },
  { name: 'Sun', patients: 34, revenue: 4300 },
];

export default function ComponentsView() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* 3. Button Variants */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-secondary mb-6">3. Button Variants</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-wrap gap-6 items-center">
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Primary Action
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm">
            Secondary Outline
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm">
            Dark Action
          </button>
          <button className="px-4 py-2 text-danger font-medium hover:bg-red-50 rounded-lg transition-colors">
            Danger Text
          </button>
          <button className="px-4 py-2 bg-danger text-white rounded-lg font-medium hover:bg-red-600 transition-colors shadow-sm">
            Destructive
          </button>
          <button className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
            Ghost Button
          </button>
        </div>
      </div>

      {/* 4. Form Components & 5. Input Components */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-secondary mb-6">4 & 5. Form & Input Components</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. John" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Doe" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Clinic Role</label>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all text-slate-700">
                  <option>Select a role...</option>
                  <option>Doctor</option>
                  <option>Nurse</option>
                  <option>Admin</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
              <textarea 
                rows={3} 
                placeholder="Add any extra details..." 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400 resize-none"
              />
            </div>
          </form>
        </div>
      </div>

      {/* 7. Cards */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-secondary mb-6">7. Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Stat Card */}
          <div className="md:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Patients</span>
              <div className="text-3xl font-bold mt-1 text-slate-900">1,248</div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-success text-xs font-medium">↑ 12%</span>
              <span className="text-slate-400 text-xs">vs last month</span>
            </div>
          </div>
          {/* Action Card */}
          <div className="md:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Schedule Appointment</h3>
              <p className="text-slate-500 text-sm mt-1">Book a new session for verified patients.</p>
            </div>
            <button className="mt-4 text-sm font-medium text-primary flex items-center gap-1 hover:text-blue-700">
              Create Booking →
            </button>
          </div>
          {/* Info Card */}
          <div className="md:col-span-4 bg-secondary rounded-2xl p-6 shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
            <div>
              <h3 className="text-lg font-semibold">Pro Plan Active</h3>
              <p className="text-slate-400 text-sm mt-1">Durga Clinic is operating at full capacity.</p>
            </div>
            <button className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors w-fit backdrop-blur-sm">
              Manage Billing
            </button>
          </div>
        </div>
      </div>

      {/* 8. Tables */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-secondary mb-6">8. Tables</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Recent Appointments</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-6 font-medium text-sm">Patient Name</th>
                  <th className="py-3 px-6 font-medium text-sm">Date & Time</th>
                  <th className="py-3 px-6 font-medium text-sm">Doctor</th>
                  <th className="py-3 px-6 font-medium text-sm">Status</th>
                  <th className="py-3 px-6 font-medium text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-900">Sarah Jenkins</div>
                    <div className="text-sm text-slate-500">ID: PT-1042</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">Oct 24, 10:30 AM</td>
                  <td className="py-4 px-6 text-sm text-slate-600">Dr. Mehta</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Confirmed</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-900">Michael Chang</div>
                    <div className="text-sm text-slate-500">ID: PT-1043</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">Oct 24, 11:15 AM</td>
                  <td className="py-4 px-6 text-sm text-slate-600">Dr. Sharma</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pending</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 9. Charts */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-secondary mb-6">9. Charts</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900">Patient Intake Activity</h3>
            <p className="text-sm text-slate-500">Weekly breakdown across all departments</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Line type="monotone" dataKey="patients" stroke="#2563EB" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
