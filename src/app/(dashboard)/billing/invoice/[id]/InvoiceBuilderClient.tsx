'use client'

import { useState } from 'react'
import type { BillingInvoiceRow, BillingInvoiceItemRow, ServiceRow } from '@/types/billing'
import { addServiceToInvoiceAction, removeServiceFromInvoiceAction, issueInvoiceAction, collectPaymentAction } from '@/actions/billing/billingActions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Props {
  invoice: BillingInvoiceRow
  items: BillingInvoiceItemRow[]
  catalog: ServiceRow[]
}

export default function InvoiceBuilderClient({ invoice, items, catalog }: Props) {
  const router = useRouter()
  const isDraft = invoice.status === 'Draft'
  const canPay = invoice.status === 'Issued' || invoice.status === 'Partially Paid'

  const [selectedService, setSelectedService] = useState('')
  const [qty, setQty] = useState(1)
  const [discount, setDiscount] = useState(0)

  // Payment State
  const [showPayment, setShowPayment] = useState(false)
  const [payAmount, setPayAmount] = useState(invoice.amount_due)
  const [payMethod, setPayMethod] = useState('Cash')
  const [payRef, setPayRef] = useState('')

  async function handleAddItem() {
    if (!selectedService) return
    const res = await addServiceToInvoiceAction(invoice.id, selectedService, qty, discount)
    if (res.ok) {
      toast.success('Item added')
      setSelectedService(''); setQty(1); setDiscount(0)
    } else {
      toast.error('Failed: ' + res.error)
    }
  }

  async function handleRemove(itemId: string) {
    const res = await removeServiceFromInvoiceAction(invoice.id, itemId)
    if (res.ok) toast.success('Item removed')
    else toast.error('Failed: ' + res.error)
  }

  async function handleIssue() {
    if (!confirm('Are you sure you want to issue this invoice? It cannot be modified afterwards.')) return
    const res = await issueInvoiceAction(invoice.id)
    if (res.ok) toast.success('Invoice Issued!')
    else toast.error('Failed: ' + res.error)
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    const res = await collectPaymentAction(invoice.id, invoice.patient_id, Number(payAmount), payMethod, payRef)
    if (res.ok) {
      toast.success('Payment Collected')
      setShowPayment(false)
    } else {
      toast.error('Failed: ' + res.error)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Invoice {invoice.invoice_number || 'DRAFT'}</h1>
          <p className="text-gray-500">Status: <span className="font-semibold text-blue-600">{invoice.status}</span></p>
        </div>
        <div className="space-x-4">
          {isDraft && (
            <button onClick={handleIssue} className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">
              Issue Invoice
            </button>
          )}
          {canPay && (
            <button onClick={() => setShowPayment(true)} className="bg-emerald-600 text-white px-6 py-2 rounded font-medium hover:bg-emerald-700">
              Collect Payment
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg border shadow-sm p-6">
          <h2 className="font-bold text-lg mb-4">Line Items</h2>
          <table className="w-full text-left mb-6">
            <thead className="border-b bg-slate-50 text-sm">
              <tr>
                <th className="p-2">Item</th>
                <th className="p-2 text-right">Qty</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-right">Tax</th>
                <th className="p-2 text-right">Disc</th>
                <th className="p-2 text-right">Total</th>
                {isDraft && <th></th>}
              </tr>
            </thead>
            <tbody className="text-sm">
              {items.map(item => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="p-2 font-medium">{item.item_name}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">₹{item.unit_price}</td>
                  <td className="p-2 text-right">₹{item.tax_amount} ({item.tax_rate}%)</td>
                  <td className="p-2 text-right text-red-500">-₹{item.discount_amount}</td>
                  <td className="p-2 text-right font-bold">₹{item.total_amount}</td>
                  {isDraft && (
                    <td className="p-2 text-right">
                      <button onClick={() => handleRemove(item.id)} className="text-red-500 text-xs font-bold hover:underline">Remove</button>
                    </td>
                  )}
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-gray-400">No items added yet.</td></tr>}
            </tbody>
          </table>

          {isDraft && (
            <div className="bg-slate-50 p-4 rounded border flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-xs font-semibold block mb-1">Select Service</label>
                <select value={selectedService} onChange={e => setSelectedService(e.target.value)} className="w-full border p-2 rounded">
                  <option value="">-- Choose --</option>
                  {catalog.map(c => <option key={c.id} value={c.id}>{c.name} (₹{c.base_price})</option>)}
                </select>
              </div>
              <div className="w-20">
                <label className="text-xs font-semibold block mb-1">Qty</label>
                <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))} className="w-full border p-2 rounded" />
              </div>
              <div className="w-32">
                <label className="text-xs font-semibold block mb-1">Discount (₹)</label>
                <input type="number" min="0" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-full border p-2 rounded" />
              </div>
              <button onClick={handleAddItem} className="bg-slate-800 text-white px-4 py-2 rounded font-medium h-[42px]">Add</button>
            </div>
          )}
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="font-bold text-lg mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span> <span className="font-medium">₹{Number(invoice.subtotal).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax Total:</span> <span className="font-medium">₹{Number(invoice.tax_total).toFixed(2)}</span></div>
              <div className="flex justify-between text-red-500"><span className="text-red-400">Discount:</span> <span className="font-medium">-₹{Number(invoice.discount_total).toFixed(2)}</span></div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg"><span className="font-bold">Grand Total:</span> <span className="font-bold text-slate-800">₹{Number(invoice.grand_total).toFixed(2)}</span></div>
              <hr className="my-2" />
              <div className="flex justify-between text-emerald-600"><span>Amount Paid:</span> <span>₹{Number(invoice.amount_paid).toFixed(2)}</span></div>
              <div className="flex justify-between text-lg"><span className="font-bold text-red-600">Balance Due:</span> <span className="font-bold text-red-600">₹{Number(invoice.amount_due).toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Collect Payment</h2>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Amount to Pay (₹)</label>
                <input type="number" step="0.01" max={invoice.amount_due} required value={payAmount} onChange={e => setPayAmount(Number(e.target.value))} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Payment Method</label>
                <select value={payMethod} onChange={e => setPayMethod(e.target.value)} className="w-full border p-2 rounded">
                  <option>Cash</option>
                  <option>Card</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Transaction Ref (Optional)</label>
                <input value={payRef} onChange={e => setPayRef(e.target.value)} className="w-full border p-2 rounded" placeholder="Txn ID..." />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowPayment(false)} className="px-4 py-2 text-gray-500 font-medium">Cancel</button>
                <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded font-medium">Confirm Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
