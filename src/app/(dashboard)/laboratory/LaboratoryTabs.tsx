'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, TestTube2, FlaskConical } from 'lucide-react'

export function LaboratoryTabs() {
  const pathname = usePathname()

  const tabs = [
    { name: 'Lab Orders', path: '/laboratory', icon: FileText },
    { name: 'Sample Queue', path: '/laboratory/samples', icon: TestTube2 },
    { name: 'Work Queue', path: '/laboratory/tests', icon: FlaskConical },
  ]

  return (
    <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-lg w-fit mb-6 border border-slate-200">
      {tabs.map(tab => {
        const isActive = pathname === tab.path
        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition ${
              isActive ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
            {tab.name}
          </Link>
        )
      })}
    </div>
  )
}
