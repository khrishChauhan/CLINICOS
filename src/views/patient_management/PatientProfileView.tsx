import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function PatientProfileView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Patient Detail Profile</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the 360-degree patient view, consolidating clinical history, billing, vitals, and demographics into a single accessible interface.
        </p>
      </div>

      <SpecCard
        title="Patient Profile Layout & Navigation"
        purpose={
          <p>
            Provides doctors and front-desk staff with a comprehensive, unified view of everything related to a specific patient. Reduces context-switching during consultations.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Clinical Alerts Banner:</strong> High-priority warnings (e.g., "SEVERE ALLERGY: PENICILLIN").</li>
            <li><strong>Financial Warning:</strong> Outstanding dues alert shown only to administrative staff.</li>
          </ul>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Layout Structure (Desktop):</strong> 
              <br/>- <strong>Left Sidebar (Sticky):</strong> Patient Identity (Photo, UHID, QR Code, Name, Age, Blood Group), Contact Info, Emergency Contact, Associated Family Members, Primary Insurance info.
              <br/>- <strong>Main Content (Tabs):</strong> Timeline, Clinical Notes, Vitals, Documents, Billing History.
            </li>
            <li><strong>Layout Structure (Mobile):</strong> Identity card at the top. Tabs convert into a horizontal scrolling pill menu or an accordion structure to save vertical space. Left sidebar elements move to a "Profile Details" tab.</li>
          </ul>
        }
      />

      <SpecCard
        title="Clinical Features (Medical History, Vitals, Allergies)"
        purpose={
          <p>
            The core medical record (EMR) section within the profile, designed for rapid consumption by doctors before or during a consultation.
          </p>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Vitals Flowsheet (Graphs):</strong> Interactive line charts tracking Blood Pressure (Systolic/Diastolic), Heart Rate, SpO2, BMI, and Temperature over historical visits.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Ongoing Medications:</strong> List of currently active prescriptions with start dates and dosage.</li>
            <li><strong>Medical History / Diagnoses:</strong> Table of chronic conditions, past surgeries, and major illnesses categorized by ICD codes.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Record New Vitals.</li>
            <li>Update Allergy List.</li>
            <li>Add Medical History Note.</li>
          </ul>
        }
      />

      <SpecCard
        title="Timeline & Visit History"
        purpose={
          <p>
            A chronological feed of every interaction the patient has had with the clinic, similar to a social media feed but for healthcare events.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Chronological Feed Items:</strong> 
              <ul className="list-circle pl-5 mt-1 text-slate-600">
                <li>Appointments (Booked, Completed, Cancelled).</li>
                <li>Consultation Notes (Doctor's assessment).</li>
                <li>Prescriptions Issued.</li>
                <li>Lab Results Published.</li>
                <li>Payments Made/Invoices Generated.</li>
              </ul>
            </li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Filter Timeline by Event Type (e.g., Show only 'Lab Results' or only 'Consultations').</li>
            <li>Sort Oldest to Newest / Newest to Oldest.</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary (Floating on Timeline):</strong> "+ New Encounter" (Starts a doctor's consultation workflow).</li>
          </ul>
        }
      />
    </div>
  );
}
