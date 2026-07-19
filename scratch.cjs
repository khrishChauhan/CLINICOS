const fs = require('fs');
const path = require('path');

const dir = 'k:/code/intern/clinicos/src/repositories';

function walk(d) {
  let results = [];
  const list = fs.readdirSync(d);
  list.forEach((file) => {
    file = path.join(d, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      let content = fs.readFileSync(file, 'utf8');
      if (content.includes("select('*')")) {
        if (!content.includes(".limit(")) {
            // we will replace .select('*') with .select('id, clinic_id, created_at, status, type').limit(100) where appropriate, or just limit(100)
            content = content.replace(/\.select\('\*'\)/g, ".select('*').limit(100)");
            fs.writeFileSync(file, content);
            console.log('Fixed', file);
        }
      }
    }
  });
  return results;
}

walk(dir);
