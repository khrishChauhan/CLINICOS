import React from 'react';
import { ArrowRight, Download, TriangleAlert } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';

export default function Reports() {
  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <Card className="flex justify-between items-center p-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Durga Clinic Audits & PDF Reports</h1>
            <p className="text-slate-500 text-xs mt-0.5">Generate compliant financial sheets, patient growth sheets, and medicine log exports</p>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="p-4 space-y-2.5 text-xs h-fit">
            <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] px-2 mb-2">Report Classification</p>
            <button className="w-full text-left p-3 rounded-lg font-bold transition flex items-center justify-between bg-blue-50 text-blue-700">
              <span>Revenue Collection Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full text-left p-3 rounded-lg font-bold transition flex items-center justify-between text-slate-600 hover:bg-slate-50">
              <span>Patient Intake Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full text-left p-3 rounded-lg font-bold transition flex items-center justify-between text-slate-600 hover:bg-slate-50">
              <span>Medicine Consumption Sheet</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-slate-100 space-y-3 px-1.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Statement Month</label>
                <input className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-700" type="month" defaultValue="2026-06" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button className="flex items-center justify-center gap-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button className="flex items-center justify-center gap-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition shadow-2xs">
                  <Download className="w-3.5 h-3.5" /> Excel
                </button>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-3 p-6 min-h-[400px] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Financial Ledger Accounts & Revenue Report</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Export statement compiled for period 2026-06</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 font-mono font-bold rounded">DURGA-REP-202606</span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <p className="text-[9px] font-bold uppercase text-slate-400">Total Billed</p>
                    <p className="text-lg font-black text-slate-800 mt-0.5">₹2,69,777</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <p className="text-[9px] font-bold uppercase text-slate-400 text-green-500">Total Collected</p>
                    <p className="text-lg font-black text-green-600 mt-0.5">₹2,65,057</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <p className="text-[9px] font-bold uppercase text-slate-400 text-rose-500">Unsettled Outstanding</p>
                    <p className="text-lg font-black text-rose-600 mt-0.5">₹4,720</p>
                  </div>
                </div>

                <div className="overflow-hidden border border-slate-100 rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[10px] hover:bg-slate-50">
                        <TableHead className="p-2.5 bg-transparent">Date</TableHead>
                        <TableHead className="p-2.5 bg-transparent">Invoices Count</TableHead>
                        <TableHead className="p-2.5 text-right bg-transparent">Consultations (₹)</TableHead>
                        <TableHead className="p-2.5 text-right bg-transparent">Diagnostics (₹)</TableHead>
                        <TableHead className="p-2.5 text-right bg-transparent">Grand Total (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="p-2.5">24 Jun 2026</TableCell>
                        <TableCell className="p-2.5 font-bold">12 Bills</TableCell>
                        <TableCell className="p-2.5 text-right">6,000</TableCell>
                        <TableCell className="p-2.5 text-right">3,400</TableCell>
                        <TableCell className="p-2.5 text-right font-bold text-blue-600">11,092</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="p-2.5">23 Jun 2026</TableCell>
                        <TableCell className="p-2.5 font-bold">15 Bills</TableCell>
                        <TableCell className="p-2.5 text-right">7,500</TableCell>
                        <TableCell className="p-2.5 text-right">5,800</TableCell>
                        <TableCell className="p-2.5 text-right font-bold text-blue-600">15,694</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 pt-6 border-t border-slate-50 flex items-center gap-1 italic">
              <TriangleAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Verified and compiled securely by Click Aarambh auditing engine for Durga Clinic.
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}