const PROJECT_REF = 'ihnjzlilbwhosfpawdvx';
const crypto = require('crypto');

async function runSQL(t, sql) {
  const r = await fetch('https://api.supabase.com/v1/projects/' + PROJECT_REF + '/database/query', {
    method: 'POST', headers: { 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  return r.json();
}
async function main() {
  const t = process.env.SUPABASE_ACCESS_TOKEN;
  
  // get doctor role id
  const roles = await runSQL(t, "SELECT id FROM roles WHERE role_name = 'Doctor';");
  const roleId = roles[0].id;
  
  // get doctors without user_id
  const docs = await runSQL(t, "SELECT id, clinic_id, first_name, last_name, email, mobile_number FROM doctor.doctors WHERE user_id IS NULL;");
  
  for (const doc of docs) {
    const newUserId = crypto.randomUUID();
    const dummyUsername = `dr.${doc.first_name?.toLowerCase().replace(/\\s+/g, '') || 'doc'}.${doc.last_name?.toLowerCase().replace(/\\s+/g, '') || Date.now()}`;
    
    await runSQL(t, `INSERT INTO users (id, clinic_id, role_id, username, email, mobile, status) VALUES ('${newUserId}', '${doc.clinic_id}', '${roleId}', '${dummyUsername}', '${doc.email || dummyUsername + '@clinic.local'}', ${doc.mobile_number ? "'" + doc.mobile_number + "'" : 'NULL'}, 'Active');`);
    
    await runSQL(t, `UPDATE doctor.doctors SET user_id = '${newUserId}' WHERE id = '${doc.id}';`);
    console.log(`Synced user for doctor ${doc.first_name} ${doc.last_name}`);
  }
}
main().catch(console.error);
