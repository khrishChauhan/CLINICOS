'use client'

import React, { useState } from 'react'
import DoctorProfileForm from '@/components/doctors/DoctorProfileForm'
import DoctorQualificationsManager from '@/components/doctors/DoctorQualificationsManager'
import DoctorRegistrationsManager from '@/components/doctors/DoctorRegistrationsManager'
import BlockedSlotManager from '@/components/doctors/BlockedSlotManager'
import LeaveManagement from '@/components/doctors/LeaveManagement'
import ConsultationFeeManager from '@/components/doctors/ConsultationFeeManager'
import SignatureManager from '@/components/doctors/SignatureManager'
import DocumentManager from '@/components/doctors/DocumentManager'

export default function DoctorProfilePage({ params }: { params: { id: string } }) {
  const doctorId = params.id
  const isNew = doctorId === 'new'
  const [activeTab, setActiveTab] = useState<'profile' | 'qualifications' | 'registrations' | 'blocks' | 'leaves' | 'fees' | 'signature' | 'documents'>('profile')

  return (
    <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{isNew ? 'Register New Doctor' : 'Doctor Profile'}</h1>
        <p className="text-sm text-slate-500">Manage demographic and professional details</p>
      </div>

      <div className="flex gap-4 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-hide">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Basic Details
        </button>
        {!isNew && (
          <>
            <button 
              onClick={() => setActiveTab('qualifications')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'qualifications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Qualifications
            </button>
            <button 
              onClick={() => setActiveTab('registrations')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'registrations' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Medical Licenses
            </button>
            <button 
              onClick={() => setActiveTab('fees')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'fees' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Consultation Fees
            </button>
            <button 
              onClick={() => setActiveTab('blocks')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'blocks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Blocked Slots
            </button>
            <button 
              onClick={() => setActiveTab('leaves')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'leaves' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Leaves
            </button>
            <button 
              onClick={() => setActiveTab('signature')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'signature' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Digital Signature
            </button>
            <button 
              onClick={() => setActiveTab('documents')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Documents
            </button>
          </>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {activeTab === 'profile' && <DoctorProfileForm doctorId={isNew ? null : doctorId} />}
        {activeTab === 'qualifications' && !isNew && <DoctorQualificationsManager doctorId={doctorId} />}
        {activeTab === 'registrations' && !isNew && <DoctorRegistrationsManager doctorId={doctorId} />}
        {activeTab === 'fees' && !isNew && <ConsultationFeeManager doctorId={doctorId} />}
        {activeTab === 'blocks' && !isNew && <BlockedSlotManager doctorId={doctorId} />}
        {activeTab === 'leaves' && !isNew && <LeaveManagement doctorId={doctorId} />}
        {activeTab === 'signature' && !isNew && <SignatureManager doctorId={doctorId} />}
        {activeTab === 'documents' && !isNew && <DocumentManager doctorId={doctorId} />}
      </div>
    </div>
  )
}
