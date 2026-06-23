import React from 'react';
import { Shield, Search, Filter, History } from 'lucide-react';

const logsData = [
  { id: 'LOG-099', time: '10:45 AM', user: 'Dr. Alok Mehta', action: 'Approved Leave Request L-01', module: 'Operations', ip: '192.168.1.105' },
  { id: 'LOG-098', time: '10:30 AM', user: 'Anita Patel', action: 'Generated Invoice INV-20261012-04 for ₹1,500', module: 'Billing', ip: '192.168.1.112' },
  { id: 'LOG-097', time: '10:15 AM', user: 'Ravi Teja', action: 'Dispensed Paracetamol 500mg (2 strips)', module: 'Inventory', ip: '192.168.1.115' },
  { id: 'LOG-096', time: '09:50 AM', user: 'Dr. Sarah Smith', action: 'Modified EMR for Patient Q-103', module: 'Clinical', ip: '192.168.1.108' },
  { id: 'LOG-095', time: '09:00 AM', user: 'System', action: 'Automated Daily Backup Completed', module: 'System', ip: '127.0.0.1' },
];

export default function AuditLogsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="text-sm text-slate-500 mt-1">Immutable record of all system activities and user actions.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)] min-h-[400px]">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input type="text" placeholder="Search by user or action..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white" />
             </div>
             <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 border-b border-slate-200 font-medium sticky top-0 z-10 w-full">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Module</th>
                <th className="px-5 py-3">Action Details</th>
                <th className="px-5 py-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {logsData.map((row, i) => (
                <tr key={i} className="transition-colors hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-500">{row.time}</td>
                  <td className="px-5 py-4 font-bold text-slate-700 font-sans">{row.user}</td>
                  <td className="px-5 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase tracking-wider">{row.module}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-800 font-sans">{row.action}</td>
                  <td className="px-5 py-4 text-right text-slate-400">{row.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
