import React from 'react'
import { fetchSurgeriesAction, fetchOTRoomsAction } from '@/actions/ot/otActions'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import dayjs from 'dayjs'
import { OTSurgeryClient } from './OTSurgeryClient'

import { ScheduleSurgeryForm } from './ScheduleSurgeryForm'
import { createClient } from '@/lib/supabase/server'

export default async function OTDashboardPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const params = await searchParams
  const selectedDate = params.date || dayjs().format('YYYY-MM-DD')
  
  const [surgRes, roomsRes] = await Promise.all([
    fetchSurgeriesAction(selectedDate),
    fetchOTRoomsAction()
  ])

  if (!surgRes.ok || !roomsRes.ok) {
    return <div className="p-8 text-red-500">Error fetching OT data: {surgRes.error || roomsRes.error}</div>
  }

  const surgeries = surgRes.data || []
  const rooms = roomsRes.data || []
  
  // Fetch patients and doctors for the scheduling form
  const supabase = await createClient()
  const { data: patients } = await supabase.from('patients').select('id, first_name, last_name, uhid').order('first_name')
  const { data: doctors } = await supabase.from('users')
    .select('id, username')
    .in('role_id', (await supabase.from('roles').select('id').in('role_name', ['Doctor', 'Super Admin'])).data?.map(r => r.id) || [])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Operation Theatre</h1>
          <p className="text-sm text-slate-500 mt-1">Manage daily surgeries, scheduling, and clinical transitions</p>
        </div>
        
        <div className="flex items-center gap-4">
          <form className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600">Date:</label>
            <input 
              type="date" 
              name="date"
              defaultValue={selectedDate}
              className="p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
            />
            <button type="submit" className="bg-slate-100 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200">
              Filter
            </button>
          </form>
          
          <ScheduleSurgeryForm rooms={rooms} patients={patients || []} doctors={doctors || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Rooms Overview */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">OT Rooms</h2>
          {rooms.length === 0 ? (
            <Card className="p-6 text-center text-slate-500">No rooms configured.</Card>
          ) : (
            rooms.map((room: any) => (
              <Card key={room.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800">{room.name}</h3>
                  <p className="text-xs text-slate-500">{room.type}</p>
                </div>
                <Badge variant={room.status === 'Active' ? 'success' : 'warning'}>{room.status}</Badge>
              </Card>
            ))
          )}
        </div>

        {/* Today's Surgeries */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Surgeries ({selectedDate})</h2>
          {surgeries.length === 0 ? (
            <Card className="p-12 text-center text-slate-500">
              No surgeries scheduled for this date.
            </Card>
          ) : (
            surgeries.map((surgery: any) => (
              <OTSurgeryClient key={surgery.id} surgery={surgery} />
            ))
          )}
        </div>
        
      </div>
    </div>
  )
}
