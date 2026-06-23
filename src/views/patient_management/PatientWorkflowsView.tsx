import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function PatientWorkflowsView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Patient Workflows</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for complex interactive flows including the Registration Wizard and Document Management system.
        </p>
      </div>

      <SpecCard
        title="Patient Registration Modal"
        purpose={
          <p>
            A streamlined, error-proof process for adding new patients to the system. Generates a unique health identifier (UHID) and QR code while preventing duplicate records.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Duplication Warning Banner:</strong> Real-time alert if phone number or Aadhar matches an existing record.</li>
            <li><strong>UHID Generation Screen:</strong> Post-registration success screen displaying the new UHID and scannable QR Code.</li>
          </ul>
        }
        userFlow={
          <ol className="list-decimal pl-4 space-y-1">
            <li><strong>Step 1: Identity Check.</strong> Receptionist enters Mobile Number. System queries DB to ensure no duplicates.</li>
            <li><strong>Step 2: Basic Demographics.</strong> First Name, Last Name, Date of Birth (auto-calculates Age), Gender, Blood Group.</li>
            <li><strong>Step 3: Contact & Address.</strong> Email, Address, Emergency Contact Name & Relation.</li>
            <li><strong>Step 4: Insurances & IDs.</strong> National ID (Aadhar), Primary Insurance Provider and Policy Number.</li>
            <li><strong>Completion:</strong> System confirms creation, generates UHID (e.g., CA-2023-8942) and a QR code for future quick scans. Options provided to "Print ID Card" or "Book Appointment Now".</li>
          </ol>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Design:</strong> On desktop, a large centered modal with a progress stepper (1 of 4). On mobile, a full-screen wizard capturing one logical section per screen to maximize keyboard space.</li>
          </ul>
        }
      />

      <SpecCard
        title="Document Upload Flow & Viewer"
        purpose={
          <p>
            Enables staff or patients to digitize and securely store external medical records, lab reports, X-rays, and identity proofs against the patient's profile.
          </p>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Drag & Drop File Upload.</li>
            <li>Camera Capture (on mobile devices/tablets).</li>
            <li>Document Tagging/Categorization.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Within the Patient Profile's "Documents" tab, filter by document category (Lab Report, Radiology, Prescription, ID Proof).</li>
          </ul>
        }
        userFlow={
          <ol className="list-decimal pl-4 space-y-1">
            <li>Patient hands a physical previous blood report to the receptionist.</li>
            <li>Receptionist navigates to Patient Profile → Documents Tab → Clicks "Upload Document".</li>
            <li>A modal appears with a drag-and-drop zone. Receptionist scans the document and drops the PDF into the zone.</li>
            <li>System prompts for Metadata: Sets Category to "Lab Report", Date to "12-Oct-2023", and adds a brief note.</li>
            <li>Upload completes. The PDF is now visible in the Timeline and Documents tab for the doctor to review in the built-in secure PDF viewer.</li>
          </ol>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> The upload zone shrinks to a single button that triggers the native OS action sheet (Choose Photo, Take Photo, Browse Files). This is critical for doctors using iPads.</li>
            <li><strong>Desktop:</strong> Integrated split-screen viewer. Click a document in the list on the left, and a high-resolution PDF/Image preview renders on the right side of the screen without downloading.</li>
          </ul>
        }
      />
    </div>
  );
}
