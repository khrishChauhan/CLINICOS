'use client'

import React from 'react';
import { Menu, CloudLightning, Bell, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import NotificationBellClient from './NotificationBellClient';

export default function Header() {
  const { session, loading, signOut } = useAuth();
  const router = useRouter();

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Build display name: prefer username, fallback to email prefix
  const displayName = session?.username ?? session?.email?.split('@')[0] ?? '…';
  const roleName = session?.role_name ?? '…';
  const clinicName = session?.clinic_name ?? 'ClinicOS';
  const clinicCity = session?.clinic_city ?? '';

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="bg-white/40 backdrop-blur-md border-b border-slate-200/50 h-14 px-6 flex justify-between items-center sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button className="p-1.5 text-slate-500 hover:text-slate-700 bg-white/50 hover:bg-white/80 border border-slate-200/50 rounded-lg lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-xs">
          <span className="font-bold text-slate-800 block">{clinicCity ? `${clinicCity} Desk` : clinicName}</span>
          <span className="text-slate-400 text-[10px] font-semibold">{currentDate} | {clinicName}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-700 backdrop-blur-xs">
          <CloudLightning className="w-3 h-3 text-emerald-500 animate-pulse" /> LOCAL SERVER LIVE
        </div>
        <NotificationBellClient />
        <div className="flex items-center gap-2 border-l border-slate-200/50 pl-4 text-xs">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          ) : (
            <>
              <span className="font-bold text-slate-700">{displayName}</span>
              <span className="text-[10px] bg-slate-100/80 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase border border-slate-200/30">
                {roleName}
              </span>
            </>
          )}
        </div>
        <button
          onClick={handleSignOut}
          title="Sign out"
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-200/50"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}