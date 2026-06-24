import React, { useState } from 'react';
import { 
  Building2, Users, HeartPulse, Stethoscope, 
  Pill, Receipt, PhoneCall, ShieldCheck, UserCircle,
  ArrowRight, Lock, Mail, Activity, Stethoscope as StethoscopeIcon
} from 'lucide-react';

export type Role = 'superadmin' | 'owner' | 'receptionist' | 'doctor' | 'nurse' | 'accountant' | 'inventory' | 'support' | 'patient';

interface LoginViewProps {
  onLogin: (role: Role) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles: { id: Role, name: string, icon: any, desc: string, color: string, bg: string }[] = [
    { id: 'superadmin', name: 'Super Admin', icon: ShieldCheck, desc: 'SaaS Platform Management', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
    { id: 'owner', name: 'Clinic Owner', icon: Building2, desc: 'Executive Analytics & Ops', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
    { id: 'receptionist', name: 'Receptionist', icon: PhoneCall, desc: 'Front Desk & Appointments', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { id: 'doctor', name: 'Doctor', icon: StethoscopeIcon, desc: 'EMR & Consultations', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { id: 'nurse', name: 'Nurse', icon: HeartPulse, desc: 'Vitals & Patient Monitoring', color: 'text-pink-600', bg: 'bg-pink-50 border-pink-200' },
    { id: 'accountant', name: 'Accountant', icon: Receipt, desc: 'Billing, Invoices & Accounts', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { id: 'inventory', name: 'Inventory Manager', icon: Pill, desc: 'Pharmacy & Stock Control', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200' },
    { id: 'support', name: 'Support Agent', icon: Users, desc: 'Helpdesk & Ticketing', color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200' },
    { id: 'patient', name: 'Patient Portal', icon: UserCircle, desc: 'Personal Health Records', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setIsLoading(true);
    setTimeout(() => {
      onLogin(selectedRole);
    }, 800); // Simulate network request
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/3 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Click Aarambh</h1>
              <p className="text-xs text-indigo-300 font-medium tracking-widest uppercase">ClinicOS Enterprise</p>
            </div>
          </div>
          
          <div className="space-y-6 max-w-sm">
            <h2 className="text-4xl font-bold text-white leading-tight">
              The complete operating system for modern clinics.
            </h2>
            <p className="text-slate-400 text-lg">
              Manage appointments, patient records, billing, and inventory all in one unified platform.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm font-medium">
          &copy; 2026 Click Aarambh Ventures.<br/>All rights reserved.
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl"></div>
      </div>

      {/* Right side - Login */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="max-w-2xl w-full mx-auto space-y-8">
          
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Click Aarambh</h1>
              <p className="text-xs text-indigo-600 font-medium tracking-widest uppercase">ClinicOS</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome to the Demo</h2>
            <p className="text-slate-500">Select a role to preview their dedicated workspace experience.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <div 
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 relative overflow-hidden group ${
                      isSelected 
                        ? `border-indigo-600 shadow-md ${role.bg}` 
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-l-[32px] border-t-indigo-600 border-l-transparent"></div>
                    )}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${isSelected ? 'bg-white shadow-sm' : role.bg}`}>
                      <Icon className={`w-5 h-5 ${role.color}`} />
                    </div>
                    <h3 className={`font-bold text-sm mb-1 ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                      {role.name}
                    </h3>
                    <p className={`text-xs ${isSelected ? 'text-indigo-700/80' : 'text-slate-500'}`}>
                      {role.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {selectedRole && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-400" /> Demo Credentials
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={`demo@${selectedRole}.clinic.os`}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter '123' to login"
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Sign In as {roles.find(r => r.id === selectedRole)?.name}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}
