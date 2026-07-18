'use client'

import React, { useState, useTransition, useCallback } from 'react'
import { Plus, Search, Filter, Eye, Users, AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table'
import PatientTableSkeleton from './PatientTableSkeleton'
import { listPatients } from '@/actions/patients/listPatients'
import type { PatientListItem, PatientFilters, PaginatedResult, PatientListResult } from '@/types/patients'

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function BloodGroupBadge({ group }: { group: string | null }) {
  if (!group) return <span className="text-slate-300 text-xs">—</span>
  return (
    <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-bold font-mono">
      {group}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'Active'
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
      isActive
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-slate-100 text-slate-500 border-slate-200'
    }`}>
      {status}
    </span>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="font-bold text-slate-700 text-base">No patients found</h3>
      <p className="text-slate-400 text-sm mt-1 max-w-xs">
        Try adjusting your search or filters. No records match the current criteria.
      </p>
      <button
        onClick={onReset}
        className="mt-4 flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition"
      >
        <RefreshCw className="w-4 h-4" /> Reset Filters
      </button>
    </div>
  )
}

function ForbiddenState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="font-bold text-slate-700 text-base">Access Denied</h3>
      <p className="text-slate-400 text-sm mt-1 max-w-xs">
        You don't have permission to view patient records. Contact your clinic administrator.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Client Component
// ─────────────────────────────────────────────────────────────────────────────

interface PatientsClientProps {
  initialData: PatientListResult
  initialFilters: PatientFilters
}

export default function PatientsClient({ initialData, initialFilters }: PatientsClientProps) {
  const [isPending, startTransition] = useTransition()

  const [search, setSearch]       = useState(initialFilters.search ?? '')
  const [gender, setGender]       = useState(initialFilters.gender ?? '')
  const [bloodGroup, setBloodGroup] = useState(initialFilters.bloodGroup ?? '')
  const [status, setStatus]       = useState(initialFilters.status ?? 'Active')
  const [page, setPage]           = useState(initialFilters.page ?? 1)
  const [result, setResult]       = useState<PatientListResult>(initialData)

  // Debounce ref for search
  const searchTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetch = useCallback((filters: PatientFilters) => {
    startTransition(async () => {
      const res = await listPatients(filters)
      setResult(res)
    })
  }, [])

  const applyFilters = useCallback((overrides: Partial<PatientFilters> & { page?: number }) => {
    const newFilters: PatientFilters = {
      search: overrides.search !== undefined ? overrides.search : search,
      gender: overrides.gender !== undefined ? overrides.gender : gender,
      bloodGroup: overrides.bloodGroup !== undefined ? overrides.bloodGroup : bloodGroup,
      status: overrides.status !== undefined ? overrides.status : status,
      page: overrides.page ?? 1,
      pageSize: 15,
    }
    if (overrides.gender !== undefined) setGender(overrides.gender)
    if (overrides.bloodGroup !== undefined) setBloodGroup(overrides.bloodGroup)
    if (overrides.status !== undefined) setStatus(overrides.status)
    if (overrides.page !== undefined) setPage(overrides.page)
    fetch(newFilters)
  }, [search, gender, bloodGroup, status, fetch])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    setPage(1)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      fetch({ search: val, gender, bloodGroup, status, page: 1, pageSize: 15 })
    }, 350)
  }

  const handleReset = () => {
    setSearch('')
    setGender('')
    setBloodGroup('')
    setStatus('Active')
    setPage(1)
    fetch({ status: 'Active', page: 1, pageSize: 15 })
  }

  // Render states — narrow the discriminated union explicitly
  const isForbidden = !result.ok && (result as { ok: false; error: string }).error === 'FORBIDDEN'
  if (isForbidden) {
    return (
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        <Card className="overflow-hidden"><ForbiddenState /></Card>
      </main>
    )
  }

  const data: PaginatedResult<PatientListItem> | null = result.ok ? result.result : null
  const patients = data?.data ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1

  return (
    <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 z-10 relative">
      <div className="space-y-6">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Durga Clinic Patient Registry</h1>
              <p className="text-slate-500 text-xs mt-0.5">
                {isPending
                  ? 'Searching…'
                  : `Manage details, vitals, timelines and EHR records — ${totalCount} patient${totalCount !== 1 ? 's' : ''} total`}
              </p>
            </div>
            <Button className="bg-blue-600/90 hover:bg-blue-600 text-white">
              <Plus className="w-4 h-4" /> Add Patient Record
            </Button>
          </div>

          {/* Filters Bar */}
          <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-96">
              <Input
                icon={<Search className="w-4.5 h-4.5" />}
                placeholder="Search by UHID, Name, Phone…"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto flex-wrap">
              {/* Gender Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">Gender:</span>
                <select
                  value={gender}
                  onChange={e => applyFilters({ gender: e.target.value })}
                  className="bg-transparent font-bold text-slate-700 focus:outline-none"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* Blood Group Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
                <span className="text-slate-500">Blood Group:</span>
                <select
                  value={bloodGroup}
                  onChange={e => applyFilters({ bloodGroup: e.target.value })}
                  className="bg-transparent font-bold text-slate-700 focus:outline-none"
                >
                  <option value="">All Groups</option>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
                <span className="text-slate-500">Status:</span>
                <select
                  value={status}
                  onChange={e => applyFilters({ status: e.target.value })}
                  className="bg-transparent font-bold text-slate-700 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="">All</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-slate-400 md:ml-auto whitespace-nowrap">
              {isPending ? '…' : `Found ${totalCount} record${totalCount !== 1 ? 's' : ''}`}
            </div>
          </Card>

          {/* Table */}
          {isPending ? (
            <PatientTableSkeleton />
          ) : (
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100 text-slate-400 bg-slate-50/50 font-bold text-xs uppercase tracking-wider hover:bg-slate-50/50">
                    <TableHead className="py-3 px-4 bg-transparent">Patient Name & ID</TableHead>
                    <TableHead className="py-3 px-4 bg-transparent">Demographics</TableHead>
                    <TableHead className="py-3 px-4 bg-transparent">Blood Group</TableHead>
                    <TableHead className="py-3 px-4 bg-transparent">Phone Number</TableHead>
                    <TableHead className="py-3 px-4 bg-transparent">Status</TableHead>
                    <TableHead className="py-3 px-4 text-center bg-transparent">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <EmptyState onReset={handleReset} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    patients.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-white/40 border-none">
                        <TableCell className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100 shrink-0">
                              {patient.initials}
                            </div>
                            <div>
                              <button className="font-bold text-slate-800 hover:text-blue-600 text-left transition text-sm">
                                {patient.fullName}
                              </button>
                              <div className="text-[10px] font-mono text-slate-400 mt-0.5">{patient.uhid}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 px-4 text-slate-600 text-sm">
                          {patient.age != null ? `${patient.age} ${patient.ageUnit}` : '—'}
                          {patient.gender ? ` • ${patient.gender}` : ''}
                        </TableCell>
                        <TableCell className="py-3.5 px-4">
                          <BloodGroupBadge group={patient.bloodGroup} />
                        </TableCell>
                        <TableCell className="py-3.5 px-4 font-semibold text-slate-600 text-sm">
                          {patient.mobileNumber}
                        </TableCell>
                        <TableCell className="py-3.5 px-4">
                          <StatusBadge status={patient.status} />
                        </TableCell>
                        <TableCell className="py-3.5 px-4 text-center">
                          <button className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded transition hover:shadow-sm">
                            <Eye className="w-3.5 h-3.5" /> View EHR
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {patients.length > 0 && (
                <div className="flex justify-between items-center p-4 border-t border-slate-100 text-xs">
                  <span className="text-slate-400">
                    Page {page} of {totalPages} ({totalCount} total records)
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      disabled={page <= 1 || isPending}
                      onClick={() => applyFilters({ page: page - 1 })}
                      className="px-3 py-1.5 border border-slate-200 rounded font-semibold transition
                        disabled:text-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed
                        enabled:text-slate-600 enabled:bg-white enabled:hover:bg-slate-50"
                    >
                      Prev
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const p = i + 1
                      return (
                        <button
                          key={p}
                          onClick={() => applyFilters({ page: p })}
                          disabled={isPending}
                          className={`w-8 h-8 rounded border font-semibold text-center transition text-xs ${
                            p === page
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    })}
                    <button
                      disabled={page >= totalPages || isPending}
                      onClick={() => applyFilters({ page: page + 1 })}
                      className="px-3 py-1.5 border border-slate-200 rounded font-semibold transition
                        disabled:text-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed
                        enabled:text-slate-600 enabled:bg-white enabled:hover:bg-slate-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
