'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Search, UserPlus } from 'lucide-react'
import { getDoctorsAction } from '@/actions/doctors/doctorActions'
import type { DoctorRow } from '@/types/doctors'
import Link from 'next/link'

export default function DoctorsListPage() {
  const [doctors, setDoctors] = useState<DoctorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchDoctors() {
      const res = await getDoctorsAction()
      if (res.success) {
        setDoctors(res.data)
      }
      setLoading(false)
    }
    fetchDoctors()
  }, [])

  const filteredDoctors = doctors.filter(doc => 
    `${doc.first_name} ${doc.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    doc.doctor_code.toLowerCase().includes(search.toLowerCase()) ||
    (doc.email && doc.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctors Registry</h1>
          <p className="text-sm text-slate-500">Manage doctor identities and professional profiles</p>
        </div>
        <Link href="/doctors/new/profile">
          <Button className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add Doctor
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center bg-slate-50/50 border-b border-slate-100">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input 
              placeholder="Search doctors..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading doctors...</div>
          ) : filteredDoctors.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No doctors found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-mono text-sm">{doc.doctor_code}</TableCell>
                    <TableCell className="font-semibold text-slate-800">Dr. {doc.first_name} {doc.last_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{doc.email || 'No email'}</div>
                      <div className="text-xs text-slate-500">{doc.mobile_number || 'No phone'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={doc.status === 'Active' ? 'success' : 'default'}>{doc.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/doctors/${doc.id}/profile`}>
                        <Button variant="outline" size="sm">Manage Profile</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}