'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getActiveClinicalAlertsAction } from '@/actions/emr/clinicalAlertActions'
import type { ClinicalAlertRow } from '@/types/emr'
import { AlertTriangle } from 'lucide-react'

export default function ClinicalAlertsBanner({ patientId }: { patientId: string }) {
  const [alerts, setAlerts] = useState<ClinicalAlertRow[]>([])

  const loadAlerts = useCallback(async () => {
    const res = await getActiveClinicalAlertsAction(patientId)
    if (res.success && res.data) setAlerts(res.data)
  }, [patientId])

  useEffect(() => { loadAlerts() }, [loadAlerts])

  if (alerts.length === 0) return null

  const highSeverityCount = alerts.filter(a => a.severity === 'High').length
  const topAlert = alerts.sort((a, b) => a.severity === 'High' ? -1 : 1)[0]

  return (
    <div className={`mb-4 flex items-start gap-3 p-3 rounded-lg border ${
      highSeverityCount > 0 ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'
    }`}>
      <AlertTriangle className={`w-5 h-5 shrink-0 ${highSeverityCount > 0 ? 'text-red-600' : 'text-amber-600'}`} />
      <div>
        <div className="font-bold text-sm">
          {alerts.length} Active Clinical Alert{alerts.length > 1 ? 's' : ''} ({highSeverityCount} High Severity)
        </div>
        <div className="text-xs mt-1">
          <span className="font-semibold">{topAlert.alert_type}:</span> {topAlert.alert_message}
          {alerts.length > 1 && <span className="ml-1 opacity-80">(+ {alerts.length - 1} more)</span>}
        </div>
      </div>
    </div>
  )
}
