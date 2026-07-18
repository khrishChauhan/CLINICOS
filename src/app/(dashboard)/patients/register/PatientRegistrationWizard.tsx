'use client'

import React, { useState } from 'react'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronRight, ChevronLeft, Loader2, AlertCircle } from 'lucide-react'
import { useRouter as useNextRouter } from 'next/navigation'

import { patientRegistrationSchema, stepSchemas, type StepNumber, type PatientRegistrationInput } from '@/services/patients/validation'
import { registerPatient } from '@/actions/patients/registerPatient'

import Step01_RegistrationType from './steps/Step01_RegistrationType'
import Step02_BasicInfo from './steps/Step02_BasicInfo'
import Step03_ContactDetails from './steps/Step03_ContactDetails'
import Step04_Demographics from './steps/Step04_Demographics'
import Step05_Address from './steps/Step05_Address'
import Step06_EmergencyContact from './steps/Step06_EmergencyContact'
import Step07_Insurance from './steps/Step07_Insurance'
import Step08_MedicalHistory from './steps/Step08_MedicalHistory'
import Step09_AdditionalInfo from './steps/Step09_AdditionalInfo'
import Step10_Review from './steps/Step10_Review'

const STEPS = [
  { id: 1, name: 'Type' },
  { id: 2, name: 'Basic Info' },
  { id: 3, name: 'Contact' },
  { id: 4, name: 'Demographics' },
  { id: 5, name: 'Address' },
  { id: 6, name: 'Emergency' },
  { id: 7, name: 'Insurance' },
  { id: 8, name: 'History' },
  { id: 9, name: 'Remarks' },
  { id: 10, name: 'Review' },
]

export default function PatientRegistrationWizard() {
  const router = useNextRouter()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // 11th step is Success page, not in the main flow
  const [successData, setSuccessData] = useState<{ patientId: string; uhid: string } | null>(null)

  const methods = useForm<PatientRegistrationInput>({
    resolver: zodResolver(patientRegistrationSchema) as any,
    mode: 'onTouched',
    defaultValues: {
      patient_type: 'OPD',
      addresses: [],
      emergency_contacts: [],
      insurance: [],
      medical_history: [],
      age_unit: 'Years',
      preferred_language: 'Hindi',
      nationality: 'Indian'
    }
  })

  const { trigger, handleSubmit, formState: { errors } } = methods

  const next = async () => {
    // Before moving to next step, validate ONLY the fields of the current step
    if (currentStep < 10) {
      const stepSchema = stepSchemas[currentStep as StepNumber]
      // We extract the keys to validate
      const keysToValidate = Object.keys(stepSchema.shape) as Array<keyof PatientRegistrationInput>
      
      const isStepValid = await trigger(keysToValidate)
      if (isStepValid) {
        setCurrentStep(s => s + 1)
      }
    }
  }

  const prev = () => {
    setCurrentStep(s => Math.max(1, s - 1))
  }

  const onSubmit = async (data: PatientRegistrationInput) => {
    if (currentStep !== 10) return
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await registerPatient(data)
      if (result.ok) {
        setSuccessData({ patientId: result.patientId, uhid: result.uhid })
      } else {
        setSubmitError((result as any).message || (result as any).error || 'Failed to register patient.')
      }
    } catch (err) {
      setSubmitError('An unexpected error occurred during submission.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (successData) {
    return (
      <div className="flex-1 p-6 max-w-4xl w-full mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Registration Successful</h1>
        <p className="text-slate-500 mb-8 max-w-md">
          Patient has been successfully registered. UHID: <span className="font-bold text-slate-800">{successData.uhid}</span>
        </p>
        <div className="flex gap-4">
          <button onClick={() => router.push('/patients')} className="px-6 py-2.5 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition">
            Back to Registry
          </button>
          <button onClick={() => router.push(`/patients/${successData.patientId}`)} className="px-6 py-2.5 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700 transition">
            View Patient Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 max-w-5xl w-full mx-auto space-y-6">
      
      {/* Progress Stepper */}
      <div className="mb-8 overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex items-center min-w-max px-2">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={`flex flex-col items-center w-20 ${currentStep === step.id ? 'opacity-100' : currentStep > step.id ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors
                  ${currentStep > step.id ? 'bg-emerald-500 text-white' : currentStep === step.id ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-200 text-slate-500'}`}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={`text-[10px] font-bold text-center ${currentStep === step.id ? 'text-blue-600' : 'text-slate-500'}`}>
                  {step.name}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`h-1 w-8 mx-2 rounded-full transition-colors ${currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-100'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Form Area */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-10 min-h-[400px]">
            {currentStep === 1 && <Step01_RegistrationType />}
            {currentStep === 2 && <Step02_BasicInfo />}
            {currentStep === 3 && <Step03_ContactDetails />}
            {currentStep === 4 && <Step04_Demographics />}
            {currentStep === 5 && <Step05_Address />}
            {currentStep === 6 && <Step06_EmergencyContact />}
            {currentStep === 7 && <Step07_Insurance />}
            {currentStep === 8 && <Step08_MedicalHistory />}
            {currentStep === 9 && <Step09_AdditionalInfo />}
            {currentStep === 10 && <Step10_Review />}
            
            {submitError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div className="text-sm text-red-800">
                  <span className="font-bold">Submission Failed:</span> {submitError}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="bg-slate-50 border-t border-slate-100 p-6 flex justify-between items-center">
            <button
              type="button"
              onClick={prev}
              disabled={currentStep === 1 || isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-bold text-sm text-slate-600 hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            
            {currentStep < 10 ? (
              <button
                type="button"
                onClick={next}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {isSubmitting ? 'Registering...' : 'Register Patient'}
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
