import React from 'react';
import { 
  Users, User, FileText, CheckCircle2, AlertCircle, 
  Clock, Calendar, ArrowRight, PlayCircle, XCircle, Volume2, Search, Plus
} from 'lucide-react';

const patientQueue = [
  { id: '1', name: 'Rahul Sharma', time: '10:00 AM', status: 'In Consultation', type: 'Follow-up', current: true },
  { id: '2', name: 'Priya Verma', time: '10:15 AM', status: 'Waiting', type: 'New Visit', current: false },
  { id: '3', name: 'Amit Singh', time: '10:30 AM', status: 'Waiting', type: 'Report Review', current: false },
  { id: '4', name: 'Neha Gupta', time: '10:45 AM', status: 'Waiting', type: 'Follow-up', current: false },
  { id: '5', name: 'Vikram Sethi', time: '11:00 AM', status: 'Not Arrived', type: 'New Visit', current: false },
];

const pendingReviews = [
  { id: 'PR-102', patient: 'Deepak Chopra', type: 'Blood Test - CBC', status: 'Urgent', time: '1 hour ago' },
  { id: 'PR-103', patient: 'Ananya Desai', type: 'MRI - Lumbar Spine', status: 'Standard', time: '3 hours ago' },
  { id: 'PR-104', patient: 'Suresh Kumar', type: 'ECG Report', status: 'Standard', time: '4 hours ago' },
];

export default function EmrDashboardView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Doctor Console</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, Dr. Alok Mehta. You have 14 appointments today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2 shadow-sm">
            <Volume2 className="w-4 h-4" /> Call Next Patient
          </button>
          <button className="px-6 py-2 bg-primary text-white rounded-md text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <PlayCircle className="w-4 h-4" /> Start Next Consultation
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Scheduled Today</p>
            <h3 className="text-2xl font-black text-slate-900 leading-none mt-1">14</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <h3 className="text-2xl font-black text-slate-900 leading-none mt-1">6</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Waiting Room</p>
            <h3 className="text-2xl font-black text-slate-900 leading-none mt-1">3</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center relative">
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Reports</p>
            <h3 className="text-2xl font-black text-slate-900 leading-none mt-1">5</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Patient Queue
              </h3>
              <div className="flex bg-white rounded-md border border-slate-200 p-1">
                <button className="px-3 py-1 text-xs font-bold bg-slate-100 text-slate-800 rounded">Upcoming</button>
                <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 rounded">Completed</button>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {patientQueue.map((patient) => (
                <div key={patient.id} className={`p-4 transition-colors ${patient.current ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 shrink-0">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{patient.name}</h4>
                          {patient.current && (
                            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                              Current Patient
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="text-slate-500 flex items-center gap-1 font-medium"><Clock className="w-3 h-3" /> {patient.time}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">{patient.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        patient.status === 'In Consultation' ? 'bg-blue-100 text-blue-700' :
                        patient.status === 'Waiting' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {patient.status}
                      </span>
                      {patient.current ? (
                        <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      ) : (
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pending Actions & Reports */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 blur-2xl"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
               <AlertCircle className="w-5 h-5 text-rose-400" />
               Action Required
            </h3>
            <p className="text-slate-400 text-sm mb-4 relative z-10">You have critical lab reports awaiting review.</p>
            <div className="space-y-3 relative z-10">
              {pendingReviews.map((review) => (
                <div key={review.id} className="bg-white/10 border border-white/10 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:bg-white/20 transition-colors">
                  <div>
                    <p className="font-bold text-sm">{review.patient}</p>
                    <p className="text-xs text-slate-300 mt-0.5">{review.type}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    review.status === 'Urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-white/10 text-slate-300'
                  }`}>
                    {review.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
              Review All Reports
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
             <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Quick Search
             </h3>
             <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Find patient by name or phone..." 
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-slate-50"
                />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

