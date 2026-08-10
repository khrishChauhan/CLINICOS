'use client'

import React, { useState, useEffect, useRef } from 'react'
import { dispenseMedicineAction } from '@/actions/pharmacy/pharmacyActions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function DispenseClient({ medicines, patients, pendingPrescriptions }: { medicines: any[], patients: any[], pendingPrescriptions: any[] }) {
  const [cart, setCart] = useState<{ 
    id: string, name: string, quantity: number, price: number, generic_name?: string,
    original_medicine_id?: string | null, substitution_reason?: string | null
  }[]>([])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string>('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Subsitution Modal State
  const [subModalOpen, setSubModalOpen] = useState(false)
  const [substituteFor, setSubstituteFor] = useState<{ origId: string, origName: string, reqQty: number } | null>(null)
  const [subReason, setSubReason] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredMeds = medicines.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.generic_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10)

  const addToCart = (med: any, reqQty: number = 1, origId: string | null = null, subReason: string | null = null) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === med.id)
      if (exists) {
        return prev.map(p => p.id === med.id ? { ...p, quantity: p.quantity + reqQty } : p)
      }
      return [...prev, { 
        id: med.id, 
        name: med.name, 
        quantity: reqQty, 
        price: med.unit_price, 
        generic_name: med.generic_name,
        original_medicine_id: origId,
        substitution_reason: subReason
      }]
    })
    setSearchQuery('')
    searchInputRef.current?.focus()
  }

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(p => p.id !== id))
    } else {
      setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: qty } : p))
    }
  }

  const handleDispense = async () => {
    if (!selectedPatientId) return alert('Select a patient first')
    if (cart.length === 0) return alert('Cart is empty')
    
    setIsSubmitting(true)
    const items = cart.map(c => ({
      medicine_id: c.id,
      medicine_name: c.name,
      requested_quantity: c.quantity,
      unit_price: c.price,
      substituted_medicine_id: c.original_medicine_id || null,
      substitution_reason: c.substitution_reason || null
    }))

    // Find the visitId if it's a prescription
    const pres = pendingPrescriptions.find(p => p.id === selectedPrescriptionId)
    const visitId = pres ? pres.visit_id : null

    const res = await dispenseMedicineAction(selectedPatientId, visitId, selectedPrescriptionId || null, items)
    if (res.ok) {
      alert('Successfully dispensed and pushed to Billing atomically!')
      setCart([])
      setSelectedPatientId('')
      setSelectedPrescriptionId('')
    } else {
      alert('Error dispensing: ' + res.error)
    }
    setIsSubmitting(false)
  }

  const loadPrescription = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value
    setSelectedPrescriptionId(pId)
    setCart([])
    if (!pId) {
      setSelectedPatientId('')
      return
    }
    
    const pres = pendingPrescriptions.find(p => p.id === pId)
    if (pres) {
      setSelectedPatientId(pres.patient_id)
      
      pres.prescription_items?.forEach((item: any) => {
        const med = medicines.find(m => m.id === item.medicine_id)
        if (med) {
          addToCart(med, item.quantity)
        } else {
          // Medicine not in catalog or out of stock maybe? Need substitution
          const origName = item.medicine_name || 'Unknown'
          setSubstituteFor({ origId: item.medicine_id, origName, reqQty: item.quantity })
          setSubModalOpen(true)
        }
      })
    }
  }

  const confirmSubstitution = (med: any) => {
    if (!substituteFor) return
    if (!subReason) return alert('Please provide a substitution reason.')
    
    addToCart(med, substituteFor.reqQty, substituteFor.origId, subReason)
    setSubModalOpen(false)
    setSubstituteFor(null)
    setSubReason('')
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)] pb-10">
      
      {/* Left Column: Search & Add */}
      <div className="lg:col-span-2 flex flex-col gap-4 h-full">
        
        {/* Prescription Selector */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <label className="font-semibold text-slate-700 whitespace-nowrap">Load EMR Prescription:</label>
          <select 
            className="flex-1 p-2 border border-slate-300 rounded-lg outline-none bg-slate-50"
            value={selectedPrescriptionId}
            onChange={loadPrescription}
          >
            <option value="">-- OTC Walk-in (No Prescription) --</option>
            {pendingPrescriptions.map(p => (
              <option key={p.id} value={p.id}>
                {p.patients?.first_name} {p.patients?.last_name} - {new Date(p.created_at).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <input 
            ref={searchInputRef}
            type="text"
            placeholder="Search Medicine by Name or Generic (F2)"
            className="flex-1 text-lg py-3 px-4 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-y-auto p-4">
          {searchQuery && filteredMeds.length > 0 && (
            <div className="space-y-2">
              {filteredMeds.map(m => (
                <div key={m.id} className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 flex justify-between items-center transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{m.name}</h3>
                    <p className="text-sm text-slate-500">{m.generic_name}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <p className="font-bold text-lg text-blue-600">${m.unit_price}</p>
                    
                    {subModalOpen ? (
                      <Button size="sm" variant="outline" onClick={() => confirmSubstitution(m)}>Substitute</Button>
                    ) : (
                      <Button size="sm" onClick={() => addToCart(m)}>Add</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {searchQuery && filteredMeds.length === 0 && (
            <div className="p-8 text-center text-slate-400">No medicine found for "{searchQuery}"</div>
          )}
        </div>
      </div>

      {/* Right Column: POS Cart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-bold text-slate-800 mb-3">POS Cart & Billing</h2>
          <select 
            className="w-full p-2 border border-slate-300 rounded-lg outline-none bg-white font-medium text-slate-700"
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
            disabled={!!selectedPrescriptionId} // Locked if loading from prescription
          >
            <option value="">Select Patient...</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.first_name} {p.last_name} ({p.uhid})</option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex flex-col border-b border-slate-100 pb-4 last:border-0">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-slate-800">{item.name}</span>
                <span className="font-semibold text-slate-700">${item.price * item.quantity}</span>
              </div>
              {item.original_medicine_id && (
                <div className="text-xs text-orange-600 font-medium bg-orange-50 p-1 rounded mb-2">
                  Substituted: {item.substitution_reason}
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold">-</button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold">+</button>
                </div>
                <button onClick={() => updateQuantity(item.id, 0)} className="text-sm text-red-500 hover:underline">Remove</button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="text-center text-slate-400 text-sm mt-10">Cart is empty</div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <div className="flex justify-between items-center mb-6 text-xl">
            <span className="font-bold text-slate-600">Total</span>
            <span className="font-black text-blue-600">${cartTotal.toFixed(2)}</span>
          </div>
          <Button 
            className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-md"
            disabled={cart.length === 0 || !selectedPatientId || isSubmitting}
            onClick={handleDispense}
          >
            {isSubmitting ? 'Processing...' : 'Dispense & Bill'}
          </Button>
        </div>
      </div>

      {subModalOpen && substituteFor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-lg w-full bg-white shadow-2xl">
            <h2 className="text-xl font-bold text-red-600 mb-2">Prescription Item Not Found</h2>
            <p className="text-slate-600 mb-4">
              The prescribed item <b>{substituteFor.origName}</b> was not found in your inventory catalog.
              Search and select a substitute above, and provide a reason.
            </p>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-300 rounded mb-4"
              placeholder="Reason (e.g. Out of stock, Brand unavailable)"
              value={subReason}
              onChange={e => setSubReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSubModalOpen(false)}>Cancel</Button>
              <Button disabled className="opacity-50">Select substitute from search...</Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}
