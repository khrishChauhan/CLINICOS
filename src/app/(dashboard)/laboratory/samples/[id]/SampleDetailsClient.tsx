'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { collectSampleAction, trackSampleAction } from '@/actions/laboratory/labSampleActions'
import { ArrowLeft, Beaker, MapPin, CheckCircle, Package, Clock, Send, Barcode, TestTube2 } from 'lucide-react'
import dayjs from 'dayjs'

export default function SampleDetailsClient({ sample }: { sample: any }) {
  const [loading, setLoading] = useState(false)
  
  // Collect state
  const [collectionSite, setCollectionSite] = useState('')
  const [collectionMethod, setCollectionMethod] = useState('')
  const [collectRemarks, setCollectRemarks] = useState('')
  
  // Track state
  const [fromLoc, setFromLoc] = useState('')
  const [toLoc, setToLoc] = useState('')
  const [trackStatus, setTrackStatus] = useState<'In Transit' | 'Processing' | 'Completed' | 'Rejected'>('In Transit')

  const handleCollect = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await collectSampleAction(sample.id, collectionSite, collectionMethod, collectRemarks)
    setLoading(false)
  }

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await trackSampleAction(sample.id, fromLoc, toLoc, trackStatus)
    setLoading(false)
    setFromLoc('')
    setToLoc('')
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/laboratory/samples" className="p-2 bg-white text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg transition shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Barcode className="w-6 h-6 text-slate-600" />
            {sample.sample_barcode || 'Pending Generation'}
          </h1>
          <p className="text-sm text-slate-500">
            {sample.lab_order_item?.test_name} • {sample.lab_order_item?.lab_order?.patient?.first_name} {sample.lab_order_item?.lab_order?.patient?.last_name}
          </p>
        </div>
        
        <div className="ml-auto flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
            sample.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
            sample.status === 'Collected' ? 'bg-blue-100 text-blue-700' :
            sample.status === 'Completed' ? 'bg-green-100 text-green-700' :
            sample.status === 'Rejected' ? 'bg-red-100 text-red-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {sample.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {sample.status === 'Pending' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Log Sample Collection</h2>
              <form onSubmit={handleCollect} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Collection Site *</label>
                    <input type="text" required value={collectionSite} onChange={e=>setCollectionSite(e.target.value)} placeholder="e.g. Room 101, Left Arm" className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Method *</label>
                    <input type="text" required value={collectionMethod} onChange={e=>setCollectionMethod(e.target.value)} placeholder="e.g. Venipuncture" className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Remarks</label>
                  <input type="text" value={collectRemarks} onChange={e=>setCollectRemarks(e.target.value)} placeholder="Optional observations..." className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Record Collection
                  </button>
                </div>
              </form>
            </div>
          )}

          {sample.status !== 'Pending' && sample.status !== 'Completed' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Add Tracking Event</h2>
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">From Location</label>
                    <input type="text" value={fromLoc} onChange={e=>setFromLoc(e.target.value)} placeholder="e.g. Ward A" className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">To Location</label>
                    <input type="text" value={toLoc} onChange={e=>setToLoc(e.target.value)} placeholder="e.g. Main Lab" className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">New Status *</label>
                    <select required value={trackStatus} onChange={e=>setTrackStatus(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                      <option value="In Transit">In Transit</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={loading} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 inline-flex items-center gap-2">
                    <Send className="w-4 h-4" /> Log Movement
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Chain of Custody</h2>
            </div>
            <div className="p-6">
              {sample.tracking?.length === 0 ? (
                <p className="text-center text-slate-500 text-sm py-4">No tracking events recorded yet.</p>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {sample.tracking?.sort((a:any, b:any) => new Date(b.tracking_time).getTime() - new Date(a.tracking_time).getTime()).map((track: any, i: number) => (
                    <div key={track.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        {track.status === 'Collected' ? <CheckCircle className="w-4 h-4 text-blue-600" /> : <MapPin className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800 text-sm">{track.status}</span>
                          <span className="text-xs font-semibold text-slate-500">{dayjs(track.tracking_time).format('MMM D, h:mm A')}</span>
                        </div>
                        {(track.from_location || track.to_location) && (
                          <div className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                            {track.from_location && <span>{track.from_location}</span>}
                            {track.from_location && track.to_location && <span>→</span>}
                            {track.to_location && <span>{track.to_location}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Sample Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Beaker className="w-4 h-4 text-slate-400" />
                <span><strong className="text-slate-800">Type:</strong> {sample.sample_type || sample.lab_order_item?.sample_type || 'Unspecified'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Package className="w-4 h-4 text-slate-400" />
                <span><strong className="text-slate-800">Container:</strong> {sample.container_type || 'Standard'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Collection Details</h2>
            {sample.collections && sample.collections.length > 0 ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{sample.collections[0].collection_site}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <TestTube2 className="w-4 h-4 text-slate-400" />
                  <span>{sample.collections[0].collection_method}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{dayjs(sample.collections[0].collection_time).format('MMM D, h:mm A')}</span>
                </div>
                {sample.collections[0].remarks && (
                  <p className="text-slate-600 text-xs italic mt-2">"{sample.collections[0].remarks}"</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Not collected yet.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 mb-3">Barcode Label</h2>
             <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50">
                <Barcode className="w-16 h-16 mx-auto text-slate-800 mb-2" />
                <p className="font-mono font-bold text-slate-900">{sample.sample_barcode || 'PENDING'}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{sample.lab_order_item?.test_name}</p>
             </div>
             <button className="w-full mt-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-100">
               Print Barcode
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
