import React from 'react';
import { TrendingUp, Star } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export default function Analytics() {
  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <Card className="p-4">
          <h1 className="text-xl font-bold text-slate-800">Durga Clinic Executive Analytics</h1>
          <p className="text-slate-500 text-xs mt-0.5">Statistical breakdowns of patient demographic growth, disease frequency levels, and cashier collections</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Billings (Aggregate)</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18%
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800">₹2,65,057</h3>
              <p className="text-xs text-slate-400 mt-1">Average invoice size: ₹1,791</p>
            </div>
          </Card>
          
          <Card className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Active Cohorts</span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +12.4%
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800">250 Patients</h3>
              <p className="text-xs text-slate-400 mt-1">Average visits per patient: 4.2 consultations</p>
            </div>
          </Card>
          
          <Card className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Rating Index</span>
              <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" /> 4.8 / 5
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800">10 Specialist Drs</h3>
              <p className="text-xs text-slate-400 mt-1">OPD consultation hours fully utilized: 84%</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5 space-y-5">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Prevalent Pathology Index</h3>
              <p className="text-xs text-slate-400">Diagnosis frequency distribution across the clinical cohort</p>
            </div>
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Hypertension</span>
                  <span>95 Patients (38%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{width: '38%'}}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Type 2 Diabetes</span>
                  <span>70 Patients (28%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{width: '28%'}}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Asthma</span>
                  <span>35 Patients (14%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500" style={{width: '14%'}}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Hypothyroidism</span>
                  <span>30 Patients (12%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{width: '12%'}}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Allergies & Skin</span>
                  <span>20 Patients (8%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-rose-500" style={{width: '8%'}}></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-5">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Gross Revenue Progression</h3>
              <p className="text-xs text-slate-400">Monthly financial aggregates comparison (₹1,000s)</p>
            </div>
            <div className="relative h-48 w-full">
              <svg viewBox="0 0 500 160" className="w-full h-full">
                <line x1="40" y1="20" x2="460" y2="20" stroke="#f1f5f9" strokeDasharray="3,3"></line>
                <line x1="40" y1="70" x2="460" y2="70" stroke="#f1f5f9" strokeDasharray="3,3"></line>
                <line x1="40" y1="120" x2="460" y2="120" stroke="#f1f5f9" strokeDasharray="3,3"></line>
                <line x1="40" y1="140" x2="460" y2="140" stroke="#cbd5e1" strokeWidth="1.5"></line>
                <g><rect x="55" y="93.25" width="22" height="46.75" fill="url(#blueGradGrad)" rx="3"></rect><text x="56" y="152" fill="#64748b" fontSize="9" fontWeight="bold">Jan</text><text x="51" y="87.25" fill="#1e293b" fontSize="8" fontWeight="bold">₹68k</text></g>
                <g><rect x="125" y="83.625" width="22" height="56.375" fill="url(#blueGradGrad)" rx="3"></rect><text x="126" y="152" fill="#64748b" fontSize="9" fontWeight="bold">Feb</text><text x="121" y="77.625" fill="#1e293b" fontSize="8" fontWeight="bold">₹82k</text></g>
                <g><rect x="195" y="64.375" width="22" height="75.625" fill="url(#blueGradGrad)" rx="3"></rect><text x="196" y="152" fill="#64748b" fontSize="9" fontWeight="bold">Mar</text><text x="191" y="58.375" fill="#1e293b" fontSize="8" fontWeight="bold">₹110k</text></g>
                <g><rect x="265" y="54.0625" width="22" height="85.9375" fill="url(#blueGradGrad)" rx="3"></rect><text x="266" y="152" fill="#64748b" fontSize="9" fontWeight="bold">Apr</text><text x="261" y="48.0625" fill="#1e293b" fontSize="8" fontWeight="bold">₹125k</text></g>
                <g><rect x="335" y="42.375" width="22" height="97.625" fill="url(#blueGradGrad)" rx="3"></rect><text x="336" y="152" fill="#64748b" fontSize="9" fontWeight="bold">May</text><text x="331" y="36.375" fill="#1e293b" fontSize="8" fontWeight="bold">₹142k</text></g>
                <g><rect x="405" y="33.4375" width="22" height="106.5625" fill="url(#blueGradGrad)" rx="3"></rect><text x="406" y="152" fill="#64748b" fontSize="9" fontWeight="bold">Jun</text><text x="401" y="27.4375" fill="#1e293b" fontSize="8" fontWeight="bold">₹155k</text></g>
                <defs><linearGradient id="blueGradGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb"></stop><stop offset="100%" stopColor="#93c5fd"></stop></linearGradient></defs>
              </svg>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}