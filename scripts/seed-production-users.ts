/**
 * ClinicOS Production Launch — Seed Production Users
 * 
 * Run after wipe-data.sql has been executed:
 *   npx tsx scripts/seed-production-users.ts
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

// Admin client — bypasses RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

interface UserSeed {
  email: string
  password: string
  username: string
  roleName: string
  employeeId: string
  isDoctor?: boolean
  doctorFirstName?: string
  doctorLastName?: string
  specialization?: string
}

const PRODUCTION_USERS: UserSeed[] = [
  {
    email: 'admin@durgaclinic.in',
    password: '123456',
    username: 'Admin',
    roleName: 'Super Admin',
    employeeId: 'EMP-001',
  },
  {
    email: 'doctor@durgaclinic.in',
    password: '123456',
    username: 'Dr. Neha',
    roleName: 'Doctor',
    employeeId: 'EMP-002',
    isDoctor: true,
    doctorFirstName: 'Neha',
    doctorLastName: 'Sharma',
    specialization: 'General Physician',
  },
  {
    email: 'receptionist@durgaclinic.in',
    password: '123456',
    username: 'Receptionist',
    roleName: 'Receptionist',
    employeeId: 'EMP-003',
  },
  {
    email: 'pharmacy@durgaclinic.in',
    password: '123456',
    username: 'Pharmacist',
    roleName: 'Pharmacist',
    employeeId: 'EMP-004',
  },
]

async function main() {
  console.log('🚀 Starting ClinicOS production user seeding...\n')

  // ─── 1. Fetch Durga Clinic ─────────────────────────────────────
  console.log('📋 Fetching Durga Clinic...')
  const { data: clinics, error: clinicErr } = await supabase
    .from('clinics')
    .select('id, clinic_name')
    .limit(1)
    .single()

  if (clinicErr || !clinics) {
    console.error('❌ Could not find any clinic in the database.', clinicErr?.message)
    console.error('   Make sure the clinics table has a row for Durga Clinic before running this script.')
    process.exit(1)
  }
  const clinicId = clinics.id
  console.log(`   ✅ Found clinic: "${clinics.clinic_name}" (${clinicId})\n`)

  // ─── 2. Fetch roles ────────────────────────────────────────────
  console.log('📋 Fetching roles...')
  const { data: roles, error: rolesErr } = await supabase
    .from('roles')
    .select('id, role_name')
  
  if (rolesErr || !roles) {
    console.error('❌ Could not fetch roles.', rolesErr?.message)
    process.exit(1)
  }

  const roleMap: Record<string, string> = {}
  roles.forEach(r => { roleMap[r.role_name] = r.id })
  console.log(`   ✅ Found roles: ${roles.map(r => r.role_name).join(', ')}\n`)

  // ─── 3. Create each user ───────────────────────────────────────
  for (const user of PRODUCTION_USERS) {
    console.log(`👤 Creating: ${user.email} (${user.roleName})`)

    const roleId = roleMap[user.roleName]
    if (!roleId) {
      console.warn(`   ⚠️  Role "${user.roleName}" not found in roles table. Skipping.`)
      console.warn(`      Make sure roles are seeded in the database.`)
      continue
    }

    // Create auth user
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true, // auto-confirm email
    })

    if (authErr) {
      // If user already exists (e.g. running script twice), try to get existing user
      if (authErr.message.includes('already been registered')) {
        console.warn(`   ⚠️  Auth user already exists. Will upsert public.users record.`)
        // Look up existing user by email
        const { data: { users: existingUsers } } = await supabase.auth.admin.listUsers()
        const existingUser = (existingUsers as any[]).find((u: any) => u.email === user.email)
        if (!existingUser) {
          console.error(`   ❌ Could not find existing auth user for ${user.email}`)
          continue
        }
        await upsertPublicUser(existingUser.id, user, clinicId, roleId)
        if (user.isDoctor) {
          await upsertDoctorRecord(existingUser.id, user, clinicId)
        }
        continue
      }
      console.error(`   ❌ Auth creation failed: ${authErr.message}`)
      continue
    }

    const authUserId = authData.user.id
    console.log(`   ✅ Auth user created: ${authUserId}`)

    await upsertPublicUser(authUserId, user, clinicId, roleId)

    if (user.isDoctor) {
      await upsertDoctorRecord(authUserId, user, clinicId)
    }

    console.log(`   ✅ Done: ${user.email}\n`)
  }

  console.log('\n🎉 Production user seeding complete!')
  console.log('\nProduction Credentials:')
  console.log('─────────────────────────────────────────')
  PRODUCTION_USERS.forEach(u => {
    console.log(`  ${u.roleName.padEnd(15)} ${u.email.padEnd(35)} ${u.password}`)
  })
  console.log('─────────────────────────────────────────')
}

async function upsertPublicUser(
  authUserId: string,
  user: UserSeed,
  clinicId: string,
  roleId: string
) {
  const { error } = await supabase.from('users').upsert({
    id: authUserId,
    clinic_id: clinicId,
    role_id: roleId,
    email: user.email,
    username: user.username,
    employee_id: user.employeeId,
    status: 'active',
    is_email_verified: true,
  }, { onConflict: 'id' })

  if (error) {
    console.error(`   ❌ public.users upsert failed: ${error.message}`)
  } else {
    console.log(`   ✅ public.users record upserted`)
  }
}

async function upsertDoctorRecord(
  authUserId: string,
  user: UserSeed,
  clinicId: string
) {
  // Check if exists first
  const { data: existing } = await supabase.schema('doctor').from('doctors').select('id').eq('user_id', authUserId).single()

  const payload = {
    user_id: authUserId,
    clinic_id: clinicId,
    doctor_code: 'DOC-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
    first_name: user.doctorFirstName ?? 'Doctor',
    last_name: user.doctorLastName ?? '',
    status: 'active',
  }

  let error;
  if (existing) {
    const { error: updErr } = await supabase.schema('doctor').from('doctors').update(payload).eq('user_id', authUserId)
    error = updErr
  } else {
    const { error: insErr } = await supabase.schema('doctor').from('doctors').insert([payload])
    error = insErr
  }

  if (error) {
    console.error(`   ❌ doctor.doctors upsert failed: ${error.message}`)
  } else {
    console.log(`   ✅ doctor.doctors record upserted`)
  }
}

main().catch(err => {
  console.error('❌ Unexpected error:', err)
  process.exit(1)
})