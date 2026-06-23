import React from 'react';
import { MessageSquareText, Search, Plus, Send, Phone, User } from 'lucide-react';

const messagesData = [
  { id: 'M-1', patient: 'Rajesh Kumar', subject: 'Report Update', preview: 'Your CBC report is now ready for download...', time: '10:45 AM', type: 'SMS', status: 'Sent' },
  { id: 'M-2', patient: 'Priya Sharma', subject: 'Appointment Reminder', preview: 'Reminder: You have an appointment tomorrow at 10...', time: 'Yesterday', type: 'WhatsApp', status: 'Delivered' },
  { id: 'M-3', patient: 'Amit Singh', subject: 'Feedback Request', preview: 'How was your recent visit to Durga Clinic?', time: 'Oct 10', type: 'Email', status: 'Opened' },
];

export default function PatientCommView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Communication</h1>
          <p className="text-sm text-slate-500 mt-1">Manage bulk messaging, reminders, and broadcast announcements.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> New Message
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-14rem)] min-h-[500px]">
        {/* Contact List / History */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
           <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
             <div className="relative flex-1 w-full max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input type="text" placeholder="Search message history..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white" />
             </div>
           </div>
           <div className="flex-1 overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-white text-slate-500 border-b border-slate-200 font-medium">
                 <tr>
                   <th className="px-5 py-3">Patient</th>
                   <th className="px-5 py-3">Message Type</th>
                   <th className="px-5 py-3">Preview</th>
                   <th className="px-5 py-3 text-right">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {messagesData.map((row, i) => (
                   <tr key={i} className="transition-colors hover:bg-slate-50 cursor-pointer">
                     <td className="px-5 py-4 font-bold text-slate-900">{row.patient}</td>
                     <td className="px-5 py-4">
                       <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">{row.type}</span>
                     </td>
                     <td className="px-5 py-4 text-slate-600 truncate max-w-xs">{row.preview}</td>
                     <td className="px-5 py-4 text-right">
                       <span className="text-xs font-medium text-emerald-600">{row.status}</span>
                       <p className="text-[10px] text-slate-400 mt-0.5">{row.time}</p>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Quick Send Panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
           <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Send className="w-4 h-4"/> Quick Sending</h3>
           <div className="space-y-4 flex-1">
             <div>
               <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">To Patient</label>
               <input type="text" placeholder="Search patient..." className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Message</label>
               <textarea rows={4} className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none" placeholder="Type your message here..."></textarea>
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Channel</label>
               <select className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                 <option>SMS</option>
                 <option>WhatsApp</option>
                 <option>Email</option>
               </select>
             </div>
           </div>
           <button className="w-full mt-4 bg-slate-900 text-white rounded-lg py-2.5 font-bold shadow-sm hover:bg-slate-800 transition-colors">Send Message</button>
        </div>
      </div>
    </div>
  );
}
