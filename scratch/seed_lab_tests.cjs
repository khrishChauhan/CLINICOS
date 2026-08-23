const PROJECT_REF = 'ihnjzlilbwhosfpawdvx';
async function runSQL(t, sql) {
  const r = await fetch('https://api.supabase.com/v1/projects/' + PROJECT_REF + '/database/query', {
    method: 'POST', headers: { 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  return r.json();
}
async function main() {
  const t = process.env.SUPABASE_ACCESS_TOKEN;
  
  // Get a clinic ID
  const clinicRes = await runSQL(t, "SELECT id FROM clinics LIMIT 1;");
  const clinicId = clinicRes[0].id;
  
  // Seed a category first
  const catQ = `INSERT INTO lab_test_categories (clinic_id, name, description) VALUES ('${clinicId}', 'Hematology', 'Blood related tests') RETURNING id;`;
  const catRes = await runSQL(t, catQ);
  const catId = catRes[0].id;

  // Seed tests
  const tests = [
    `('${clinicId}', '${catId}', 'Complete Blood Count (CBC)', 'CBC01', 'Blood', 'cells/mcL', 'Numeric', 500)`,
    `('${clinicId}', '${catId}', 'Hemoglobin (Hb)', 'HB01', 'Blood', 'g/dL', 'Numeric', 150)`,
    `('${clinicId}', '${catId}', 'Fasting Blood Sugar (FBS)', 'FBS01', 'Blood', 'mg/dL', 'Numeric', 200)`
  ];
  
  const insertQ = `INSERT INTO lab_tests (clinic_id, category_id, name, code, specimen_type, unit, result_type, price) VALUES ${tests.join(',')};`;
  await runSQL(t, insertQ);
  console.log("Lab tests seeded successfully!");
}
main().catch(console.error);
