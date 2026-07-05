import React from 'react';
import { Menu, CloudLightning, Bell } from 'lucide-react';

export default function Header() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="bg-white/40 backdrop-blur-md border-b border-slate-200/50 h-14 px-6 flex justify-between items-center sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button className="p-1.5 text-slate-500 hover:text-slate-700 bg-white/50 hover:bg-white/80 border border-slate-200/50 rounded-lg lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-xs">
          <span className="font-bold text-slate-800 block">Delhi NCR Desk</span>
          <span className="text-slate-400 text-[10px] font-semibold">{currentDate} | Durga Clinic</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-700 backdrop-blur-xs">
          <CloudLightning className="w-3 h-3 text-emerald-500 animate-pulse" /> LOCAL SERVER LIVE
        </div>
        <div className="relative">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/80 rounded-lg relative transition border border-transparent hover:border-slate-200/50">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 bg-blue-600 w-2 h-2 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
        <div className="flex items-center gap-2 border-l border-slate-200/50 pl-4 text-xs">
          <span className="font-bold text-slate-700">R. Kumar</span>
          <span className="text-[10px] bg-slate-100/80 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase border border-slate-200/30">Cashier</span>
        </div>
      </div>
    </header>
  );
}