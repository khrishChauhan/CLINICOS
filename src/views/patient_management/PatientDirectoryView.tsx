import React, { useState } from 'react';
import { 
  Search, Filter, Plus, UserPlus, MoreVertical, Phone, Mail, 
  Calendar, Activity, ArrowUpDown, ChevronLeft, ChevronRight,
  Download, FileSpreadsheet, ShieldAlert, CheckSquare, Trash2, Mail as MailIcon, MessageSquare, Inbox
} from 'lucide-react';
import PatientProfileView from './PatientProfileView';

const patientsData = [
  { uhid: 'UHID-23091', name: 'Rahul Sharma', age: 34, gender: 'Male', phone: '+91 9876543210', lastVisit: '12 Jun 2026', doctor: 'Dr. Alok Mehta', status: 'Active', tags: ['VIP'] },
  { uhid: 'UHID-23092', name: 'Priya Verma', age: 28, gender: 'Female', phone: '+91 8765432109', lastVisit: '18 Jun 2026', doctor: 'Dr. Sarah Thomas', status: 'Active', tags: [] },
  { uhid: 'UHID-23093', name: 'Amit Singh', age: 45, gender: 'Male', phone: '+91 7654321098', lastVisit: '05 May 2026', doctor: 'Dr. Vikram Sethi', status: 'Inactive', tags: ['Diabetic'] },
  { uhid: 'UHID-23094', name: 'Neha Gupta', age: 31, gender: 'Female', phone: '+91 6543210987', lastVisit: '20 Jun 2026', doctor: 'Dr. Riya Sharma', status: 'Active', tags: ['Maternity'] },
  { uhid: 'UHID-23095', name: 'Kiran Reddy', age: 52, gender: 'Male', phone: '+91 9988776655', lastVisit: '15 Apr 2026', doctor: 'Dr. Alok Mehta', status: 'Active', tags: ['Hypertension'] },
  { uhid: 'UHID-23096', name: 'Vikram Malhotra', age: 29, gender: 'Male', phone: '+91 8877665544', lastVisit: '22 Jun 2026', doctor: 'Dr. Sarah Thomas', status: 'Active', tags: [] },
  { uhid: 'UHID-23097', name: 'Sneha Patel', age: 41, gender: 'Female', phone: '+91 7766554433', lastVisit: '10 Jun 2026', doctor: 'Dr. Riya Sharma', status: 'Active', tags: [] },
  { uhid: 'UHID-23098', name: 'Ananya Desai', age: 36, gender: 'Female', phone: '+91 6655443322', lastVisit: '28 May 2026', doctor: 'Dr. Vikram Sethi', status: 'Inactive', tags: ['Post-Op'] },
  { uhid: 'UHID-23099', name: 'Suresh Kumar', age: 60, gender: 'Male', phone: '+91 5544332211', lastVisit: '01 Jun 2026', doctor: 'Dr. Alok Mehta', status: 'Active', tags: ['Senior', 'Cardiac'] },
  { uhid: 'UHID-23100', name: 'Ramesh Jain', age: 48, gender: 'Male', phone: '+91 4433221100', lastVisit: '19 Jun 2026', doctor: 'Dr. Sarah Thomas', status: 'Active', tags: [] },
];

export default function PatientDirectoryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  if (selectedPatient) {
    return <PatientProfileView onBack={() => setSelectedPatient(null)} />;
  }

  const filteredPatients = patientsData.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.uhid.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  );

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredPatients.length && filteredPatients.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredPatients.map((_, i) => i));
    }
  };

  const toggleSelectRow = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const isAllSelected = selectedRows.length > 0 && selectedRows.length === filteredPatients.length;
  const hasSelection = selectedRows.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage 5,432 registered records across all clinic branches.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <UserPlus className="w-4 h-4" />
            New Patient
          </button>
        </div>
      </div>

      {/* CRM Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center transition-all">
        {hasSelection ? (
          <div className="flex items-center gap-4 w-full animate-in fade-in slide-in-from-left-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-700">{selectedRows.length} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                <MessageSquare className="w-4 h-4" /> SMS
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                <MailIcon className="w-4 h-4" /> Email
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
            <button onClick={() => setSelectedRows([])} className="text-sm text-slate-500 font-medium hover:text-slate-700 ml-auto mr-2">Clear</button>
          </div>
        ) : (
          <>
            <div className="relative w-full md:w-96 animate-in fade-in">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search by name, UHID, or phone number..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto animate-in fade-in">
              <button className="flex-1 md:flex-none px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                <Filter className="w-4 h-4" />
                Filters <span className="bg-slate-200 text-slate-800 text-xs px-2 py-0.5 rounded-full ml-1">2</span>
              </button>
              <button className="flex-1 md:flex-none px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                Columns
              </button>
            </div>
          </>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {filteredPatients.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                  <tr>
                    <th className="px-5 py-4 w-12 text-center border-r border-slate-100">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" 
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-5 py-4 cursor-pointer hover:text-slate-800 transition-colors">
                      <div className="flex items-center gap-2">Patient <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-5 py-4">UHID</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4 cursor-pointer hover:text-slate-800 transition-colors">
                      <div className="flex items-center gap-2">Last Visit <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-5 py-4">Status & Tags</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((patient, i) => {
                    const isSelected = selectedRows.includes(i);
                    return (
                    <tr key={i} className={`transition-colors group ${isSelected ? 'bg-indigo-50/30' : 'hover:bg-slate-50/80'}`}>
                      <td className="px-5 py-4 text-center border-r border-slate-100">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" 
                          checked={isSelected}
                          onChange={() => toggleSelectRow(i)}
                        />
                      </td>
                      <td className="px-5 py-4 cursor-pointer" onClick={() => setSelectedPatient(patient)}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs flex-shrink-0">
                            {patient.name.split(' ')[0][0]}{patient.name.split(' ')[1] ? patient.name.split(' ')[1][0] : ''}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-primary transition-colors cursor-pointer">{patient.name}</div>
                            <div className="text-xs text-slate-500">{patient.age} Yrs • {patient.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-600">
                        {patient.uhid}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-3.5 h-3.5" />
                          {patient.phone}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-slate-900">{patient.lastVisit}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{patient.doctor}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${patient.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                            <span className="text-xs text-slate-600 font-medium">{patient.status}</span>
                          </div>
                          {patient.tags.map((tag, tIdx) => (
                            <span key={tIdx} className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              tag === 'VIP' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                              tag.includes('Allergy') ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                              'bg-indigo-50 text-indigo-700 border border-indigo-100'
                            }`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-600 mt-auto">
              <div>
                Showing <span className="font-semibold text-slate-900">1</span> to <span className="font-semibold text-slate-900">{filteredPatients.length}</span> of <span className="font-semibold text-slate-900">5,432</span> patients
              </div>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded bg-white border border-slate-200 text-slate-400 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-3 py-1 bg-primary text-white font-medium rounded shadow-sm">1</button>
                <button className="px-3 py-1 hover:bg-slate-200 rounded transition-colors">2</button>
                <button className="px-3 py-1 hover:bg-slate-200 rounded transition-colors">3</button>
                <span className="px-2">...</span>
                <button className="px-3 py-1 hover:bg-slate-200 rounded transition-colors">544</button>
                <button className="px-3 py-1.5 rounded bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No patients found</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              We couldn't find any patient matching "{searchTerm}". Try checking for typos or searching by phone number instead.
            </p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

