import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function BillingDashboard() {
  const supabase = await createClient()
  
  // Fetch invoices
  const { data: invoices, error } = await supabase
    .from('billing_invoices')
    .select('*, patients(first_name, last_name)')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Billing & Invoices</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b text-slate-700">
            <tr>
              <th className="p-4">Invoice #</th>
              <th className="p-4">Patient Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Total</th>
              <th className="p-4">Balance</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices?.map(inv => (
              <tr key={inv.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-mono font-medium">{inv.invoice_number || 'DRAFT'}</td>
                <td className="p-4">{inv.patients?.first_name} {inv.patients?.last_name}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 
                      inv.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 
                      'bg-amber-100 text-amber-800'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 font-semibold">₹{Number(inv.grand_total).toFixed(2)}</td>
                <td className="p-4 text-red-600 font-semibold">₹{Number(inv.amount_due).toFixed(2)}</td>
                <td className="p-4">
                  <Link href={`/billing/invoice/${inv.id}`} className="text-blue-600 font-medium hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {invoices?.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No invoices found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
