'use client'

import React, { useEffect } from 'react'
import type { PrescriptionRow, PrescriptionItemRow } from '@/types/emr'

interface PrescriptionPrintViewProps {
  prescription: PrescriptionRow
  items: PrescriptionItemRow[]
  patientName?: string
  doctorName?: string
  clinicName?: string
  advice?: string
  dietaryAdvice?: string
  nextVisit?: string
  onClose: () => void
}

export default function PrescriptionPrintView({
  prescription,
  items,
  patientName,
  doctorName,
  clinicName,
  advice,
  dietaryAdvice,
  nextVisit,
  onClose
}: PrescriptionPrintViewProps) {
  // Auto-open print dialog when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print()
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Print Overlay — hidden on print, backdrop on screen */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center print:hidden"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 print:hidden">
            <h3 className="font-bold text-slate-800">Prescription Preview</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                🖨️ Print / Save as PDF
              </button>
              <button type="button" onClick={onClose} className="px-3 py-2 text-slate-500 hover:text-slate-700 text-sm">Close</button>
            </div>
          </div>
          <div id="prescription-print-area" className="p-8">
            {/* Prescription Content — this is what gets printed */}
            <PrintableContent
              prescription={prescription}
              items={items}
              patientName={patientName}
              doctorName={doctorName}
              clinicName={clinicName}
              advice={advice}
              dietaryAdvice={dietaryAdvice}
              nextVisit={nextVisit}
            />
          </div>
        </div>
      </div>

      {/* Print-only version rendered directly into DOM for @media print */}
      <div className="hidden print:block print-prescription">
        <PrintableContent
          prescription={prescription}
          items={items}
          patientName={patientName}
          doctorName={doctorName}
          clinicName={clinicName}
          advice={advice}
          dietaryAdvice={dietaryAdvice}
          nextVisit={nextVisit}
        />
      </div>

      <style>{`
        @media print {
          body > *:not(.print-prescription) {
            display: none !important;
          }
          .print-prescription {
            display: block !important;
          }
          @page {
            size: A4;
            margin: 20mm;
          }
        }
      `}</style>
    </>
  )
}

function PrintableContent({
  prescription,
  items,
  patientName,
  doctorName,
  clinicName,
  advice,
  dietaryAdvice,
  nextVisit
}: Omit<PrescriptionPrintViewProps, 'onClose'>) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#111', fontSize: '13px', lineHeight: '1.6' }}>
      {/* Letterhead */}
      <div style={{ borderBottom: '3px solid #1d4ed8', paddingBottom: '12px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1d4ed8', margin: 0 }}>
          {clinicName || 'Click Aarambh ClinicOS'}
        </h1>
        <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '12px' }}>
          Electronic Medical Prescription
        </p>
      </div>

      {/* Doctor & Patient Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', gap: '16px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px' }}>Dr. {doctorName || 'Attending Doctor'}</div>
          <div style={{ color: '#64748b', fontSize: '12px' }}>Attending Physician</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Patient: <strong style={{ color: '#111' }}>{patientName || 'Patient'}</strong></div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Date: <strong style={{ color: '#111' }}>{prescription.prescription_date}</strong></div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Rx ID: <strong style={{ color: '#111', fontFamily: 'monospace' }}>{prescription.id.slice(0, 8).toUpperCase()}</strong></div>
        </div>
      </div>

      {/* Rx Symbol */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '28px', fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#1d4ed8', fontWeight: 700 }}>Rx</span>
        <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }} />
      </div>

      {/* Medicines Table */}
      {items.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#eff6ff', borderBottom: '2px solid #bfdbfe' }}>
              <th style={{ textAlign: 'left', padding: '8px', fontSize: '11px', textTransform: 'uppercase', color: '#1d4ed8' }}>#</th>
              <th style={{ textAlign: 'left', padding: '8px', fontSize: '11px', textTransform: 'uppercase', color: '#1d4ed8' }}>Medicine</th>
              <th style={{ textAlign: 'left', padding: '8px', fontSize: '11px', textTransform: 'uppercase', color: '#1d4ed8' }}>Dosage</th>
              <th style={{ textAlign: 'left', padding: '8px', fontSize: '11px', textTransform: 'uppercase', color: '#1d4ed8' }}>Frequency</th>
              <th style={{ textAlign: 'left', padding: '8px', fontSize: '11px', textTransform: 'uppercase', color: '#1d4ed8' }}>Duration</th>
              <th style={{ textAlign: 'left', padding: '8px', fontSize: '11px', textTransform: 'uppercase', color: '#1d4ed8' }}>Instructions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ padding: '8px', color: '#64748b' }}>{i + 1}.</td>
                <td style={{ padding: '8px', fontWeight: 600 }}>{item.medicine_name}</td>
                <td style={{ padding: '8px' }}>{item.dosage || '—'}</td>
                <td style={{ padding: '8px' }}>{item.frequency || '—'}</td>
                <td style={{ padding: '8px' }}>{item.duration || '—'}</td>
                <td style={{ padding: '8px', fontSize: '12px', color: '#475569' }}>
                  {[item.before_after_food, item.route, item.instructions].filter(Boolean).join(', ') || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#94a3b8', fontStyle: 'italic', marginBottom: '20px' }}>No medicines prescribed.</p>
      )}

      {/* Advice Section */}
      {(advice || dietaryAdvice || nextVisit) && (
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '20px' }}>
          {advice && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Advice:</strong> {advice}
            </div>
          )}
          {dietaryAdvice && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Dietary Advice:</strong> {dietaryAdvice}
            </div>
          )}
          {nextVisit && (
            <div>
              <strong>Next Visit:</strong> {nextVisit}
            </div>
          )}
        </div>
      )}

      {/* Signature Area */}
      <div style={{ marginTop: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ textAlign: 'center', minWidth: '180px' }}>
          {prescription.digital_signature ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={prescription.digital_signature}
              alt="Doctor Signature"
              style={{ maxHeight: '60px', marginBottom: '4px', display: 'block', marginLeft: 'auto' }}
            />
          ) : (
            <div style={{ height: '60px', borderBottom: '1px solid #94a3b8', marginBottom: '4px' }} />
          )}
          <div style={{ fontSize: '12px', color: '#475569' }}>Dr. {doctorName || 'Attending Doctor'}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Signature</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '8px', textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>
        This prescription is generated electronically by ClinicOS and is valid without a physical signature where digital signatures are attached.
      </div>
    </div>
  )
}
