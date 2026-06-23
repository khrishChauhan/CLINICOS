import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function InvDashboardView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Inventory Dashboard</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the primary Inventory Command Center, focusing on immediate alerts, expiring items, and overall stock valuation.
        </p>
      </div>

      <SpecCard
        title="Inventory Command Center"
        purpose={
          <p>
            The day-to-day landing page for the pharmacist or inventory manager. Highlights immediate risks (expiring soon, out of stock) and gives a high-level view of capital tied up in inventory.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Total Inventory Value:</strong> Capital currently held in physical stock.</li>
            <li><strong>Critical Low Stock:</strong> Count of SKUs that have breached their minimum reorder point.</li>
            <li><strong>Expiring Within 30 Days:</strong> Count and value of items about to expire, requiring immediate clearance or return.</li>
            <li><strong>Pending Deliveries:</strong> Purchase orders issued but goods not yet received.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Urgent Action Items:</strong> A combined list of the most critically low / expiring items. Columns: Item Name, SKU, Issue (Low Stock / Expiring), Current Qty, Action.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Stock Value Distribution (Donut Chart):</strong> Breakdown of inventory value by category (Pharmacy, Consumables, Equipment).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>One-click "Generate Urgent PO" for critically low items.</li>
            <li>Mass discount / Mark as wastage for expiring items.</li>
          </ul>
        }
        userFlow={
          <p>
            Pharmacist logs in → Dashboard shows 5 items "Expiring &lt; 30 Days" → Pharmacist reviews the block → Marks 2 items to return to vendor, flags 3 for immediate dispensing priority.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Desktop:</strong> Bento grid layout ensuring value distribution charts and urgent action table are visible simultaneously.</li>
            <li><strong>Mobile:</strong> Simplified top metric cards followed by the Urgent Action list. Swipe gestures to acknowledge and dismiss non-critical alerts.</li>
          </ul>
        }
      />
    </div>
  );
}
