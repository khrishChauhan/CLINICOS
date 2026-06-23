import React from 'react';
import { SpecCard } from '../../components/SpecCard';

export default function ExecOperationsView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">Inventory & Operations Analytics</h2>
        <p className="text-slate-500 mb-8 max-w-3xl">
          High-level oversight of supply chain efficiency, capital lockup, and operational bottlenecks.
        </p>
      </div>

      <SpecCard
        title="Inventory Analytics"
        purpose={
          <p>
            Tracks the efficiency of capital tied up in the pharmacy and consumable storage from an executive perspective.
          </p>
        }
        widgets={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Inventory Turnover Ratio:</strong> How many times the clinic sells and replaces its inventory over a year.</li>
            <li><strong>Carrying Cost:</strong> Capital locked in slow-moving stock.</li>
            <li><strong>Wastage %:</strong> Value of expired/damaged stock vs total volume.</li>
          </ul>
        }
        charts={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Stock Out Impact (Line/Bar):</strong> Lost revenue estimated due to critical items being out of stock over time.</li>
            <li><strong>Vendor Performance (Radar):</strong> Comparing suppliers on Delivery Speed, Defect Rate, and Pricing variance.</li>
          </ul>
        }
        tables={
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Top Moving Items vs Margin:</strong> Identifies which fast-moving items drive actual profit vs which are loss leaders.</li>
          </ul>
        }
        actions={
          <ul className="list-disc pl-4 space-y-1">
            <li>Export Supply Chain Audit Report.</li>
          </ul>
        }
      />
    </div>
  );
}
