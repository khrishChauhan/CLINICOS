import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-blue-600/10 rounded-b-[100%] blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-600/20 mb-6">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Click Aarambh</h1>
          <p className="text-slate-500 font-medium mt-2">ClinicOS Management Platform</p>
        </div>
        
        {children}
      </div>
    </div>
  );
}
