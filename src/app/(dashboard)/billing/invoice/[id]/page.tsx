import React from 'react';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const { data: invoice, error } = await supabase
    .from('billing_invoices')
    .select('*, patients ( first_name, last_name, uhid, mobile_number ), users ( username )')
    .eq('id', params.id)
    .single();

  if (error || !invoice) return notFound();

  const { data: items } = await supabase
    .from('billing_invoice_items')
    .select('*')
    .eq('invoice_id', params.id)
    .order('created_at', { ascending: true });

  const { data: payments } = await supabase
    .from('billing_payments')
    .select('amount, payment_method, payment_date, status')
    .eq('invoice_id', params.id)
    .order('payment_date', { ascending: false });

  const getStatusVariant = (status: string) => {
    if (status === 'Paid') return 'success';
    if (status === 'Issued' || status === 'Partially Paid') return 'warning';
    if (status === 'Cancelled' || status === 'Refunded') return 'danger';
    return 'default';
  };

  const patient = (invoice as any).patients;
  const createdBy = (invoice as any).users;

  return (
    <main className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-6 z-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/ledger" className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Invoice {invoice.invoice_number || `#${params.id.slice(0, 8).toUpperCase()}`}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Created {new Date(invoice.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              {createdBy?.username && ` by ${createdBy.username}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(invoice.status) as any}>{invoice.status}</Badge>
        </div>
      </div>

      {/* Patient & Invoice Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</h3>
          <p className="font-bold text-slate-800 text-base">{patient?.first_name} {patient?.last_name}</p>
          <p className="text-xs text-slate-500 font-mono">{patient?.uhid}</p>
          {patient?.mobile_number && <p className="text-xs text-slate-500">{patient.mobile_number}</p>}
        </Card>
        <Card className="p-5 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice Details</h3>
          <p className="text-sm font-semibold text-slate-700">
            Invoice No: <span className="font-mono text-slate-900">{invoice.invoice_number || '—'}</span>
          </p>
          <p className="text-sm font-semibold text-slate-700">
            Due Date: <span className="text-slate-900">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN') : 'Immediate'}</span>
          </p>
        </Card>
      </div>

      {/* Line Items */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Charges & Services</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="py-3 px-5 bg-transparent">Description</TableHead>
              <TableHead className="py-3 px-4 text-right bg-transparent">Qty</TableHead>
              <TableHead className="py-3 px-4 text-right bg-transparent">Unit Price</TableHead>
              <TableHead className="py-3 px-4 text-right bg-transparent">Discount</TableHead>
              <TableHead className="py-3 px-4 text-right bg-transparent">Tax</TableHead>
              <TableHead className="py-3 px-5 text-right bg-transparent">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!items || items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                  No line items on this invoice.
                </TableCell>
              </TableRow>
            ) : items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="py-3.5 px-5 font-medium text-slate-800">{item.item_name}</TableCell>
                <TableCell className="py-3.5 px-4 text-right text-slate-600">{item.quantity}</TableCell>
                <TableCell className="py-3.5 px-4 text-right text-slate-600">&#8377;{Number(item.unit_price).toFixed(2)}</TableCell>
                <TableCell className="py-3.5 px-4 text-right text-slate-500">
                  {Number(item.discount_amount) > 0 ? `-&#8377;${Number(item.discount_amount).toFixed(2)}` : '—'}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-right text-slate-500">
                  {Number(item.tax_amount) > 0 ? `&#8377;${Number(item.tax_amount).toFixed(2)}` : '—'}
                </TableCell>
                <TableCell className="py-3.5 px-5 text-right font-bold text-slate-800">&#8377;{Number(item.total_amount).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Totals */}
        <div className="px-5 py-4 border-t border-slate-100 flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>&#8377;{Number(invoice.subtotal || 0).toFixed(2)}</span>
            </div>
            {Number(invoice.tax_total) > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Tax</span>
                <span>&#8377;{Number(invoice.tax_total).toFixed(2)}</span>
              </div>
            )}
            {Number(invoice.discount_total) > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-&#8377;{Number(invoice.discount_total).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-900 text-base border-t border-slate-200 pt-2">
              <span>Grand Total</span>
              <span>&#8377;{Number(invoice.grand_total || 0).toFixed(2)}</span>
            </div>
            {Number(invoice.amount_paid) > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Amount Paid</span>
                <span>&#8377;{Number(invoice.amount_paid).toFixed(2)}</span>
              </div>
            )}
            {Number(invoice.amount_due) > 0 && (
              <div className="flex justify-between text-red-600 font-bold">
                <span>Balance Due</span>
                <span>&#8377;{Number(invoice.amount_due).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Payment History */}
      {payments && payments.length > 0 && (
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Payment History</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="py-3 px-5 bg-transparent">Date</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Method</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Status</TableHead>
                <TableHead className="py-3 px-5 text-right bg-transparent">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p: any, i) => (
                <TableRow key={i}>
                  <TableCell className="py-3.5 px-5 text-slate-600">{new Date(p.payment_date).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell className="py-3.5 px-4 font-medium text-slate-700">{p.payment_method}</TableCell>
                  <TableCell className="py-3.5 px-4">
                    <Badge variant={p.status === 'Success' ? 'success' : 'danger'}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="py-3.5 px-5 text-right font-bold text-emerald-700">&#8377;{Number(p.amount).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </main>
  );
}