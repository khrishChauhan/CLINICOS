import React from 'react';
import { 
  Plus, Calendar, IndianRupee, TrendingUp, Clock, TriangleAlert, 
  ArrowRight, CircleCheck, ShieldAlert, FlaskConical 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { mockDoctors, mockAppointments } from '../data/mockData';

export default function Dashboard() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Namaste, Durga Clinic Team</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back to Click Aarambh ClinicOS. Here's a brief snapshot of Durga Clinic for today, <span className="font-semibold text-blue-600">{currentDate}</span>.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="primary" className="bg-blue-600/90 hover:bg-blue-600">
              <Plus className="w-4 h-4" /> Add Patient
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4" /> Book Appointment
            </Button>
            <Button className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 border border-emerald-500/20 shadow-none">
              <IndianRupee className="w-4 h-4" /> New Bill
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/40 backdrop-blur-md hover:border-blue-500/30 transition duration-300">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Today's Appointments</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">25</h3>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-600">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                <span className="flex items-center gap-0.5 text-emerald-600 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3" /> +14.2%
                </span>
                <span>vs. yesterday (22)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-md hover:border-emerald-500/30 transition duration-300">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Today's Revenue</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">₹7,505</h3>
                </div>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                <span className="text-emerald-600 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">9 Completed</span>
                <span>consultations today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-md hover:border-amber-500/30 transition duration-300">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Payments</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">₹4,720</h3>
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                <span className="text-amber-600 font-semibold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">2 Invoices</span>
                <span>unpaid from this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-md hover:border-red-500/30 transition duration-300">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Low Stock Alerts</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">37</h3>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600">
                  <TriangleAlert className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                <span className="text-red-600 font-semibold bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded">31 Medicines</span>
                <span>need reordering immediately</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white/40 backdrop-blur-md lg:col-span-2">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Clinic Analytics (Last 7 Days)</h3>
                  <p className="text-xs text-slate-400">Daily appointment volume and gross collection trends</p>
                </div>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-blue-500 rounded"></span>
                    <span className="text-slate-600">Appointments</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-emerald-500 rounded"></span>
                    <span className="text-slate-600">Revenue (₹1k)</span>
                  </div>
                </div>
              </div>
              <div className="relative h-64 w-full">
                {/* SVG Chart preserved exactly as is to prevent layout break */}
                <svg viewBox="0 0 600 220" className="w-full h-full">
                  <line x1="50" y1="20" x2="560" y2="20" stroke="#f1f5f9" strokeDasharray="3,3" />
                  <line x1="50" y1="65" x2="560" y2="65" stroke="#f1f5f9" strokeDasharray="3,3" />
                  <line x1="50" y1="110" x2="560" y2="110" stroke="#f1f5f9" strokeDasharray="3,3" />
                  <line x1="50" y1="155" x2="560" y2="155" stroke="#f1f5f9" strokeDasharray="3,3" />
                  <line x1="50" y1="180" x2="560" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
                  
                  <text x="15" y="25" fill="#94a3b8" fontSize="10" fontWeight="500">50 / ₹35k</text>
                  <text x="15" y="70" fill="#94a3b8" fontSize="10" fontWeight="500">35 / ₹25k</text>
                  <text x="15" y="115" fill="#94a3b8" fontSize="10" fontWeight="500">20 / ₹15k</text>
                  <text x="15" y="160" fill="#94a3b8" fontSize="10" fontWeight="500">5 / ₹5k</text>
                  
                  <g>
                    <rect x="50" y="10" width="55" height="185" fill="transparent" className="hover:fill-slate-50/40 cursor-pointer transition duration-200" />
                    <rect x="60" y="84" width="16" height="96" fill="url(#blueGrad)" rx="3" />
                    <circle cx="68" cy="101.14285714285715" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="55" y="198" fill="#64748b" fontSize="10" fontWeight="600">Thu</text>
                    <text x="52" y="210" fill="#94a3b8" fontSize="9">18 Jun</text>
                    <text x="45" y="76" fill="#1e293b" fontSize="8" fontWeight="bold" opacity="0.8">32 (18.4k)</text>
                  </g>
                  <g>
                    <rect x="122" y="10" width="55" height="185" fill="transparent" className="hover:fill-slate-50/40 cursor-pointer transition duration-200" />
                    <rect x="132" y="66" width="16" height="114" fill="url(#blueGrad)" rx="3" />
                    <circle cx="140" cy="85.28571428571428" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="127" y="198" fill="#64748b" fontSize="10" fontWeight="600">Fri</text>
                    <text x="124" y="210" fill="#94a3b8" fontSize="9">19 Jun</text>
                    <text x="117" y="58" fill="#1e293b" fontSize="8" fontWeight="bold" opacity="0.8">38 (22.1k)</text>
                  </g>
                  <g>
                    <rect x="194" y="10" width="55" height="185" fill="transparent" className="hover:fill-slate-50/40 cursor-pointer transition duration-200" />
                    <rect x="204" y="45" width="16" height="135" fill="url(#blueGrad)" rx="3" />
                    <circle cx="212" cy="60.85714285714286" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="199" y="198" fill="#64748b" fontSize="10" fontWeight="600">Sat</text>
                    <text x="196" y="210" fill="#94a3b8" fontSize="9">20 Jun</text>
                    <text x="189" y="37" fill="#1e293b" fontSize="8" fontWeight="bold" opacity="0.8">45 (27.8k)</text>
                  </g>
                  <g>
                    <rect x="266" y="10" width="55" height="185" fill="transparent" className="hover:fill-slate-50/40 cursor-pointer transition duration-200" />
                    <rect x="276" y="144" width="16" height="36" fill="url(#blueGrad)" rx="3" />
                    <circle cx="284" cy="149.14285714285714" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="271" y="198" fill="#64748b" fontSize="10" fontWeight="600">Sun</text>
                    <text x="268" y="210" fill="#94a3b8" fontSize="9">21 Jun</text>
                    <text x="261" y="136" fill="#1e293b" fontSize="8" fontWeight="bold" opacity="0.8">12 (7.2k)</text>
                  </g>
                  <g>
                    <rect x="338" y="10" width="55" height="185" fill="transparent" className="hover:fill-slate-50/40 cursor-pointer transition duration-200" />
                    <rect x="348" y="60" width="16" height="120" fill="url(#blueGrad)" rx="3" />
                    <circle cx="356" cy="75" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="343" y="198" fill="#64748b" fontSize="10" fontWeight="600">Mon</text>
                    <text x="340" y="210" fill="#94a3b8" fontSize="9">22 Jun</text>
                    <text x="333" y="52" fill="#1e293b" fontSize="8" fontWeight="bold" opacity="0.8">40 (24.5k)</text>
                  </g>
                  <g>
                    <rect x="410" y="10" width="55" height="185" fill="transparent" className="hover:fill-slate-50/40 cursor-pointer transition duration-200" />
                    <rect x="420" y="54" width="16" height="126" fill="url(#blueGrad)" rx="3" />
                    <circle cx="428" cy="68.57142857142857" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="415" y="198" fill="#64748b" fontSize="10" fontWeight="600">Tue</text>
                    <text x="412" y="210" fill="#94a3b8" fontSize="9">23 Jun</text>
                    <text x="405" y="46" fill="#1e293b" fontSize="8" fontWeight="bold" opacity="0.8">42 (26k)</text>
                  </g>
                  <g>
                    <rect x="482" y="10" width="55" height="185" fill="transparent" className="hover:fill-slate-50/40 cursor-pointer transition duration-200" />
                    <rect x="492" y="36" width="16" height="144" fill="url(#blueGrad)" rx="3" />
                    <circle cx="500" cy="46.28571428571428" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="487" y="198" fill="#64748b" fontSize="10" fontWeight="600">Wed</text>
                    <text x="484" y="210" fill="#94a3b8" fontSize="9">24 Jun</text>
                    <text x="477" y="28" fill="#1e293b" fontSize="8" fontWeight="bold" opacity="0.8">48 (31.2k)</text>
                  </g>
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#93c5fd" />
                    </linearGradient>
                  </defs>
                  <path d="M 68 101.14285714285715 L 140 85.28571428571428 L 212 60.85714285714286 L 284 149.14285714285714 L 356 75 L 428 68.57142857142857 L 500 46.28571428571428" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-md">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">OPD Leaderboard</h3>
                  <p className="text-xs text-slate-400">Doctor consultations scheduled today</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-0.5 cursor-pointer">
                  All Doctors <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-3.5">
                {mockDoctors.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/60 transition border border-transparent hover:border-slate-200/40">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs uppercase border border-blue-500/20">
                        {doc.name.split(' ').map(n => n[0]).join('').replace('D', '').substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 leading-tight">{doc.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{doc.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-800">{doc.patientsToday}</span>
                      <p className="text-[10px] text-slate-400">tokens</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white/40 backdrop-blur-md lg:col-span-2">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Today's Appointment Queue</h3>
                  <p className="text-xs text-slate-400">Ongoing and scheduled clinic checkups</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-0.5 cursor-pointer">
                  Full Calendar <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100/80 text-slate-400 font-medium text-xs hover:bg-transparent">
                    <TableHead className="py-2.5 px-3 bg-transparent">Token</TableHead>
                    <TableHead className="py-2.5 px-3 bg-transparent">Patient</TableHead>
                    <TableHead className="py-2.5 px-3 bg-transparent">Consulting Doctor</TableHead>
                    <TableHead className="py-2.5 px-3 bg-transparent">Time</TableHead>
                    <TableHead className="py-2.5 px-3 bg-transparent">Category</TableHead>
                    <TableHead className="py-2.5 px-3 text-right bg-transparent">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100/40">
                  {mockAppointments.map((apt, idx) => (
                    <TableRow key={apt.id} className="hover:bg-white/40 border-none">
                      <TableCell className="py-3 px-3 font-mono font-bold text-slate-500">
                        #{String(idx + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{apt.patient}</div>
                        <div className="text-[10px] text-slate-400">{apt.id.replace('APT', 'PAT')}</div>
                      </TableCell>
                      <TableCell className="py-3 px-3 text-slate-600 font-medium">{apt.doctor}</TableCell>
                      <TableCell className="py-3 px-3 text-slate-500">{apt.time}</TableCell>
                      <TableCell className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-white/60 border border-slate-200/50 rounded text-xs text-slate-600 font-medium">
                          {apt.type}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 px-3 text-right">
                        <Badge variant={apt.status === 'Completed' ? 'success' : apt.status === 'In Progress' ? 'info' : 'warning'}>
                          {apt.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-md">
            <CardContent className="p-5">
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-800">Recent Activities</h3>
                <p className="text-xs text-slate-400">Live operational logs for Durga Clinic</p>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 rounded-xl shrink-0 text-green-600 bg-emerald-500/10 border border-emerald-500/20">
                    <CircleCheck className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-700 leading-tight font-medium">Ramesh Kumar completed consultation with Dr. Neha Patel</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> 10 Mins ago
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 rounded-xl shrink-0 text-blue-600 bg-blue-500/10 border border-blue-500/20">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-700 leading-tight font-medium">Invoice INV-2026-001 generated for Ramesh Kumar - ₹1,500 Paid via UPI</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> 25 Mins ago
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 rounded-xl shrink-0 text-orange-600 bg-orange-500/10 border border-orange-500/20">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-700 leading-tight font-medium">Operation OT-003: Scheduled for tomorrow 08:00 AM</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> 1 Hour ago
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 rounded-xl shrink-0 text-red-600 bg-red-500/10 border border-red-500/20">
                    <TriangleAlert className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-700 leading-tight font-medium">Stock Alert: Montelukast 10mg has fallen below critical level of 10 units</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> 2 Hours ago
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 rounded-xl shrink-0 text-purple-600 bg-purple-500/10 border border-purple-500/20">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-700 leading-tight font-medium">Lab Report Completed: Complete Blood Count for Anjali Verma</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> 3 Hours ago
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}