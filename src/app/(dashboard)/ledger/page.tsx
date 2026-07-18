import React from 'react';
import { Smartphone, Wallet, CreditCard, Plus, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export default function Ledger() {
  const mockInvoices = [
    { id: 'INV-0043', date: '2026-06-24', patient: 'Vijay Pandey', doctor: 'Dr. Sanjay Nair', amount: '₹1,626', method: 'Card', status: 'Paid' },
    { id: 'INV-0046', date: '2026-06-24', patient: 'Kiran Dwivedi', doctor: 'Dr. Vikram Shah', amount: '₹1,593', method: 'Cash', status: 'Paid' },
    { id: 'INV-0108', date: '2026-06-24', patient: 'Anjali Verma', doctor: 'Dr. Neha Patel', amount: '₹2,280', method: 'Cash', status: 'Paid' },
    { id: 'INV-0138', date: '2026-06-24', patient: 'Rahul Desai', doctor: 'Dr. Amit Shah', amount: '₹2,006', method: 'Cash', status: 'Paid' },
    { id: 'INV-0005', date: '2026-06-23', patient: 'Divya Dubey', doctor: 'Dr. Vikram Shah', amount: '₹2,155', method: 'Cash', status: 'Paid' },
    { id: 'INV-0007', date: '2026-06-23', patient: 'Ekta Rao', doctor: 'Dr. Vikram Shah', amount: '₹689', method: 'UPI', status: 'Paid' },
    { id: 'INV-0012', date: '2026-06-23', patient: 'Ananya Mukherjee', doctor: 'Dr. Komal Saxena', amount: '₹2,596', method: 'Cash', status: 'Paid' },
    { id: 'INV-0017', date: '2026-06-23', patient: 'Ekta Rao', doctor: 'Dr. Sunita Sharma', amount: '₹354', method: 'Cash', status: 'Pending' },
    { id: 'INV-0050', date: '2026-06-23', patient: 'Deepika Verma', doctor: 'Dr. Rajeev Mehta', amount: '₹1,180', method: 'Cash', status: 'Paid' },
    { id: 'INV-0059', date: '2026-06-23', patient: 'Suresh Srivastava', doctor: 'Dr. Sunita Sharma', amount: '₹2,950', method: 'UPI', status: 'Paid' },
  ];

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Durga Clinic Cashier Counter</h3>
              <p className="text-[11px] text-slate-400">Real-time daily accounts collection summary for June 24, 2026</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              ₹7,505 Gross Collection
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-500" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">UPI Payments</span>
                  <span className="font-bold text-slate-700">₹0</span>
                </div>
              </div>
              <span className="text-[10px] bg-white border px-1.5 py-0.2 rounded font-semibold text-slate-400">BHIM / GPay</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-500" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Cash Collection</span>
                  <span className="font-bold text-slate-700">₹5,879</span>
                </div>
              </div>
              <span className="text-[10px] bg-white border px-1.5 py-0.2 rounded font-semibold text-slate-400">Cash Counter</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-500" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Card Swipe</span>
                  <span className="font-bold text-slate-700">₹1,626</span>
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
            <Button>
              <Plus className="w-4 h-4" /> Create Bill Entry
            </Button>
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
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
                <span className="text-slate-500 font-semibold">Channel:</span>
                <select className="bg-transparent font-bold text-slate-700 focus:outline-none text-xs">
                  <option value="All">All Methods</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-slate-400 md:ml-auto">Found {mockInvoices.length} invoices</div>
          </Card>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 text-slate-400 bg-slate-50/50 font-bold uppercase tracking-wider hover:bg-slate-50/50">
                  <TableHead className="py-3 px-4 bg-transparent">Invoice ID</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Date</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Patient Name</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Attending Doctor</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Total Amount</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Method</TableHead>
                  <TableHead className="py-3 px-4 text-center bg-transparent">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="py-3.5 px-4 font-mono font-bold">
                      <button className="text-blue-600 hover:underline hover:text-blue-700 font-bold">{inv.id}</button>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-slate-500">{inv.date}</TableCell>
                    <TableCell className="py-3.5 px-4 font-bold text-slate-800">{inv.patient}</TableCell>
                    <TableCell className="py-3.5 px-4 text-slate-600 font-medium">{inv.doctor}</TableCell>
                    <TableCell className="py-3.5 px-4 font-bold text-slate-850">{inv.amount}</TableCell>
                    <TableCell className="py-3.5 px-4 font-semibold text-slate-500">{inv.method}</TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <Badge variant={inv.status === 'Paid' ? 'success' : 'warning'}>
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