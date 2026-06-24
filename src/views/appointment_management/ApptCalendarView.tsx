import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, 
  Search, Filter, Clock, MoreHorizontal, User, Phone, CheckCircle2,
  AlertCircle
} from 'lucide-react';

const doctors = [
  { id: 'd1', name: 'Dr. Sarah Thomas', spec: 'General Physician', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { id: 'd2', name: 'Dr. Alok Mehta', spec: 'Cardiologist', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { id: 'd3', name: 'Dr. Vikram Sethi', spec: 'Orthopedics', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { id: 'd4', name: 'Dr. Riya Sharma', spec: 'Dermatologist', color: 'bg-rose-50 border-rose-200 text-rose-700' },
];

const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

const generateAppointments = () => {
  const types = ['Consultation', 'Follow-up', 'Procedure', 'Vaccination', 'Routine Checkup'];
  const statuses = ['Checked In', 'Confirmed', 'Waiting', 'In Progress', 'Completed', 'No Show'];
  const colors = [
    'bg-blue-100/50 border-blue-300',
    'bg-amber-50 border-amber-300',
    'bg-indigo-100/50 border-indigo-300',
    'bg-emerald-100/50 border-emerald-300',
    'bg-rose-100/50 border-rose-300',
    'bg-purple-50 border-purple-300'
  ];

  const firstNames = ['Amit', 'Rahul', 'Priya', 'Sneha', 'Vikram', 'Anjali', 'Karan', 'Neha', 'Sanjay', 'Pooja'];
  const lastNames = ['Sharma', 'Patel', 'Singh', 'Desai', 'Reddy', 'Kumar', 'Gupta', 'Mehta', 'Verma', 'Jain'];

  let appts = [];
  let idCounter = 1;

  doctors.forEach(doctor => {
    // Generate 6-10 appointments per doctor per day
    const numAppts = Math.floor(Math.random() * 5) + 6;
    let currentHour = 8;
    let currentMinute = 0;

    for (let i = 0; i < numAppts; i++) {
      // Add gap (0 to 60 mins)
      currentMinute += Math.floor(Math.random() * 4) * 15;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }

      if (currentHour >= 19) break; // End of day

      const duration = [15, 30, 45, 60][Math.floor(Math.random() * 4)];
      
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      const type = types[Math.floor(Math.random() * types.length)];
      
      // Randomly make some blocks 'Lunch Break' or 'Surgery'
      const isBlock = Math.random() < 0.1;
      let apptStatus = statuses[Math.floor(Math.random() * statuses.length)];
      let color = colors[Math.floor(Math.random() * colors.length)];
      let finalName = name;
      let finalType = type;

      if (isBlock) {
         apptStatus = 'Blocked';
         color = 'bg-slate-100 border-slate-300 pattern-diagonal-lines pattern-slate-200 pattern-bg-white pattern-size-4 pattern-opacity-100';
         finalName = Math.random() > 0.5 ? 'Lunch Break' : 'Surgery Block';
         finalType = finalName;
      }

      appts.push({
        id: idCounter++,
        doctorId: doctor.id,
        patient: finalName,
        time: timeStr,
        duration: duration,
        type: finalType,
        status: apptStatus,
        typeColor: color
      });

      // Advance time by duration
      currentMinute += duration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }
  });

  return appts;
};

const appointments = generateAppointments();

export default function ApptCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getPositionStyle = (timeStr: string, duration: number) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const startHour = 8; // Calendar starts at 8 AM
    const minutesFromStart = ((hours - startHour) * 60) + minutes;
    
    // Total height of calendar area is 12 hours * 80px per hour
    // Top offset = (minutesFromStart / 60) * 80px
    // Height = (duration / 60) * 80px
    return {
      top: `${(minutesFromStart / 60) * 80}px`,
      height: `${(duration / 60) * 80}px`,
    };
  };

  // Calculate current time line position
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const minutesFromStart = ((currentHours - 8) * 60) + currentMinutes;
  const showCurrentTimeLine = currentHours >= 8 && currentHours < 20;
  const currentTimeTop = (minutesFromStart / 60) * 80;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 lg:-m-8 animate-in fade-in duration-500 bg-white">
      
      {/* Calendar Header / Toolbar */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 bg-white shadow-sm z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button className="px-4 py-2 border border-slate-200 rounded font-medium text-slate-700 hover:bg-slate-50 transition-colors text-sm">
              Today
            </button>
            <button className="p-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-slate-900 ml-2">Tue, Jun 23, 2026</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-slate-100 p-1 rounded-lg">
            <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-white shadow-sm text-slate-900 transition-colors">Day</button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md text-slate-500 hover:text-slate-900 transition-colors">Week</button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md text-slate-500 hover:text-slate-900 transition-colors">Timeline</button>
          </div>
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">
             <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>

      </div>

      {/* Calendar Body */}
      <div className="flex-1 overflow-hidden flex bg-slate-50 relative">
        
        {/* Time Axis (Y-Axis) */}
        <div className="w-20 flex-shrink-0 bg-white border-r border-slate-200 z-10 overflow-hidden pt-14">
          <div className="h-[960px] relative"> {/* 12 hours * 80px */}
            {timeSlots.map(hour => (
              <div key={hour} className="h-20 border-b border-slate-100 relative group">
                <span className="absolute -top-3 left-4 text-xs font-medium text-slate-400 bg-white px-1">
                  {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          
          {/* Doctors Header (Sticky top) */}
          <div className="sticky top-0 bg-white z-20 flex border-b border-slate-200 shadow-sm">
            {doctors.map(doctor => (
              <div key={doctor.id} className="flex-1 min-w-[200px] border-r border-slate-200 px-4 py-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${doctor.color}`}>
                  {doctor.name.split(' ')[1][0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{doctor.name}</h3>
                  <p className="text-xs text-slate-500">{doctor.spec}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Grid Area */}
          <div className="flex h-[960px] relative bg-white">
            
            {/* Background Grid Lines */}
            <div className="absolute inset-0 pointer-events-none flex flex-col">
              {timeSlots.map(hour => (
                <div key={hour} className="h-20 border-b border-slate-100 w-full flex">
                  {doctors.map(doc => (
                    <div key={doc.id} className="flex-1 border-r border-slate-100 h-full"></div>
                  ))}
                </div>
              ))}
            </div>

            {/* Current Time Indicator Line */}
            {showCurrentTimeLine && (
              <div 
                className="absolute left-0 right-0 border-t-2 border-rose-500 z-10 flex items-center pointer-events-none" 
                style={{ top: `${currentTimeTop}px` }}
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 -ml-1"></div>
              </div>
            )}

            {/* Appointment Blocks */}
            <div className="absolute inset-0 flex">
              {doctors.map(doctor => {
                const docAppointments = appointments.filter(a => a.doctorId === doctor.id);
                
                return (
                  <div key={doctor.id} className="flex-1 relative min-w-[200px] border-r border-transparent">
                    {docAppointments.map(appt => (
                      <div 
                        key={appt.id}
                        className={`absolute left-1 right-2 rounded-md border p-2 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden ${appt.typeColor}`}
                        style={getPositionStyle(appt.time, appt.duration)}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[11px] font-bold text-slate-700 bg-white/60 px-1.5 rounded">{appt.time}</span>
                          {appt.status !== 'Blocked' && (
                            <span className={`w-2 h-2 rounded-full ${
                              appt.status === 'Checked In' ? 'bg-emerald-500' :
                              appt.status === 'Waiting' ? 'bg-amber-500' :
                              appt.status === 'In Progress' ? 'bg-blue-500' :
                              'bg-slate-300'
                            }`}></span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-900 leading-tight line-clamp-1">{appt.patient}</p>
                        
                        {appt.duration >= 45 && appt.status !== 'Blocked' && (
                          <div className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-auto">
                            <Clock className="w-3 h-3" /> {appt.type}
                          </div>
                        )}
                        
                        {appt.status === 'Blocked' && (
                          <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-400 bg-white/40">
                            {appt.patient}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

