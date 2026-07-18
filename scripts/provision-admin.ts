import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function provisionAdmin() {
  const email = 'admin@durgaclinic.in'
  const password = 'Password123!'

  console.log(`Provisioning Super Admin: ${email}...`)

  // 1. Create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    if (authError.message.includes('already been registered') || authError.message.includes('already exists')) {
      console.log('Auth user already exists. Fetching user ID...')
    } else {
      console.error('Error creating auth user:', authError.message)
      process.exit(1)
    }
  }

  // Get the user ID (either from creation or by fetching)
  let userId = authData?.user?.id
  if (!userId) {
    const { data: listData } = await supabase.auth.admin.listUsers()
    userId = listData.users.find((u: any) => u.email === email)?.id
  }

  if (!userId) {
    console.error('Failed to resolve user ID.')
    process.exit(1)
  }

  console.log(`Auth user ID: ${userId}`)

  // 2. Assign the role in public.users
  // Fetch "Super Admin" role
  const { data: roleData, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('role_name', 'Super Admin')
    .single()

  if (roleError || !roleData) {
    console.error('Super Admin role not found. Ensure roles are seeded.')
    process.exit(1)
  }

  // Fetch "Durga Clinic" clinic
  const { data: clinicData, error: clinicError } = await supabase
    .from('clinics')
    .select('id')
    .eq('clinic_name', 'Durga Clinic')
    .single()

  if (clinicError || !clinicData) {
    console.error('Durga Clinic not found. Ensure clinics are seeded.')
    process.exit(1)
  }

  // Upsert the user into public.users
  const { error: upsertError } = await supabase
    .from('users')
    .upsert({
      id: userId,
      email: email,
      username: 'Super Admin',
      role_id: roleData.id,
      clinic_id: clinicData.id,
      status: 'Active',
    }, { onConflict: 'id' })

  if (upsertError) {
    console.error('Error upserting into public.users:', upsertError.message)
    process.exit(1)
  }

  console.log('✅ Super Admin provisioned successfully.')
}

provisionAdmin().catch(console.error)
