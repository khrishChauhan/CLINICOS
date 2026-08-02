'use client'

import React, { useState, useTransition, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Search, UserPlus, AlertTriangle, Users, RefreshCw, Filter,
  Stethoscope, CheckCircle, XCircle, Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { getDoctorsAction, updateDoctorStatusAction } from '@/actions/doctors/doctorActions'
import type { DoctorRow } from '@/types/doctors'

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function DoctorStatusBadge({ status }: { status: string }) {
  const cfg = {
    'Active':   { variant: 'success'  as const, icon: CheckCircle, label: 'Active' },
    'On Leave': { variant: 'warning'  as const, icon: Clock,        label: 'On Leave' },
    'Inactive': { variant: 'default'  as const, icon: XCircle,      label: 'Inactive' },
  }[status] ?? { variant: 'default' as const, icon: XCircle, label: status }

  return (
    <Badge variant={cfg.variant}>
      {cfg.label}
    </Badge>
  )
}

function DoctorTableSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="animate-pulse divide-y divide-slate-100">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-4 py-4 flex items-center gap-4">
            <div className="w-9 h-9 bg-slate-100 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-100 rounded w-40" />
              <div className="h-2 bg-slate-50 rounded w-24" />
            </div>
            <div className="h-6 w-16 bg-slate-100 rounded-full" />
            <div className="h-8 w-24 bg-slate-50 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  )
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Stethoscope className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="font-bold text-slate-700 text-base">
        {hasSearch ? 'No doctors match your search' : 'No doctors registered yet'}
      </h3>
      <p className="text-slate-400 text-sm mt-1 max-w-xs">
        {hasSearch ? 'Try adjusting your filters or search term.' : 'Add your first doctor to get started.'}
      </p>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="font-bold text-slate-700 text-base">Failed to load doctors</h3>
      <p className="text-slate-400 text-sm mt-1">There was an error fetching the doctor list.</p>
      <button
        onClick={onRetry}
        className="mt-4 flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition"
      >
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

interface DoctorsClientProps {
  initialDoctors: DoctorRow[]
  initialSearch: string
  initialStatus: string
  hasError: boolean
}

export default function DoctorsClient({
  initialDoctors,
  initialSearch,
  initialStatus,
  hasError: initialError
}: DoctorsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParamsHook = useSearchParams()

  const [doctors, setDoctors]     = useState<DoctorRow[]>(initialDoctors)
  const [search, setSearch]       = useState(initialSearch)
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [hasError, setHasError]   = useState(initialError)
  const [isPending, startTransition] = useTransition()
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Push URL params + re-fetch
  const applyAndSync = useCallback((overrides: { search?: string; status?: string }) => {
    const newSearch = overrides.search  !== undefined ? overrides.search  : search
    const newStatus = overrides.status  !== undefined ? overrides.status  : statusFilter
    if (overrides.search  !== undefined) setSearch(newSearch)
    if (overrides.status  !== undefined) setStatusFilter(newStatus)

    const params = new URLSearchParams(searchParamsHook.toString())
    if (newSearch) params.set('search', newSearch) ; else params.delete('search')
    if (newStatus) params.set('status', newStatus) ; else params.delete('status')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })

    startTransition(async () => {
      const result = await getDoctorsAction()
      if (result.success) { setDoctors(result.data); setHasError(false) }
      else setHasError(true)
    })
  }, [search, statusFilter, pathname, router, searchParamsHook])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => applyAndSync({ search: val }), 300)
  }

  const handleRetry = () => applyAndSync({})

  // Client-side filter on already-fetched data (fast, no round-trip for search)
  const filteredDoctors = doctors.filter(doc => {
    const fullName = `${doc.first_name} ${doc.last_name}`.toLowerCase()
    const matchesSearch = !search ||
      fullName.includes(search.toLowerCase()) ||
      doc.doctor_code.toLowerCase().includes(search.toLowerCase()) ||
      (doc.email && doc.email.toLowerCase().includes(search.toLowerCase())) ||
      (doc.mobile_number && doc.mobile_number.includes(search))
    const matchesStatus = !statusFilter || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctors Registry</h1>
          <p className="text-sm text-slate-500">
            {isPending ? 'Loading…' : `${filteredDoctors.length} doctor${filteredDoctors.length !== 1 ? 's' : ''} • Manage profiles, fees, and availability`}
          </p>
        </div>
        <Link href="/doctors/new/profile">
          <Button className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add Doctor
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search by name, code, email…"
            className="pl-9"
            value={search}
            onChange={handleSearchChange}
            aria-label="Search doctors"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <label htmlFor="doc-status-filter" className="text-slate-500">Status:</label>
          <select
            id="doc-status-filter"
            value={statusFilter}
            onChange={e => applyAndSync({ status: e.target.value })}
            className="bg-transparent font-bold text-slate-700 focus:outline-none"
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="text-xs text-slate-400 md:ml-auto whitespace-nowrap">
          {isPending ? '…' : `${filteredDoctors.length} result${filteredDoctors.length !== 1 ? 's' : ''}`}
        </div>
      </Card>

      {/* Table */}
      {isPending ? (
        <DoctorTableSkeleton />
      ) : hasError ? (
        <Card className="overflow-hidden"><ErrorState onRetry={handleRetry} /></Card>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {filteredDoctors.length === 0 ? (
              <EmptyState hasSearch={!!(search || statusFilter)} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100 text-slate-400 bg-slate-50/50 text-xs uppercase tracking-wider hover:bg-slate-50/50">
                    <TableHead className="py-3 px-4 bg-transparent font-bold">Doctor</TableHead>
                    <TableHead className="py-3 px-4 bg-transparent font-bold">Code</TableHead>
                    <TableHead className="py-3 px-4 bg-transparent font-bold">Contact</TableHead>
                    <TableHead className="py-3 px-4 bg-transparent font-bold">Status</TableHead>
                    <TableHead className="py-3 px-4 text-right bg-transparent font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map(doc => (
                    <TableRow key={doc.id} className="hover:bg-slate-50/40 border-none">
                      <TableCell className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100 shrink-0" aria-hidden="true">
                            {doc.first_name[0]}{doc.last_name[0]}
                          </div>
                          <div>
                            <Link href={`/doctors/${doc.id}/profile`} className="font-bold text-slate-800 hover:text-blue-600 transition text-sm">
                              Dr. {doc.first_name} {doc.last_name}
                            </Link>
                            {doc.experience_years && (
                              <div className="text-[10px] text-slate-400 mt-0.5">{doc.experience_years} yrs experience</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-4 font-mono text-sm text-slate-600">{doc.doctor_code}</TableCell>
                      <TableCell className="py-3.5 px-4">
                        <div className="text-sm text-slate-700">{doc.email || <span className="text-slate-300">No email</span>}</div>
                        <div className="text-xs text-slate-500">{doc.mobile_number || <span className="text-slate-300">No phone</span>}</div>
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <DoctorStatusBadge status={doc.status} />
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-right">
                        <Link href={`/doctors/${doc.id}/profile`}>
                          <Button variant="outline" size="sm" aria-label={`Manage profile for Dr. ${doc.first_name} ${doc.last_name}`}>
                            Manage Profile
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
