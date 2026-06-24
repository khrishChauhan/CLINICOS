import React, { useState } from 'react';
import { 
  User, MapPin, Phone, Mail, Calendar, Activity, FileText, 
  Clock, Pill, AlertTriangle, ChevronRight, Plus, Download, 
  Stethoscope, FileDigit, HeartPulse, ExternalLink, ArrowLeft
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const vitalsData = [
  { date: 'Jan 10', bpSys: 120, bpDia: 80, hr: 72 },
  { date: 'Feb 14', bpSys: 125, bpDia: 82, hr: 75 },
  { date: 'Mar 22', bpSys: 130, bpDia: 85, hr: 78 },
  { date: 'May 05', bpSys: 122, bpDia: 81, hr: 70 },
  { date: 'Jun 24', bpSys: 118, bpDia: 79, hr: 72 },
];

const timelineData = [
  { id: 1, type: 'consultation', date: 'Today, 10:30 AM', title: 'Cardiology Consultation', desc: 'Dr. Alok Mehta. Patient complained of mild chest pain. ECG ordered.', icon: <Stethoscope className="w-4 h-4 text-indigo-500" />, bg: 'bg-indigo-50' },
  { id: 2, type: 'lab', date: 'Today, 11:15 AM', title: 'ECG Completed', desc: 'Report attached to file.', icon: <Activity className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-50' },
  { id: 3, type: 'prescription', date: 'May 05, 2026', title: 'Prescription Issued', desc: 'Aspirin 75mg, Atorvastatin 20mg.', icon: <Pill className="w-4 h-4 text-amber-500" />, bg: 'bg-amber-50' },
  { id: 4, type: 'visit', date: 'Mar 22, 2026', title: 'General Checkup', desc: 'Routine follow-up.', icon: <Calendar className="w-4 h-4 text-slate-500" />, bg: 'bg-slate-50' },
];

export default function PatientProfileView({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 bg-slate-50 min-h-full">
      
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6 pt-2">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 -ml-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient 360 View</h1>
              <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Active</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Comprehensive clinical and administrative record.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            Edit Patient
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> New Encounter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Identity Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center border-b border-slate-100">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center mb-4">
                 <span className="text-3xl font-bold text-slate-400">RK</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Rajesh Kumar</h2>
              <p className="text-sm text-slate-500 mt-1">UHID: PT-2026-8941</p>
              
              <div className="flex items-center justify-center gap-4 mt-4 w-full">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Age</p>
                  <p className="text-sm font-bold text-slate-800">45 Yrs</p>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Sex</p>
                  <p className="text-sm font-bold text-slate-800">Male</p>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-rose-400 tracking-widest">Blood</p>
                  <p className="text-sm font-bold text-rose-600">O+</p>
                </div>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
               <div className="flex items-center gap-3 text-sm">
                 <Phone className="w-4 h-4 text-slate-400" />
                 <span className="text-slate-700 font-medium">+91 98765 43210</span>
               </div>
               <div className="flex items-center gap-3 text-sm">
                 <Mail className="w-4 h-4 text-slate-400" />
                 <span className="text-slate-700 font-medium">rajesh.k@email.com</span>
               </div>
               <div className="flex items-start gap-3 text-sm">
                 <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                 <span className="text-slate-700 font-medium">42, Residency Road,<br/>Bangalore 560025</span>
               </div>
            </div>
          </div>

          {/* Clinical Alerts Widget */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm">
             <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2 mb-3">
               <AlertTriangle className="w-4 h-4" /> Clinical Alerts
             </h3>
             <ul className="space-y-2">
               <li className="text-xs font-bold bg-white text-rose-700 px-3 py-2 rounded border border-rose-100 shadow-sm">Allergic to Penicillin</li>
               <li className="text-xs font-bold bg-white text-amber-700 px-3 py-2 rounded border border-amber-100 shadow-sm">Hypertensive (Stage 1)</li>
             </ul>
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="lg:col-span-3">
          
          {/* Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-200 mb-6 bg-white px-2 rounded-t-xl">
             <button 
               onClick={() => setActiveTab('timeline')}
               className={`whitespace-nowrap px-4 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'timeline' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               Clinical Timeline
             </button>
             <button 
               onClick={() => setActiveTab('vitals')}
               className={`whitespace-nowrap px-4 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'vitals' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               Vitals Flowsheet
             </button>
             <button 
               onClick={() => setActiveTab('prescriptions')}
               className={`whitespace-nowrap px-4 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'prescriptions' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               Active Medications
             </button>
             <button 
               onClick={() => setActiveTab('documents')}
               className={`whitespace-nowrap px-4 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'documents' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               Documents & Labs
             </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[500px]">
            
            {activeTab === 'timeline' && (
              <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-900">Encounter History</h3>
                   <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">Filter Feed</button>
                 </div>
                 
                 <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-8">
                    {timelineData.map((item) => (
                      <div key={item.id} className="relative pl-8 group">
                         <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${item.bg}`}>
                            {item.icon}
                         </div>
                         <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 group-hover:border-slate-200 group-hover:bg-slate-100/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                               <h4 className="font-bold text-slate-900">{item.title}</h4>
                               <span className="text-xs font-medium text-slate-500">{item.date}</span>
                            </div>
                            <p className="text-sm text-slate-600">{item.desc}</p>
                            
                            {item.type === 'lab' && (
                               <button className="mt-3 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"><Download className="w-3 h-3"/> Download Report</button>
                            )}
                            {item.type === 'prescription' && (
                               <button className="mt-3 text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3"/> View Rx</button>
                            )}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'vitals' && (
              <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-900">Blood Pressure Trends</h3>
                   <button className="text-xs font-bold text-indigo-600 flex items-center gap-1"><Plus className="w-3 h-3"/> Log Vitals</button>
                 </div>
                 <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={vitalsData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']}/>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="bpSys" name="Systolic" stroke="#f43f5e" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="bpDia" name="Diastolic" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span className="text-xs text-slate-600 font-medium">Systolic (mmHg)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs text-slate-600 font-medium">Diastolic (mmHg)</span></div>
                 </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-900">Ongoing Medications</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                        <tr>
                          <th className="px-4 py-3">Medicine Name</th>
                          <th className="px-4 py-3">Dosage</th>
                          <th className="px-4 py-3">Duration</th>
                          <th className="px-4 py-3">Prescribed By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900">Atorvastatin</td>
                          <td className="px-4 py-3 text-slate-600">20mg • 0-0-1 (After Dinner)</td>
                          <td className="px-4 py-3 text-slate-600">30 Days</td>
                          <td className="px-4 py-3 text-slate-600">Dr. Alok Mehta</td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900">Aspirin</td>
                          <td className="px-4 py-3 text-slate-600">75mg • 1-0-0 (After Breakfast)</td>
                          <td className="px-4 py-3 text-slate-600">30 Days</td>
                          <td className="px-4 py-3 text-slate-600">Dr. Alok Mehta</td>
                        </tr>
                      </tbody>
                    </table>
                 </div>
              </div>
            )}
            
            {activeTab === 'documents' && (
              <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-900">Clinical Documents</h3>
                   <button className="text-xs font-bold text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">Upload File</button>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-4 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer">
                       <div className="w-10 h-10 bg-rose-50 text-rose-500 flex items-center justify-center rounded-lg flex-shrink-0">
                         <HeartPulse className="w-5 h-5" />
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-900 text-sm">ECG Report</h4>
                         <p className="text-xs text-slate-500 mt-0.5">Uploaded Today, 11:15 AM</p>
                       </div>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-4 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer">
                       <div className="w-10 h-10 bg-blue-50 text-blue-500 flex items-center justify-center rounded-lg flex-shrink-0">
                         <FileDigit className="w-5 h-5" />
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-900 text-sm">Lipid Profile</h4>
                         <p className="text-xs text-slate-500 mt-0.5">Uploaded Mar 22, 2026</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
