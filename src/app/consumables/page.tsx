import React from 'react';
import { ShoppingCart, Search, Filter, MapPin } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';

export default function Consumables() {
  const mockConsumables = [
    { id: 1, name: 'Surgical Gloves (Box of 100)', class: 'Consumable', stock: 77, unit: 'Boxs', location: 'OT Store', lastOrdered: '2026-05-13', status: 'ADEQUATE' },
    { id: 2, name: 'N95 Masks (Box of 50)', class: 'Consumable', stock: 45, unit: 'Boxs', location: 'General Store', lastOrdered: '2026-05-20', status: 'ADEQUATE' },
    { id: 3, name: 'Disposable Syringes 5ml (Box of 100)', class: 'Consumable', stock: 35, unit: 'Boxs', location: 'Nursing Station', lastOrdered: '2026-05-13', status: 'ADEQUATE' },
    { id: 4, name: 'Sterilized Gauze Swabs', class: 'Consumable', stock: 11, unit: 'Packets', location: 'Treatment Room', lastOrdered: '2026-05-17', status: 'ADEQUATE' },
    { id: 5, name: 'Digital Thermometer', class: 'Equipment', stock: 49, unit: 'Units', location: 'OPD Desk', lastOrdered: '2026-05-21', status: 'ADEQUATE' },
    { id: 6, name: 'BP Monitor (Omron)', class: 'Equipment', stock: 61, unit: 'Units', location: 'OPD Desk', lastOrdered: '2026-05-25', status: 'ADEQUATE' },
    { id: 7, name: 'Pulse Oximeter', class: 'Equipment', stock: 8, unit: 'Units', location: 'OPD Desk', lastOrdered: '2026-05-24', status: 'LOW LEVEL' },
    { id: 8, name: 'Stethoscope (Littmann)', class: 'Equipment', stock: 49, unit: 'Units', location: 'Consulting Room 1', lastOrdered: '2026-05-17', status: 'ADEQUATE' },
    { id: 9, name: 'Glucometer Test Strips (Box of 50)', class: 'Diagnostic', stock: 23, unit: 'Boxs', location: 'Lab', lastOrdered: '2026-05-24', status: 'ADEQUATE' },
    { id: 10, name: 'ECG Thermal Roll', class: 'Diagnostic', stock: 29, unit: 'Rolls', location: 'ECG Room', lastOrdered: '2026-05-12', status: 'ADEQUATE' },
  ];

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Durga Clinic Consumables & Equipment Inventory</h1>
            <p className="text-slate-500 text-xs mt-0.5">Track diagnostics kits, surgical syringes, non-pharmaceutical clinical supplies</p>
          </div>
          <Button>
            <ShoppingCart className="w-4 h-4" /> Quick Restock Entry
          </Button>
        </div>

        <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Input 
              icon={<Search className="w-4.5 h-4.5" />} 
              placeholder="Search by equipment, consumable name, location..." 
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-semibold">Stock Class:</span>
              <select className="bg-transparent font-bold text-slate-700 focus:outline-none text-xs">
                <option value="All">All Stocks</option>
                <option value="Consumable">Consumables</option>
                <option value="Equipment">Clinical Equipment</option>
                <option value="Diagnostic">Diagnostic Supplies</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 text-slate-400 bg-slate-50/50 font-bold uppercase tracking-wider py-3 hover:bg-slate-50/50">
                <TableHead className="py-3 px-4 bg-transparent">Item ID & Description</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Classification</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Available Stock</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Facility Location</TableHead>
                <TableHead className="py-3 px-4 bg-transparent">Last Ordered</TableHead>
                <TableHead className="py-3 px-4 text-center bg-transparent">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockConsumables.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="py-3.5 px-4 font-bold text-slate-800">{item.name}</TableCell>
                  <TableCell className="py-3.5 px-4 text-slate-600 font-medium">{item.class}</TableCell>
                  <TableCell className="py-3.5 px-4 font-mono font-bold">
                    <span className={item.stock < 15 ? 'text-amber-600' : 'text-slate-800'}>{item.stock}</span>
                    <span className="text-[10px] text-slate-400 ml-1">{item.unit}</span>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-slate-400 font-mono">{item.lastOrdered}</TableCell>
                  <TableCell className="py-3.5 px-4 text-center">
                    <Badge variant={item.status === 'ADEQUATE' ? 'success' : 'warning'} className="text-[9px] font-bold">
                      {item.status}
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