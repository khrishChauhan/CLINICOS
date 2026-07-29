import React from 'react'
import Link from 'next/link'
import { getSamplesAction } from '@/actions/laboratory/labSampleActions'
import { Beaker, Search, ChevronRight, TestTube2 } from 'lucide-react'
import dayjs from 'dayjs'
import { LaboratoryTabs } from '../LaboratoryTabs'

export default async function LaboratorySamplesPage() {
  const { data: samples, success } = await getSamplesAction()

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sample Queue</h1>
          <p className="text-sm text-slate-500">Manage laboratory samples, collection, and tracking</p>
        </div>
      </div>

      <LaboratoryTabs />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by Barcode, Patient or Test..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="border border-slate-300 rounded-lg text-sm px-3 py-2 bg-white outline-none">
              <option value="">All Statuses</option>
              <option value="Pending">Pending Collection</option>
              <option value="Collected">Collected</option>
              <option value="In Transit">In Transit</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Barcode</th>
                <th className="px-6 py-4 font-semibold">Test Name</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Order No.</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!success || !samples?.length) ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <TestTube2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-medium text-slate-900">No samples found</p>
                    <p className="text-sm">Create a lab order to generate samples.</p>
                  </td>
                </tr>
              ) : (
                samples.map((sample: any) => (
                  <tr key={sample.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <Beaker className="w-4 h-4 text-purple-500" />
                        {sample.sample_barcode || 'Pending Gen'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {sample.lab_order_item?.test_name}
                    </td>
                    <td className="px-6 py-4">
                      {sample.lab_order_item?.lab_order?.patient?.first_name} {sample.lab_order_item?.lab_order?.patient?.last_name}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                      {sample.lab_order_item?.lab_order?.order_number}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        sample.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                        sample.status === 'Collected' ? 'bg-blue-100 text-blue-700' :
                        sample.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        sample.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {sample.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/laboratory/samples/${sample.id}`}
                        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Manage
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
