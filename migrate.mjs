import fs from 'fs';
import path from 'path';

const basePath = 'k:/code/intern/clinicos/src';

// Create app directory
if (!fs.existsSync(path.join(basePath, 'app'))) {
  fs.mkdirSync(path.join(basePath, 'app'));
}

// Map old pages to new app router paths
const routes = {
  'Dashboard.tsx': 'page.tsx',
  'Patients.tsx': 'patients/page.tsx',
  'Appointments.tsx': 'appointments/page.tsx',
  'Doctors.tsx': 'doctors/page.tsx',
  'EMR.tsx': 'emr/page.tsx',
  'Ledger.tsx': 'ledger/page.tsx',
  'Pharmacy.tsx': 'pharmacy/page.tsx',
  'Consumables.tsx': 'consumables/page.tsx',
  'OperationTheatre.tsx': 'operation-theatre/page.tsx',
  'Lab.tsx': 'lab/page.tsx',
  'Staff.tsx': 'staff/page.tsx',
  'Reports.tsx': 'reports/page.tsx',
  'Analytics.tsx': 'analytics/page.tsx',
  'Configurations.tsx': 'settings/page.tsx'
};

const pagesPath = path.join(basePath, 'pages');

for (const [oldName, newPath] of Object.entries(routes)) {
  const oldFilePath = path.join(pagesPath, oldName);
  if (fs.existsSync(oldFilePath)) {
    const fullNewPath = path.join(basePath, 'app', newPath);
    const newDir = path.dirname(fullNewPath);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }
    fs.renameSync(oldFilePath, fullNewPath);
  }
}

// Remove empty pages directory
if (fs.existsSync(pagesPath) && fs.readdirSync(pagesPath).length === 0) {
  fs.rmdirSync(pagesPath);
}

// Remove unused Vite files
const rootPath = 'k:/code/intern/clinicos';
const filesToDelete = [
  'vite.config.ts',
  'index.html',
  'src/App.tsx',
  'src/main.tsx',
  'src/index.css'
];

for (const file of filesToDelete) {
  const p = path.join(rootPath, file);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
  }
}
