import React from 'react';
import { FileText, Plus, Printer, Activity } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockPatients, mockDoctors } from '../../data/mockData';

export default function EMR() {
  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <Card className="flex justify-between items-center p-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">EMR Smart Consultation Desk</h1>
            <p className="text-slate-500 text-xs mt-0.5">Live Electronic Medical Records generation and prescription print designer</p>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form className="lg:col-span-2 space-y-6">
            <Card className="p-5 space-y-5">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-blue-600" /> Patient Intake & Diagnostics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-500 mb-1 uppercase">Consulting Patient*</label>
                  <select required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400">
                    <option value="">-- Choose Patient in OPD --</option>
                    {mockPatients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1 uppercase">Attending Doctor*</label>
                  <select required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400">
                    <option value="">-- Choose Doctor on Duty --</option>
                    {mockDoctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase">Primary Symptoms / Chief Complaint</label>
                    <input placeholder="e.g. Dry cough, persistent mild fever for 3 days" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" type="text" defaultValue="" />
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <button type="button" className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-500">Dry Cough, High Fever</button>
                      <button type="button" className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-500">Throat congestion & pain</button>
                      <button type="button" className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-500">Frequent urination & thirst</button>
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase">Clinical Diagnosis / ICD Assessment*</label>
                    <input required placeholder="e.g. Essential Hypertension" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" type="text" defaultValue="" />
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <button type="button" className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-500">Acute Viral Fever</button>
                      <button type="button" className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-500">Essential Hypertension</button>
                      <button type="button" className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-500">Type 2 Diabetes Mellitus</button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  <span className="text-blue-600 font-serif italic text-lg leading-none mr-1">Rx</span> Medicine Prescription Builder
                </h3>
                <button type="button" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition">
                  <Plus className="w-3.5 h-3.5" /> Add Medicine
                </button>
              </div>
              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center border-b sm:border-b-0 pb-3 sm:pb-0 border-slate-100">
                  <div className="sm:col-span-5">
                    <label className="block font-bold text-slate-400 mb-0.5 uppercase tracking-wider text-[9px] sm:hidden sf-hidden">Select Medicine</label>
                    <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-700 font-semibold" defaultValue="">
                      <option value="">-- Choose Medicine --</option>
                      <option value="MED-001">Metformin 500mg (Antidiabetic)</option>
                      <option value="MED-002">Amlodipine 5mg (Antihypertensive)</option>
                      <option value="MED-004">Paracetamol 650mg (Dolo) (Analgesic)</option>
                      <option value="MED-005">Amoxicillin 500mg (Antibiotic)</option>
                      <option value="MED-008">Montelukast 10mg (Antiasthmatic)</option>
                      <option value="MED-009">Cetirizine 10mg (Antihistamine)</option>
                      <option value="MED-010">Ibuprofen 400mg (Analgesic/NSAID)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-400 mb-0.5 uppercase tracking-wider text-[9px] sm:hidden sf-hidden">Dosage</label>
                    <input placeholder="e.g. 1-0-1" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-center font-bold text-slate-700" type="text" defaultValue="1-0-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-400 mb-0.5 uppercase tracking-wider text-[9px] sm:hidden sf-hidden">Duration</label>
                    <input placeholder="5 Days" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-center" type="text" defaultValue="5 Days" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-400 mb-0.5 uppercase tracking-wider text-[9px] sm:hidden sf-hidden">Instruction</label>
                    <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" defaultValue="After Food">
                      <option value="After Food">After Food</option>
                      <option value="Before Food">Before Food</option>
                      <option value="With Food">With Food</option>
                      <option value="At Bedtime">At Bedtime</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Advise Investigations & Notes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <label className="block font-bold text-slate-500 mb-2 uppercase">Advise Diagnostic Lab Investigations</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition">
                      <input className="rounded text-blue-600 focus:ring-0" type="checkbox" />
                      <span className="font-medium text-slate-700">Blood Test</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition">
                      <input className="rounded text-blue-600 focus:ring-0" type="checkbox" />
                      <span className="font-medium text-slate-700">ECG</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition">
                      <input className="rounded text-blue-600 focus:ring-0" type="checkbox" />
                      <span className="font-medium text-slate-700">X-Ray</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition">
                      <input className="rounded text-blue-600 focus:ring-0" type="checkbox" />
                      <span className="font-medium text-slate-700">MRI</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase">Recommend Follow-up Visit</label>
                    <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-xs" defaultValue="7">
                      <option value="0">No follow-up required</option>
                      <option value="3">In 3 Days</option>
                      <option value="7">In 1 Week (7 Days)</option>
                      <option value="15">In 2 Weeks (15 Days)</option>
                      <option value="30">In 1 Month (30 Days)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase">Physician Clinical Remarks</label>
                    <textarea rows={2} placeholder="e.g. Rest requested. Avoid fatty foods and check BP daily." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"></textarea>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="submit" variant="primary" className="flex items-center gap-1.5 px-6">
                  <Printer className="w-4 h-4" /> Generate Rx & Preview Prescription
                </Button>
              </div>
            </Card>
          </form>
          
          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Activity className="w-4.5 h-4.5 text-blue-600" /> Live Vitals Screen
              </h3>
              <div className="py-14 text-center text-slate-400 italic text-xs">
                Select a patient in EMR intake to load live medical vitals and assessment history here.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}