import React from 'react';
import { 
  Building2, Users, Receipt, Pill, CreditCard, Activity, 
  Search, Filter, Download, MoreVertical, Shield, Clock,
  FileText, CheckCircle2, AlertCircle, FileDigit, ShieldAlert
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DynamicTabRenderer({ activeTab }: { activeTab: string }) {
  // Determine if it's a dashboard or a list view based on the name
  const isDashboard = activeTab.includes('dashboard');

  if (isDashboard) {
    return <RoleDashboard activeTab={activeTab} />;
  }

  return <GenericTableView activeTab={activeTab} />;
}

function RoleDashboard({ activeTab }: { activeTab: string }) {
  const chartData = Array.from({ length: 7 }).map((_, i) => ({
    name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    val: Math.floor(Math.random() * 50) + 10,
    val2: Math.floor(Math.random() * 30) + 5,
  }));

  const getTitle = () => {
    if (activeTab.startsWith('sa-')) return 'Super Admin Telemetry';
    if (activeTab.startsWith('rc-')) return 'Front Desk Operations';
    if (activeTab.startsWith('dr-')) return 'Clinical Overview';
    if (activeTab.startsWith('nr-')) return 'Nursing Station Status';
    if (activeTab.startsWith('ac-')) return 'Financial Overview';
    if (activeTab.startsWith('iv-')) return 'Inventory Telemetry';
    if (activeTab.startsWith('sp-')) return 'Service Desk Overview';
    if (activeTab.startsWith('pt-')) return 'My Health Summary';
    return 'Dashboard Overview';
  };

  const getMetrics = () => {
    if (activeTab.startsWith('sa-')) return [
      { label: 'Total Clinics', val: '1,248', inc: '+12 this week' },
      { label: 'Active Users', val: '45.2K', inc: '+5.4% vs last month' },
      { label: 'System Health', val: '99.99%', inc: 'All systems operational' },
    ];
    if (activeTab.startsWith('ac-')) return [
      { label: 'Monthly Revenue', val: '₹42,50,000', inc: '+12.5% vs last month' },
      { label: 'Pending Invoices', val: '142', inc: '₹1,24,000 outstanding' },
      { label: 'Monthly Expenses', val: '₹12,40,000', inc: '-2.4% vs last month' },
    ];
    if (activeTab.startsWith('nr-')) return [
      { label: 'Patients Admitted', val: '42', inc: '8 critical care' },
      { label: 'Pending Vitals', val: '14', inc: 'Due in next 30 mins' },
      { label: 'Medications Due', val: '28', inc: 'Next round at 14:00' },
    ];
    // Default
    return [
      { label: 'Total Tasks', val: '142', inc: '12 pending' },
      { label: 'Active Sessions', val: '84', inc: '+5 this hour' },
      { label: 'Completion Rate', val: '94%', inc: '+2% vs yesterday' },
    ];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{getTitle()}</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time system telemetry and operational metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getMetrics().map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-bold text-slate-500">{m.label}</h3>
             <p className="text-3xl font-bold text-slate-900 mt-2">{m.val}</p>
             <p className="text-xs text-emerald-600 font-medium mt-2">{m.inc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-6">Activity Trends (Last 7 Days)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="val" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              <Area type="monotone" dataKey="val2" stroke="#0ea5e9" strokeWidth={3} fillOpacity={0.1} fill="#0ea5e9" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function GenericTableView({ activeTab }: { activeTab: string }) {
  // Generate fake data based on tab name to make it look highly realistic.
  
  const generateData = () => {
    const isUsers = activeTab.includes('users') || activeTab.includes('staff');
    const isClinics = activeTab.includes('clinics');
    const isFinancial = activeTab.includes('payments') || activeTab.includes('revenue') || activeTab.includes('gst');
    const isClinical = activeTab.includes('prescriptions') || activeTab.includes('reports') || activeTab.includes('vitals') || activeTab.includes('procedures');
    const isInventory = activeTab.includes('vendors') || activeTab.includes('purchases') || activeTab.includes('expiry') || activeTab.includes('alerts');
    const isTickets = activeTab.includes('tickets') || activeTab.includes('features') || activeTab.includes('errors');

    const statuses = ['Active', 'Pending', 'Resolved', 'Inactive', 'Critical'];
    
    return Array.from({ length: 15 }).map((_, i) => {
      if (isClinics) {
        return {
          id: `CL-${1000 + i}`,
          name: `City Clinic ${['North', 'South', 'East', 'West', 'Central'][i % 5]}`,
          status: i % 4 === 0 ? 'Inactive' : 'Active',
          detail1: `${Math.floor(Math.random() * 50) + 10} Doctors`,
          detail2: `₹${(Math.random() * 500000).toFixed(0)} ARR`,
          date: `2026-0${(i % 6) + 1}-1${i % 9}`
        };
      }
      if (isFinancial) {
        return {
          id: `INV-26${2000 + i}`,
          name: `Consultation + Procedures`,
          status: i % 3 === 0 ? 'Pending' : 'Paid',
          detail1: `₹${(Math.floor(Math.random() * 5000) + 500)}`,
          detail2: ['Cash', 'UPI', 'Credit Card', 'Insurance'][i % 4],
          date: `2026-06-${Math.floor(Math.random() * 28) + 1}`
        };
      }
      if (isClinical) {
        return {
          id: `REC-${8000 + i}`,
          name: ['Complete Blood Count', 'Lipid Profile', 'X-Ray Chest', 'ECG', 'Prescription Refill'][i % 5],
          status: i % 5 === 0 ? 'Pending Review' : 'Completed',
          detail1: `Dr. ${['Mehta', 'Singh', 'Patel', 'Sharma'][i % 4]}`,
          detail2: ['Normal', 'Abnormal', 'Critical', 'Routine'][i % 4],
          date: `2026-06-${Math.floor(Math.random() * 28) + 1}`
        };
      }
      if (isInventory) {
        return {
          id: `PO-${5000 + i}`,
          name: ['Paracetamol 500mg', 'Amoxicillin 250mg', 'Surgical Masks Box', 'Syringes 5ml', 'Saline Solution'][i % 5],
          status: i % 4 === 0 ? 'Low Stock' : 'In Stock',
          detail1: `${Math.floor(Math.random() * 500) + 10} Units`,
          detail2: `Exp: 202${7 + (i % 3)}-0${(i % 9) + 1}`,
          date: `Updated 2026-06-${Math.floor(Math.random() * 28) + 1}`
        };
      }
      if (isTickets) {
         return {
          id: `TCK-${9000 + i}`,
          name: ['Cannot access billing module', 'Printer not syncing', 'New feature request: SMS API', 'Database latency alert', 'User login failed'][i % 5],
          status: statuses[i % statuses.length],
          detail1: ['High', 'Medium', 'Low'][i % 3] + ' Priority',
          detail2: `Assigned: Agent ${i % 5}`,
          date: `2026-06-${Math.floor(Math.random() * 28) + 1}`
        };
      }
      
      // Default / Users
      return {
        id: `USR-${3000 + i}`,
        name: ['Amit Kumar', 'Priya Sharma', 'Rahul Singh', 'Anita Desai', 'Vikram Patel'][i % 5],
        status: i % 6 === 0 ? 'Inactive' : 'Active',
        detail1: ['Doctor', 'Nurse', 'Receptionist', 'Admin'][i % 4],
        detail2: 'Last login: 2 hrs ago',
        date: `Joined 2025-0${(i % 6) + 1}-1${i % 9}`
      };
    });
  };

  const data = generateData();
  const title = activeTab.replace(/^[a-z]+-/, '').replace('-', ' ');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and monitor records effectively.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
             <Filter className="w-4 h-4" /> Filter
           </button>
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
             Add New
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
           <div className="relative flex-1 max-w-md">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
             <input type="text" placeholder="Search records..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
           </div>
           <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100 ml-auto">
             <Download className="w-4 h-4" />
           </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
              <tr>
                <th className="px-5 py-4 w-12 text-center border-r border-slate-100">
                  <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                </th>
                <th className="px-5 py-4">ID Reference</th>
                <th className="px-5 py-4">Primary Detail</th>
                <th className="px-5 py-4">Secondary Info</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date Logged</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-5 py-4 text-center border-r border-slate-100">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                  </td>
                  <td className="px-5 py-4 font-mono text-xs font-medium text-slate-600">
                    {row.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{row.name}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-900">{row.detail1}</div>
                    <div className="text-xs text-slate-500">{row.detail2}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                      row.status === 'Active' || row.status === 'Completed' || row.status === 'In Stock' || row.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : row.status === 'Pending' || row.status === 'Pending Review' || row.status === 'Low Stock'
                        ? 'bg-amber-100 text-amber-700'
                        : row.status === 'Critical'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {row.date}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
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
