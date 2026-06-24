import { useState, useRef, useEffect } from 'react';
import { LayoutGrid, Type, Box, MessageSquare, Bell, Search, Menu, Stethoscope, LayoutDashboard, Users, Server, LifeBuoy, Activity, Pill, Receipt, UserPlus, Fingerprint, FileText, CalendarRange, ListTree, MonitorPlay, HeartPulse, Stethoscope as StethoscopeIcon, FileSignature, Wallet, FileSpreadsheet, Undo2, Package, Tags, Truck, PieChart, TrendingUp, BriefcaseMedical, LineChart, HelpCircle, MessageCircle, BookOpen, GraduationCap, ClipboardList, Clock, Phone, FileDigit, CalendarClock, MessageSquareText, Shield, Settings, FileBox, ChevronDown, Plus, Star, Zap, History } from 'lucide-react';
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
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showClinicSwitcher, setShowClinicSwitcher] = useState(false);

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
              label="Command Center" 
              active={activeTab === 'co-dashboard'} 
              onClick={() => setActiveTab('co-dashboard')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4 flex items-center gap-2">
             <Star className="w-3 h-3 text-amber-500" /> Favorites
          </div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<CalendarRange size={18} />} 
              label="Appointments" 
              active={activeTab === 'am-calendar'} 
              onClick={() => setActiveTab('am-calendar')} 
            />
            <SidebarItem 
              icon={<Users size={18} />} 
              label="Patient Database" 
              active={activeTab === 'pm-directory'} 
              onClick={() => setActiveTab('pm-directory')} 
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
          <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-slate-800 transition-colors relative" onClick={() => setShowProfile(!showProfile)}>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-xs">
                   Dr
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-white leading-none">Dr. Alok Mehta</h4>
                    <p className="text-xs text-slate-400 mt-1">Chief Medical Officer</p>
                 </div>
               </div>
               <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            {showProfile && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2"><UserPlus className="w-4 h-4" /> My Profile</button>
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2"><Settings className="w-4 h-4" /> Account Settings</button>
                  <div className="h-px bg-slate-800 my-1"></div>
                  <button className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2"><Undo2 className="w-4 h-4" /> Sign Out</button>
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
                 Durga Clinic - Main Branch
                 <ChevronDown className="w-4 h-4 text-slate-400" />
               </button>

               {showClinicSwitcher && (
                 <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                   <div className="p-2 space-y-1">
                     <button className="w-full text-left px-3 py-2 text-sm text-slate-900 font-medium bg-indigo-50/50 text-indigo-700 rounded-md flex items-center justify-between">
                       <span>Durga Clinic - Main Branch</span>
                       <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                     </button>
                     <button className="w-full text-left px-3 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 rounded-md transition-colors flex items-center justify-between">
                       <span>Durga Clinic - South Wing</span>
                     </button>
                   </div>
                   <div className="p-2 border-t border-slate-100 bg-slate-50">
                     <button className="w-full text-left px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider flex items-center gap-2">
                       <Plus className="w-3 h-3" /> Add New Clinic
                     </button>
                   </div>
                 </div>
               )}
            </div>

            <div className="hidden lg:flex items-center gap-2 ml-4 px-4 border-l border-slate-200 text-sm text-slate-500 font-medium tracking-tight">
              <span className="text-slate-900 font-bold">
                {activeTab === 'co-dashboard' && 'Command Center'}
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
                       <input autoFocus type="text" placeholder="Search patients, doctors, appointments..." className="w-full text-sm font-medium focus:outline-none placeholder:font-normal" />
                    </div>
                    <div className="p-2">
                       <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Searches</div>
                       <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-2"><History className="w-4 h-4 text-slate-400" /> Patient: Amit Singh</button>
                       <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-2"><History className="w-4 h-4 text-slate-400" /> Invoice INV-20261012</button>
                    </div>
                    <div className="p-2 bg-slate-50 border-t border-slate-100">
                       <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">AI Suggestions</div>
                       <button className="w-full text-left px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-50 rounded-md flex items-center gap-2 font-medium"><Zap className="w-4 h-4 text-indigo-500" /> View today's revenue summary</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

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
                      <div className="h-px bg-slate-100 my-1"></div>
                      <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-md transition-colors flex items-center gap-2 font-medium"><Wallet className="w-4 h-4" /> Generate Invoice</button>
                      <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-md transition-colors flex items-center gap-2 font-medium"><Receipt className="w-4 h-4" /> Log Expense</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white box-content"></span>
            </button>

            {/* Notification Drawer (Simplified) */}
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
                       <p className="text-xs font-bold text-slate-900 mb-0.5">Low Stock Alert</p>
                       <p className="text-xs text-slate-600">Paracetamol 500mg is below minimum threshold.</p>
                       <p className="text-[10px] text-slate-400 mt-1">10 mins ago</p>
                     </div>
                     <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                       <p className="text-xs font-medium text-slate-900 mb-0.5">Patient Waiting</p>
                       <p className="text-xs text-slate-600">Amit Singh has been waiting for 45 mins.</p>
                       <p className="text-[10px] text-slate-400 mt-1">1 hour ago</p>
                     </div>
                     <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                       <p className="text-xs font-medium text-slate-900 mb-0.5">Report Ready</p>
                       <p className="text-xs text-slate-600">Lipid Profile for Priya Sharma is available.</p>
                       <p className="text-[10px] text-slate-400 mt-1">2 hours ago</p>
                     </div>
                   </div>
                   <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                     <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors" onClick={() => { setActiveTab('cm-notifications'); setShowNotifications(false); }}>View all notifications</button>
                   </div>
                 </div>
               </>
            )}

          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
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
