import React from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table'
import { Card } from '@/components/ui/Card'

function SkeletonCell({ width = 'w-24' }: { width?: string }) {
  return (
    <div className={`h-3.5 ${width} bg-slate-200 rounded animate-pulse`} />
  )
}

export default function PatientTableSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
            <TableHead className="py-3 px-4 bg-transparent"><SkeletonCell width="w-32" /></TableHead>
            <TableHead className="py-3 px-4 bg-transparent"><SkeletonCell width="w-20" /></TableHead>
            <TableHead className="py-3 px-4 bg-transparent"><SkeletonCell width="w-16" /></TableHead>
            <TableHead className="py-3 px-4 bg-transparent"><SkeletonCell width="w-24" /></TableHead>
            <TableHead className="py-3 px-4 bg-transparent"><SkeletonCell width="w-20" /></TableHead>
            <TableHead className="py-3 px-4 bg-transparent"><SkeletonCell width="w-16" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i} className="border-none">
              <TableCell className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 bg-slate-200 rounded animate-pulse" />
                    <div className="h-2.5 w-20 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3.5 px-4"><SkeletonCell width="w-20" /></TableCell>
              <TableCell className="py-3.5 px-4"><SkeletonCell width="w-10" /></TableCell>
              <TableCell className="py-3.5 px-4"><SkeletonCell width="w-28" /></TableCell>
              <TableCell className="py-3.5 px-4">
                <div className="flex gap-2">
                  <div className="h-5 w-12 bg-slate-200 rounded animate-pulse" />
                  <div className="h-5 w-14 bg-slate-200 rounded animate-pulse" />
                </div>
              </TableCell>
              <TableCell className="py-3.5 px-4 text-center">
                <div className="h-6 w-16 bg-slate-200 rounded animate-pulse mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center p-4 border-t border-slate-100">
        <div className="h-3 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="flex gap-1.5">
          <div className="h-8 w-14 bg-slate-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
          <div className="h-8 w-14 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    </Card>
  )
}
