import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function ApptCalendarView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Calendar & Scheduling</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed UI/UX specifications for the Doctor Calendar, varied temporal views (List, Timeline), and appointment modification workflows (Reschedule, Cancel, Follow-Up).
        </p>
      </div>

      <SpecCard
        title="Doctor Calendar View"
        purpose={
          <p>
            The primary scheduling interface. Allows doctors and administrative staff to visualize the week or day at a glance, manage time blocks, and quickly identify gaps or overbookings.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mini-Calendar:</strong> A small monthly calendar in the sidebar for quick date jumping.</li>
            <li><strong>Availability Toggles:</strong> Switches to block out time (e.g., Surgery, Lunch, Out of Office).</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Filter by Doctor/Provider (Supervising staff can view multiple calendars side-by-side).</li>
            <li>Filter by Appointment Type (New Consultation, Follow-up, Procedure).</li>
            <li>Filter by Status (Confirmed, Checked-In, No-Show).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Drag-and-Drop to change appointment times.</li>
            <li>Stretch/Shrink appointment blocks to adjust duration.</li>
            <li>Click on empty slot to create a new appointment.</li>
          </ul>
        }
        userFlow={
          <p>
            Doctor wants to check their afternoon → Opens Calendar View (defaults to Today) → Sees a 2-hour gap → Drag-selects the gap and marks it as "Administrative Work" to prevent new online bookings.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Desktop:</strong> Standard grid-based Day/Week/Month views natively supported. Sidebar contains filters.</li>
            <li><strong>Mobile:</strong> Shifts to a vertical agenda/timeline view to fit narrow screens. Complex drag-and-drop is replaced with tap-to-edit modals.</li>
          </ul>
        }
      />

      <SpecCard
        title="List & Timeline Views"
        purpose={
          <p>
            Alternative visual representations of the schedule. The List View is dense and text-heavy (ideal for receptionists), while the Timeline View shows a horizontal Gantt-like chart mapping multiple doctors simultaneously.
          </p>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>List View Data Grid:</strong> Columns: Time, Patient Name, UHID, Doctor, Reason for Visit, Status, Actions.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Timeline View (Horizontal):</strong> Time on the X-axis, Doctors on the Y-axis. Perfect for clinic managers optimizing multi-room usage.</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>View Toggle Segmented Control:</strong> Switch between "Calendar", "List", and "Timeline".</li>
          </ul>
        }
        userFlow={
          <p>
            Clinic Head wants to see resource utilization → Switches to Timeline View → Notices Dr. Sharma is overbooked while Dr. Patel has no appointments → Re-assigns two walk-in patients to Dr. Patel via drag-and-drop across rows.
          </p>
        }
      />

      <SpecCard
        title="Reschedule, Cancel & Follow-Up Workflows"
        purpose={
          <p>
            Handles the lifecycle modifications of an appointment, ensuring audit trails are kept and automated notifications are dispatched to the patient.
          </p>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Reschedule:</strong> Opens a modal to select a new date/time. Automatically triggers SMS/WhatsApp update to patient.</li>
            <li><strong>Cancel:</strong> Prompts for a mandatory cancellation reason (e.g., Patient Request, Doctor Unavailable, No-Show). Determines if refund logic needs to trigger.</li>
            <li><strong>Follow-Up:</strong> One-click action from a completed appointment that duplicates the patient data into a new future slot (e.g., "+ 7 Days").</li>
          </ul>
        }
        userFlow={
          <p>
            Patient calls to say they are stuck in traffic → Receptionist searches patient in List View → Clicks "Reschedule" → Selects a slot 2 hours later → Hits Save → System sends "Your appointment is updated" SMS.
          </p>
        }
      />
    </div>
  );
}
