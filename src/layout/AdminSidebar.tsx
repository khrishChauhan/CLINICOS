'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/platform', label: 'Dashboard', icon: '⬡' },
  { href: '/platform/tenants', label: 'Tenants', icon: '🏥' },
  { href: '/platform/audit', label: 'Audit Logs', icon: '📋' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-40 hidden lg:flex flex-col">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-black">CA</div>
          <div>
            <p className="text-sm font-bold text-white">Click Aarambh</p>
            <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Control Center</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition">
          ← Back to Clinic Dashboard
        </Link>
      </div>
    </aside>
  )
}
