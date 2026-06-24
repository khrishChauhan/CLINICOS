import React, { useState, useRef, useEffect } from 'react';
import { Building2, LayoutGrid, Type, Box, MessageSquare, Bell, Search, Menu, Stethoscope, LayoutDashboard, Users, Server, LifeBuoy, Activity, Pill, Receipt, UserPlus, Fingerprint, FileText, CalendarRange, ListTree, MonitorPlay, HeartPulse, Stethoscope as StethoscopeIcon, FileSignature, Wallet, FileSpreadsheet, Undo2, Package, Tags, Truck, PieChart, TrendingUp, BriefcaseMedical, LineChart, HelpCircle, MessageCircle, BookOpen, GraduationCap, ClipboardList, Clock, Phone, FileDigit, CalendarClock, MessageSquareText, Shield, Settings, FileBox, ChevronDown, Plus, Star, Zap, History, Database, CheckSquare, Laptop, ToggleLeft, Megaphone, Bug, CreditCard, UserCircle } from 'lucide-react';
import OwnerDashboardView from './views/clinic_owner/OwnerDashboardView';
import PatientDirectoryView from './views/patient_management/PatientDirectoryView';
import ApptCalendarView from './views/appointment_management/ApptCalendarView';
import EmrDashboardView from './views/doctor_emr/EmrDashboardView';
import EmrConsultationView from './views/doctor_emr/EmrConsultationView';
import BillingDashboardView from './views/billing_payments/BillingDashboardView';
import InvStockView from './views/inventory/InvStockView';
import ExecRevenueView from './views/executive_analytics/ExecRevenueView';
import SupportDashboardView from './views/support/SupportDashboardView';

import ApptQueueView from './views/appointment_management/ApptQueueView';
import FollowUpCenterView from './views/appointment_management/FollowUpCenterView';
import DiagnosticReportsView from './views/doctor_emr/DiagnosticReportsView';
import StaffManagementView from './views/operations/StaffManagementView';
import AttendanceLeaveView from './views/operations/AttendanceLeaveView';
import TaskManagementView from './views/operations/TaskManagementView';
import AccountsExpensesView from './views/finance/AccountsExpensesView';
import NotificationCenterView from './views/communication/NotificationCenterView';
import PatientCommView from './views/communication/PatientCommView';
import ReportsCenterView from './views/administration/ReportsCenterView';
import AuditLogsView from './views/administration/AuditLogsView';
import SettingsView from './views/administration/SettingsView';
import KnowledgeBaseView from './views/support/KnowledgeBaseView';

import LoginView, { Role } from './views/LoginView';
import DynamicTabRenderer from './views/DynamicTabRenderer';

type Tab = 
  // Owner
  'co-dashboard' | 'pm-directory' | 'am-calendar' | 'emr-dashboard' | 'bp-dashboard' | 'inv-stock' | 'ea-revenue' | 'sup-dashboard' | 'fd-queue' | 'fd-followups' | 'cl-diagnostics' | 'op-staff' | 'op-attendance' | 'op-tasks' | 'fi-accounts' | 'cm-notifications' | 'cm-patient' | 'ad-reports' | 'ad-audit' | 'ad-settings' | 'sup-knowledge' |
  // Super Admin
  'sa-dashboard' | 'sa-clinics' | 'sa-subscriptions' | 'sa-revenue' | 'sa-users' | 'sa-features' | 'sa-monitoring' | 'sa-backups' | 'sa-errors' | 'sa-announcements' |
  // Receptionist
  'rc-dashboard' |
  // Doctor
  'dr-dashboard' | 'dr-prescriptions' | 'emr-consultation' |
  // Nurse
  'nr-dashboard' | 'nr-vitals' | 'nr-procedures' | 'nr-monitoring' | 'nr-medication' |
  // Accountant
  'ac-dashboard' | 'ac-payments' | 'ac-gst' |
  // Inventory
  'iv-dashboard' | 'iv-vendors' | 'iv-purchases' | 'iv-alerts' | 'iv-expiry' |
  // Support
  'sp-dashboard' | 'sp-tickets' | 'sp-remote' | 'sp-features' | 'sp-training' |
  // Patient
  'pt-dashboard' | 'pt-appointments' | 'pt-reports' | 'pt-prescriptions' | 'pt-payments' | 'pt-profile';

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('co-dashboard');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showClinicSwitcher, setShowClinicSwitcher] = useState(false);

  // Set default tab when role changes
  useEffect(() => {
    if (role === 'superadmin') setActiveTab('sa-dashboard');
    if (role === 'owner') setActiveTab('co-dashboard');
    if (role === 'receptionist') setActiveTab('rc-dashboard');
    if (role === 'doctor') setActiveTab('dr-dashboard');
    if (role === 'nurse') setActiveTab('nr-dashboard');
    if (role === 'accountant') setActiveTab('ac-dashboard');
    if (role === 'inventory') setActiveTab('iv-dashboard');
    if (role === 'support') setActiveTab('sp-dashboard');
    if (role === 'patient') setActiveTab('pt-dashboard');
  }, [role]);

  if (!role) {
    return <LoginView onLogin={setRole} />;
  }

  const renderSidebarLinks = () => {
    switch (role) {
      case 'superadmin':
        return (
          <>
            <SidebarSection title="Platform Operations" />
            <SidebarItem icon={<LayoutDashboard size={18} />} label="SaaS Dashboard" active={activeTab === 'sa-dashboard'} onClick={() => setActiveTab('sa-dashboard')} />
            <SidebarItem icon={<Building2 size={18} />} label="Clinics" active={activeTab === 'sa-clinics'} onClick={() => setActiveTab('sa-clinics')} />
            <SidebarItem icon={<CreditCard size={18} />} label="Subscriptions" active={activeTab === 'sa-subscriptions'} onClick={() => setActiveTab('sa-subscriptions')} />
            <SidebarItem icon={<TrendingUp size={18} />} label="Platform Revenue" active={activeTab === 'sa-revenue'} onClick={() => setActiveTab('sa-revenue')} />
            <SidebarItem icon={<Users size={18} />} label="User Management" active={activeTab === 'sa-users'} onClick={() => setActiveTab('sa-users')} />
            
            <SidebarSection title="System Engineering" />
            <SidebarItem icon={<MonitorPlay size={18} />} label="Monitoring & Health" active={activeTab === 'sa-monitoring'} onClick={() => setActiveTab('sa-monitoring')} />
            <SidebarItem icon={<Database size={18} />} label="Database Backups" active={activeTab === 'sa-backups'} onClick={() => setActiveTab('sa-backups')} />
            <SidebarItem icon={<Shield size={18} />} label="Audit Logs" active={activeTab === 'ad-audit'} onClick={() => setActiveTab('ad-audit')} />
            <SidebarItem icon={<Bug size={18} />} label="Error Logs" active={activeTab === 'sa-errors'} onClick={() => setActiveTab('sa-errors')} />
            
            <SidebarSection title="Configuration" />
            <SidebarItem icon={<ToggleLeft size={18} />} label="Feature Flags" active={activeTab === 'sa-features'} onClick={() => setActiveTab('sa-features')} />
            <SidebarItem icon={<Megaphone size={18} />} label="Announcements" active={activeTab === 'sa-announcements'} onClick={() => setActiveTab('sa-announcements')} />
            <SidebarItem icon={<Settings size={18} />} label="Global Settings" active={activeTab === 'ad-settings'} onClick={() => setActiveTab('ad-settings')} />
          </>
        );
      case 'owner':
        return (
          <>
            <SidebarItem icon={<LayoutGrid size={18} />} label="Command Center" active={activeTab === 'co-dashboard'} onClick={() => setActiveTab('co-dashboard')} />
            <SidebarSection title="Analytics" />
            <SidebarItem icon={<TrendingUp size={18} />} label="Revenue Reports" active={activeTab === 'ea-revenue'} onClick={() => setActiveTab('ea-revenue')} />
            <SidebarItem icon={<PieChart size={18} />} label="Reports Center" active={activeTab === 'ad-reports'} onClick={() => setActiveTab('ad-reports')} />
            <SidebarSection title="Operations" />
            <SidebarItem icon={<UserPlus size={18} />} label="Doctors & Staff" active={activeTab === 'op-staff'} onClick={() => setActiveTab('op-staff')} />
            <SidebarItem icon={<Users size={18} />} label="Patient Database" active={activeTab === 'pm-directory'} onClick={() => setActiveTab('pm-directory')} />
            <SidebarItem icon={<CalendarRange size={18} />} label="Appointments" active={activeTab === 'am-calendar'} onClick={() => setActiveTab('am-calendar')} />
            <SidebarItem icon={<CalendarClock size={18} />} label="Attendance & Leave" active={activeTab === 'op-attendance'} onClick={() => setActiveTab('op-attendance')} />
            <SidebarSection title="Finance & Inventory" />
            <SidebarItem icon={<Wallet size={18} />} label="Billing & Invoicing" active={activeTab === 'bp-dashboard'} onClick={() => setActiveTab('bp-dashboard')} />
            <SidebarItem icon={<Receipt size={18} />} label="Accounts & Expenses" active={activeTab === 'fi-accounts'} onClick={() => setActiveTab('fi-accounts')} />
            <SidebarItem icon={<Tags size={18} />} label="Inventory & Stock" active={activeTab === 'inv-stock'} onClick={() => setActiveTab('inv-stock')} />
            <SidebarSection title="System" />
            <SidebarItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'ad-settings'} onClick={() => setActiveTab('ad-settings')} />
          </>
        );
      case 'receptionist':
        return (
          <>
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Front Desk Hub" active={activeTab === 'rc-dashboard'} onClick={() => setActiveTab('rc-dashboard')} />
            <SidebarSection title="Daily Operations" />
            <SidebarItem icon={<ListTree size={18} />} label="Live Queue" active={activeTab === 'fd-queue'} onClick={() => setActiveTab('fd-queue')} />
            <SidebarItem icon={<CalendarRange size={18} />} label="Appointments" active={activeTab === 'am-calendar'} onClick={() => setActiveTab('am-calendar')} />
            <SidebarItem icon={<Users size={18} />} label="Patient Database" active={activeTab === 'pm-directory'} onClick={() => setActiveTab('pm-directory')} />
            <SidebarItem icon={<Phone size={18} />} label="Follow-Ups" active={activeTab === 'fd-followups'} onClick={() => setActiveTab('fd-followups')} />
            <SidebarSection title="Billing & Comms" />
            <SidebarItem icon={<Wallet size={18} />} label="Billing" active={activeTab === 'bp-dashboard'} onClick={() => setActiveTab('bp-dashboard')} />
            <SidebarItem icon={<Bell size={18} />} label="Notifications" active={activeTab === 'cm-notifications'} onClick={() => setActiveTab('cm-notifications')} />
          </>
        );
      case 'doctor':
        return (
          <>
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Doctor Dashboard" active={activeTab === 'dr-dashboard'} onClick={() => setActiveTab('dr-dashboard')} />
            <SidebarSection title="Clinical" />
            <SidebarItem icon={<CalendarRange size={18} />} label="Today's Schedule" active={activeTab === 'am-calendar'} onClick={() => setActiveTab('am-calendar')} />
            <SidebarItem icon={<HeartPulse size={18} />} label="EMR Console" active={activeTab === 'emr-dashboard'} onClick={() => setActiveTab('emr-dashboard')} />
            <SidebarItem icon={<FileSignature size={18} />} label="Prescriptions" active={activeTab === 'dr-prescriptions'} onClick={() => setActiveTab('dr-prescriptions')} />
            <SidebarItem icon={<FileDigit size={18} />} label="Diagnostic Reports" active={activeTab === 'cl-diagnostics'} onClick={() => setActiveTab('cl-diagnostics')} />
            <SidebarSection title="Patients" />
            <SidebarItem icon={<Users size={18} />} label="My Patients" active={activeTab === 'pm-directory'} onClick={() => setActiveTab('pm-directory')} />
            <SidebarItem icon={<Phone size={18} />} label="Follow-Ups" active={activeTab === 'fd-followups'} onClick={() => setActiveTab('fd-followups')} />
          </>
        );
      case 'nurse':
        return (
          <>
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Nursing Station" active={activeTab === 'nr-dashboard'} onClick={() => setActiveTab('nr-dashboard')} />
            <SidebarSection title="Care Operations" />
            <SidebarItem icon={<Activity size={18} />} label="Vitals & Triage" active={activeTab === 'nr-vitals'} onClick={() => setActiveTab('nr-vitals')} />
            <SidebarItem icon={<StethoscopeIcon size={18} />} label="Procedures" active={activeTab === 'nr-procedures'} onClick={() => setActiveTab('nr-procedures')} />
            <SidebarItem icon={<MonitorPlay size={18} />} label="Patient Monitoring" active={activeTab === 'nr-monitoring'} onClick={() => setActiveTab('nr-monitoring')} />
            <SidebarItem icon={<Pill size={18} />} label="Medication Logs" active={activeTab === 'nr-medication'} onClick={() => setActiveTab('nr-medication')} />
            <SidebarSection title="Patient Context" />
            <SidebarItem icon={<Users size={18} />} label="Patient Directory" active={activeTab === 'pm-directory'} onClick={() => setActiveTab('pm-directory')} />
          </>
        );
      case 'accountant':
        return (
          <>
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Finance Dashboard" active={activeTab === 'ac-dashboard'} onClick={() => setActiveTab('ac-dashboard')} />
            <SidebarSection title="Receivables" />
            <SidebarItem icon={<Wallet size={18} />} label="Invoices & Billing" active={activeTab === 'bp-dashboard'} onClick={() => setActiveTab('bp-dashboard')} />
            <SidebarItem icon={<CreditCard size={18} />} label="Payments" active={activeTab === 'ac-payments'} onClick={() => setActiveTab('ac-payments')} />
            <SidebarSection title="Payables & Core" />
            <SidebarItem icon={<Receipt size={18} />} label="Expenses" active={activeTab === 'fi-accounts'} onClick={() => setActiveTab('fi-accounts')} />
            <SidebarItem icon={<TrendingUp size={18} />} label="Revenue Reports" active={activeTab === 'ea-revenue'} onClick={() => setActiveTab('ea-revenue')} />
            <SidebarItem icon={<FileSpreadsheet size={18} />} label="GST Reports" active={activeTab === 'ac-gst'} onClick={() => setActiveTab('ac-gst')} />
          </>
        );
      case 'inventory':
        return (
          <>
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Inventory Hub" active={activeTab === 'iv-dashboard'} onClick={() => setActiveTab('iv-dashboard')} />
            <SidebarSection title="Stock Management" />
            <SidebarItem icon={<Pill size={18} />} label="Medicines & Items" active={activeTab === 'inv-stock'} onClick={() => setActiveTab('inv-stock')} />
            <SidebarItem icon={<Truck size={18} />} label="Vendors" active={activeTab === 'iv-vendors'} onClick={() => setActiveTab('iv-vendors')} />
            <SidebarItem icon={<Package size={18} />} label="Purchases (PO)" active={activeTab === 'iv-purchases'} onClick={() => setActiveTab('iv-purchases')} />
            <SidebarSection title="Alerts & Tracking" />
            <SidebarItem icon={<Bell size={18} />} label="Stock Alerts" active={activeTab === 'iv-alerts'} onClick={() => setActiveTab('iv-alerts')} />
            <SidebarItem icon={<CalendarClock size={18} />} label="Expiry Tracking" active={activeTab === 'iv-expiry'} onClick={() => setActiveTab('iv-expiry')} />
          </>
        );
      case 'support':
        return (
          <>
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Support Hub" active={activeTab === 'sp-dashboard'} onClick={() => setActiveTab('sp-dashboard')} />
            <SidebarSection title="Service Desk" />
            <SidebarItem icon={<LifeBuoy size={18} />} label="Active Tickets" active={activeTab === 'sp-tickets'} onClick={() => setActiveTab('sp-tickets')} />
            <SidebarItem icon={<HelpCircle size={18} />} label="Helpdesk Console" active={activeTab === 'sup-dashboard'} onClick={() => setActiveTab('sup-dashboard')} />
            <SidebarItem icon={<Laptop size={18} />} label="Remote Sessions" active={activeTab === 'sp-remote'} onClick={() => setActiveTab('sp-remote')} />
            <SidebarSection title="Feedback & Content" />
            <SidebarItem icon={<Star size={18} />} label="Feature Requests" active={activeTab === 'sp-features'} onClick={() => setActiveTab('sp-features')} />
            <SidebarItem icon={<GraduationCap size={18} />} label="Training Requests" active={activeTab === 'sp-training'} onClick={() => setActiveTab('sp-training')} />
            <SidebarItem icon={<BookOpen size={18} />} label="Knowledge Base" active={activeTab === 'sup-knowledge'} onClick={() => setActiveTab('sup-knowledge')} />
          </>
        );
      case 'patient':
        return (
          <>
            <SidebarItem icon={<LayoutDashboard size={18} />} label="My Health Hub" active={activeTab === 'pt-dashboard'} onClick={() => setActiveTab('pt-dashboard')} />
            <SidebarSection title="Care & Records" />
            <SidebarItem icon={<CalendarRange size={18} />} label="Appointments" active={activeTab === 'pt-appointments'} onClick={() => setActiveTab('pt-appointments')} />
            <SidebarItem icon={<FileDigit size={18} />} label="Lab Reports" active={activeTab === 'pt-reports'} onClick={() => setActiveTab('pt-reports')} />
            <SidebarItem icon={<FileSignature size={18} />} label="Prescriptions" active={activeTab === 'pt-prescriptions'} onClick={() => setActiveTab('pt-prescriptions')} />
            <SidebarSection title="Account" />
            <SidebarItem icon={<Wallet size={18} />} label="Payments & Bills" active={activeTab === 'pt-payments'} onClick={() => setActiveTab('pt-payments')} />
            <SidebarItem icon={<UserCircle size={18} />} label="My Profile" active={activeTab === 'pt-profile'} onClick={() => setActiveTab('pt-profile')} />
          </>
        );
      default:
        return null;
    }
  };

  const getProfileInfo = () => {
    switch (role) {
      case 'superadmin': return { name: 'Admin System', role: 'Super Admin', initials: 'SA' };
      case 'owner': return { name: 'Dr. Alok Mehta', role: 'Clinic Owner', initials: 'AM' };
      case 'receptionist': return { name: 'Anita Patel', role: 'Front Desk Lead', initials: 'AP' };
      case 'doctor': return { name: 'Dr. Sarah Smith', role: 'Senior Physician', initials: 'SS' };
      case 'nurse': return { name: 'Ravi Teja', role: 'Head Nurse', initials: 'RT' };
      case 'accountant': return { name: 'Sanjay Gupta', role: 'Billing Specialist', initials: 'SG' };
      case 'inventory': return { name: 'Priya Sharma', role: 'Pharmacy Head', initials: 'PS' };
      case 'support': return { name: 'Agent 042', role: 'Platform Support', initials: '42' };
      case 'patient': return { name: 'Rahul Sharma', role: 'Patient', initials: 'RS' };
      default: return { name: 'User', role: 'Role', initials: 'U' };
    }
  };

  const profile = getProfileInfo();

  return (
    <div className="h-screen flex bg-background overflow-hidden relative">
      <aside className="w-64 bg-secondary text-slate-300 hidden md:flex flex-col flex-shrink-0 h-full overflow-y-auto custom-scrollbar border-r border-[#1e293b]">
        <div className="p-6 border-b border-white/10 mb-4 bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-white font-bold text-xs tracking-wider leading-tight">
              CLICK AARAMBH<br/>
              <span className="text-accent font-medium opacity-80">
                {role === 'superadmin' ? 'CLINICOS HQ' : role === 'patient' ? 'PATIENT PORTAL' : 'DURGA CLINIC'}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex-1 px-4 space-y-1">
          {renderSidebarLinks()}
        </div>
        
        <div className="mt-auto p-4 flex-shrink-0">
          <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-slate-800 transition-colors relative" onClick={() => setShowProfile(!showProfile)}>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-xs">
                   {profile.initials}
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-white leading-none">{profile.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{profile.role}</p>
                 </div>
               </div>
               <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            {showProfile && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2"><UserCircle className="w-4 h-4" /> My Profile</button>
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2"><Settings className="w-4 h-4" /> Account Settings</button>
                  <div className="h-px bg-slate-800 my-1"></div>
                  <button onClick={() => setRole(null)} className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2"><Undo2 className="w-4 h-4" /> Sign Out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        
        {/* Header Design Implementation */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-900">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center relative">
               <button 
                 onClick={() => setShowClinicSwitcher(!showClinicSwitcher)}
                 className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200"
               >
                 {role === 'superadmin' ? 'Global Command Center' : role === 'patient' ? 'Durga Clinic - Main' : 'Durga Clinic - Main Branch'}
                 <ChevronDown className="w-4 h-4 text-slate-400" />
               </button>

               {showClinicSwitcher && (
                 <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                   <div className="p-2 space-y-1">
                     <button className="w-full text-left px-3 py-2 text-sm text-slate-900 font-medium bg-indigo-50/50 text-indigo-700 rounded-md flex items-center justify-between">
                       <span>{role === 'superadmin' ? 'Global View' : 'Durga Clinic - Main Branch'}</span>
                       <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                     </button>
                     {role !== 'superadmin' && role !== 'patient' && (
                       <button className="w-full text-left px-3 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 rounded-md transition-colors flex items-center justify-between">
                         <span>Durga Clinic - South Wing</span>
                       </button>
                     )}
                   </div>
                 </div>
               )}
            </div>

            <div className="hidden lg:flex items-center gap-2 ml-4 px-4 border-l border-slate-200 text-sm text-slate-500 font-medium tracking-tight">
              <span className="text-slate-900 font-bold capitalize">
                {activeTab.replace(/^[a-z]+-/, '').replace('-', ' ')}
              </span>
              <button className="text-slate-400 hover:text-amber-500 ml-2"><Star className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <div 
                className="flex items-center bg-slate-100/80 hover:bg-slate-100 border border-slate-200/50 rounded-full px-3 py-1.5 w-64 cursor-text transition-colors"
                onClick={() => setShowSearch(true)}
              >
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <span className="text-xs text-slate-400 flex-1">Global search...</span>
                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 rounded uppercase tracking-wider">⌘K</span>
              </div>

              {showSearch && (
                <>
                  <div className="fixed inset-0 bg-slate-900/20 z-40" onClick={() => setShowSearch(false)}></div>
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-slate-100">
                       <input autoFocus type="text" placeholder="Search across ClinicOS..." className="w-full text-sm font-medium focus:outline-none placeholder:font-normal" />
                    </div>
                    <div className="p-2">
                       <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Searches</div>
                       <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-2"><History className="w-4 h-4 text-slate-400" /> Patient: Rahul Sharma</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            {role !== 'patient' && role !== 'superadmin' && (
              <div className="relative">
                <button 
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create</span>
                </button>
                
                {showQuickActions && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowQuickActions(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="p-2 space-y-1">
                        <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-md transition-colors flex items-center gap-2 font-medium"><CalendarRange className="w-4 h-4" /> New Appointment</button>
                        <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-md transition-colors flex items-center gap-2 font-medium"><UserPlus className="w-4 h-4" /> Register Patient</button>
                        <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-md transition-colors flex items-center gap-2 font-medium"><FileSignature className="w-4 h-4" /> Write Prescription</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white box-content"></span>
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
               <>
                 <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                 <div className="absolute top-full right-4 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                   <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                     <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                     <button className="text-xs text-indigo-600 font-medium">Mark all read</button>
                   </div>
                   <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                     <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer bg-blue-50/30">
                       <p className="text-xs font-bold text-slate-900 mb-0.5">System Update</p>
                       <p className="text-xs text-slate-600">New features have been deployed.</p>
                       <p className="text-[10px] text-slate-400 mt-1">10 mins ago</p>
                     </div>
                   </div>
                 </div>
               </>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Existing views... */}
            {activeTab === 'co-dashboard' && <OwnerDashboardView />}
            {activeTab === 'pm-directory' && <PatientDirectoryView />}
            {activeTab === 'am-calendar' && <ApptCalendarView />}
            {activeTab === 'fd-queue' && <ApptQueueView />}
            {activeTab === 'fd-followups' && <FollowUpCenterView />}
            {activeTab === 'emr-dashboard' && <EmrDashboardView setActiveTab={setActiveTab} />}
            {activeTab === 'emr-consultation' && <EmrConsultationView />}
            {activeTab === 'cl-diagnostics' && <DiagnosticReportsView />}
            {activeTab === 'op-staff' && <StaffManagementView />}
            {activeTab === 'op-attendance' && <AttendanceLeaveView />}
            {activeTab === 'op-tasks' && <TaskManagementView />}
            {activeTab === 'inv-stock' && <InvStockView />}
            {activeTab === 'bp-dashboard' && <BillingDashboardView />}
            {activeTab === 'fi-accounts' && <AccountsExpensesView />}
            {activeTab === 'ea-revenue' && <ExecRevenueView />}
            {activeTab === 'cm-notifications' && <NotificationCenterView />}
            {activeTab === 'cm-patient' && <PatientCommView />}
            {activeTab === 'ad-reports' && <ReportsCenterView />}
            {activeTab === 'ad-audit' && <AuditLogsView />}
            {activeTab === 'ad-settings' && <SettingsView />}
            {activeTab === 'sup-knowledge' && <KnowledgeBaseView />}
            {activeTab === 'sup-dashboard' && <SupportDashboardView />}
            
            {/* Catch-all for views that don't exist yet but need to look real */}
            {![
              'co-dashboard', 'pm-directory', 'am-calendar', 'fd-queue', 'fd-followups', 
              'emr-dashboard', 'emr-consultation', 'cl-diagnostics', 'op-staff', 'op-attendance', 'op-tasks',
              'inv-stock', 'bp-dashboard', 'fi-accounts', 'ea-revenue', 'cm-notifications',
              'cm-patient', 'ad-reports', 'ad-audit', 'ad-settings', 'sup-knowledge', 'sup-dashboard'
            ].includes(activeTab) && (
              <DynamicTabRenderer activeTab={activeTab} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarSection({ title }: { title: string }) {
  return (
    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">
      {title}
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors font-medium ${
        active 
          ? 'bg-primary text-white shadow-sm' 
          : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
