import React, { useState } from 'react';
import { 
  LifeBuoy, Search, Plus, MessageSquare, AlertCircle, FileText, 
  CheckCircle2, Clock, MonitorPlay, ChevronRight, Activity, 
  BookOpen, Video
} from 'lucide-react';

const supportTickets = [
  { id: 'TKT-8902', subject: 'Printer not connecting to billing system', type: 'Bug Report', status: 'Open', priority: 'High', lastUpdated: '10 mins ago', assignee: 'Raj (Helpdesk)' },
  { id: 'TKT-8901', subject: 'How to add a new doctor schedule?', type: 'Training', status: 'Pending', priority: 'Low', lastUpdated: '2 hours ago', assignee: 'Priya (Success)' },
  { id: 'TKT-8895', subject: 'Insurance claim status showing error', type: 'Bug Report', status: 'Resolved', priority: 'Medium', lastUpdated: 'Yesterday', assignee: 'Amit (Billing Support)' },
  { id: 'TKT-8880', subject: 'Request for custom letterhead template', type: 'Feature Request', status: 'In Progress', priority: 'Low', lastUpdated: '3 days ago', assignee: 'Design Team' },
  { id: 'TKT-8872', subject: 'Cannot log in from mobile app', type: 'Bug Report', status: 'Resolved', priority: 'Critical', lastUpdated: '1 week ago', assignee: 'Tech Support' },
];

const knowledgeBase = [
  { title: 'How to generate E-Way Bills for Pharmacy', category: 'Billing', readTime: '3 min read' },
  { title: 'Configuring Doctor Roles & Permissions', category: 'Admin Tools', readTime: '5 min read' },
  { title: 'Troubleshooting Barcode Scanners', category: 'Hardware', readTime: '2 min read' },
];

export default function SupportDashboardView() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support & Helpdesk</h1>
          <p className="text-sm text-slate-500 mt-1">Get assistance, track issues, and access training materials.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden md:flex px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors items-center gap-2 shadow-sm">
            <MonitorPlay className="w-4 h-4" /> Request Remote Screen Share
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-900">All Systems Operational</h3>
            <p className="text-xs text-emerald-700 mt-0.5">ClinicOS is running smoothly across all your interconnected branches.</p>
          </div>
        </div>
        <button className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded transition-colors">
          View Status Page
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Main Column: Ticket Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">My Support Tickets</h3>
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Search ticket ID or subject..." 
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-200 font-medium">
                  <tr>
                    <th className="px-5 py-3">Ticket ID</th>
                    <th className="px-5 py-3">Subject</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Last Updated</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {supportTickets.map((ticket, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-primary">{ticket.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{ticket.subject}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{ticket.type} • Assigned to: {ticket.assignee}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit ${
                          ticket.status === 'Open' ? 'bg-rose-100 text-rose-700' :
                          ticket.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {ticket.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                          {ticket.status === 'Open' && <AlertCircle className="w-3 h-3" />}
                          {ticket.status === 'Pending' && <Clock className="w-3 h-3" />}
                          {ticket.status === 'In Progress' && <Activity className="w-3 h-3" />}
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold ${
                          ticket.priority === 'Critical' ? 'text-rose-600' :
                          ticket.priority === 'High' ? 'text-orange-600' :
                          ticket.priority === 'Medium' ? 'text-blue-600' :
                          'text-slate-500'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{ticket.lastUpdated}</td>
                      <td className="px-5 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-sm text-slate-600">
              <div>Displaying 5 active tickets</div>
              <button className="text-primary font-medium hover:underline">View Closed Tickets</button>
            </div>
          </div>
        </div>

        {/* Right Column: Knowledge Base & Quick Links */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 relative z-10">ClinicOS Academy</h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10">New staff joining? Browse our video library of bite-sized training modules for Reception, Cashiers, and Doctors.</p>
            <button className="w-full py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-sm">
              Open Training Center
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-slate-900">Recommended Articles</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {knowledgeBase.map((article, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <p className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors pr-6 relative">
                    {article.title}
                    <ChevronRight className="w-4 h-4 absolute right-0 top-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50 text-center border-t border-slate-200">
               <button className="text-sm font-bold text-primary hover:underline">Search full knowledge base &rarr;</button>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}

