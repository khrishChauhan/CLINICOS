import React from 'react';
import { Building, Clock, Shield, HardDrive } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Configurations() {
  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <Card className="p-4">
          <h1 className="text-xl font-bold text-slate-800">Durga Clinic Configurations</h1>
          <p className="text-slate-500 text-xs mt-0.5">Customize workspace settings, physician working profiles, access rules, and automated backup nodes</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <Card className="p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-500" /> Clinic Profile Details
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Authorized Name</span>
                <span className="font-bold text-slate-800 text-sm">Durga Family Health Clinic & Diagnostic Center</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Physical Address</span>
                <span className="font-semibold text-slate-600">Flat G-2, Royal Residency, Sector 15, Preet Vihar, Delhi NCR</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Numbers</span>
                <span className="font-semibold text-slate-600">+91 98765 11111 | +91 11 2560 9890</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" /> General Working Hours
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-700">Weekdays (Mon - Fri)</span>
                <span className="font-semibold text-slate-600">08:00 AM - 08:00 PM</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-700">Saturdays</span>
                <span className="font-semibold text-slate-600">09:00 AM - 06:00 PM</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-rose-600 border-l-4 border-l-rose-500">
                <span className="font-bold">Sundays</span>
                <span className="font-bold">OPD Closed (Emergencies Only)</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-500" /> Security Access Controls (Roles)
            </h3>
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-850">Chief Physicians</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Edit patient medical assessment records, write dynamic prescriptions, diagnostic advice</p>
                </div>
                <span className="text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 rounded-full">Owner</span>
              </div>
              <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-850">Frontdesk Receptionists</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Add new patient intake profiles, generate token queue bookings, collect cashier bills</p>
                </div>
                <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 rounded-full border">Staff</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-blue-500" /> Database Backup Systems
            </h3>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Your patient files, clinical prescriptions and bookkeeping ledgers are backing up automatically to secure clinical servers.</p>
              <div className="flex gap-2 justify-end pt-1">
                <Button variant="primary">Sync with Clinical Servers Now</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}