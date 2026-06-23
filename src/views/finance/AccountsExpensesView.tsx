import React from 'react';
import { Receipt, Plus, Download, TrendingDown, CreditCard, Wallet } from 'lucide-react';

const expenseData = [
  { id: 'EXP-1042', date: 'Oct 12, 2026', category: 'Medical Supplies', description: 'Restock Syringes & Gloves', amount: '₹14,500', method: 'Bank Transfer', status: 'Cleared' },
  { id: 'EXP-1043', date: 'Oct 11, 2026', category: 'Utilities', description: 'Electricity Bill', amount: '₹8,200', method: 'Credit Card', status: 'Pending' },
  { id: 'EXP-1044', date: 'Oct 10, 2026', category: 'Equipment Maintenance', description: 'X-Ray Machine Service', amount: '₹5,000', method: 'Cash', status: 'Cleared' },
  { id: 'EXP-1045', date: 'Oct 09, 2026', category: 'Marketing', description: 'Local Newspaper Ad', amount: '₹2,500', method: 'Credit Card', status: 'Cleared' },
];

export default function AccountsExpensesView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Accounts & Expenses</h1>
          <p className="text-sm text-slate-500 mt-1">Track clinic expenditures, vendor payments, and operational costs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
             <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
             <p className="text-sm font-medium text-slate-500">Expenses This Month</p>
             <h3 className="text-2xl font-black text-slate-900 mt-1">₹84,500</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">₹8,200</h3>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[400px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Receipt className="w-5 h-5 text-slate-400"/> Expense Ledger</h3>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 border-b border-slate-200 font-medium sticky top-0 z-10 w-full">
              <tr>
                <th className="px-5 py-3">Date & ID</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Payment Method</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenseData.map((row, i) => (
                <tr key={i} className="transition-colors group hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{row.date}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{row.id}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded text-xs">{row.category}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{row.description}</td>
                  <td className="px-5 py-4 text-slate-600 flex items-center gap-2 mt-2">
                     <Wallet className="w-4 h-4 text-slate-400"/> {row.method}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900">{row.amount}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                      row.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
