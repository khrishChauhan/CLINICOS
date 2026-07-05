export const mockPatients = [
  { id: 'PAT-10294', name: 'Ramesh Kumar', age: 45, gender: 'M', phone: '+91 98765 43210', lastVisit: '2026-06-28', status: 'Stable', bloodGroup: 'O+' },
  { id: 'PAT-10295', name: 'Sunita Sharma', age: 32, gender: 'F', phone: '+91 98765 11223', lastVisit: '2026-07-01', status: 'Review', bloodGroup: 'A+' },
  { id: 'PAT-10296', name: 'Vikram Singh', age: 58, gender: 'M', phone: '+91 91234 56789', lastVisit: '2026-07-03', status: 'Critical', bloodGroup: 'B-' },
  { id: 'PAT-10297', name: 'Anjali Verma', age: 24, gender: 'F', phone: '+91 99887 76655', lastVisit: '2026-07-04', status: 'Stable', bloodGroup: 'AB+' },
  { id: 'PAT-10298', name: 'Rahul Desai', age: 41, gender: 'M', phone: '+91 98123 45678', lastVisit: '2026-07-05', status: 'Pending', bloodGroup: 'O-' },
];

export const mockAppointments = [
  { id: 'APT-8831', patient: 'Ramesh Kumar', doctor: 'Dr. Neha Patel', dept: 'Cardiology', time: '09:00 AM', status: 'Completed', type: 'Follow-up' },
  { id: 'APT-8832', patient: 'Sunita Sharma', doctor: 'Dr. Amit Shah', dept: 'General Medicine', time: '10:30 AM', status: 'In Progress', type: 'Consultation' },
  { id: 'APT-8833', patient: 'Vikram Singh', doctor: 'Dr. R.K. Gupta', dept: 'Orthopedics', time: '11:15 AM', status: 'Waiting', type: 'Post-Op' },
  { id: 'APT-8834', patient: 'Anjali Verma', doctor: 'Dr. Neha Patel', dept: 'Cardiology', time: '01:00 PM', status: 'Scheduled', type: 'Consultation' },
  { id: 'APT-8835', patient: 'Rahul Desai', doctor: 'Dr. Amit Shah', dept: 'General Medicine', time: '02:45 PM', status: 'Scheduled', type: 'Follow-up' },
];

export const mockDoctors = [
  { id: 'DOC-01', name: 'Dr. Neha Patel', specialty: 'Cardiologist', education: 'MBBS, MD', available: true, patientsToday: 12 },
  { id: 'DOC-02', name: 'Dr. Amit Shah', specialty: 'General Physician', education: 'MBBS, DNB', available: true, patientsToday: 24 },
  { id: 'DOC-03', name: 'Dr. R.K. Gupta', specialty: 'Orthopedic Surgeon', education: 'MS Ortho', available: false, patientsToday: 8 },
  { id: 'DOC-04', name: 'Dr. Priya Mehta', specialty: 'Pediatrician', education: 'MD Pediatrics', available: true, patientsToday: 15 },
];

export const mockPharmacy = [
  { id: 'MED-001', name: 'Metformin 500mg', class: 'Antidiabetic', stock: 1111, unit: 'Tablets', expiry: '2029-03-28', price: 9.1, batch: 'BAT-76655', status: 'Stable' },
  { id: 'MED-004', name: 'Paracetamol 650mg', class: 'Analgesic', stock: 12, unit: 'Tablets', expiry: '2026-09-28', price: 1.7, batch: 'BAT-66329', status: 'Critical' },
  { id: 'MED-012', name: 'Losartan 50mg', class: 'Antihypertensive', stock: 140, unit: 'Tablets', expiry: '2028-09-28', price: 6.7, batch: 'BAT-20740', status: 'Reorder' },
  { id: 'MED-007', name: 'Pantoprazole 40mg', class: 'Antacid', stock: 921, unit: 'Tablets', expiry: '2026-07-28', price: 8.5, batch: 'BAT-43296', status: 'Stable' },
  { id: 'MED-008', name: 'Montelukast 10mg', class: 'Antiasthmatic', stock: 8, unit: 'Tablets', expiry: '2026-11-28', price: 9.3, batch: 'BAT-15942', status: 'Critical' },
];

export const mockLedger = [
  { id: 'INV-2026-001', date: '2026-07-05', patient: 'Ramesh Kumar', amount: 1500, status: 'Paid', method: 'UPI' },
  { id: 'INV-2026-002', date: '2026-07-05', patient: 'Vikram Singh', amount: 12500, status: 'Pending', method: 'Insurance' },
  { id: 'INV-2026-003', date: '2026-07-04', patient: 'Sunita Sharma', amount: 800, status: 'Paid', method: 'Cash' },
  { id: 'INV-2026-004', date: '2026-07-04', patient: 'Anjali Verma', amount: 2400, status: 'Paid', method: 'Card' },
];
