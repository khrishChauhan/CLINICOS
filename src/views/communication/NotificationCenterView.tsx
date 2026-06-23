import React from 'react';
import { Bell, Search, Settings, AlertCircle, Info, CheckCircle, Package } from 'lucide-react';

const notificationsData = [
  { id: 1, type: 'Alert', title: 'Low Stock: Paracetamol 500mg', message: 'Current stock is below the minimum threshold (45 < 50).', time: '10 mins ago', read: false },
  { id: 2, type: 'Info', title: 'System Update Completed', message: 'The clinic software was updated to version 2.4.1.', time: '2 hours ago', read: false },
  { id: 3, type: 'Success', title: 'Data Backup Successful', message: 'Daily cloud backup completed at 02:00 AM.', time: '8 hours ago', read: true },
  { id: 4, type: 'Alert', title: 'Missing Diagnostic Report', message: 'Patient: Amit Singh (Lipid Profile) report is overdue from pathology.', time: 'Yesterday', read: true },
  { id: 5, type: 'Alert', title: 'SLA Breach: Patient Wait Time', message: 'Patient A-14 has been waiting for more than 45 minutes.', time: 'Oct 11', read: true },
];

export default function NotificationCenterView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-sm text-slate-500 mt-1">System alerts, updates, and operational notifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 border border-slate-200 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)] min-h-[400px] max-w-4xl mx-auto">
         <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
           <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input type="text" placeholder="Search notifications..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white" />
           </div>
           <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Mark all as read</button>
         </div>

         <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
           {notificationsData.map((notif) => (
             <div key={notif.id} className={`p-4 flex items-start gap-4 transition-colors ${notif.read ? 'bg-white opacity-70' : 'bg-slate-50'}`}>
                <div className={`mt-1 flex-shrink-0 ${notif.type === 'Alert' ? 'text-rose-500' : notif.type === 'Success' ? 'text-emerald-500' : 'text-blue-500'}`}>
                   {notif.type === 'Alert' ? <AlertCircle className="w-5 h-5" /> : notif.type === 'Success' ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${notif.read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>{notif.title}</h4>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                   </div>
                   <p className="text-sm text-slate-600">{notif.message}</p>
                </div>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>}
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}
