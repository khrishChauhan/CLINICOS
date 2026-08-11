'use client'

import React, { useState, use } from 'react'
import DoctorProfileForm from '@/components/doctors/DoctorProfileForm'
import DoctorProfileOverview from '@/components/doctors/DoctorProfileOverview'
import DoctorQualificationsManager from '@/components/doctors/DoctorQualificationsManager'
import DoctorRegistrationsManager from '@/components/doctors/DoctorRegistrationsManager'
import BlockedSlotManager from '@/components/doctors/BlockedSlotManager'
import LeaveManagement from '@/components/doctors/LeaveManagement'
import ConsultationFeeManager from '@/components/doctors/ConsultationFeeManager'
import SignatureManager from '@/components/doctors/SignatureManager'
import DocumentManager from '@/components/doctors/DocumentManager'
import PerformanceDashboard from '@/components/doctors/PerformanceDashboard'
import NotesManager from '@/components/doctors/NotesManager'
import AwardsManager from '@/components/doctors/AwardsManager'
import LanguagesManager from '@/components/doctors/LanguagesManager'
import CommunicationPreferencesManager from '@/components/doctors/CommunicationPreferencesManager'
import LoginDevicesManager from '@/components/doctors/LoginDevicesManager'
import AuditTimeline from '@/components/doctors/AuditTimeline'
import DoctorScheduleManager from '@/components/doctors/DoctorScheduleManager'

export default function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const doctorId = resolvedParams.id
  const isNew = doctorId === 'new'
  const [activeTab, setActiveTab] = useState<'profile' | 'qualifications' | 'registrations' | 'schedule' | 'blocks' | 'leaves' | 'fees' | 'signature' | 'documents' | 'performance' | 'notes' | 'awards' | 'languages' | 'communication' | 'devices' | 'audit'>('profile')

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
              onClick={() => setActiveTab('schedule')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'schedule' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Schedule
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
              onClick={() => setActiveTab('performance')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'performance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Performance
            </button>
            <button 
              onClick={() => setActiveTab('languages')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'languages' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Languages
            </button>
            <button 
              onClick={() => setActiveTab('awards')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'awards' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Awards
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'notes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Notes
            </button>
            <button 
              onClick={() => setActiveTab('communication')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'communication' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Communication
            </button>
            <button 
              onClick={() => setActiveTab('signature')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'signature' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Signature
            </button>
            <button 
              onClick={() => setActiveTab('documents')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Documents
            </button>
            <button 
              onClick={() => setActiveTab('devices')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'devices' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Login Devices
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 whitespace-nowrap ${activeTab === 'audit' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Audit Log
            </button>
          </>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {activeTab === 'profile' && (
          isNew ? <DoctorProfileForm doctorId={null} /> : <DoctorProfileOverview doctorId={doctorId} />
        )}
        {activeTab === 'qualifications' && !isNew && <DoctorQualificationsManager doctorId={doctorId} />}
        {activeTab === 'registrations' && !isNew && <DoctorRegistrationsManager doctorId={doctorId} />}
        {activeTab === 'fees' && !isNew && <ConsultationFeeManager doctorId={doctorId} />}
        {activeTab === 'schedule' && !isNew && <DoctorScheduleManager doctorId={doctorId} />}
        {activeTab === 'blocks' && !isNew && <BlockedSlotManager doctorId={doctorId} />}
        {activeTab === 'leaves' && !isNew && <LeaveManagement doctorId={doctorId} />}
        {activeTab === 'performance' && !isNew && <PerformanceDashboard doctorId={doctorId} />}
        {activeTab === 'languages' && !isNew && <LanguagesManager doctorId={doctorId} />}
        {activeTab === 'awards' && !isNew && <AwardsManager doctorId={doctorId} />}
        {activeTab === 'notes' && !isNew && <NotesManager doctorId={doctorId} />}
        {activeTab === 'communication' && !isNew && <CommunicationPreferencesManager doctorId={doctorId} />}
        {activeTab === 'signature' && !isNew && <SignatureManager doctorId={doctorId} />}
        {activeTab === 'documents' && !isNew && <DocumentManager doctorId={doctorId} />}
        {activeTab === 'devices' && !isNew && <LoginDevicesManager doctorId={doctorId} />}
        {activeTab === 'audit' && !isNew && <AuditTimeline doctorId={doctorId} />}
      </div>
    </div>
  )
}
