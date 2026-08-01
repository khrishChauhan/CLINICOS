import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, CalendarDays, FilePlus } from 'lucide-react'

export function RadiologyTabs() {
  const pathname = usePathname()
  
  const tabs = [
    { name: 'Dashboard', path: '/radiology', icon: Activity },
    { name: 'New Order', path: '/radiology/new', icon: FilePlus },
    { name: 'Schedule', path: '/radiology/schedule', icon: CalendarDays },
  ]

  return (
    <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path || (tab.path !== '/radiology' && pathname.startsWith(tab.path))
        return (
          <Link
            key={tab.name}
            href={tab.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </Link>
        )
      })}
    </div>
  )
}
