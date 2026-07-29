import React from 'react'
import Link from 'next/link'
import { getLabTestsAction } from '@/actions/laboratory/labResultActions'
import { FlaskConical, ChevronRight, Search, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import dayjs from 'dayjs'
import { LaboratoryTabs } from '../LaboratoryTabs'

const STATUS_STYLES: Record<string, string> = {
  'Ordered': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Completed': 'bg-amber-100 text-amber-700',
  'Verified': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
}

export default async function LabWorkQueuePage() {
  const { data: tests, success } = await getLabTestsAction()

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Work Queue</h1>
          <p className="text-sm text-slate-500">Process tests, enter results, and verify reports</p>
        </div>
      </div>

      <LaboratoryTabs />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Ordered', status: 'Ordered', icon: Clock, color: 'text-slate-500 bg-slate-50' },
          { label: 'In Progress', status: 'In Progress', icon: FlaskConical, color: 'text-blue-600 bg-blue-50' },
          { label: 'Awaiting Verification', status: 'Completed', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
          { label: 'Verified', status: 'Verified', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
        ].map(card => {
          const count = tests?.filter((t: any) => t.status === card.status).length ?? 0
          return (
            <div key={card.status} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{count}</p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by test name, patient..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="ml-2 border border-slate-300 rounded-lg text-sm px-3 py-2 bg-white outline-none">
            <option value="">All Statuses</option>
            <option>Ordered</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Verified</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Test Name</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Order No.</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!success || !tests?.length) ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-800">No lab tests in queue</p>
                    <p className="text-sm text-slate-500 mt-1">Create a lab test from an order item to get started.</p>
                  </td>
                </tr>
              ) : (
                tests.map((test: any) => (
                  <tr key={test.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">{test.test_name}</td>
                    <td className="px-6 py-4">
                      {test.lab_order_item?.lab_order?.patient?.first_name} {test.lab_order_item?.lab_order?.patient?.last_name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {test.lab_order_item?.lab_order?.order_number}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{test.department || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[test.status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {test.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{dayjs(test.created_at).format('MMM D, h:mm A')}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/laboratory/tests/${test.id}`} className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
                        Process <ChevronRight className="w-4 h-4 ml-1" />
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
