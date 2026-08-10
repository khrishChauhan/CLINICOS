const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src', 'repositories'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  content = content.replace(/\.schema\('emr'\)/g, '');
  content = content.replace(/\.schema\('laboratory'\)/g, '');
  content = content.replace(/\.schema\('radiology'\)/g, '');
  content = content.replace(/\.schema\('master'\)/g, '');
  content = content.replace(/\.schema\('appointment'\)/g, '');
  content = content.replace(/\.schema\('appointments'\)/g, '');
  content = content.replace(/\.schema\('inventory'\)/g, '');
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
