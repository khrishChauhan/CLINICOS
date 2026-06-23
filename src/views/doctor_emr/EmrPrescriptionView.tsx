import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function EmrPrescriptionView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Prescription & Follow-up</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for creating safe, legible, and legally compliant prescriptions, lab requests, and concluding the consultation.
        </p>
      </div>

      <SpecCard
        title="Prescription Builder (Rx)"
        purpose={
          <p>
            The medication authoring tool. Designed to prevent adverse drug events by checking allergies and standardizing dose instructions, while being faster than writing on paper.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Favorite Regimens:</strong> Quick-select buttons for common treatments (e.g., "Standard Viral Fever Kit").</li>
            <li><strong>Allergy/Interaction Engine:</strong> Background checker that flashes a warning if prescribed drug conflicts with patient history.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Drug Search:</strong> Auto-complete from local/national drug formulary.</li>
            <li><strong>Dosage Builder:</strong> 1-0-1 (Morning-Afternoon-Night) toggle switches.</li>
            <li><strong>Duration & Instructions:</strong> "5 Days", "After Food", "With Water".</li>
            <li><strong>Digital Signature:</strong> Cryptographically secures the document and attaches the doctor's visual signature image.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Active Rx List (Current Session):</strong> Columns: Drug Name, Form (Tablet/Syrup), Dosage, Frequency, Duration, Instructions, Action (Remove).</li>
          </ul>
        }
        userFlow={
          <p>
            Doctor searches "Paracetamol" → Selects "500mg Tablet" → Clicks "1-1-1" preset → Selects "3 Days" → Adds "After Food" instruction. System checks for allergies (Clear). Drug is added to Rx List.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li>Desktop and Tablet optimized. Uses large toggle buttons for dosage to minimize typing.</li>
          </ul>
        }
      />

      <SpecCard
        title="Lab Request & Follow-Up Screen"
        purpose={
          <p>
            The final step of the consultation used to order investigations, provide general lifestyle advice, and schedule the next visit before generating the final PDF.
          </p>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Lab Investigations:</strong> Search and add tests (e.g., CBC, Lipid Profile). Integrates with in-house lab billing if applicable.</li>
            <li><strong>General Advice:</strong> Free text or templates (e.g., "Drink warm water", "Avoid oily food").</li>
            <li><strong>Follow-Up Date:</strong> Date picker or quick presets ("+ 3 Days", "+ 1 Week", "SOS").</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Gigantic Primary Action:</strong> "Finish & Generate Prescription" (Locks the encounter, generates PDF, sends to printer/WhatsApp).</li>
          </ul>
        }
        userFlow={
          <p>
            Rx is built → Doctor adds "CBC" to lab requests → Selects "Follow-up in 1 Week" → Clicks "Finish" → Digital signature is applied. App alerts reception that the patient is returning to the desk. Front desk prints the PDF.
          </p>
        }
      />
    </div>
  );
}
