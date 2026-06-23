import React from 'react';

interface SpecCardProps {
  title: string;
  purpose: React.ReactNode;
  widgets?: React.ReactNode;
  tables?: React.ReactNode;
  charts?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  buttons?: React.ReactNode;
  userFlow?: React.ReactNode;
  responsive?: React.ReactNode;
}

export function SpecCard({
  title,
  purpose,
  widgets,
  tables,
  charts,
  filters,
  actions,
  buttons,
  userFlow,
  responsive
}: SpecCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none"></div>
      <h3 className="text-2xl font-bold text-slate-900 mb-6 relative z-10">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Section title="Purpose">{purpose}</Section>
        </div>
        {(widgets || tables || charts) && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 pt-6">
            <Section title="Widgets">{widgets}</Section>
            <Section title="Tables">{tables}</Section>
            <Section title="Charts">{charts}</Section>
          </div>
        )}
        {(filters || actions || buttons) && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 pt-6">
            <Section title="Filters">{filters}</Section>
            <Section title="Actions">{actions}</Section>
            <Section title="Buttons">{buttons}</Section>
          </div>
        )}
        {(userFlow || responsive) && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
            <Section title="User Flow">{userFlow}</Section>
            <Section title="Responsive Design">{responsive}</Section>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</h4>
      <div className="text-slate-700 text-sm leading-relaxed prose prose-slate prose-sm max-w-none">
        {children}
      </div>
    </div>
  );
}
