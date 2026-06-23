import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function InvStockView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Stock Ledger & Auditing</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          Detailed specifications for the core stock database, handling diverse medical items from pharmacy drugs to surgical equipment and physical stock auditing workflows.
        </p>
      </div>

      <SpecCard
        title="Master Stock Ledger"
        purpose={
          <p>
            The exhaustive database of all physical items in the clinic. Handles categorization, tracking of individual batches, and pricing metadata.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Barcode / Global Search:</strong> Huge search bar that accepts keyboard input or scanner wedge input instantly.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Inventory Grid:</strong> Columns: Category, Item Description, SKU/Barcode, Manufacturer, Current Stock, Batch Number, Expiry, Cost Price, Sell Price.</li>
          </ul>
        }
        filters={
          <ul className="list-disc pl-4 space-y-1">
            <li>Filter by Category (Medicine, Consumable, Equipment, Dental Material).</li>
            <li>Filter by Manufacturer/Brand.</li>
            <li>Stock Status (In Stock, Out of Stock, Overstocked).</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Edit Item Master Details.</li>
            <li>Print Barcode Labels (Integrates with thermal printers).</li>
            <li>Configure Reorder Levels globally or per item.</li>
          </ul>
        }
        userFlow={
          <p>
            Staff needs to check price of 'Amoxicillin' → Focuses on search bar → Scans physical box with barcode scanner → Grid filters instantly to that exact batch → Staff reads Sell Price.
          </p>
        }
        responsive={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Desktop:</strong> Complex spreadsheet-like view for heavy data management.</li>
            <li><strong>Mobile:</strong> Transforms device camera into a native barcode scanner to quickly pull up an item's details while standing in the stock room.</li>
          </ul>
        }
      />

      <SpecCard
        title="Stock Adjustments & Physical Auditing"
        purpose={
          <p>
            Workflow to handle physical stock taking (reconciliation), registering spillages, breakages, or shrinkage, ensuring the digital ledger matches physical reality.
          </p>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Physical Audit Mode:</strong> System locks purchasing/dispensing for a specific rack/category while staff counts.</li>
            <li><strong>Manual Adjustment:</strong> Interface to log a discrepancy. Prompts for reason (Lost, Damaged, Expired, Found).</li>
          </ul>
        }
        buttons={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Primary:</strong> "Start Audit Batch"</li>
            <li><strong>Secondary:</strong> "Record Breakage/Loss"</li>
          </ul>
        }
        userFlow={
          <p>
            End of quarter audit → Manager starts "Consumables Audit" on tablet → Walks to supply closet → Scans item box → Tablet shows "System: 50". Manager counts "48" → Enters 48 → System logs a "-2" adjustment with reason "Stock Take Adjustment".
          </p>
        }
      />
    </div>
  );
}
