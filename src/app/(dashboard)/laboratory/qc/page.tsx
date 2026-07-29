import React from 'react'
import { getQcHistoryAction, getLabInstrumentsAction } from '@/actions/laboratory/labOperationsActions'
import QualityControlClient from './QualityControlClient'

export default async function QualityControlPage() {
  const [{ data: qcHistory }, { data: instruments }] = await Promise.all([
    getQcHistoryAction(),
    getLabInstrumentsAction()
  ])
  return <QualityControlClient qcHistory={qcHistory ?? []} instruments={instruments ?? []} />
}
