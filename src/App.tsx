import { useState } from 'react';
import { LayoutGrid, Type, Box, MessageSquare, Bell, Search, Menu, Stethoscope, LayoutDashboard, Users, Server, LifeBuoy, Activity, Pill, Receipt, UserPlus, Fingerprint, FileText, CalendarRange, ListTree, MonitorPlay, HeartPulse, Stethoscope as StethoscopeIcon, FileSignature, Wallet, FileSpreadsheet, Undo2, Package, Tags, Truck, PieChart, TrendingUp, BriefcaseMedical, LineChart, HelpCircle, MessageCircle, BookOpen, GraduationCap, ClipboardList, Clock, Phone, FileDigit, CalendarClock, MessageSquareText, Shield, Settings, FileBox } from 'lucide-react';
import OwnerDashboardView from './views/clinic_owner/OwnerDashboardView';
import PatientDirectoryView from './views/patient_management/PatientDirectoryView';
import ApptCalendarView from './views/appointment_management/ApptCalendarView';
import EmrDashboardView from './views/doctor_emr/EmrDashboardView';
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


type Tab = 'co-dashboard' | 'pm-directory' | 'am-calendar' | 'emr-dashboard' | 'bp-dashboard' | 'inv-stock' | 'ea-revenue' | 'sup-dashboard' | 'fd-queue' | 'fd-followups' | 'cl-diagnostics' | 'op-staff' | 'op-attendance' | 'op-tasks' | 'fi-accounts' | 'cm-notifications' | 'cm-patient' | 'ad-reports' | 'ad-audit' | 'ad-settings' | 'sup-knowledge';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('co-dashboard');

  return (
    <div className="h-screen flex bg-background overflow-hidden relative">
      {/* Sidebar Design Implementation */}
      <aside className="w-64 bg-secondary text-slate-300 hidden md:flex flex-col flex-shrink-0 h-full overflow-y-auto custom-scrollbar border-r border-[#1e293b]">
        <div className="p-6 border-b border-white/10 mb-4 bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">DC</span>
            </div>
            <h1 className="text-white font-bold text-xs tracking-wider leading-tight">
              DURGA CLINIC<br/><span className="text-accent font-medium opacity-80">WORKSPACE</span>
            </h1>
          </div>
        </div>

        <div className="flex-1 px-4 space-y-1">
          <nav className="space-y-1 mt-2">
            <SidebarItem 
              icon={<LayoutGrid size={18} />} 
              label="Dashboard" 
              active={activeTab === 'co-dashboard'} 
              onClick={() => setActiveTab('co-dashboard')} 
            />
          </nav>
          
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Front Desk</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<Users size={18} />} 
              label="Patient Database" 
              active={activeTab === 'pm-directory'} 
              onClick={() => setActiveTab('pm-directory')} 
            />
            <SidebarItem 
              icon={<CalendarRange size={18} />} 
              label="Appointments" 
              active={activeTab === 'am-calendar'} 
              onClick={() => setActiveTab('am-calendar')} 
            />
            <SidebarItem 
              icon={<ListTree size={18} />} 
              label="Queue Management" 
              active={activeTab === 'fd-queue'} 
              onClick={() => setActiveTab('fd-queue')} 
            />
            <SidebarItem 
              icon={<Phone size={18} />} 
              label="Follow-up Center" 
              active={activeTab === 'fd-followups'} 
              onClick={() => setActiveTab('fd-followups')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Clinical</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<HeartPulse size={18} />} 
              label="Doctor EMR Console" 
              active={activeTab === 'emr-dashboard'} 
              onClick={() => setActiveTab('emr-dashboard')} 
            />
            <SidebarItem 
              icon={<FileDigit size={18} />} 
              label="Diagnostic Reports" 
              active={activeTab === 'cl-diagnostics'} 
              onClick={() => setActiveTab('cl-diagnostics')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Operations</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<UserPlus size={18} />} 
              label="Staff Management" 
              active={activeTab === 'op-staff'} 
              onClick={() => setActiveTab('op-staff')} 
            />
            <SidebarItem 
              icon={<CalendarClock size={18} />} 
              label="Attendance & Leave" 
              active={activeTab === 'op-attendance'} 
              onClick={() => setActiveTab('op-attendance')} 
            />
            <SidebarItem 
              icon={<ClipboardList size={18} />} 
              label="Task Management" 
              active={activeTab === 'op-tasks'} 
              onClick={() => setActiveTab('op-tasks')} 
            />
            <SidebarItem 
              icon={<Tags size={18} />} 
              label="Inventory & Stock" 
              active={activeTab === 'inv-stock'} 
              onClick={() => setActiveTab('inv-stock')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Finance</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<Wallet size={18} />} 
              label="Billing & Invoicing" 
              active={activeTab === 'bp-dashboard'} 
              onClick={() => setActiveTab('bp-dashboard')} 
            />
            <SidebarItem 
              icon={<Receipt size={18} />} 
              label="Accounts & Expenses" 
              active={activeTab === 'fi-accounts'} 
              onClick={() => setActiveTab('fi-accounts')} 
            />
            <SidebarItem 
              icon={<TrendingUp size={18} />} 
              label="Revenue Reports" 
              active={activeTab === 'ea-revenue'} 
              onClick={() => setActiveTab('ea-revenue')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Communication</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<Bell size={18} />} 
              label="Notification Center" 
              active={activeTab === 'cm-notifications'} 
              onClick={() => setActiveTab('cm-notifications')} 
            />
            <SidebarItem 
              icon={<MessageSquareText size={18} />} 
              label="Patient Communication" 
              active={activeTab === 'cm-patient'} 
              onClick={() => setActiveTab('cm-patient')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Administration</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<FileBox size={18} />} 
              label="Reports Center" 
              active={activeTab === 'ad-reports'} 
              onClick={() => setActiveTab('ad-reports')} 
            />
            <SidebarItem 
              icon={<Shield size={18} />} 
              label="Audit Logs" 
              active={activeTab === 'ad-audit'} 
              onClick={() => setActiveTab('ad-audit')} 
            />
            <SidebarItem 
              icon={<Settings size={18} />} 
              label="Settings" 
              active={activeTab === 'ad-settings'} 
              onClick={() => setActiveTab('ad-settings')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Support</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<BookOpen size={18} />} 
              label="Knowledge Base" 
              active={activeTab === 'sup-knowledge'} 
              onClick={() => setActiveTab('sup-knowledge')} 
            />
            <SidebarItem 
              icon={<HelpCircle size={18} />} 
              label="Helpdesk & Support" 
              active={activeTab === 'sup-dashboard'} 
              onClick={() => setActiveTab('sup-dashboard')} 
            />
          </nav>
        </div>
        
        <div className="mt-auto p-4 flex-shrink-0">
          <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-xs">
                 Dr
               </div>
               <div>
                  <h4 className="text-sm font-bold text-white leading-none">Dr. Alok Mehta</h4>
                  <p className="text-xs text-slate-400 mt-1">Chief Medical Officer</p>
               </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        
        {/* Header Design Implementation */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-900">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 font-medium tracking-tight">
              <span>Durga Clinic</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-bold">
                {activeTab === 'co-dashboard' && 'Dashboard'}
                {activeTab === 'pm-directory' && 'Patient Database'}
                {activeTab === 'am-calendar' && 'Appointments'}
                {activeTab === 'fd-queue' && 'Queue Management'}
                {activeTab === 'fd-followups' && 'Follow-up Center'}
                {activeTab === 'emr-dashboard' && 'Doctor EMR Console'}
                {activeTab === 'cl-diagnostics' && 'Diagnostic Reports'}
                {activeTab === 'op-staff' && 'Staff Management'}
                {activeTab === 'op-attendance' && 'Attendance & Leave'}
                {activeTab === 'op-tasks' && 'Task Management'}
                {activeTab === 'inv-stock' && 'Inventory & Stock'}
                {activeTab === 'bp-dashboard' && 'Billing & Invoicing'}
                {activeTab === 'fi-accounts' && 'Accounts & Expenses'}
                {activeTab === 'ea-revenue' && 'Revenue Reports'}
                {activeTab === 'cm-notifications' && 'Notification Center'}
                {activeTab === 'cm-patient' && 'Patient Communication'}
                {activeTab === 'ad-reports' && 'Reports Center'}
                {activeTab === 'ad-audit' && 'Audit Logs'}
                {activeTab === 'ad-settings' && 'Settings'}
                {activeTab === 'sup-knowledge' && 'Knowledge Base'}
                {activeTab === 'sup-dashboard' && 'Helpdesk & Support'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
              <input 
                type="text" 
                placeholder="Global search... (⌘K)" 
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all w-64"
              />
            </div>
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'co-dashboard' && <OwnerDashboardView />}
            {activeTab === 'pm-directory' && <PatientDirectoryView />}
            {activeTab === 'am-calendar' && <ApptCalendarView />}
            {activeTab === 'fd-queue' && <ApptQueueView />}
            {activeTab === 'fd-followups' && <FollowUpCenterView />}
            {activeTab === 'emr-dashboard' && <EmrDashboardView />}
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
          </div>
        </main>
      </div>
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
