import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function OwnerOperationsView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Operations & HR</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for managing physical clinic inventory, pharmacy stock, and staff attendance tracking.
        </p>
      </div>

      <SpecCard
        title="Inventory Analytics"
        purpose={
          <p>
            Track consumption of medical supplies, manage pharmacy stock levels, identify wastage, and streamline supplier reordering.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Low Stock Alerts:</strong> Count of items below critical threshold.</li>
            <li><strong>Total Inventory Value:</strong> Current monetary value of all stocked goods.</li>
            <li><strong>Expiring Soon:</strong> Medications/supplies expiring within 30-60 days.</li>
            <li><strong>Top Consumed Item:</strong> The fastest-moving inventory item this week.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Stock Ledger:</strong> Columns: Item Name, SKU, Category, Current Quantity, Reorder Level, Supplier, Expiry Date, Status (Okay, Low, Expired).</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Consumption Trend (Line/Area):</strong> Weekly usage of critical supplies (e.g., gloves, specific drugs).</li>
            <li><strong>Stock by Category (Bar):</strong> Value or volume split across Pharmacy, Consumables, Equipment.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Category (Medication, Surgical, Office Supplies).</li>
            <li>Stock Status (In Stock, Low Stock, Out of Stock, Expiring).</li>
            <li>Supplier Name.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Generate Purchase Order (Auto-fills with low stock items).</li>
            <li>Perform Manual Stock Adjustment (for audits/wastage).</li>
            <li>Export Inventory Value Report for accounting.</li>
          </ul>
        }
        userFlow={
          <p>
            Owner receives 'Low Stock' alert notification → Opens Inventory Analytics → Identifies paracetamol and syringes are critically low → Selects items in table → Clicks "Generate Purchase Order" → Reviews PDF and sends to supplier.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Prioritizes alerts and expiring items. Quick swipe actions to approve stock adjustments. Barcode scanner toggle on mobile for quick audits.</li>
            <li><strong>Desktop:</strong> Comprehensive ledger view with bulk selection tools for generating multi-supplier purchase orders.</li>
          </ul>
        }
      />

      <SpecCard
        title="Attendance Analytics"
        purpose={
          <p>
            Monitor real-time staff presence, track historical leave, calculate working hours, and manage shift adherences for payroll processing.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Present Today:</strong> Percentage of scheduled staff currently checked in.</li>
            <li><strong>Late Arrivals:</strong> Number of staff checking in past their grace period.</li>
            <li><strong>On Leave:</strong> Staff on approved time off today.</li>
            <li><strong>Overtime Hours:</strong> Total extra hours logged this week across the clinic.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Daily Attendance Log:</strong> Columns: Employee Name, Department, Shift, Check-in Time, Check-out Time, Total Hours, Status (Present, Late, Absent, Half-day).</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Punctuality Trend (Line Chart):</strong> Percentage of on-time arrivals over the month.</li>
            <li><strong>Resource Utilization (Gantt Chart):</strong> Visualizes shift coverage and overlaps throughout the day.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Date selection.</li>
            <li>Role/Department (Nurses, Front Desk, Doctors).</li>
            <li>Status (Absent, Late).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Approve/Reject Leave Requests.</li>
            <li>Manually adjust incorrect punch-in/punch-out times.</li>
            <li>Export Monthly Timesheet for Payroll (CSV/Excel).</li>
          </ul>
        }
        userFlow={
          <p>
            End of month payroll processing → Owner opens Attendance Analytics → Filters to "Last Month" → Reviews and approves any pending manual time adjustments → Clicks "Export Timesheet" → Forwards CSV to accounting software.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Focus is on immediate situational awareness ("Who is here right now?") and quick approvals of leave requests via push notifications.</li>
            <li><strong>Desktop:</strong> Full calendar UI and complex Gantt charts for shift scheduling and historical timesheet auditing.</li>
          </ul>
        }
      />
    </div>
  );
}
