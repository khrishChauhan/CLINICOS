import React from 'react';
import { 
  Package, Search, Filter, Plus, AlertTriangle, 
  ArrowUpDown, MoreHorizontal, Printer, Edit, Trash2, CheckCircle2, QrCode
} from 'lucide-react';

const stockData = [
  { id: 'SKU-892', name: 'Paracetamol 500mg Strip', category: 'Medicine', batch: 'B-4402', expiry: 'Oct 2027', stock: 145, min: 50, price: '₹25', supplier: 'PharmaCorp' },
  { id: 'SKU-891', name: 'Azithromycin 250mg', category: 'Medicine', batch: 'B-4190', expiry: 'Dec 2026', stock: 12, min: 30, price: '₹120', supplier: 'MediLife' },
  { id: 'SKU-890', name: 'Disposable Syringes 5ml', category: 'Consumable', batch: 'S-110', expiry: 'Jan 2028', stock: 850, min: 200, price: '₹5', supplier: 'Surgicals Co.' },
  { id: 'SKU-889', name: 'Surgical Masks (Box)', category: 'Consumable', batch: 'M-002', expiry: 'N/A', stock: 8, min: 20, price: '₹150', supplier: 'CareTech' },
  { id: 'SKU-888', name: 'Pantoprazole 40mg', category: 'Medicine', batch: 'B-3392', expiry: 'Feb 2027', stock: 240, min: 100, price: '₹85', supplier: 'PharmaCorp' },
  { id: 'SKU-887', name: 'Digital Thermometer', category: 'Equipment', batch: 'EQ-04', expiry: 'N/A', stock: 5, min: 5, price: '₹450', supplier: 'CareTech' },
  { id: 'SKU-886', name: 'Cough Syrup 100ml', category: 'Medicine', batch: 'B-4551', expiry: 'May 2026', stock: 45, min: 20, price: '₹95', supplier: 'HealthPlus' },
];

export default function InvStockView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory & Stock</h1>
          <p className="text-sm text-slate-500 mt-1">Manage medicines, consumables, and track stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm">
            <QrCode className="w-4 h-4" /> Scan Barcode
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Items in Catalog</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">1,452</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Low Stock Alerts</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">24</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Expiring in 30 Days</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">8</h3>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Stock Value</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">₹4.2L</h3>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-18rem)] min-h-[400px]">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search by item name, SKU, or batch..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex bg-white rounded-md border border-slate-200 p-1 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-800 rounded">All Items</button>
            <button className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 rounded">Medicines</button>
            <button className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 rounded">Consumables</button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 border-b border-slate-200 font-medium sticky top-0 z-10 w-full">
              <tr>
                <th className="px-5 py-3">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                    SKU <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-5 py-3">Item Description</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Batch & Expiry</th>
                <th className="px-5 py-3">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                    Stock <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockData.map((item, i) => {
                const isLowStock = item.stock <= item.min;
                return (
                  <tr key={i} className={`transition-colors group hover:bg-slate-50 ${isLowStock ? 'bg-rose-50/30' : ''}`}>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">{item.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.supplier}</p>
                    </td>
                    <td className="px-5 py-4">
                       <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700">{item.batch}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Exp: {item.expiry}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                          {item.stock}
                        </span>
                        {isLowStock && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                            Low
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">Min: {item.min}</p>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">{item.price}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Print Barcode">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Item">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors" title="More Options">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination/Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-600">
          <div>Showing 1 to 7 of 1,452 items</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}
