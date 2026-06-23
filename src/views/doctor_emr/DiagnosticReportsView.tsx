import React from 'react';
import { FileDigit, Search, Filter, Download, Eye, UploadCloud, FileText } from 'lucide-react';

const reportsData = [
  { id: 'LAB-901', patient: 'Rajesh Kumar', testName: 'Complete Blood Count (CBC)', date: 'Oct 12, 2026', status: 'Ready', doctor: 'Dr. Alok Mehta', lab: 'Pathology' },
  { id: 'RAD-302', patient: 'Priya Verma', testName: 'Chest X-Ray', date: 'Oct 12, 2026', status: 'Pending Review', doctor: 'Dr. Sarah Smith', lab: 'Radiology' },
  { id: 'LAB-900', patient: 'Amit Singh', testName: 'Lipid Profile', date: 'Oct 11, 2026', status: 'Ready', doctor: 'Dr. K. L. Rao', lab: 'Pathology' },
  { id: 'RAD-301', patient: 'Sneha Patel', testName: 'MRI Lumbar Spine', date: 'Oct 10, 2026', status: 'Critical', doctor: 'Dr. Alok Mehta', lab: 'Radiology' },
];

export default function DiagnosticReportsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Diagnostic Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Manage, review, and upload patient lab and radiology reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <UploadCloud className="w-4 h-4" /> Upload Report
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)] min-h-[400px]">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input type="text" placeholder="Search report ID or patient..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white" />
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
                <th className="px-5 py-3">Report ID</th>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Test Name & Category</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportsData.map((row, i) => (
                <tr key={i} className="transition-colors group hover:bg-slate-50">
                  <td className="px-5 py-4 font-mono text-slate-600">{row.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{row.patient}</p>
                    <p className="text-xs text-slate-500">{row.doctor}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{row.testName}</p>
                    <p className="text-xs text-slate-500">{row.lab}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{row.date}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                      row.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' :
                      row.status === 'Critical' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                       <button className="p-1.5 hover:text-indigo-600 rounded" title="View"><Eye className="w-4 h-4" /></button>
                       <button className="p-1.5 hover:text-blue-600 rounded" title="Download"><Download className="w-4 h-4" /></button>
                    </div>
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
