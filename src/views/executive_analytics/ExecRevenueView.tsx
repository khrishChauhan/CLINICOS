import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, Legend
} from 'recharts';
import { 
  TrendingUp, Download, Calendar, ArrowUpRight, ArrowDownRight, 
  IndianRupee, CreditCard, Building2, Filter, Activity
} from 'lucide-react';

const revenueData = [
  { month: 'Jan', actual: 8.4, target: 8.0, profit: 3.2 },
  { month: 'Feb', actual: 9.1, target: 8.5, profit: 3.5 },
  { month: 'Mar', actual: 10.2, target: 9.0, profit: 4.1 },
  { month: 'Apr', actual: 9.8, target: 9.5, profit: 3.8 },
  { month: 'May', actual: 11.5, target: 10.0, profit: 5.0 },
  { month: 'Jun', actual: 12.4, target: 11.0, profit: 5.4 },
];

const departmentData = [
  { name: 'Consultations', value: 45 },
  { name: 'Pharmacy', value: 30 },
  { name: 'Laboratory', value: 15 },
  { name: 'Procedures', value: 10 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const tenderData = [
  { day: 'Mon', UPI: 40, Card: 30, Cash: 20, Insurance: 10 },
  { day: 'Tue', UPI: 45, Card: 25, Cash: 20, Insurance: 10 },
  { day: 'Wed', UPI: 50, Card: 30, Cash: 15, Insurance: 5 },
  { day: 'Thu', UPI: 55, Card: 35, Cash: 10, Insurance: 0 },
  { day: 'Fri', UPI: 60, Card: 40, Cash: 15, Insurance: 15 },
  { day: 'Sat', UPI: 65, Card: 45, Cash: 20, Insurance: 25 },
  { day: 'Sun', UPI: 30, Card: 20, Cash: 30, Insurance: 5 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-lg">
        <p className="font-bold text-slate-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.name !== 'value' ? `₹${entry.value}L` : `${entry.value}`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ExecRevenueView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Revenue Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">C-suite financial overview and predictive modeling.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">FY 2026</span>
          </div>
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
              <ArrowUpRight className="w-3 h-3" /> 14.5%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">YTD Gross Revenue</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
              ₹61.4 <span className="text-base font-bold text-slate-400">L</span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
              <ArrowUpRight className="w-3 h-3" /> 8.2%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Net Profit Margin</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
              43.5 <span className="text-base font-bold text-slate-400">%</span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
             <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full border border-rose-100">
              <ArrowDownRight className="w-3 h-3" /> 2.1%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Rev Per Patient</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
              ₹1,850
            </h3>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
              <Activity className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-white/70 tracking-widest uppercase">
              AI Forecast
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-400">Q3 Projected Finish</p>
            <h3 className="text-3xl font-black text-white mt-1 flex items-baseline gap-1">
              ₹38.5 <span className="text-base font-bold text-slate-500">L</span>
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Revenue Actuals vs Budget</h3>
              <p className="text-sm text-slate-500">Monthly performance tracking</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-3 h-3 rounded bg-blue-500"></div> <span className="text-slate-600 truncate">Actual Revenue</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-3 h-[2px] bg-slate-400"></div> <span className="text-slate-600 truncate">Target Budget</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `₹${value}L`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="actual" name="Actual Revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                <Line type="step" dataKey="target" name="Target Budget" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-slate-900">Revenue by Dept</h3>
            <p className="text-sm text-slate-500">YTD Contribution</p>
          </div>
          <div className="flex-1 min-h-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="block text-2xl font-black text-slate-900">₹61.4L</span>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            {departmentData.map((dept, i) => (
              <div key={dept.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }}></div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-600 font-medium truncate">{dept.name}</p>
                  <p className="text-sm font-bold text-slate-900">{dept.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tender Bar Chart (Full Width Bottom) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Collections by Tender Type</h3>
              <p className="text-sm text-slate-500">Breakdown of payment methods over the last 7 days</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenderData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `${value}%`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="UPI" stackId="a" fill="#8b5cf6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Card" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Cash" stackId="a" fill="#10b981" />
                <Bar dataKey="Insurance" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

