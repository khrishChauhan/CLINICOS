'use client'

import { useState } from 'react'
import type { ServiceRow } from '@/types/billing'
import { createServiceAction } from '@/actions/billing/catalogActions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CatalogClient({ initialServices }: { initialServices: ServiceRow[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [tax, setTax] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    const res = await createServiceAction(name, Number(price), Number(tax))
    setIsSubmitting(false)
    
    if (res.ok) {
      toast.success('Service created')
      setName(''); setPrice(''); setTax('')
      router.refresh()
    } else {
      toast.error('Failed: ' + res.error)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Service Catalog</h1>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <h2 className="font-semibold mb-4 text-slate-800">Add New Service</h2>
        <form onSubmit={handleAdd} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Service Name</label>
            <input required value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. ECG" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Base Price (₹)</label>
            <input required type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-32 border p-2 rounded" placeholder="500.00" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tax Rate (%)</label>
            <input required type="number" step="0.01" value={tax} onChange={e => setTax(e.target.value)} className="w-32 border p-2 rounded" placeholder="18.00" />
          </div>
          <button disabled={isSubmitting} type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium h-[42px]">
            {isSubmitting ? 'Adding...' : 'Add Service'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Service Name</th>
              <th className="p-4 font-semibold text-slate-700 text-right">Base Price</th>
              <th className="p-4 font-semibold text-slate-700 text-right">Tax Rate</th>
              <th className="p-4 font-semibold text-slate-700 text-right">Net Price</th>
            </tr>
          </thead>
          <tbody>
            {initialServices.map(s => {
              const net = Number(s.base_price) + (Number(s.base_price) * Number(s.tax_rate) / 100)
              return (
                <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{s.name}</td>
                  <td className="p-4 text-right text-slate-600">₹{Number(s.base_price).toFixed(2)}</td>
                  <td className="p-4 text-right text-slate-600">{Number(s.tax_rate).toFixed(2)}%</td>
                  <td className="p-4 text-right font-bold text-slate-800">₹{net.toFixed(2)}</td>
                </tr>
              )
            })}
            {initialServices.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-400">No services in catalog.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
