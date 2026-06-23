import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function OwnerDashboardView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Business Overview</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the primary Clinic Owner dashboards, providing a holistic view of the clinic's daily performance and revenue generation.
        </p>
      </div>

      <SpecCard
        title="Overview Dashboard"
        purpose={
          <p>
            The primary landing page for the Clinic Owner. It acts as the day's pulse check, aggregating critical metrics across appointments, revenue, and staff presence to ensure smooth daily operations.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Today's Bookings:</strong> Total scheduled vs. arrived vs. completed.</li>
            <li><strong>Daily Revenue Expected:</strong> Estimated cash/card collection for the day.</li>
            <li><strong>Staff Present:</strong> Doctors and nurses currently checked-in.</li>
            <li><strong>Pending Reports:</strong> Critical lab/radiology reports awaiting doctor review.</li>
          </ul>
        }
        cards={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Queue Status Card:</strong> Real-time view of current waiting room congestion and average wait times.</li>
            <li><strong>Inventory Alert Card:</strong> Highlights low-stock critical items (e.g., syringes, specific medications).</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Hourly Footfall (Bar Chart):</strong> Patient arrivals mapped by hour to visualize peak times.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Date Selector (Defaults to Today).</li>
            <li>Department/Branch filter (if clinic has multiple internal departments).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Quick-book Emergency Appointment.</li>
            <li>Send broadcast SMS to all staff.</li>
          </ul>
        }
        userFlow={
          <p>
            Owner logs in at 9:00 AM → Checks "Staff Present" to ensure doctors arrived → Reviews "Today's Bookings" to gauge workload → Glances at "Queue Status" to monitor wait times throughout the morning.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Stacked widget cards prioritizing today's urgent metrics. Charts are hidden behind a "View Trends" tap.</li>
            <li><strong>Desktop:</strong> Bento grid layout. All charts, widgets, and live queue status visible simultaneously above the fold.</li>
          </ul>
        }
      />

      <SpecCard
        title="Revenue Dashboard"
        purpose={
          <p>
            Deep dive into the clinic's financial health, tracking income sources, outstanding dues, and departmental profitability.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Total Collections:</strong> Daily/Weekly/Monthly totals.</li>
            <li><strong>Outstanding Dues:</strong> Money owed by patients or insurance companies.</li>
            <li><strong>Top Revenue Source:</strong> Department or treatment bringing in the most income.</li>
            <li><strong>Discounts Given:</strong> Total value of waivers or discounts applied by staff.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Recent Transactions:</strong> Columns: Patient Name, Bill ID, Amount, Payment Method (Cash, Card, UPI), Status, Handled By.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Revenue by Department (Donut Chart):</strong> Shows income split between Consulting, Pharmacy, Lab, etc.</li>
            <li><strong>Income vs. Expenses (Line Chart):</strong> Monthly trend mapping collections against operational costs.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Date Range (This Month, Last Month, Custom Range).</li>
            <li>Payment Method (Filter for cash or digital reconciliation).</li>
            <li>Doctor/Provider (Track revenue generated per doctor).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Export Ledger to Excel/PDF.</li>
            <li>Trigger automated payment reminders for outstanding dues via WhatsApp/SMS.</li>
          </ul>
        }
        userFlow={
          <p>
            Owner opens Revenue tab → Checks "Outstanding Dues" widget → Filters "Recent Transactions" by "Unpaid" → Selects bulk action "Send Reminders" → Reviews the Donut Chart to see which department underperformed this week.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Mobile:</strong> Key revenue metrics grouped at top. Transaction table converts to a list of payment cards.</li>
            <li><strong>Desktop:</strong> Detailed breakdown with side-by-side comparative charts and full transaction ledger filtering.</li>
          </ul>
        }
      />
    </div>
  );
}
