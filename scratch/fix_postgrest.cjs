const PROJECT_REF = 'ihnjzlilbwhosfpawdvx';

async function runSQL(accessToken, sql) {
  const resp = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await resp.text();
  console.log(`Status: ${resp.status}`);
  try {
    const data = JSON.parse(text);
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch {
    console.log(text);
    return null;
  }
}

async function main() {
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('ERROR: Set SUPABASE_ACCESS_TOKEN');
    process.exit(1);
  }

  console.log('=== Step 1: Recreate empty ot and radiology schemas ===');
  await runSQL(accessToken, 'CREATE SCHEMA IF NOT EXISTS ot; CREATE SCHEMA IF NOT EXISTS radiology;');

  console.log('\n=== Step 2: Fix pgrst.db_schemas (the CORRECT setting) ===');
  await runSQL(accessToken, `
    ALTER ROLE authenticator SET pgrst.db_schemas TO 'public, storage, graphql_public';
  `);

  console.log('\n=== Step 3: Also reset extra_search_path ===');
  await runSQL(accessToken, `
    ALTER ROLE authenticator SET pgrst.db_extra_search_path TO 'public, extensions';
  `);

  console.log('\n=== Step 4: Reload PostgREST ===');
  await runSQL(accessToken, "NOTIFY pgrst, 'reload config'; NOTIFY pgrst, 'reload schema';");

  console.log('\n=== Step 5: Verify config ===');
  await runSQL(accessToken, "SELECT rolname, rolconfig FROM pg_roles WHERE rolname = 'authenticator';");

  console.log('\n=== Step 6: Drop the empty schemas ===');
  await runSQL(accessToken, "DROP SCHEMA IF EXISTS ot CASCADE; DROP SCHEMA IF EXISTS radiology CASCADE;");

  console.log('\n=== Step 7: Final reload ===');
  await runSQL(accessToken, "NOTIFY pgrst, 'reload config'; NOTIFY pgrst, 'reload schema';");

  console.log('\nDone! Wait ~30 seconds then refresh browser.');
}

main().catch(console.error);
