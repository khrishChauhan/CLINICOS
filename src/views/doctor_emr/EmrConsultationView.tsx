import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function EmrConsultationView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Patient Consultation (EMR)</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the core Electronic Medical Record interface. Designed for rapid data entry, clinical safety, and low cognitive load during active patient interactions.
        </p>
      </div>

      <SpecCard
        title="Consultation Interface (SOAP Format)"
        purpose={
          <p>
            The primary screen used while the patient is sitting in front of the doctor. It follows a logical clinical flow (Subjective, Objective, Assessment, Plan) while allowing non-linear data entry.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Patient Header:</strong> Persistent sticky header showing Name, Age, Gender, Highlights (Allergies in RED, Chronic conditions).</li>
            <li><strong>Previous Visit Summary:</strong> Collapsible right sidebar showing the last prescription and notes to avoid context switching.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Chief Complaint (Subjective):</strong> Free-text or templated quick-selects (e.g., "Fever x 3 days", "Lower back pain").</li>
            <li><strong>Medical History Review:</strong> Checkboxes to confirm past history is unchanged, or append new data.</li>
            <li><strong>Vitals (Objective):</strong> Input grid for BP, Temp, SpO2, Weight. Flags abnormal values in red instantly.</li>
            <li><strong>Diagnosis (Assessment):</strong> ICD-10 search integration. Typahead search prioritizing the doctor's historically most-used codes.</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Floating Action:</strong> "Voice Dictation" button hovering near text areas.</li>
            <li><strong>Primary Action:</strong> "Proceed to Prescription" (Moves to the next step).</li>
          </ul>
        }
        userFlow={
          <p>
            Doctor asks "What brings you in?" → Types "Headache" in Chief Complaint → Assistant already entered Vitals (Temp: 101F shows in red) → Doctor palpates and adds clinical notes → Types "Migraine" in Diagnosis box, selects ICD-10 code → Clicks "Proceed to Prescription".
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Desktop:</strong> Multi-column layout. Left side for data entry, right side for referring to past history/documents.</li>
            <li><strong>Tablet:</strong> Emphasizes Voice Notes. The UI shifts to a more vertically stacked scroll view, perfect for stylus or dictation input.</li>
          </ul>
        }
      />

      <SpecCard
        title="Voice Notes & Attachments"
        purpose={
          <p>
            Enhances the speed of data entry and allows capturing clinical evidence (like wound photos or external ECGs) directly into the current encounter.
          </p>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>AI Voice Dictation:</strong> Doctor dictates notes. System uses natural language processing to categorize text into Complaints, Findings, and Advice automatically.</li>
            <li><strong>File Attachments:</strong> Drag-and-drop or camera capture. E.g., taking a photo of a rash using the iPad camera directly into the EMR.</li>
          </ul>
        }
        userFlow={
          <p>
            Doctor clicks Microphone icon → Speaks: "Patient presents with persistent cough for 2 weeks. Temp is normal. Prescribing Amoxicillin." → AI parses "Cough" to Chief Complaint and "Amoxicillin" to Draft Prescription.
          </p>
        }
      />
    </div>
  );
}
