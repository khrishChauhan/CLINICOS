import React from 'react';
import { 
  IndianRupee, CreditCard, Wallet, Receipt, 
  ArrowUpRight, ArrowDownRight, Clock, Plus,
  FileText, Search, Filter, MoreHorizontal, Printer, MonitorPlay
} from 'lucide-react';

const liveQueue = [
  { id: '1', patient: 'Rahul Sharma', time: '10:45 AM', type: 'Consultation & Labs', amount: '₹1,500', status: 'Waiting' },
  { id: '2', patient: 'Neha Gupta', time: '10:50 AM', type: 'Pharmacy', amount: '₹450', status: 'Processing' },
  { id: '3', patient: 'Deepak Chopra', time: '11:05 AM', type: 'Procedure: ECG', amount: '₹800', status: 'Waiting' },
];

const recentTransactions = [
  { id: 'TXN-00124', patient: 'Suresh Kumar', amount: '₹2,500', method: 'UPI', time: '10:30 AM', status: 'Paid', receipt: 'INV-4402' },
  { id: 'TXN-00123', patient: 'Priya Verma', amount: '₹500', method: 'Cash', time: '10:15 AM', status: 'Paid', receipt: 'INV-4401' },
  { id: 'TXN-00122', patient: 'Amit Singh', amount: '₹3,200', method: 'Credit Card', time: '09:45 AM', status: 'Paid', receipt: 'INV-4400' },
  { id: 'TXN-00121', patient: 'Kiran Reddy', amount: '₹1,200', method: 'UPI', time: '09:30 AM', status: 'Paid', receipt: 'INV-4399' },
  { id: 'TXN-00120', patient: 'Rahul Sharma', amount: '₹800', method: 'Cash', time: '09:00 AM', status: 'Paid', receipt: 'INV-4398' },
  { id: 'TXN-00119', patient: 'Meera Rajput', amount: '₹1,500', method: 'Insurance', time: '08:45 AM', status: 'Pending', receipt: 'INV-4397' },
];

export default function BillingDashboardView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Billing & Payments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage daily collections, pending dues, and invoices.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm">
            <MonitorPlay className="w-4 h-4" /> Shift Closing
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Generate Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> 12%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Today's Collection</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
              ₹42,500 <span className="text-sm font-medium text-slate-400">INR</span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Cash in Drawer</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
              ₹14,200 <span className="text-sm font-medium text-slate-400">INR</span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              12 Invoices
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Payments</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
              ₹8,450 <span className="text-sm font-medium text-slate-400">INR</span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
              4 Claims
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Insurance Claims</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
              ₹24,000 <span className="text-sm font-medium text-slate-400">INR</span>
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Queue & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Live Billing Queue
              </h3>
              <span className="text-xs font-bold bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-500">{liveQueue.length} Waiting</span>
            </div>
            <div className="divide-y divide-slate-100">
              {liveQueue.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{item.patient}</h4>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{item.time}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-500">{item.type}</p>
                      <p className="text-emerald-600 font-bold mt-1 text-sm">{item.amount}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors">
                      Bill Now
                    </button>
                  </div>
                </div>
              ))}
              {liveQueue.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Queue is empty.
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 blur-2xl"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10">Cashier Shift</h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10">Current shift started at 08:00 AM by Aditi Sharma.</p>
            <div className="space-y-3 relative z-10 pb-6 border-b border-white/10 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Transactions</span>
                <span className="font-bold">42</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Cash Received</span>
                <span className="font-bold text-emerald-400">₹14,200</span>
              </div>
            </div>
            <button className="w-full py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
              Initiate Shift Close
            </button>
          </div>
        </div>

        {/* Right Column: Transactions Ledger */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden h-[calc(100vh-16rem)]">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
              <h3 className="font-bold text-slate-900">Recent Transactions</h3>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                 <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    placeholder="Search invoice or patient..." 
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
                  />
                </div>
                <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white text-slate-500 border-b border-slate-200 font-medium">
                  <tr>
                    <th className="px-5 py-3">Transaction ID</th>
                    <th className="px-5 py-3">Patient</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Method</th>
                    <th className="px-5 py-3">Time</th>
                    <th className="px-5 py-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTransactions.map((txn, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">{txn.id}</td>
                      <td className="px-5 py-4 font-bold text-slate-900 group-hover:text-primary transition-colors cursor-pointer">{txn.patient}</td>
                      <td className="px-5 py-4 font-medium text-slate-900">{txn.amount}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                          txn.method === 'UPI' ? 'bg-purple-100 text-purple-700' :
                          txn.method === 'Cash' ? 'bg-emerald-100 text-emerald-700' :
                          txn.method === 'Credit Card' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {txn.method}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{txn.time}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-slate-400">
                          <span className="font-mono text-xs mr-2">{txn.receipt}</span>
                          <button className="p-1.5 hover:text-primary hover:bg-primary/10 rounded transition-colors"><Printer className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-600">
              <div>Showing 6 of 42 transactions today</div>
              <button className="text-primary font-medium hover:underline">View All</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
