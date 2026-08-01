'use client'

import React, { useState } from 'react'
import { Activity, Search, Filter, AlertCircle, FileText, CheckCircle2, Clock } from 'lucide-react'
import dayjs from 'dayjs'
import { RadiologyTabs } from './RadiologyTabs'

export default function RadiologyClient({ orders }: { orders: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredOrders = orders.filter(o => 
    o.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.patient?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.patient?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Stat': return 'bg-red-100 text-red-700'
      case 'Urgent': return 'bg-orange-100 text-orange-700'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'Scheduled': return <Clock className="w-4 h-4 text-blue-500" />
      default: return <AlertCircle className="w-4 h-4 text-orange-500" />
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-500" /> Radiology Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage and track radiology orders and imaging requests.</p>
      </div>

      <RadiologyTabs />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient name or order number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Order No.</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Imaging Tests</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!filteredOrders.length ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-800">No radiology orders found.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-indigo-700">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {dayjs(order.order_date).format('DD MMM YYYY')}
                      <div className="text-xs text-slate-400">{dayjs(order.order_date).format('h:mm A')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {order.patient?.first_name} {order.patient?.last_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.patient?.gender} • {dayjs().diff(order.patient?.date_of_birth, 'year')} yrs
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getPriorityColor(order.priority)}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {order.items?.slice(0, 2).map((item: any) => (
                          <div key={item.id} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded truncate max-w-[200px]">
                            {item.imaging_name} {item.body_part ? `(${item.body_part})` : ''}
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <div className="text-xs text-slate-500 font-medium">
                            +{order.items.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
