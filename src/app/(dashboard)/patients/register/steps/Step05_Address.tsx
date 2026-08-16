'use client'

import React, { useState, useEffect } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { StepHeader } from '../FormComponents'
import type { PatientRegistrationInput } from '@/services/patients/validation'
import { getMasterDataAction, getStatesAction, getDistrictsAction, getCitiesAction } from '@/actions/master/masterActions'
import type { MasterCountry, MasterState, MasterDistrict, MasterCity } from '@/types/master'

function AddressCard({ index, onRemove, countries }: { index: number; onRemove: () => void; countries: MasterCountry[] }) {
  const { register, control, formState: { errors } } = useFormContext<PatientRegistrationInput>()
  const base = `addresses.${index}` as const
  
  const [states, setStates] = useState<MasterState[]>([])
  const [districts, setDistricts] = useState<MasterDistrict[]>([])
  const [cities, setCities] = useState<MasterCity[]>([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  const selectedCountry = useWatch({ control, name: `${base}.country` })
  const selectedState = useWatch({ control, name: `${base}.state` })
  const selectedDistrict = useWatch({ control, name: `${base}.district` })

  useEffect(() => {
    async function loadStates() {
      if (!selectedCountry) return setStates([])
      const countryObj = countries.find(c => c.country_name === selectedCountry)
      if (!countryObj) return setStates([])
      setLoadingStates(true)
      const res = await getStatesAction<MasterState>(countryObj.id)
      if (res.success && res.data) setStates(res.data)
      setLoadingStates(false)
    }
    loadStates()
  }, [selectedCountry, countries])

  useEffect(() => {
    async function loadDistricts() {
      if (!selectedState) return setDistricts([])
      const stateObj = states.find(s => s.state_name === selectedState)
      if (!stateObj) return setDistricts([])
      setLoadingDistricts(true)
      const res = await getDistrictsAction<MasterDistrict>(stateObj.id)
      if (res.success && res.data) setDistricts(res.data)
      setLoadingDistricts(false)
    }
    loadDistricts()
  }, [selectedState, states])

  useEffect(() => {
    async function loadCities() {
      if (!selectedDistrict) return setCities([])
      const districtObj = districts.find(d => d.district_name === selectedDistrict)
      if (!districtObj) return setCities([])
      setLoadingCities(true)
      const res = await getCitiesAction<MasterCity>(districtObj.id)
      if (res.success && res.data) setCities(res.data)
      setLoadingCities(false)
    }
    loadCities()
  }, [selectedDistrict, districts])

  const fieldError = (field: string) => {
    const errs = errors.addresses as Record<string, Record<string, { message: string }>> | undefined
    return errs?.[index]?.[field]?.message
  }

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4 relative">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-slate-600">Address {index + 1}</span>
        {index > 0 && (
          <button type="button" onClick={onRemove}
            className="text-red-500 hover:text-red-700 transition">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600">Address Type</label>
          <select {...register(`${base}.address_type`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            {['Home', 'Office', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Country</label>
          <select {...register(`${base}.country`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option value="">Select Country</option>
            {countries.map(c => <option key={c.id} value={c.country_name}>{c.country_name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600">Address Line 1 <span className="text-red-500">*</span></label>
        <input {...register(`${base}.address_line_1`)}
          placeholder="House / Flat / Plot number, Street / Colony"
          className={`mt-1 w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30
            ${fieldError('address_line_1') ? 'border-red-400' : 'border-slate-200'}`} />
        {fieldError('address_line_1') && <p className="text-[10px] text-red-500 mt-0.5">{fieldError('address_line_1')}</p>}
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Address Line 2</label>
        <input {...register(`${base}.address_line_2`)}
          placeholder="Landmark, area, locality (optional)"
          className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">State {loadingStates && <Loader2 className="w-3 h-3 animate-spin text-slate-400"/>}</label>
          <select {...register(`${base}.state`)} disabled={!selectedCountry || states.length === 0}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50">
            <option value="">Select State</option>
            {states.map(s => <option key={s.id} value={s.state_name}>{s.state_name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">District {loadingDistricts && <Loader2 className="w-3 h-3 animate-spin text-slate-400"/>}</label>
          <select {...register(`${base}.district`)} disabled={!selectedState || districts.length === 0}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50">
            <option value="">Select District</option>
            {districts.map(d => <option key={d.id} value={d.district_name}>{d.district_name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">City {loadingCities && <Loader2 className="w-3 h-3 animate-spin text-slate-400"/>}</label>
          <select {...register(`${base}.city`)} disabled={!selectedDistrict || cities.length === 0}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50">
            <option value="">Select City</option>
            {cities.map(c => <option key={c.id} value={c.city_name}>{c.city_name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Pincode</label>
          <input {...register(`${base}.pincode`)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
        </div>
      </div>
    </div>
  )
}

export default function Step05_Address() {
  const { control } = useFormContext<PatientRegistrationInput>()
  const { fields, append, remove } = useFieldArray({ control, name: 'addresses' })
  
  const [countries, setCountries] = useState<MasterCountry[]>([])
  useEffect(() => {
    async function load() {
      const res = await getMasterDataAction<MasterCountry>('countries')
      if (res.success && res.data) setCountries(res.data)
    }
    load()
  }, [])

  return (
    <div>
      <StepHeader step={4} title="Address Details" description="Enter the patient's residential or contact address." />
      <div className="space-y-4">
        {fields.map((field, index) => (
          <AddressCard key={field.id} index={index} onRemove={() => remove(index)} countries={countries} />
        ))}
        <button type="button"
          onClick={() => append({ address_type: 'Home', address_line_1: '', country: 'India', is_primary: fields.length === 0 })}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 border-dashed px-4 py-2.5 rounded-xl w-full justify-center transition hover:bg-blue-100">
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>
    </div>
  )
}
