import React from 'react';
import { Smartphone, Wallet, CreditCard, Plus, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function Ledger() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: userProfile } = await supabase.from('users').select('clinic_id').eq('id', user?.id).single();
  const clinicId = userProfile?.clinic_id;

  // Fetch today's payments for stats
  const today = new Date().toISOString().split('T')[0];
  const { data: payments } = await supabase
    .from('billing_payments')
    .select('amount, payment_method')
    .eq('clinic_id', clinicId)
    .gte('payment_date', today)
    .eq('status', 'Success');
  
  let grossCollection = 0;
  let cashCollection = 0;
  let cardCollection = 0;
  let upiCollection = 0;

  payments?.forEach(p => {
    const amt = Number(p.amount);
    grossCollection += amt;
    if (p.payment_method === 'Cash') cashCollection += amt;
    else if (p.payment_method === 'Card') cardCollection += amt;
    else if (p.payment_method === 'UPI') upiCollection += amt;
  });

  // Fetch Invoices
  const { data: invoicesData } = await supabase
    .from('billing_invoices')
    .select(`
      id, invoice_number, created_at, grand_total, status,
      patients ( first_name, last_name ),
      users ( username )
    `)
    .eq('clinic_id', clinicId)
    .order('created_at', { ascending: false })
    .limit(50);

  const invoices = invoicesData || [];

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Durga Clinic Cashier Counter</h3>
              <p className="text-[11px] text-slate-400">Real-time daily accounts collection summary for {new Date().toLocaleDateString()}</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              ₹{grossCollection.toFixed(2)} Gross Collection
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-500" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">UPI Payments</span>
                  <span className="font-bold text-slate-700">₹{upiCollection.toFixed(2)}</span>
                </div>
              </div>
              <span className="text-[10px] bg-white border px-1.5 py-0.2 rounded font-semibold text-slate-400">BHIM / GPay</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-500" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Cash Collection</span>
                  <span className="font-bold text-slate-700">₹{cashCollection.toFixed(2)}</span>
                </div>
              </div>
              <span className="text-[10px] bg-white border px-1.5 py-0.2 rounded font-semibold text-slate-400">Cash Counter</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-500" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Card Swipe</span>
                  <span className="font-bold text-slate-700">₹{cardCollection.toFixed(2)}</span>
                </div>
              </div>
              <span className="text-[10px] bg-white border px-1.5 py-0.2 rounded font-semibold text-slate-400">POS terminal</span>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Durga Clinic Billing Ledger</h1>
              <p className="text-slate-500 text-xs mt-0.5">Collect charges, generate clinical receipts and oversee bookkeeping ledgers for bills</p>
            </div>
          </div>

          <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-96">
              <Input 
                icon={<Search className="w-4.5 h-4.5" />} 
                placeholder="Search by Invoice ID, Patient name..." 
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-semibold">Status:</span>
                <select className="bg-transparent font-bold text-slate-700 focus:outline-none text-xs">
                  <option value="All">All Invoices</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-slate-400 md:ml-auto">Found {invoices.length} invoices</div>
          </Card>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 text-slate-400 bg-slate-50/50 font-bold uppercase tracking-wider hover:bg-slate-50/50">
                  <TableHead className="py-3 px-4 bg-transparent">Invoice ID</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Date</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Patient Name</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Created By</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Total Amount</TableHead>
                  <TableHead className="py-3 px-4 text-center bg-transparent">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-slate-400">
                      No invoices found for today.
                    </TableCell>
                  </TableRow>
                )}
                {invoices.map((inv: any) => (
                  <TableRow key={inv.id}>
                    <TableCell className="py-3.5 px-4 font-mono font-bold">
                      <Link href={`/billing/invoice/${inv.id}`} className="text-blue-600 hover:underline hover:text-blue-700 font-bold">
                        {inv.invoice_number || 'DRAFT'}
                      </Link>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-slate-500">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 font-bold text-slate-800">
                      {inv.patients?.first_name} {inv.patients?.last_name}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-slate-600 font-medium">
                      {inv.users?.username || 'System'}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 font-bold text-slate-850">
                      ₹{Number(inv.grand_total).toFixed(2)}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Draft' ? 'default' : 'warning'}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </main>
  );
}