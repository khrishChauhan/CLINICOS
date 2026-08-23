'use client'

import React, { useState } from 'react';
import { Smartphone, Wallet, CreditCard, Search, Filter, Send, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface Invoice {
  id: string;
  invoice_number: string | null;
  created_at: string;
  grand_total: number;
  status: string;
  patients: { first_name: string; last_name: string } | null;
  users: { username: string } | null;
}

interface LedgerClientProps {
  invoices: Invoice[];
  grossCollection: number;
  cashCollection: number;
  cardCollection: number;
  upiCollection: number;
}

export default function LedgerClient({
  invoices,
  grossCollection,
  cashCollection,
  cardCollection,
  upiCollection,
}: LedgerClientProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = invoices.filter(inv => {
    const matchSearch =
      !search ||
      (inv.invoice_number?.toLowerCase().includes(search.toLowerCase())) ||
      (`${inv.patients?.first_name} ${inv.patients?.last_name}`.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusVariant = (status: string) => {
    if (status === 'Paid') return 'success';
    if (status === 'Issued' || status === 'Partially Paid') return 'warning';
    if (status === 'Cancelled' || status === 'Refunded') return 'danger';
    return 'default';
  };

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <Send className="w-4 h-4 text-blue-400" />
          {toast}
        </div>
      )}

      <div className="space-y-6">
        {/* Collection Stats */}
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Durga Clinic Cashier Counter</h3>
              <p className="text-[11px] text-slate-400">
                Real-time daily accounts collection summary for {new Date().toLocaleDateString()}
              </p>
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
              <span className="text-[10px] bg-white border px-1.5 rounded font-semibold text-slate-400">BHIM / GPay</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-500" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Cash Collection</span>
                  <span className="font-bold text-slate-700">₹{cashCollection.toFixed(2)}</span>
                </div>
              </div>
              <span className="text-[10px] bg-white border px-1.5 rounded font-semibold text-slate-400">Cash Counter</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-500" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Card Swipe</span>
                  <span className="font-bold text-slate-700">₹{cardCollection.toFixed(2)}</span>
                </div>
              </div>
              <span className="text-[10px] bg-white border px-1.5 rounded font-semibold text-slate-400">POS terminal</span>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Durga Clinic Billing Ledger</h1>
            <p className="text-slate-500 text-xs mt-0.5">Collect charges, generate clinical receipts and oversee bookkeeping ledgers for bills</p>
          </div>

          {/* Filters */}
          <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-96">
              <Input
                icon={<Search className="w-4.5 h-4.5" />}
                placeholder="Search by Invoice ID, Patient name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-semibold">Status:</span>
                <select
                  className="bg-transparent font-bold text-slate-700 focus:outline-none text-xs"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Invoices</option>
                  <option value="Paid">Paid</option>
                  <option value="Issued">Issued</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-slate-400 md:ml-auto">Found {filtered.length} invoices</div>
          </Card>

          {/* Table */}
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
                  <TableHead className="py-3 px-4 text-center bg-transparent">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-slate-400 text-sm">
                      No invoices found.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-slate-50/50 transition">
                    <TableCell className="py-3.5 px-4 font-mono font-bold">
                      <Link
                        href={`/billing/invoice/${inv.id}`}
                        className="text-blue-600 hover:underline hover:text-blue-700 font-bold"
                      >
                        {inv.invoice_number || `INV-${inv.id.slice(0, 8).toUpperCase()}`}
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
                      <Badge variant={getStatusVariant(inv.status) as any}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/billing/invoice/${inv.id}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => showToast(`Ready to send — email/SMS coming soon for ${inv.patients?.first_name || 'patient'}`)}
                          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                          title="Send Invoice & Summary"
                        >
                          <Send className="w-3 h-3" />
                          Send
                        </button>
                      </div>
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