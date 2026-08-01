import React from 'react'

export const metadata = {
  title: 'Radiology | ClinicOS',
  description: 'Radiology Order & Scheduling Management',
}

export default function RadiologyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {children}
    </div>
  )
}
