import { fetchFullConsultationAction } from '@/actions/consultations/consultationActions'
import ConsultationWorkspaceClient from './ConsultationWorkspaceClient'
import { redirect } from 'next/navigation'

export default async function ConsultationPage({ params, searchParams }: { params: { id: string }, searchParams: { appointmentId?: string } }) {
  const patientId = params.id
  const appointmentId = searchParams.appointmentId || null

  const res = await fetchFullConsultationAction(patientId, appointmentId)
  
  if (!res.ok || !res.data) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold">Error Loading Consultation</h2>
        <p>{res.error || 'Unknown error occurred'}</p>
      </div>
    )
  }

  return (
    <ConsultationWorkspaceClient 
      patientId={patientId}
      initialData={res.data}
    />
  )
}
