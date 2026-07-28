import React from 'react'
import Link from 'next/link'
import { getLabOrdersAction } from '@/actions/laboratory/labOrderActions'
import { Plus, Beaker, Search, ChevronRight, FileText } from 'lucide-react'
import dayjs from 'dayjs'

export default async function LaboratoryDashboardPage() {
  const { data: labOrders, success, error } = await getLabOrdersAction()

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laboratory Dashboard</h1>
          <p className="text-sm text-slate-500">Manage lab orders and sample collections</p>
        </div>
        <Link 
          href="/laboratory/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          New Lab Order
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by Order ID or Patient..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="border border-slate-300 rounded-lg text-sm px-3 py-2 bg-white outline-none">
              <option value="">All Statuses</option>
              <option value="Ordered">Ordered</option>
              <option value="Collected">Collected</option>
              <option value="Processing">Processing</option>
              <option value="Resulted">Resulted</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Order Number</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!success || !labOrders?.length) ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Beaker className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-medium text-slate-900">No lab orders found</p>
                    <p className="text-sm">Create a new lab order to get started.</p>
                  </td>
                </tr>
              ) : (
                labOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        {order.order_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {dayjs(order.order_date).format('MMM D, YYYY h:mm A')}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {order.patient?.first_name} {order.patient?.last_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        order.priority === 'Stat' ? 'bg-red-100 text-red-700' :
                        order.priority === 'Urgent' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Ordered' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Resulted' ? 'bg-green-100 text-green-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/laboratory/${order.id}`}
                        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
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
