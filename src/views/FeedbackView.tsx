import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, Inbox } from 'lucide-react';

export default function FeedbackView() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* 6 & 12. Modals & Notifications */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-secondary mb-6">6 & 12. Modals & Notifications</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Static Modal Example */}
          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden min-h-[400px]">
             {/* Fake Overlay backdrop */}
             <div className="absolute inset-0 bg-secondary/40 backdrop-blur-sm z-0"></div>
             
             {/* Modal Card */}
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative z-10 flex flex-col shadow-slate-900/20">
               <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-semibold text-slate-900">Archived Patient</h3>
                 <button className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5"/></button>
               </div>
               <div className="px-6 py-6 text-slate-600 text-sm leading-relaxed">
                 Are you sure you want to archive this patient record? They will no longer appear in active search results, but historical data will be retained for compliance.
               </div>
               <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                 <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                 <button className="px-4 py-2 text-sm font-medium bg-danger text-white hover:bg-red-600 rounded-lg shadow-sm transition-colors">Archive Record</button>
               </div>
             </div>
          </div>

          <div className="space-y-6">
            {/* Standard Toast Notification */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex gap-4 items-start w-full max-w-md mx-auto">
              <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 text-sm">Appointment Confirmed</h4>
                <p className="text-slate-500 text-sm mt-1">Patient Sarah Jenkins has been notified via SMS.</p>
              </div>
              <button className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4"/></button>
            </div>
            
            {/* Warning Internal Notification */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 flex gap-4 items-start w-full max-w-md mx-auto">
              <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 text-sm">Configuration Missing</h4>
                <p className="text-amber-700/80 text-sm mt-1">Please confirm Durga Clinic's tax identification details for billing.</p>
              </div>
            </div>

            {/* Error Inline state */}
            <div className="bg-red-50 rounded-2xl border border-red-200 p-4 flex gap-4 items-start w-full max-w-md mx-auto">
              <Info className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-900 text-sm">Failed to Sync</h4>
                <p className="text-red-700/80 text-sm mt-1">The external lab integration is currently down. Retrying automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 13. Empty States */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-secondary mb-6">13. Empty States</h2>
        <div className="bg-background rounded-2xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6">
            <Inbox className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Active Prescriptions</h3>
          <p className="text-slate-500 max-w-sm mb-6">There are no pending prescriptions for this clinic today. When a doctor writes a script, it will appear here.</p>
          <button className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors">
            Prescribe Medication
          </button>
        </div>
      </div>

      {/* 14 & 15. Loading & Skeleton */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-secondary mb-6">14 & 15. Loaders & Skeleton Layouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-wider">Dashboard Skeleton</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-slate-100 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-32 w-full bg-slate-100 rounded-lg animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center min-h-[300px]">
             {/* Spinner implementation */}
             <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-4"></div>
             <p className="text-slate-500 font-medium text-sm">Processing records...</p>
          </div>
        </div>
      </div>

    </div>
  );
}
