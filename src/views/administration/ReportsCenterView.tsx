import React from 'react';
import { FileBox, Download, FileSpreadsheet, FileText, DownloadCloud } from 'lucide-react';

export default function ReportsCenterView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports Center</h1>
          <p className="text-sm text-slate-500 mt-1">Generate and download centralized operational and financial reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Financial Reports */}
         <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
           <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
             <FileSpreadsheet className="w-5 h-5" />
           </div>
           <h3 className="font-bold text-slate-900 text-lg mb-1">Financial summary</h3>
           <p className="text-sm text-slate-500 mb-6">Monthly revenue, expenses, and net profit breakdown.</p>
           <button className="w-full flex justify-center items-center gap-2 border border-slate-200 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700">
              <DownloadCloud className="w-4 h-4" /> Download Report
           </button>
         </div>

         {/* Patient Demographics */}
         <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
           <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
             <FileText className="w-5 h-5" />
           </div>
           <h3 className="font-bold text-slate-900 text-lg mb-1">Patient Demographics</h3>
           <p className="text-sm text-slate-500 mb-6">New vs returning patients, age groups, and locations.</p>
           <button className="w-full flex justify-center items-center gap-2 border border-slate-200 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700">
              <DownloadCloud className="w-4 h-4" /> Download Report
           </button>
         </div>

         {/* Inventory Audit */}
         <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
           <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
             <FileBox className="w-5 h-5" />
           </div>
           <h3 className="font-bold text-slate-900 text-lg mb-1">Inventory Audit</h3>
           <p className="text-sm text-slate-500 mb-6">Current stock value, nearing expiry items, and low stock.</p>
           <button className="w-full flex justify-center items-center gap-2 border border-slate-200 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700">
              <DownloadCloud className="w-4 h-4" /> Download Report
           </button>
         </div>
      </div>
    </div>
  );
}
