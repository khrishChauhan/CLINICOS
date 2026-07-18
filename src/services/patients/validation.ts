import { z } from 'zod'

// ─────────────────────────────────────────────────────────────────────────────
// Step Schemas (used individually for per-step validation)
// ─────────────────────────────────────────────────────────────────────────────

export const step1Schema = z.object({
  patient_type: z.enum(['OPD', 'IPD', 'Emergency'], {
    required_error: 'Patient type is required',
  }),
  referred_by: z.string().max(255).optional(),
  primary_doctor_id: z.string().uuid().nullable().optional(),
})

export const step2Schema = z.object({
  title: z.enum(['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Master', 'Baby', 'Baby of']).optional(),
  first_name: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name is required')
    .max(100, 'Maximum 100 characters'),
  middle_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
  date_of_birth: z.string().optional().nullable(),
  age: z
    .number({ invalid_type_error: 'Age must be a number' })
    .int()
    .min(0)
    .max(150)
    .optional()
    .nullable(),
  age_unit: z.enum(['Years', 'Months', 'Days']).default('Years'),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown']).optional().nullable(),
  marital_status: z.enum(['Single', 'Married', 'Divorced', 'Widowed', 'Separated']).optional(),
})

export const step3Schema = z.object({
  mobile_number: z
    .string({ required_error: 'Mobile number is required' })
    .min(10, 'Enter a valid 10-digit mobile number')
    .max(20, 'Maximum 20 characters'),
  alternate_mobile: z.string().max(20).optional(),
  email: z.string().email('Enter a valid email address').max(255).optional().or(z.literal('')),
  preferred_language: z.string().max(50).default('Hindi'),
})

export const step4Schema = z.object({
  aadhaar_number: z
    .string()
    .refine(v => !v || /^\d{12}$/.test(v), 'Aadhaar must be exactly 12 digits')
    .optional()
    .or(z.literal('')),
  passport_number: z.string().max(50).optional(),
  occupation: z.string().max(100).optional(),
  nationality: z.string().max(100).default('Indian'),
  religion: z.string().max(100).optional(),
})

export const addressSchema = z.object({
  address_type: z.enum(['Home', 'Office', 'Other']).default('Home'),
  address_line_1: z
    .string({ required_error: 'Address is required' })
    .min(1, 'Address is required'),
  address_line_2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).default('India'),
  pincode: z.string().max(10).optional(),
  is_primary: z.boolean().default(true),
})

export const step5Schema = z.object({
  addresses: z.array(addressSchema).default([]),
})

export const emergencyContactSchema = z.object({
  contact_name: z
    .string({ required_error: 'Contact name is required' })
    .min(1, 'Contact name is required'),
  relationship: z.string().max(100).optional(),
  mobile_number: z
    .string({ required_error: 'Mobile is required' })
    .min(10, 'Enter a valid mobile number'),
  alternate_mobile: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  remarks: z.string().optional(),
})

export const step6Schema = z.object({
  emergency_contacts: z.array(emergencyContactSchema).default([]),
})

export const insuranceSchema = z.object({
  insurance_provider: z.string().min(1, 'Provider name is required'),
  policy_number: z.string().min(1, 'Policy number is required'),
  member_id: z.string().optional(),
  coverage_amount: z.number().positive('Must be positive').optional().nullable(),
  valid_from: z.string().optional(),
  valid_to: z.string().optional(),
  insurance_type: z.enum(['Health', 'Life', 'Accident', 'Dental', 'Vision', 'Other']).optional(),
  status: z.enum(['Active', 'Expired', 'Pending']).default('Active'),
  remarks: z.string().optional(),
})

export const step7Schema = z.object({
  insurance: z.array(insuranceSchema).default([]),
})

export const medicalHistorySchema = z.object({
  disease_name: z.string().min(1, 'Disease / condition name is required'),
  diagnosis_date: z.string().optional(),
  treated_by: z.string().optional(),
  hospital_name: z.string().optional(),
  treatment_status: z.enum(['Ongoing', 'Completed', 'Chronic', 'Resolved']).optional(),
  remarks: z.string().optional(),
})

export const step8Schema = z.object({
  medical_history: z.array(medicalHistorySchema).default([]),
})

export const step9Schema = z.object({
  remarks: z.string().max(1000).optional(),
})

// ─────────────────────────────────────────────────────────────────────────────
// Master schema (used for final submission validation in Server Action)
// ─────────────────────────────────────────────────────────────────────────────

export const patientRegistrationSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(step6Schema)
  .merge(step7Schema)
  .merge(step8Schema)
  .merge(step9Schema)

export type PatientRegistrationInput = z.infer<typeof patientRegistrationSchema>

// Per-step schema map for the wizard to validate individual steps
export const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
  6: step6Schema,
  7: step7Schema,
  8: step8Schema,
  9: step9Schema,
} as const

export type StepNumber = keyof typeof stepSchemas
