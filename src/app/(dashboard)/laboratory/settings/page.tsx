import React from 'react'
import {
  getReferenceRangesAction,
  getSpecimenTypesAction,
  getLabConsumablesAction
} from '@/actions/laboratory/labPhase5Actions'
import LabSettingsClient from './LabSettingsClient'

export default async function LabSettingsPage() {
  const [{ data: ranges }, { data: specimenTypes }, { data: consumables }] = await Promise.all([
    getReferenceRangesAction(),
    getSpecimenTypesAction(),
    getLabConsumablesAction()
  ])
  return (
    <LabSettingsClient
      referenceRanges={ranges ?? []}
      specimenTypes={specimenTypes ?? []}
      consumables={consumables ?? []}
    />
  )
}
