import React from 'react';
import { ClipboardList, Plus, CheckSquare, Clock, ArrowRight } from 'lucide-react';

const tasksData = [
  { id: 'TSK-01', title: 'Restock Emergency Cart', assignee: 'Ravi Teja', due: 'Today, 2:00 PM', priority: 'High', status: 'Pending' },
  { id: 'TSK-02', title: 'Submit Monthly Tax Filing', assignee: 'Sanjay Gupta', due: 'Tomorrow', priority: 'High', status: 'Pending' },
  { id: 'TSK-03', title: 'Calibrate X-Ray Machine', assignee: 'Biomedical Team', due: 'Oct 15', priority: 'Medium', status: 'In Progress' },
  { id: 'TSK-04', title: 'Order Printer Ink', assignee: 'Anita Patel', due: 'Oct 12', priority: 'Low', status: 'Completed' },
];

export default function TaskManagementView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Task Management</h1>
          <p className="text-sm text-slate-500 mt-1">Assign, track, and complete operational duties.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-slate-400"/> Active Tasks</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {tasksData.map((task, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <button className={`mt-0.5 ${task.status === 'Completed' ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'}`}>
                      <CheckSquare className="w-5 h-5" />
                    </button>
                    <div>
                      <p className={`font-bold ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="text-slate-500">Assigned: <strong>{task.assignee}</strong></span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {task.due}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        task.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                        task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {task.priority}
                      </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
           {/* Side panel for quick stats or personal tasks could go here */}
           <div className="bg-slate-900 rounded-2xl p-6 text-white relative shadow-sm">
             <h3 className="font-bold text-lg mb-2">My Tasks</h3>
             <p className="text-slate-400 text-sm mb-4">You have 2 pending tasks due today.</p>
             <button className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300">View My Tasks <ArrowRight className="w-4 h-4"/></button>
           </div>
        </div>
      </div>
    </div>
  );
}
