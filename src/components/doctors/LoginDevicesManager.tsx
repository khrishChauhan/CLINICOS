'use client'

import React, { useState, useEffect } from 'react'
import { getDoctorDevicesAction, trackDoctorLoginAction, revokeDoctorDeviceAction } from '@/actions/doctors/deviceActions'
import { Button } from '@/components/ui/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'

export default function LoginDevicesManager({ doctorId }: { doctorId: string }) {
  const [devices, setDevices] = useState<any[]>([])
  
  const loadDevices = async () => {
    // For demo/testing, we automatically track the current device when the tab is opened
    await trackDoctorLoginAction(doctorId)
    const res = await getDoctorDevicesAction(doctorId)
    if (res.success) setDevices(res.data)
  }

  useEffect(() => {
    loadDevices()
  }, [doctorId])

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke access for this device?')) return
    const res = await revokeDoctorDeviceAction(id)
    if (res.success) {
      setDevices(devices.map(d => d.id === id ? { ...d, trusted_device: false } : d))
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-blue-900">Active Sessions</h3>
          <p className="text-sm text-blue-700">Manage devices that have access to this doctor's account.</p>
        </div>
        <Button onClick={loadDevices} variant="outline" size="sm" className="bg-white">Refresh Devices</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device / OS</TableHead>
            <TableHead>Browser</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map(d => (
            <TableRow key={d.id} className={!d.trusted_device ? 'opacity-50' : ''}>
              <TableCell className="font-semibold">{d.device_name}</TableCell>
              <TableCell>{d.browser}</TableCell>
              <TableCell className="text-slate-500 font-mono text-xs">{d.ip_address}</TableCell>
              <TableCell>{new Date(d.last_login).toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={d.trusted_device ? 'success' : 'danger'}>
                  {d.trusted_device ? 'Trusted' : 'Revoked'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {d.trusted_device && (
                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleRevoke(d.id)}>Revoke</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {devices.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-slate-500 py-4">No login devices recorded.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
