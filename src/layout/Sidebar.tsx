"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserRound, 
  FileText, 
  IndianRupee, 
  ShoppingBag, 
  Package, 
  Heart, 
  FlaskConical, 
  ClipboardList, 
  FileChartColumn, 
  ChartColumnIncreasing, 
  Settings, 
  LifeBuoy 
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Patients', path: '/patients', icon: Users },
  { name: 'Appointments', path: '/appointments', icon: Calendar },
  { name: 'Doctors', path: '/doctors', icon: UserRound },
  { name: 'EMR Consult', path: '/emr', icon: FileText },
  { name: 'Cashier Ledger', path: '/ledger', icon: IndianRupee },
  { name: 'Pharmacy Store', path: '/pharmacy', icon: ShoppingBag },
  { name: 'Consumables', path: '/consumables', icon: Droplet },
  { name: 'Operation Theatre', path: '/operation-theatre', icon: Heart },
  { name: 'Pathology Lab', path: '/lab', icon: FlaskConical },
  { name: 'Staff Directory', path: '/staff', icon: UserCog },
  { name: 'Audits & Reports', path: '/reports', icon: ClipboardList },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Configurations', path: '/settings', icon: Settings },
  { name: 'Help & Support', path: '/support', icon: LifeBuoy },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="bg-white/40 backdrop-blur-xl border-r border-slate-200/50 text-slate-700 w-64 fixed inset-y-0 left-0 z-40 transition-transform lg:translate-x-0 flex flex-col justify-between translate-x-0">
      <div className="space-y-6 py-4 flex-1 overflow-y-auto">
        <div className="px-5 pb-3 border-b border-slate-100/80 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">C</div>
            <div>
              <h1 className="text-sm font-black text-slate-900 tracking-wide uppercase leading-none">Click Aarambh</h1>
              <p className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mt-1">Durga Clinic OS</p>
            </div>
          </div>
          <button className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="space-y-1.5 px-3 text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all group',
                  isActive
                    ? 'bg-blue-600/90 text-white shadow-md shadow-blue-500/10 backdrop-blur-md'
                    : 'hover:bg-white/60 hover:text-slate-900 text-slate-500'
                )}
              >
                <item.icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-transform group-hover:scale-105',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 bg-white/30 border-t border-slate-100/80 text-[10px] text-slate-400 space-y-1">
        <p className="font-bold text-slate-600">v3.4.1 (Stable Build)</p>
        <p>Local sync node connected securely</p>
      </div>
    </aside>
  );
}