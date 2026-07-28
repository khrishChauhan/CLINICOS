import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { labOrderService } from '@/services/laboratory/labOrderService'
import { ArrowLeft, Beaker, FileText, Calendar, User, Clock, AlertCircle } from 'lucide-react'
import dayjs from 'dayjs'

export default async function LabOrderDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <div>Unauthorized</div>

  const { data: profile } = await supabase.from('users').select('clinic_id').eq('id', user.id).single()
  if (!profile?.clinic_id) return <div>Clinic ID not found</div>

  let order: any = null
  let errorMsg = null

  try {
    order = await labOrderService.getLabOrderById(supabase, profile.clinic_id, params.id)
  } catch (e: any) {
    errorMsg = e.message
  }

  if (errorMsg || !order) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          {errorMsg || 'Order not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/laboratory" className="p-2 bg-white text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg transition shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            {order.order_number}
          </h1>
          <p className="text-sm text-slate-500">Laboratory Order Details</p>
        </div>
        
        <div className="ml-auto flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            order.status === 'Ordered' ? 'bg-blue-100 text-blue-700' :
            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
            'bg-slate-100 text-slate-700'
          }`}>
            {order.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            order.priority === 'Stat' ? 'bg-red-100 text-red-700' :
            order.priority === 'Urgent' ? 'bg-orange-100 text-orange-700' :
            'bg-slate-100 text-slate-700'
          }`}>
            {order.priority}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Requested Tests</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items?.length === 0 ? (
                <div className="p-6 text-center text-slate-500">No tests found for this order.</div>
              ) : (
                order.items?.map((item: any) => (
                  <div key={item.id} className="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Beaker className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900">{item.test_name}</h3>
                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                          {item.status}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 grid grid-cols-2 gap-2 mt-2">
                        {item.sample_type && (
                          <p><span className="text-slate-400">Sample:</span> {item.sample_type}</p>
                        )}
                        {item.remarks && (
                          <p className="col-span-2"><span className="text-slate-400">Remarks:</span> {item.remarks}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Patient Info</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{order.patient?.first_name} {order.patient?.last_name}</p>
                <Link href={`/patients/${order.patient_id}`} className="text-xs text-blue-600 hover:underline">View Patient Profile</Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Order Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{dayjs(order.order_date).format('MMM D, YYYY')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{dayjs(order.order_date).format('h:mm A')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-4 h-4 text-slate-400" />
                <span>Ordered by: Dr. {order.doctor?.first_name} {order.doctor?.last_name}</span>
              </div>
            </div>
            
            {order.remarks && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 mb-1">Remarks</p>
                <p className="text-sm text-slate-700">{order.remarks}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
