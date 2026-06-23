import React from 'react';
import { Type, PaintBucket } from 'lucide-react';

export default function FoundationView() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-secondary mb-2">1. Typography System</h2>
        <p className="text-slate-500 mb-8">
          The primary typeface for ClinicOS is <strong>Inter</strong>. It provides excellent legibility for dense healthcare data screens, dashboards, and enterprise applications.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <div className="space-y-8">
            <div className="flex items-center gap-8 border-b border-slate-100 pb-6">
              <div className="w-24 text-sm font-medium text-slate-400">Display (H1)</div>
              <div>
                <div className="text-4xl font-bold text-slate-900 tracking-tight">Click Aarambh ClinicOS</div>
                <div className="text-sm text-slate-500 mt-1">4xl / Bold (700) / Tracking Tight</div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 border-b border-slate-100 pb-6">
              <div className="w-24 text-sm font-medium text-slate-400">Heading (H2)</div>
              <div>
                <div className="text-2xl font-semibold text-slate-900 tracking-tight">Durga Clinic Overview</div>
                <div className="text-sm text-slate-500 mt-1">2xl / Semibold (600) / Tracking Tight</div>
              </div>
            </div>

            <div className="flex items-center gap-8 border-b border-slate-100 pb-6">
              <div className="w-24 text-sm font-medium text-slate-400">Section (H3)</div>
              <div>
                <div className="text-lg font-medium text-slate-900">Recent Patients</div>
                <div className="text-sm text-slate-500 mt-1">lg / Medium (500)</div>
              </div>
            </div>

            <div className="flex items-center gap-8 border-b border-slate-100 pb-6">
              <div className="w-24 text-sm font-medium text-slate-400">Body</div>
              <div className="flex-1 max-w-2xl">
                <div className="text-base font-normal text-slate-700 leading-relaxed">
                  Patient reported mild fever and coughing over the last 48 hours. Prescribed standard
                  antibiotics and recommended rest. Follow-up scheduled for next week.
                </div>
                <div className="text-sm text-slate-500 mt-2">base / Normal (400) / Leading Relaxed</div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="w-24 text-sm font-medium text-slate-400">Small / Meta</div>
              <div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Patient ID: #DOC-8821</div>
                <div className="text-sm text-slate-400 mt-1">sm / Medium (500) / Uppercase / Tracking Wider</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-secondary mb-2">2. Color System</h2>
        <p className="text-slate-500 mb-8">
          The color palette is designed to be accessible, professional, and trustworthy, aligning with modern healthcare software standards like Notion and Linear.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <ColorSwatch name="Primary" hex="#2563EB" colorClass="bg-[#2563EB]" usage="CTAs, Active States, Links" />
          <ColorSwatch name="Secondary" hex="#0F172A" colorClass="bg-[#0F172A]" usage="Sidebar, Headings, Text" lightText />
          <ColorSwatch name="Accent" hex="#14B8A6" colorClass="bg-[#14B8A6]" usage="Highlights, New Features" />
          <ColorSwatch name="Success" hex="#22C55E" colorClass="bg-[#22C55E]" usage="Confirmed Appointments, Savings" />
          <ColorSwatch name="Warning" hex="#F59E0B" colorClass="bg-[#F59E0B]" usage="Pending Approvals, Alerts" />
          <ColorSwatch name="Danger" hex="#EF4444" colorClass="bg-[#EF4444]" usage="Cancellations, Errors, Deletions" />
          <ColorSwatch name="Background" hex="#F8FAFC" colorClass="bg-[#F8FAFC]" usage="Main App Canvas, Body" border />
          <ColorSwatch name="Card / Surface" hex="#FFFFFF" colorClass="bg-[#FFFFFF]" usage="Modals, Cards, Popups" border />
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ name, hex, colorClass, usage, lightText = false, border = false }: {
  name: string, hex: string, colorClass: string, usage: string, lightText?: boolean, border?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <div className={`h-32 w-full ${colorClass} ${border ? 'border-b border-slate-200' : ''}`}></div>
      <div className="p-4 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-slate-900">{name}</span>
          <span className="font-mono text-xs text-slate-500">{hex}</span>
        </div>
        <span className="text-sm text-slate-500">{usage}</span>
      </div>
    </div>
  );
}
