import React from 'react'
import { getLabInstrumentsAction } from '@/actions/laboratory/labOperationsActions'
import InstrumentsClient from './InstrumentsClient'

export default async function InstrumentsPage() {
  const { data: instruments } = await getLabInstrumentsAction()
  return <InstrumentsClient instruments={instruments ?? []} />
}
