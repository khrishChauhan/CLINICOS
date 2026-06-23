import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function PatientDirectoryView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Patient Directory</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the primary Patient List page, along with the Search and Advanced Filtering experiences.
        </p>
      </div>

      <SpecCard
        title="Patient List Page"
        purpose={
          <p>
            The central hub for receptionists and clinic staff to view, search, and manage all registered patients in the clinic's database. It serves as the starting point for most administrative patient interactions.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Total Registered:</strong> Lifetime patient count.</li>
            <li><strong>New This Month:</strong> Patient acquisition metric.</li>
            <li><strong>Active Today:</strong> Patients scheduled or present in the clinic today.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Patient Index:</strong> Columns: UHID (Unique Health ID), Patient Name, Age/Gender, Primary Contact, Last Visit Date, Status (Active/Inactive), Actions.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>View Profile (Drill down).</li>
            <li>Book Appointment (Quick action from row).</li>
            <li>Edit Basic Details.</li>
            <li>Merge Duplicate Records (Admin only).</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "+ Register Patient" (Opens Registration Modal).</li>
            <li><strong>Secondary/Icon:</strong> "Export List", "Bulk SMS".</li>
          </ul>
        }
        userFlow={
          <p>
            Receptionist receives a phone call → Types phone number into Quick Search → Matches patient record → Clicks "Book Appointment" icon directly on the table row → Books slot without leaving the list view.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Table converts to a list of cards showing Name, UHID, and Phone. Gestures (swipe left) reveal quick actions like "Call" or "Book".</li>
            <li><strong>Desktop:</strong> High-density data grid with sortable columns, resizable widths, and bulk-selection checkboxes.</li>
          </ul>
        }
      />

      <SpecCard
        title="Search Experience & Advanced Filters"
        purpose={
          <p>
            Ensures instant retrieval of patient records to reduce wait times at the reception desk. Combines fuzzy search with highly specific clinical and administrative filters.
          </p>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Global Search (⌘K):</strong> Omnibox that instantly queries by First Name, Last Name, Phone Number, UHID, or National ID (e.g., Aadhar). Supports fuzzy matching for spelling errors.</li>
            <li><strong>Advanced Filter Panel:</strong> Slide-out tray for complex queries:
              <ul className="list-circle pl-5 mt-1 space-y-1 text-slate-600">
                <li>Age Group (Min-Max sliders).</li>
                <li>Gender.</li>
                <li>Blood Group.</li>
                <li>Last Visit Date Range (e.g., "Hasn't visited in 6 months").</li>
                <li>Insurance Provider.</li>
                <li>Patient Group / Tags (e.g., VIP, Chronic).</li>
              </ul>
            </li>
          </ul>
        }
        userFlow={
          <p>
            Marketing team wants to recall chronic patients → Opens Patient List → Clicks "Advanced Filters" → Selects "Last Visit &gt; 6 Months" + "Tag: Diabetic" → Applies Filter → Selects all 45 results → Clicks "Bulk SMS" to send a checkup reminder.
          </p>
        }
      />
    </div>
  );
}
