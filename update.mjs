import { writeFileSync, readFileSync } from 'node:fs';
let content = readFileSync('src/components/emr/VisitWorkspace.tsx', 'utf8');

content = content.replace(/type Tab = 'timeline' \\| 'complaints' \\| 'vitals' \\| 'diagnoses' \\| 'procedures' \\| 'prescription' \\| 'clinical_notes' \\| 'orders' \\| 'followup' \\| 'referrals' \\| 'alerts' \\| 'treatment_plans' \\| 'attachments' \\| 'audit' \\| 'summary'/, 
  "type Tab = 'timeline' | 'complaints' | 'vitals' | 'diagnoses' | 'procedures' | 'prescription' | 'clinical_notes' | 'orders' | 'followup' | 'referrals' | 'alerts' | 'treatment_plans' | 'attachments' | 'audit'");

content = content.replace(/const \[notes, setNotes\] = useState('')\n  const \[provDiag, setProvDiag\] = useState('')\n  const \[followupRequired, setFollowupRequired\] = useState(false)\n  const \[followupDate, setFollowupDate\] = useState('')\n/, '');

content = content.replace(/setNotes(res.data.notes \\|\\| '')\n      setProvDiag(res.data.provisional_diagnosis \\|\\| '')\n      setFollowupRequired(res.data.followup_required)\n      setFollowupDate(res.data.followup_date \\|\\| '')\n/, '');

content = content.replace(/const res = await completeVisitAction\(visitId, \{\n      provisional_diagnosis: provDiag \\|\\| undefined,\n      notes: notes \\|\\| undefined,\n      followup_required: followupRequired,\n      followup_date: followupDate \\|\\| undefined\n    \}\)/, 
  'const res = await completeVisitAction(visitId)');

content = content.replace(/const handleSaveSummary = async \\(\\) => \\{[\\s\\S]*?\@}\n\n/, '');
content = content.replace(/\\{ id: 'summary', label: 'Summary' \\},?\n/, '');
content = content.replace(/\\{activeTab === 'summary' && \\([\\s\\S];*?\\)\\}\n/, '');

writeFileSync('src/components/emr/VisitWorkspace.tsx', content, 'utf8');
console.log('updated');
