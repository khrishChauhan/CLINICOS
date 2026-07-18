import React from 'react';
import { Plus, Search, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { mockPatients } from '@/data/mockData';

export default function Patients() {
  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Durga Clinic Patient Registry</h1>
              <p className="text-slate-500 text-xs mt-0.5">Manage details, vitals, timelines and comprehensive EHR records for 250 patients</p>
            </div>
            <Button>
              <Plus className="w-4 h-4" /> Add Patient Record
            </Button>
          </div>

          <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-96">
              <Input 
                icon={<Search className="w-4.5 h-4.5" />} 
                placeholder="Search by Patient ID, Name, Phone..." 
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">Gender:</span>
                <select className="bg-transparent font-bold text-slate-700 focus:outline-none">
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
                <span className="text-slate-500">Blood Group:</span>
                <select className="bg-transparent font-bold text-slate-700 focus:outline-none">
                  <option value="All">All Groups</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-slate-400 md:ml-auto">Found {mockPatients.length} of 250 records</div>
          </Card>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 text-slate-400 bg-slate-50/50 font-bold text-xs uppercase tracking-wider hover:bg-slate-50/50">
                  <TableHead className="py-3 px-4 bg-transparent">Patient Name & ID</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Demographics</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Blood Group</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Phone Number</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Vitals Summary</TableHead>
                  <TableHead className="py-3 px-4 text-center bg-transparent">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPatients.map((patient) => {
                  const initials = patient.name.split(' ').map(n => n[0]).join('').substring(0, 2);
                  
                  return (
                    <TableRow key={patient.id}>
                      <TableCell className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                            {initials}
                          </div>
                          <div>
                            <button className="font-bold text-slate-800 hover:text-blue-600 text-left transition">
                              {patient.name}
                            </button>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{patient.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-slate-600">
                        {patient.age} Yrs • {patient.gender === 'M' ? 'Male' : 'Female'}
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-bold font-mono">
                          {patient.bloodGroup}
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 px-4 font-semibold text-slate-600">
                        {patient.phone}
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <div className="flex gap-2 text-xs">
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded leading-none text-[10px]" title="BP">130/85</span>
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded leading-none text-[10px]" title="Weight">78 kg</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-center">
                        <button className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded transition hover:shadow-sm">
                          <Eye className="w-3.5 h-3.5" /> View EHR
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            <div className="flex justify-between items-center p-4 border-t border-slate-100 text-xs">
              <span className="text-slate-400">Showing page 1 of 1 ({mockPatients.length} records)</span>
              <div className="flex gap-1.5">
                <button disabled className="px-3 py-1.5 border border-slate-200 rounded font-semibold transition text-slate-300 bg-slate-50 cursor-not-allowed">Prev</button>
                <button className="w-8 h-8 rounded border font-semibold text-center transition bg-blue-600 border-blue-600 text-white">1</button>
                <button className="px-3 py-1.5 border border-slate-200 rounded font-semibold transition text-slate-600 bg-white hover:bg-slate-50">Next</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}