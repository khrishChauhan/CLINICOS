import React from 'react'
import AdminSidebar from '@/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <header className="bg-slate-900 border-b border-slate-800 h-14 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <span className="text-xs font-bold text-slate-200 tracking-widest uppercase">ClinicOS Control Center</span>
            <span className="ml-3 bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">SUPER ADMIN</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-0 text-slate-100">
          {children}
        </main>
      </div>
    </div>
  )
}
