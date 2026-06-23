import React, { useState } from 'react';
import { 
  Stethoscope, Clock, AlertTriangle, ChevronRight, Activity, FileText, 
  Mic, Paperclip, Save, CheckCircle2, History, Syringe, FileDigit, MoreVertical,
  X
} from 'lucide-react';

export default function EmrConsultationView() {
  const [activeTab, setActiveTab] = useState<'subjective' | 'objective' | 'assessment' | 'plan'>('subjective');

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 lg:-m-8 animate-in fade-in duration-500">
      
      {/* Sticky Patient Header (Top) */}
      <div className="bg-slate-900 text-white flex-shrink-0 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <img 
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
            alt="Patient" 
            className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight">Priya Verma</h1>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded text-xs font-mono font-medium tracking-wider">UHID-23092</span>
            </div>
            <p className="text-slate-300 text-sm mt-0.5 flex items-center gap-2">
              <span>28 Yrs • Female</span>
              <span className="w-1 h-1 rounded-full bg-slate-500"></span>
              <span>O+ Blood Group</span>
              <span className="w-1 h-1 rounded-full bg-slate-500"></span>
              <span>Dr. Sarah Thomas</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-2">
          <div className="flex items-center gap-2 bg-rose-500/20 text-rose-200 border border-rose-500/30 px-3 py-1.5 rounded-md text-sm font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Allergies: Penicillin, Peanuts
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            Chronic: Mild Asthma (Diagnosed 2021)
          </div>
        </div>
      </div>

      {/* Main Workspace (Split View) */}
      <div className="flex-1 flex overflow-hidden flex-col lg:flex-row bg-slate-50">
        
        {/* Left Column: Data Entry (SOAP) */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 bg-white shadow-sm z-0">
          
          {/* EMR Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/50 overflow-x-auto flex-shrink-0">
            {[
              { id: 'subjective', label: '1. Subjective (Hx)' },
              { id: 'objective', label: '2. Objective (Vitals/Exam)' },
              { id: 'assessment', label: '3. Assessment (Dx)' },
              { id: 'plan', label: '4. Plan (Rx)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3.5 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-primary text-primary bg-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
            
            {activeTab === 'subjective' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Chief Complaints</label>
                  <div className="relative">
                    <textarea 
                      className="w-full h-32 p-4 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow resize-none"
                      placeholder="E.g., Patient complains of severe headache for past 3 days..."
                      defaultValue="Patient reports a persistent, throbbing headache on the right side of the head, starting 3 days ago. Accompanied by mild nausea and sensitivity to light. No fever or vomiting."
                    />
                    <button className="absolute bottom-3 right-3 p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 hover:text-primary transition-colors group">
                      <Mic className="w-5 h-5 group-hover:animate-pulse" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">History of Presenting Illness (HPI)</label>
                  <textarea 
                    className="w-full h-24 p-4 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow resize-none"
                    placeholder="Provide detailed narrative..."
                    defaultValue="Pain intensity is 7/10. Aggravated by screen time. Relieved temporarily by OTC Paracetamol (taken x2 yesterday). Similar episode occurred 6 months ago."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Quick Macros</label>
                  <div className="flex flex-wrap gap-2">
                    {['Fever', 'Cough', 'Abdominal Pain', 'Fatigue', 'Dizziness', 'URTI Symptoms'].map(macro => (
                      <button key={macro} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-200 border border-slate-200 transition-colors">
                        + {macro}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'objective' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-bold text-slate-700">Vitals (Captured by Nurse @ 10:15 AM)</label>
                    <button className="text-xs text-primary font-medium hover:underline">Re-check Vitals</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-xs text-slate-500 font-medium mb-1">Blood Pressure</p>
                      <p className="text-xl font-bold text-slate-900">128/82 <span className="text-xs text-slate-400 font-normal">mmHg</span></p>
                    </div>
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1.5 bg-rose-500 rounded-bl-lg">
                        <AlertTriangle className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-xs text-rose-600 font-bold mb-1">Heart Rate</p>
                      <p className="text-xl font-bold text-rose-700">102 <span className="text-xs text-rose-400 font-normal">bpm</span></p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-xs text-slate-500 font-medium mb-1">Temperature</p>
                      <p className="text-xl font-bold text-slate-900">98.6 <span className="text-xs text-slate-400 font-normal">°F</span></p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-xs text-slate-500 font-medium mb-1">SpO2</p>
                      <p className="text-xl font-bold text-slate-900">98 <span className="text-xs text-slate-400 font-normal">%</span></p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Systemic Examination</label>
                  <textarea 
                    className="w-full h-32 p-4 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow resize-none"
                    placeholder="Findings on palpation, auscultation, etc."
                    defaultValue="CNS: Conscious, oriented. No focal neurological deficits. Cranial nerves intact. \nCVS: S1, S2 audible, no murmurs. \nResp: B/L clear air entry. \nLocal exam (Head/Neck): Mild tenderness over right occipital region and paraspinal muscles."
                  />
                </div>
              </div>
            )}

            {activeTab === 'assessment' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Primary Diagnosis (ICD-10)</label>
                  <div className="flex items-center gap-2 mb-3">
                    <input 
                      type="text" 
                      className="p-2.5 border border-slate-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="Search diagnosis..."
                      defaultValue="Migraine with aura"
                    />
                    <button className="px-4 py-2.5 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition-colors">
                      Search
                    </button>
                  </div>
                  
                  {/* Selected Dx */}
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-200 text-emerald-800 font-mono text-xs font-bold px-2 py-1 rounded">G43.109</span>
                      <span className="text-emerald-900 font-medium text-sm">Migraine with aura, not intractable, without status migrainosus</span>
                    </div>
                    <button className="text-emerald-600 hover:text-emerald-800"><X className="w-4 h-4" /></button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Differential Diagnosis</label>
                  <textarea 
                    className="w-full h-20 p-4 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow resize-none text-sm"
                    placeholder="Rule out..."
                    defaultValue="Tension-headache. Cervicogenic headache."
                  />
                </div>
              </div>
            )}

            {activeTab === 'plan' && (
               <div className="space-y-8 flex flex-col h-full justify-center items-center text-center">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                   <FileText className="w-8 h-8 text-blue-500" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Proceed to Rx Builder</h3>
                 <p className="text-slate-500 max-w-sm mb-6">You have completed the SOAP documentation. Move directly to the Prescription Builder to assign medications and lab orders.</p>
                 <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all flex items-center gap-2">
                   Open Rx Builder <ChevronRight className="w-5 h-5" />
                 </button>
               </div>
            )}

          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center flex-shrink-0 shadow-[0_-4px_6px_-1px_rgb(0_0_0_0.05)]">
            <button className="text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2 flex items-center gap-2">
              <Paperclip className="w-4 h-4" /> Attach File
            </button>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                Save as Draft
              </button>
              <button 
                onClick={() => {
                  if(activeTab === 'subjective') setActiveTab('objective');
                  else if(activeTab === 'objective') setActiveTab('assessment');
                  else if(activeTab === 'assessment') setActiveTab('plan');
                }}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                {activeTab === 'plan' ? 'Finish' : 'Next Step'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Historical Context */}
        <div className="w-full lg:w-96 flex-shrink-0 bg-slate-50 flex flex-col border-t lg:border-t-0 border-slate-200">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              Patient Timeline
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
            
            {/* Timeline Item 1 */}
            <div className="relative pl-6 border-l-2 border-slate-200">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1 border-2 border-white"></div>
              <p className="text-xs text-primary font-bold mb-1">Today, 10:20 AM</p>
              <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-slate-900 mb-1">Outpatient Visit Started</p>
                <p className="text-xs text-slate-500">Checked in by Reception. Vitals recorded.</p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative pl-6 border-l-2 border-slate-200">
              <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[7px] top-1 border-2 border-white"></div>
              <p className="text-xs text-slate-500 font-bold mb-1">12 Jan 2026</p>
              <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-slate-900 flex items-center gap-1.5 mb-2">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                  Follow-up Consultation
                </p>
                <p className="text-xs text-slate-600 line-clamp-2 italic mb-2">"Patient reports improvement in wheezing. Continue inhaler..."</p>
                <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                  Read full notes <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative pl-6 border-l-2 border-slate-200">
              <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[7px] top-1 border-2 border-white"></div>
              <p className="text-xs text-slate-500 font-bold mb-1">10 Jan 2026</p>
              <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-slate-900 flex items-center gap-1.5 mb-2">
                  <FileDigit className="w-3.5 h-3.5 text-amber-500" />
                  Lab Reports Uploaded
                </p>
                <div className="bg-slate-50 border border-slate-100 p-2 rounded text-xs flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5"><Paperclip className="w-3 h-3"/> CBC_Report.pdf</span>
                  <span className="font-medium text-slate-500">View</span>
                </div>
              </div>
            </div>

             {/* Timeline Item 4 */}
             <div className="relative pl-6 border-l-2 border-transparent">
              <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[7px] top-1 border-2 border-white"></div>
              <p className="text-xs text-slate-500 font-bold mb-1">24 Sep 2025</p>
              <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-slate-900 flex items-center gap-1.5 mb-2">
                  <Syringe className="w-3.5 h-3.5 text-emerald-500" />
                  Flu Vaccination
                </p>
                <p className="text-xs text-slate-500">Administered Influvac Tetra 0.5ml.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

