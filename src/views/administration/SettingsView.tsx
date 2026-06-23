import React from 'react';
import { Settings, Save, Globe, Building2, UserCircle, Bell, ShieldCheck } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure global clinic preferences and workflows.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl">
        <div className="space-y-1">
           <button className="w-full text-left px-3 py-2 bg-white rounded-lg shadow-sm border border-slate-200 text-sm font-bold text-slate-900 flex items-center gap-2"><Building2 className="w-4 h-4"/> Clinic Profile</button>
           <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 flex items-center gap-2"><UserCircle className="w-4 h-4"/> User Preferences</button>
           <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 flex items-center gap-2"><Bell className="w-4 h-4"/> Notifications</button>
           <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 flex items-center gap-2"><Globe className="w-4 h-4"/> Branding</button>
           <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Security</button>
        </div>
        
        <div className="md:col-span-3 space-y-6">
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
             <h3 className="font-bold text-lg text-slate-900 mb-4 border-b border-slate-100 pb-2">Clinic Information</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Clinic Name</label>
                  <input type="text" defaultValue="Durga Clinic" className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50/50" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Registration Number</label>
                  <input type="text" defaultValue="REG-MH-2024-991" className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50/50" />
               </div>
               <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Address</label>
                  <textarea rows={3} defaultValue="12, Health Avenue, Sector 4, Navanagar" className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50/50 resize-none"></textarea>
               </div>
             </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
             <h3 className="font-bold text-lg text-slate-900 mb-4 border-b border-slate-100 pb-2">Contact Details</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Primary Phone</label>
                  <input type="text" defaultValue="+91 98000 00000" className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50/50" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input type="email" defaultValue="contact@durgaclinic.com" className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50/50" />
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
