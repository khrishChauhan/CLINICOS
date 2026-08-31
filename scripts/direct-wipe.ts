import { Client } from 'pg';

const connectionString = 'postgresql://postgres.ihnjzlilbwhosfpawdvx:Click%20Aarambh%20ClinicOS@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

const wipeSql = `
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname IN ('public', 'appointment', 'doctor', 'radiology', 'laboratory', 'ipd', 'ot', 'pharmacy', 'billing') 
        AND tablename NOT IN ('clinics', 'roles', 'role_permissions', 'permissions', 'departments', 'designations', 'users')
    ) LOOP
        BEGIN
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename) || ' CASCADE;';
        EXCEPTION WHEN OTHERS THEN 
            -- Ignore errors like foreign keys not matching temporarily
        END;
    END LOOP;

    -- Wipe Users explicitly
    BEGIN
        TRUNCATE TABLE public.platform_audit_logs CASCADE;
    EXCEPTION WHEN OTHERS THEN END;
    
    DELETE FROM public.users;
    DELETE FROM auth.users;
END $$;
`;

async function wipe() {
  console.log('Connecting to database...');
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected! Executing dynamic wipe...');
    await client.query(wipeSql);
    
    // Check if patients were actually deleted
    const res = await client.query('SELECT count(*) FROM public.patients');
    console.log('Patients remaining in DB:', res.rows[0].count);
    
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await client.end();
  }
}

wipe();