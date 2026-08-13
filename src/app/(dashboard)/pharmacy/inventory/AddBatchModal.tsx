'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { addDirectBatchAction } from '@/actions/pharmacy/pharmacyActions'
import { Button } from '@/components/ui/Button'

export function AddBatchModal({ medicines, onClose }: { medicines: any[], onClose: () => void }) {
  const [medicineId, setMedicineId] = useState(medicines[0]?.id || '')
  const [batchNumber, setBatchNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [quantity, setQuantity] = useState(100)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!medicineId) return toast.error('Please select a medicine')

    setIsSubmitting(true)
    const res = await addDirectBatchAction({
      medicine_id: medicineId,
      batch_number: batchNumber,
      expiry_date: expiryDate,
      quantity
    })
    setIsSubmitting(false)

    if (res.ok) {
      toast.success('Batch added successfully!')
      onClose()
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-800 text-lg">Add Inventory Batch</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {medicines.length === 0 ? (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-lg border border-amber-200 text-sm">
              <p className="font-bold mb-1">No medicines found</p>
              <p>You must add a medicine to the catalog before you can receive an inventory batch. Please go to the <strong>Catalog & Registry</strong> to create one first.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Medicine</label>
                <select 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  value={medicineId} 
                  onChange={e => setMedicineId(e.target.value)}
                  required
                >
                  {medicines.map(m => {
                    const name = m.brand_name || m.generic_name || 'Unknown Medicine'
                    const detail = m.brand_name && m.generic_name ? `(${m.generic_name})` : ''
                    return <option key={m.id} value={m.id}>{name} {detail}</option>
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Batch Number</label>
                <input 
                  required type="text" 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm" 
                  placeholder="e.g. BATCH-2026-X" 
                  value={batchNumber} 
                  onChange={e => setBatchNumber(e.target.value)} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input 
                    required type="date" 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                    value={expiryDate} 
                    onChange={e => setExpiryDate(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity Added</label>
                  <input 
                    required type="number" min="1" 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                    value={quantity} 
                    onChange={e => setQuantity(Number(e.target.value))} 
                  />
                </div>
              </div>
            </>
          )}
          
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || medicines.length === 0}>{isSubmitting ? 'Adding...' : 'Save Batch'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
