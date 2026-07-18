import React from 'react';
import { ShoppingBag, TriangleAlert, CircleAlert, ShoppingCart, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export default function Pharmacy() {
  const mockMedicines = [
    { id: 'MED-001', name: 'Metformin 500mg', manufacturer: 'Abbott India', class: 'Antidiabetic', stock: 1111, expiry: '2029-03-28', price: '₹9.1', batch: 'BAT-76655', status: 'STABLE' },
    { id: 'MED-002', name: 'Amlodipine 5mg', manufacturer: 'Dr. Reddy Laboratories', class: 'Antihypertensive', stock: 982, expiry: '2028-04-28', price: '₹3.8', batch: 'BAT-51940', status: 'STABLE' },
    { id: 'MED-003', name: 'Atorvastatin 10mg', manufacturer: 'Abbott India', class: 'Cardiovascular', stock: 734, expiry: '2029-08-28', price: '₹13.1', batch: 'BAT-85257', status: 'STABLE' },
    { id: 'MED-004', name: 'Paracetamol 650mg (Dolo)', manufacturer: 'Dr. Reddy Laboratories', class: 'Analgesic/Antipyretic', stock: 12, expiry: '2026-09-28', price: '₹1.7', batch: 'BAT-66329', status: 'CRITICAL' },
    { id: 'MED-005', name: 'Amoxicillin 500mg', manufacturer: 'Lupin Ltd.', class: 'Antibiotic', stock: 444, expiry: '2029-10-28', price: '₹17.3', batch: 'BAT-11545', status: 'STABLE' },
    { id: 'MED-006', name: 'Levothyroxine 50mcg', manufacturer: 'Dr. Reddy Laboratories', class: 'Thyroid Hormone', stock: 439, expiry: '2026-06-28', price: '₹3.9', batch: 'BAT-83960', status: 'STABLE' },
    { id: 'MED-007', name: 'Pantoprazole 40mg', manufacturer: 'Cipla Ltd.', class: 'Antacid/Gastro', stock: 921, expiry: '2026-07-28', price: '₹8.5', batch: 'BAT-43296', status: 'STABLE' },
    { id: 'MED-008', name: 'Montelukast 10mg', manufacturer: 'Sun Pharmaceutical Industries', class: 'Antiasthmatic', stock: 8, expiry: '2026-11-28', price: '₹9.3', batch: 'BAT-15942', status: 'CRITICAL' },
    { id: 'MED-009', name: 'Cetirizine 10mg', manufacturer: 'Dr. Reddy Laboratories', class: 'Antihistamine', stock: 274, expiry: '2029-11-28', price: '₹2.7', batch: 'BAT-64954', status: 'STABLE' },
    { id: 'MED-010', name: 'Ibuprofen 400mg', manufacturer: 'Sun Pharmaceutical Industries', class: 'Analgesic/NSAID', stock: 423, expiry: '2027-06-28', price: '₹2.6', batch: 'BAT-90054', status: 'STABLE' },
    { id: 'MED-011', name: 'Azithromycin 500mg', manufacturer: 'Abbott India', class: 'Antibiotic', stock: 955, expiry: '2028-06-28', price: '₹27.6', batch: 'BAT-57631', status: 'STABLE' },
    { id: 'MED-012', name: 'Losartan 50mg', manufacturer: 'Cipla Ltd.', class: 'Antihypertensive', stock: 140, expiry: '2028-09-28', price: '₹6.7', batch: 'BAT-20740', status: 'REORDER' },
  ];

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Formulations</p>
              <h4 className="text-xl font-bold text-slate-800">300 Medicines</h4>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4 border-l-4 border-l-amber-500">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <TriangleAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Low Stock Level</p>
              <h4 className="text-xl font-bold text-slate-800">31 Items Alerts</h4>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4 border-l-4 border-l-rose-500">
            <div className="p-3 rounded-lg bg-rose-50 text-rose-600">
              <CircleAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Critical Reorders (&lt;15 Units)</p>
              <h4 className="text-xl font-bold text-slate-800">6 Urgent Refills</h4>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Durga Clinic Pharmacy Dispensing Desk</h1>
            <p className="text-slate-500 text-xs mt-0.5">Maintain stock logs, track expiries, and issue medicine packets to clinical patients</p>
          </div>
          <Button>
            <ShoppingCart className="w-4 h-4" /> Issue Patient Medicines
          </Button>
        </div>

        <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Input 
              icon={<Search className="w-4.5 h-4.5" />} 
              placeholder="Search by Medicine name, batch ID, manufacture..." 
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-semibold">Category:</span>
              <select className="bg-transparent font-bold text-slate-700 focus:outline-none text-xs">
                <option value="All">All Categories</option>
                <option value="Antidiabetic">Antidiabetic</option>
                <option value="Antihypertensive">Antihypertensive</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Analgesic/Antipyretic">Analgesic/Antipyretic</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Thyroid Hormone">Thyroid Hormone</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
              <span className="text-slate-500 font-semibold">Stock Health:</span>
              <select className="bg-transparent font-bold text-slate-700 focus:outline-none text-xs">
                <option value="All">All Items</option>
                <option value="Low">Low Stock (&lt;Min Stock)</option>
                <option value="Critical">Critical (&lt;15 units)</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 text-slate-400 bg-slate-50/50 font-bold uppercase tracking-wider py-3 hover:bg-slate-50/50">
                <TableHead className="py-3 px-4 bg-transparent">Medicine Code & Name</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Therapeutic Class</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Current Stock</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Expiry Date</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Unit Price</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Batch ID</TableHead>
                <TableHead className="py-3 px-4 text-center bg-transparent">Reorder Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMedicines.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{med.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">{med.id} | {med.manufacturer}</div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-slate-600 font-medium">{med.class}</TableCell>
                  <TableCell className="py-3.5 px-4 font-mono">
                    <span className={`font-bold ${med.stock < 15 ? 'text-red-600 font-black' : med.stock < 150 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {med.stock}
                    </span>
                    <span className="text-[9px] text-slate-400 ml-1">Tablets</span>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-slate-500 font-mono">{med.expiry}</TableCell>
                  <TableCell className="py-3.5 px-4 font-bold">{med.price}</TableCell>
                  <TableCell className="py-3.5 px-4 text-slate-400 font-mono">{med.batch}</TableCell>
                  <TableCell className="py-3.5 px-4 text-center">
                    <Badge variant={med.status === 'In Stock' ? 'success' : med.status === 'Low Stock' ? 'warning' : 'danger'} className="text-[9px] font-bold">
                      {med.status}
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