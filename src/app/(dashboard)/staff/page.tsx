import React from 'react';
import { Users, CircleCheck, ShieldAlert, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export default function Staff() {
  const mockStaff = [
    { id: 'STF-001', name: 'Karan Malhotra', joined: '2021-04-10', role: 'Clinic Manager', dept: 'Administration', phone: '+91 98765 11111', salary: '₹65,000', attendance: 96, stats: '24P | 1L | 0A', status: 'Active' },
    { id: 'STF-002', name: 'Anjali Deshmukh', joined: '2022-01-15', role: 'Senior Receptionist', dept: 'Administration', phone: '+91 98765 22222', salary: '₹35,000', attendance: 92, stats: '23P | 1L | 1A', status: 'Active' },
    { id: 'STF-003', name: 'Geeta Sen', joined: '2023-02-15', role: 'Billing Officer', dept: 'Billing', phone: '+91 99929 97299', salary: '₹70,015', attendance: 83, stats: '19P | 2L | 2A', status: 'Active' },
    { id: 'STF-005', name: 'Jyoti Banerjee', joined: '2021-08-15', role: 'OT Technician', dept: 'OT Support', phone: '+91 99713 95447', salary: '₹57,088', attendance: 87, stats: '20P | 3L | 0A', status: 'Active' },
    { id: 'STF-006', name: 'Isha Srivastava', joined: '2025-01-15', role: 'Staff Nurse', dept: 'Nursing', phone: '+91 99255 94521', salary: '₹56,180', attendance: 93, stats: '25P | 2L | 0A', status: 'Active' },
    { id: 'STF-007', name: 'Pooja Sen', joined: '2021-09-15', role: 'Assistant Pharmacist', dept: 'Pharmacy', phone: '+91 99664 60262', salary: '₹36,753', attendance: 86, stats: '25P | 2L | 2A', status: 'Active' },
    { id: 'STF-011', name: 'Divya Trivedi', joined: '2023-02-15', role: 'Assistant Pharmacist', dept: 'Pharmacy', phone: '+91 99465 89891', salary: '₹40,529', attendance: 90, stats: '18P | 2L | 0A', status: 'On Leave' },
    { id: 'STF-012', name: 'Kiran Pillai', joined: '2023-08-15', role: 'Senior Nurse', dept: 'Nursing', phone: '+91 99707 88966', salary: '₹28,510', attendance: 85, stats: '22P | 3L | 1A', status: 'Active' },
    { id: 'STF-024', name: 'Neha Banerjee', joined: '2024-04-15', role: 'Supervisor', dept: 'Housekeeping', phone: '+91 99711 77854', salary: '₹73,171', attendance: 96, stats: '23P | 1L | 0A', status: 'Active' },
    { id: 'STF-025', name: 'Nikhil Chatterjee', joined: '2021-06-15', role: 'Pathologist Assistant', dept: 'Lab', phone: '+91 99520 43595', salary: '₹70,411', attendance: 93, stats: '25P | 2L | 0A', status: 'Active' },
  ];

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Workforce</p>
              <h4 className="text-xl font-bold text-slate-800">25 Employees</h4>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4 border-l-4 border-l-green-500">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <CircleCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider">On Duty Today</p>
              <h4 className="text-xl font-bold text-slate-800">24 Present</h4>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4 border-l-4 border-l-amber-500">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Authorized Absences</p>
              <h4 className="text-xl font-bold text-slate-800">1 On Leave</h4>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Durga Clinic Workforce Directory</h1>
            <p className="text-slate-500 text-xs mt-0.5">Manage nursing staff, receptionists, lab technicians, housekeeping rosters and attendance sheets</p>
          </div>
        </div>

        <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Input 
              icon={<Search className="w-4.5 h-4.5" />} 
              placeholder="Search by Employee ID, name, clinical role..." 
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-semibold">Department:</span>
              <select className="bg-transparent font-bold text-slate-700 focus:outline-none text-xs">
                <option value="All">All Departments</option>
                <option value="Nursing">Nursing</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Lab">Lab</option>
                <option value="Administration">Administration</option>
                <option value="Billing">Billing</option>
                <option value="OT Support">OT Support</option>
                <option value="Housekeeping">Housekeeping</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 text-slate-400 bg-slate-50/50 font-bold uppercase tracking-wider py-3 hover:bg-slate-50/50">
                <TableHead className="py-3 px-4 bg-transparent">Employee Name & ID</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Department & Role</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Contact Phone</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Monthly Salary</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Attendance Rate (Monthly)</TableHead>
                <TableHead className="py-3 px-4 text-center bg-transparent">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{staff.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{staff.id} | Joined {staff.joined}</div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <div className="font-semibold text-slate-700">{staff.role}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{staff.dept}</div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-slate-500 font-semibold">{staff.phone}</TableCell>
                  <TableCell className="py-3.5 px-4 font-bold text-slate-850">{staff.salary}</TableCell>
                  <TableCell className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${staff.attendance >= 90 ? 'bg-green-500' : 'bg-amber-500'}`} style={{width: `${staff.attendance}%`}}></div>
                      </div>
                      <span className="font-bold font-mono">{staff.attendance}%</span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5">{staff.stats}</p>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-center">
                    <Badge variant={staff.status === 'Active' ? 'success' : 'warning'} className="text-[10px]">
                      {staff.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </main>
  );
}