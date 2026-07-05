import React from 'react';
import { Plus, Eye, CircleCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';

export default function Lab() {
  const mockLabTests = [
    { id: 'LAB-001', name: 'Knee Joint X-Ray', patient: 'Nisha Nair', patId: 'PAT-0076', category: 'X-Ray', doctor: 'Dr. Komal Saxena', date: '2026-06-12', status: 'Completed' },
    { id: 'LAB-002', name: 'HbA1c (Glycated Haemoglobin)', patient: 'Divya Gill', patId: 'PAT-0039', category: 'Blood Test', doctor: 'Dr. Rajeev Mehta', date: '2026-06-24', status: 'Pending' },
    { id: 'LAB-003', name: 'Lipid Profile', patient: 'Tanvi Mishra', patId: 'PAT-0107', category: 'Blood Test', doctor: 'Dr. Amit Trivedi', date: '2026-06-22', status: 'Completed' },
    { id: 'LAB-004', name: 'Thyroid Panel (T3, T4, TSH)', patient: 'Deepak Dwivedi', patId: 'PAT-0016', category: 'Blood Test', doctor: 'Dr. Sanjay Nair', date: '2026-06-14', status: 'Completed' },
    { id: 'LAB-005', name: 'Thyroid Panel (T3, T4, TSH)', patient: 'Deepika Mishra', patId: 'PAT-0186', category: 'Blood Test', doctor: 'Dr. Alok Verma', date: '2026-06-20', status: 'Completed' },
    { id: 'LAB-006', name: 'Chest X-Ray PA View', patient: 'Aarav Reddy', patId: 'PAT-0166', category: 'X-Ray', doctor: 'Dr. Alok Verma', date: '2026-06-22', status: 'Completed' },
    { id: 'LAB-007', name: 'Chest X-Ray PA View', patient: 'Jay Reddy', patId: 'PAT-0151', category: 'X-Ray', doctor: 'Dr. Vikram Shah', date: '2026-06-16', status: 'Completed' },
    { id: 'LAB-010', name: 'Lipid Profile', patient: 'Sanjay Sen', patId: 'PAT-0237', category: 'Blood Test', doctor: 'Dr. Priya Rao', date: '2026-06-24', status: 'Pending' },
    { id: 'LAB-012', name: 'Standard 12-Lead ECG', patient: 'Siddharth Yadav', patId: 'PAT-0080', category: 'ECG', doctor: 'Dr. Priya Rao', date: '2026-06-11', status: 'Completed' },
    { id: 'LAB-013', name: 'Complete Blood Count (CBC)', patient: 'Divya Shah', patId: 'PAT-0183', category: 'Blood Test', doctor: 'Dr. Sanjay Nair', date: '2026-06-24', status: 'Pending' }
  ];

  const categories = [
    'All Departments', 'Blood Test', 'ECG', 'X-Ray', 'MRI', 'CT Scan', 'Ultrasound'
  ];

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Durga Clinic Diagnostic Laboratory</h1>
            <p className="text-slate-500 text-xs mt-0.5">Publish haematology profiles, ECG tracings, radiology results and CT scan folders</p>
          </div>
          <Button>
            <Plus className="w-4 h-4" /> Upload Diagnostic Report
          </Button>
        </div>

        <div className="space-y-5">
          <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex gap-3 flex-wrap">
              {categories.map((cat, idx) => (
                <button key={cat} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs md:ml-auto">
              <span className="text-slate-500 font-semibold">Test status:</span>
              <select className="bg-transparent font-bold text-slate-700 focus:outline-none text-xs">
                <option value="All">All Tests</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 text-slate-400 bg-slate-50/50 font-bold uppercase tracking-wider py-3 hover:bg-slate-50/50">
                  <TableHead className="py-3 px-4 bg-transparent">Test ID & Investigation Name</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Patient details</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Tested Category</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Assigned Doctor</TableHead>
                  <TableHead className="py-3 px-4 bg-transparent">Complete Date</TableHead>
                  <TableHead className="py-3 px-4 text-center bg-transparent">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLabTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="py-3.5 px-4">
                      <button className="font-bold text-slate-800 hover:text-blue-600 text-left" disabled={test.status === 'Pending'}>{test.name}</button>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{test.id}</div>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 font-semibold">
                      {test.patient} <span className="text-[10px] text-slate-400 font-mono font-normal">({test.patId})</span>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 font-medium text-slate-600">{test.category}</TableCell>
                    <TableCell className="py-3.5 px-4 font-semibold text-slate-500">{test.doctor}</TableCell>
                    <TableCell className="py-3.5 px-4 text-slate-400 font-mono">{test.date}</TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      {test.status === 'Completed' ? (
                        <button className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded transition hover:bg-green-100">
                          <Eye className="w-3 h-3" /> View Report
                        </button>
                      ) : (
                        <button className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded transition hover:bg-amber-100">
                          <CircleCheck className="w-3 h-3 animate-pulse" /> Complete Report
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </main>
  );
}