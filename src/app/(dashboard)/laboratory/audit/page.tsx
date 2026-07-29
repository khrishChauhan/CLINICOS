import React from 'react'
import { getLabAuditAction } from '@/actions/laboratory/labPhase5Actions'
import LabAuditClient from './LabAuditClient'

export default async function LabAuditPage() {
  const { data: auditLogs } = await getLabAuditAction()
  return <LabAuditClient auditLogs={auditLogs ?? []} />
}
