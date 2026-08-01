import React from 'react'
import { getRadiologyOrdersAction } from '@/actions/radiology/radiologyOrderActions'
import RadiologyClient from './RadiologyClient'

export default async function RadiologyDashboardPage() {
  const { data: orders } = await getRadiologyOrdersAction()
  
  return <RadiologyClient orders={orders || []} />
}
