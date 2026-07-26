'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getClinicalOrdersAction, createClinicalOrderAction } from '@/actions/emr/clinicalOrderActions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { ClinicalOrderRow } from '@/types/emr'

export default function ClinicalOrdersPanel({ visitId }: { visitId: string }) {
  const [orders, setOrders] = useState<ClinicalOrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const [type, setType] = useState('Laboratory')
  const [ref, setRef] = useState('')

  const loadOrders = useCallback(async () => {
    setLoading(true)
    const res = await getClinicalOrdersAction(visitId)
    if (res.success && res.data) setOrders(res.data)
    setLoading(false)
  }, [visitId])

  useEffect(() => { loadOrders() }, [loadOrders])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    const res = await createClinicalOrderAction(visitId, { order_type: type, order_reference: ref })
    if (res.success && res.data) {
      setOrders([res.data!, ...orders])
      setRef('')
    }
    setAdding(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <form onSubmit={handleAdd} className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Order Type</label>
          <select className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none" value={type} onChange={e => setType(e.target.value)}>
            <option>Laboratory</option>
            <option>Radiology</option>
            <option>Procedure</option>
            <option>External</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Order Ref / Name</label>
          <Input required placeholder="e.g. CBC Panel" value={ref} onChange={e => setRef(e.target.value)} />
        </div>
        <div>
          <Button type="submit" disabled={adding} className="w-full">+ Create Order</Button>
        </div>
      </form>

      <div className="space-y-3">
        {loading && <div className="text-sm text-slate-400">Loading orders...</div>}
        {orders.map(o => (
          <div key={o.id} className="p-4 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-800">{o.order_reference || o.order_type}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{o.order_type}</span>
              </div>
              <div className="text-xs text-slate-400">Ordered: {new Date(o.order_date).toLocaleString()}</div>
            </div>
            <div className="text-xs font-bold px-3 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {o.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
