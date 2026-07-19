'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import Link from 'next/link'

export default function AnalyticsDashboardClient({ type, data }: { type: string, data: any }) {
  if (type === 'executive') {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Executive Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Financial & Operational Overview</p>
          </div>
          <Link href="/reports" className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">
            Report Builder
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-500 font-semibold mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">₹{data.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-500 font-semibold mb-1">Completed Consults</p>
            <p className="text-2xl font-bold text-blue-600">{data.totalConsultations}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-500 font-semibold mb-1">Total No-Shows</p>
            <p className="text-2xl font-bold text-red-600">{data.totalNoShows}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-500 font-semibold mb-1">Inventory Value</p>
            <p className="text-2xl font-bold text-purple-600">₹{data.inventoryValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white p-6 rounded-lg border shadow-sm h-96">
          <h2 className="font-bold text-lg mb-4 text-slate-700">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} tickFormatter={v => `₹${v}`} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px'}} />
              <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  } else {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Clinical Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Your Personal Metrics</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-500 font-semibold mb-1">Total Consultations</p>
            <p className="text-2xl font-bold text-blue-600">{data.totalConsultations}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-500 font-semibold mb-1">Upcoming Appointments</p>
            <p className="text-2xl font-bold text-emerald-600">{data.upcomingAppointments}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-500 font-semibold mb-1">Lab Orders Completed</p>
            <p className="text-2xl font-bold text-purple-600">{data.completedLabOrders}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white p-6 rounded-lg border shadow-sm h-96">
          <h2 className="font-bold text-lg mb-4 text-slate-700">Patient Volume Trend</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.appointmentTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip contentStyle={{borderRadius: '8px'}} />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }
}
