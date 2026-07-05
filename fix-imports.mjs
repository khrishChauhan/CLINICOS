import fs from 'fs';
import path from 'path';

const appDir = 'k:/code/intern/clinicos/src/app';
const dirs = fs.readdirSync(appDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const dir of dirs) {
  const pagePath = path.join(appDir, dir, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    content = content.replace(/from '\.\.\/components/g, "from '../../components");
    content = content.replace(/from '\.\.\/data/g, "from '../../data");
    fs.writeFileSync(pagePath, content);
  }
}
