import React, { useState } from 'react';
import { 
  Users, Calendar, IndianRupee, Clock, TrendingUp, CheckCircle2, 
  AlertCircle, Pill, Activity, ChevronDown, Download, Bell, 
  ArrowUpRight, ArrowDownRight, Package, Stethoscope
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// --- Realistic Mock Data ---

const revenueData = [
  { name: '08:00', today: 12000, yesterday: 8000 },
  { name: '10:00', today: 35000, yesterday: 42000 },
  { name: '12:00', today: 68000, yesterday: 55000 },
  { name: '14:00', today: 85000, yesterday: 78000 },
  { name: '16:00', today: 112000, yesterday: 95000 },
  { name: '18:00', today: 145000, yesterday: 130000 },
  { name: '20:00', today: 184500, yesterday: 165000 },
];

const patientDepartmentData = [
  { name: 'General Medicine', value: 4500 },
  { name: 'Pediatrics', value: 3200 },
  { name: 'Orthopedics', value: 2800 },
  { name: 'Cardiology', value: 1500 },
  { name: 'Gynecology', value: 2100 },
];
const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f43f5e', '#f59e0b'];

const hourlyFootfall = [
  { time: '09 AM', patients: 12 },
  { time: '10 AM', patients: 28 },
  { time: '11 AM', patients: 35 },
  { time: '12 PM', patients: 42 },
  { time: '01 PM', patients: 18 },
  { time: '02 PM', patients: 15 },
  { time: '03 PM', patients: 24 },
  { time: '04 PM', patients: 36 },
  { time: '05 PM', patients: 45 },
  { time: '06 PM', patients: 52 },
  { time: '07 PM', patients: 38 },
  { time: '08 PM', patients: 22 },
];

const recentTransactions = [
  { id: 'INV-2023-8942', patient: 'Rahul Sharma', amount: 1250, method: 'UPI', status: 'Completed', time: '10 mins ago', dept: 'Consultation' },
  { id: 'INV-2023-8943', patient: 'Priya Verma', amount: 450, method: 'Cash', status: 'Completed', time: '15 mins ago', dept: 'Pharmacy' },
  { id: 'INV-2023-8944', patient: 'Amit Singh', amount: 3200, method: 'Credit Card', status: 'Completed', time: '22 mins ago', dept: 'Pathology Lab' },
  { id: 'INV-2023-8945', patient: 'Neha Gupta', amount: 850, method: 'UPI', status: 'Completed', time: '28 mins ago', dept: 'Consultation' },
  { id: 'INV-2023-8946', patient: 'Kiran Reddy', amount: 1500, method: 'Pending', status: 'Pending', time: '35 mins ago', dept: 'Radiology' },
  { id: 'INV-2023-8947', patient: 'Vikram Malhotra', amount: 450, method: 'Cash', status: 'Completed', time: '42 mins ago', dept: 'Pharmacy' },
  { id: 'INV-2023-8948', patient: 'Sneha Patel', amount: 850, method: 'UPI', status: 'Completed', time: '1 hr ago', dept: 'Consultation' },
  { id: 'INV-2023-8949', patient: 'Ananya Desai', amount: 2100, method: 'Debit Card', status: 'Completed', time: '1 hr ago', dept: 'Pathology Lab' },
  { id: 'INV-2023-8950', patient: 'Suresh Kumar', amount: 1200, method: 'UPI', status: 'Completed', time: '1.5 hrs ago', dept: 'Consultation' },
  { id: 'INV-2023-8951', patient: 'Ramesh Jain', amount: 350, method: 'Cash', status: 'Completed', time: '2 hrs ago', dept: 'Pharmacy' },
  { id: 'INV-2023-8952', patient: 'Pooja Iyer', amount: 5000, method: 'Credit Card', status: 'Completed', time: '2 hrs ago', dept: 'Surgical Day Care' },
  { id: 'INV-2023-8953', patient: 'Deepak Chopra', amount: 850, method: 'UPI', status: 'Refunded', time: '2.5 hrs ago', dept: 'Consultation' },
  { id: 'INV-2023-8954', patient: 'Anita Dongre', amount: 1450, method: 'Cash', status: 'Completed', time: '3 hrs ago', dept: 'Pathology Lab' },
  { id: 'INV-2023-8955', patient: 'Manish Malhotra', amount: 600, method: 'Pending', status: 'Pending', time: '3 hrs ago', dept: 'Pharmacy' },
  { id: 'INV-2023-8956', patient: 'Sabyasachi M.', amount: 850, method: 'UPI', status: 'Completed', time: '3.5 hrs ago', dept: 'Consultation' },
];

const lowStockItems = [
  { item: 'Paracetamol 500mg (Strip)', current: 12, threshold: 50, critical: true },
  { item: 'Azithromycin 250mg', current: 8, threshold: 30, critical: true },
  { item: 'Disposable Syringes 5ml', current: 45, threshold: 200, critical: false },
  { item: 'Surgical Masks (Box)', current: 5, threshold: 20, critical: true },
  { item: 'Pantoprazole 40mg', current: 28, threshold: 100, critical: false },
];

const doctorsOnDuty = [
  { name: 'Dr. Alok Mehta', spec: 'General Medicine', status: 'Consulting', room: 'Room 101', wait: 3 },
  { name: 'Dr. Sarah Thomas', spec: 'Pediatrics', status: 'Free', room: 'Room 104', wait: 0 },
  { name: 'Dr. Vikram Sethi', spec: 'Orthopedics', status: 'Consulting', room: 'Room 202', wait: 5 },
  { name: 'Dr. Riya Sharma', spec: 'Gynecology', status: 'On Break', room: 'Room 205', wait: 2 },
];


export default function OwnerDashboardView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Live operational metrics for Durga Clinic (Multi-Specialty)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md text-sm font-medium border border-emerald-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Updates
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
            <Calendar className="w-4 h-4" />
            Today, 22 Jun 2026
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export EOD
          </button>
        </div>
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <IndianRupee className="w-16 h-16 text-primary" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Today's Revenue</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">₹1,84,500</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded flex items-center font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 12.5%
            </span>
            <span className="text-slate-400">vs yesterday (₹1,65,000)</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-indigo-600" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Patients</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-bold text-slate-900">142</h3>
                <span className="text-sm font-medium text-slate-400">/ 185 booked</span>
              </div>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm mt-2">
            <div className="flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              104 Consulted
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              38 Waiting
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-16 h-16 text-amber-600" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Avg. Wait Time</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">24 min</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded flex items-center font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 4 mins
            </span>
            <span className="text-slate-400">higher than target (20m)</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-16 h-16 text-rose-600" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Actions</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">11</h3>
            </div>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm mt-2">
            <div className="flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              2 Payments
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              9 Lab Approvals
            </div>
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Today's Revenue Trajectory</h3>
              <p className="text-xs text-slate-500">Cumulative collection across all departments</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-primary">
              <option>Today vs Yesterday</option>
              <option>This Week vs Last Week</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorYday" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(val) => `₹${val/1000}k`} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value) => [`₹${(value as number).toLocaleString()}`, '']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="today" name="Today" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorToday)" />
                <Area type="monotone" dataKey="yesterday" name="Yesterday" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorYday)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Footfall */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">Patient Footfall</h3>
            <p className="text-xs text-slate-500">Arrivals by hour</p>
          </div>
          <div className="flex-1 h-full min-h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyFootfall} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} interval={2} />
                <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="patients" name="Patients" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Doctors on Duty */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-slate-500" />
              Doctors on Duty
            </h3>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium">4 Active</span>
          </div>
          <div className="p-0 overflow-y-auto max-h-[350px] custom-scrollbar">
            {doctorsOnDuty.map((doc, idx) => (
              <div key={idx} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                    {doc.name.split(' ')[1][0]}{doc.name.split(' ')[2] ? doc.name.split(' ')[2][0] : ''}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                    <p className="text-xs text-slate-500">{doc.spec} • {doc.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    doc.status === 'Free' ? 'bg-emerald-100 text-emerald-700' :
                    doc.status === 'Consulting' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {doc.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{doc.wait} in queue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-slate-500" />
              Latest Transactions
            </h3>
            <button className="text-xs font-semibold text-primary hover:text-primary/80">View All Ledger</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                <tr>
                  <th className="px-4 py-3 font-medium">Receipt ID</th>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.slice(0, 8).map((txn, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{txn.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{txn.patient}</td>
                    <td className="px-4 py-3 text-slate-500">{txn.dept}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">₹{txn.amount}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">{txn.method}</span>
                    </td>
                    <td className="px-4 py-3">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        txn.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        txn.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

