import { useState } from 'react';
import { LayoutGrid, Type, Box, MessageSquare, Bell, Search, Menu, Stethoscope, LayoutDashboard, Users, Server, LifeBuoy, Activity, Pill, Receipt, UserPlus, Fingerprint, FileText, CalendarRange, ListTree, MonitorPlay, HeartPulse, Stethoscope as StethoscopeIcon, FileSignature, Wallet, FileSpreadsheet, Undo2, Package, Tags, Truck, PieChart, TrendingUp, BriefcaseMedical, LineChart, HelpCircle, MessageCircle, BookOpen, GraduationCap, ClipboardList } from 'lucide-react';
import FoundationView from './views/FoundationView';
import ComponentsView from './views/ComponentsView';
import FeedbackView from './views/FeedbackView';
import SuperAdminCoreView from './views/superadmin/SuperAdminCoreView';
import SuperAdminTenantsView from './views/superadmin/SuperAdminTenantsView';
import SuperAdminInfraView from './views/superadmin/SuperAdminInfraView';
import SuperAdminOpsView from './views/superadmin/SuperAdminOpsView';
import OwnerDashboardView from './views/clinic_owner/OwnerDashboardView';
import OwnerAnalyticsView from './views/clinic_owner/OwnerAnalyticsView';
import OwnerOperationsView from './views/clinic_owner/OwnerOperationsView';
import OwnerFinanceSupportView from './views/clinic_owner/OwnerFinanceSupportView';
import PatientDirectoryView from './views/patient_management/PatientDirectoryView';
import PatientProfileView from './views/patient_management/PatientProfileView';
import PatientWorkflowsView from './views/patient_management/PatientWorkflowsView';
import ApptCalendarView from './views/appointment_management/ApptCalendarView';
import ApptQueueView from './views/appointment_management/ApptQueueView';
import ApptReceptionView from './views/appointment_management/ApptReceptionView';
import EmrDashboardView from './views/doctor_emr/EmrDashboardView';
import EmrConsultationView from './views/doctor_emr/EmrConsultationView';
import EmrPrescriptionView from './views/doctor_emr/EmrPrescriptionView';
import BillingDashboardView from './views/billing_payments/BillingDashboardView';
import InvoiceGeneratorView from './views/billing_payments/InvoiceGeneratorView';
import PaymentRefundsView from './views/billing_payments/PaymentRefundsView';
import InvDashboardView from './views/inventory/InvDashboardView';
import InvStockView from './views/inventory/InvStockView';
import InvPurchasingView from './views/inventory/InvPurchasingView';
import ExecPatientView from './views/executive_analytics/ExecPatientView';
import ExecRevenueView from './views/executive_analytics/ExecRevenueView';
import ExecDoctorView from './views/executive_analytics/ExecDoctorView';
import ExecOperationsView from './views/executive_analytics/ExecOperationsView';
import SupportDashboardView from './views/support/SupportDashboardView';
import TicketDetailsView from './views/support/TicketDetailsView';
import KnowledgeBaseView from './views/support/KnowledgeBaseView';
import TrainingCenterView from './views/support/TrainingCenterView';
import ProductSpecView from './views/ProductSpecView';

type Tab = 'spec' | 'foundation' | 'components' | 'feedback' | 'sa-core' | 'sa-tenants' | 'sa-infra' | 'sa-ops' | 'co-dashboard' | 'co-analytics' | 'co-ops' | 'co-finance' | 'pm-directory' | 'pm-profile' | 'pm-workflows' | 'am-calendar' | 'am-queue' | 'am-reception' | 'emr-dashboard' | 'emr-consultation' | 'emr-prescription' | 'bp-dashboard' | 'bp-invoice' | 'bp-payment' | 'inv-dashboard' | 'inv-stock' | 'inv-purchasing' | 'ea-patient' | 'ea-revenue' | 'ea-doctor' | 'ea-ops' | 'sup-dashboard' | 'sup-tickets' | 'sup-knowledge' | 'sup-training';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('co-dashboard');

  return (
    <div className="h-screen flex bg-background overflow-hidden relative">
      {/* 10. Sidebar Design Implementation */}
      <aside className="w-64 bg-secondary text-slate-300 hidden md:flex flex-col flex-shrink-0 h-full overflow-y-auto custom-scrollbar border-r border-[#1e293b]">
        <div className="p-6 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">CA</span>
            </div>
            <h1 className="text-white font-bold text-xs tracking-wider leading-tight">
              CLICK AARAMBH<br/><span className="text-accent font-medium opacity-80">CLINICOS</span>
            </h1>
          </div>
        </div>

        <div className="flex-1 px-4 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3">Platform Overview</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<ClipboardList size={18} />} 
              label="Master Specification" 
              active={activeTab === 'spec'} 
              onClick={() => setActiveTab('spec')} 
            />
          </nav>
          
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Design System</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<Type size={18} />} 
              label="1-2. Foundation" 
              active={activeTab === 'foundation'} 
              onClick={() => setActiveTab('foundation')} 
            />
            <SidebarItem 
              icon={<Box size={18} />} 
              label="3-9. Components" 
              active={activeTab === 'components'} 
              onClick={() => setActiveTab('components')} 
            />
            <SidebarItem 
              icon={<MessageSquare size={18} />} 
              label="12-17. States & Feedback" 
              active={activeTab === 'feedback'} 
              onClick={() => setActiveTab('feedback')} 
            />
          </nav>
          
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Super Admin</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<LayoutDashboard size={18} />} 
              label="Core & Telemetry" 
              active={activeTab === 'sa-core'} 
              onClick={() => setActiveTab('sa-core')} 
            />
            <SidebarItem 
              icon={<Users size={18} />} 
              label="Tenants & Users" 
              active={activeTab === 'sa-tenants'} 
              onClick={() => setActiveTab('sa-tenants')} 
            />
            <SidebarItem 
              icon={<Server size={18} />} 
              label="Infra & Security" 
              active={activeTab === 'sa-infra'} 
              onClick={() => setActiveTab('sa-infra')} 
            />
            <SidebarItem 
              icon={<LifeBuoy size={18} />} 
              label="Platform Ops" 
              active={activeTab === 'sa-ops'} 
              onClick={() => setActiveTab('sa-ops')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Clinic Owner</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<LayoutGrid size={18} />} 
              label="Business Overview" 
              active={activeTab === 'co-dashboard'} 
              onClick={() => setActiveTab('co-dashboard')} 
            />
            <SidebarItem 
              icon={<Activity size={18} />} 
              label="Clinical Analytics" 
              active={activeTab === 'co-analytics'} 
              onClick={() => setActiveTab('co-analytics')} 
            />
            <SidebarItem 
              icon={<Pill size={18} />} 
              label="Operations & HR" 
              active={activeTab === 'co-ops'} 
              onClick={() => setActiveTab('co-ops')} 
            />
            <SidebarItem 
              icon={<Receipt size={18} />} 
              label="Finance & Support" 
              active={activeTab === 'co-finance'} 
              onClick={() => setActiveTab('co-finance')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Patient Management</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<Users size={18} />} 
              label="Patient Directory" 
              active={activeTab === 'pm-directory'} 
              onClick={() => setActiveTab('pm-directory')} 
            />
            <SidebarItem 
              icon={<Fingerprint size={18} />} 
              label="360° Profile" 
              active={activeTab === 'pm-profile'} 
              onClick={() => setActiveTab('pm-profile')} 
            />
            <SidebarItem 
              icon={<FileText size={18} />} 
              label="Core Workflows" 
              active={activeTab === 'pm-workflows'} 
              onClick={() => setActiveTab('pm-workflows')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Appointments & Queue</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<CalendarRange size={18} />} 
              label="Calendar & Schedule" 
              active={activeTab === 'am-calendar'} 
              onClick={() => setActiveTab('am-calendar')} 
            />
            <SidebarItem 
              icon={<ListTree size={18} />} 
              label="Queue & Tokens" 
              active={activeTab === 'am-queue'} 
              onClick={() => setActiveTab('am-queue')} 
            />
            <SidebarItem 
              icon={<MonitorPlay size={18} />} 
              label="Reception Desk" 
              active={activeTab === 'am-reception'} 
              onClick={() => setActiveTab('am-reception')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Doctor EMR</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<HeartPulse size={18} />} 
              label="Doctor Dashboard" 
              active={activeTab === 'emr-dashboard'} 
              onClick={() => setActiveTab('emr-dashboard')} 
            />
            <SidebarItem 
              icon={<StethoscopeIcon size={18} />} 
              label="Live Consultation" 
              active={activeTab === 'emr-consultation'} 
              onClick={() => setActiveTab('emr-consultation')} 
            />
            <SidebarItem 
              icon={<FileSignature size={18} />} 
              label="Prescription (Rx)" 
              active={activeTab === 'emr-prescription'} 
              onClick={() => setActiveTab('emr-prescription')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Billing & Payments</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<Wallet size={18} />} 
              label="Billing Dashboard" 
              active={activeTab === 'bp-dashboard'} 
              onClick={() => setActiveTab('bp-dashboard')} 
            />
            <SidebarItem 
              icon={<FileSpreadsheet size={18} />} 
              label="Invoice Generation" 
              active={activeTab === 'bp-invoice'} 
              onClick={() => setActiveTab('bp-invoice')} 
            />
            <SidebarItem 
              icon={<Undo2 size={18} />} 
              label="Payments & Refunds" 
              active={activeTab === 'bp-payment'} 
              onClick={() => setActiveTab('bp-payment')} 
            />
          </nav>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Inventory & Stock</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<Package size={18} />} 
              label="Inventory Dashboard" 
              active={activeTab === 'inv-dashboard'} 
              onClick={() => setActiveTab('inv-dashboard')} 
            />
            <SidebarItem 
              icon={<Tags size={18} />} 
              label="Stock Ledger" 
              active={activeTab === 'inv-stock'} 
              onClick={() => setActiveTab('inv-stock')} 
            />
            <SidebarItem 
              icon={<Truck size={18} />} 
              label="Purchasing & Vendors" 
              active={activeTab === 'inv-purchasing'} 
              onClick={() => setActiveTab('inv-purchasing')} 
            />
          </nav>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Executive Analytics</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<PieChart size={18} />} 
              label="Patient Intelligence" 
              active={activeTab === 'ea-patient'} 
              onClick={() => setActiveTab('ea-patient')} 
            />
            <SidebarItem 
              icon={<TrendingUp size={18} />} 
              label="Revenue & Finance" 
              active={activeTab === 'ea-revenue'} 
              onClick={() => setActiveTab('ea-revenue')} 
            />
            <SidebarItem 
              icon={<BriefcaseMedical size={18} />} 
              label="Clinical Performance" 
              active={activeTab === 'ea-doctor'} 
              onClick={() => setActiveTab('ea-doctor')} 
            />
            <SidebarItem 
              icon={<LineChart size={18} />} 
              label="Inventory & Ops" 
              active={activeTab === 'ea-ops'} 
              onClick={() => setActiveTab('ea-ops')} 
            />
          </nav>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 border-t border-white/5 mt-4 pt-4">Support Center</div>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<HelpCircle size={18} />} 
              label="Support Dashboard" 
              active={activeTab === 'sup-dashboard'} 
              onClick={() => setActiveTab('sup-dashboard')} 
            />
            <SidebarItem 
              icon={<MessageCircle size={18} />} 
              label="Ticket Details" 
              active={activeTab === 'sup-tickets'} 
              onClick={() => setActiveTab('sup-tickets')} 
            />
            <SidebarItem 
              icon={<BookOpen size={18} />} 
              label="Knowledge Base" 
              active={activeTab === 'sup-knowledge'} 
              onClick={() => setActiveTab('sup-knowledge')} 
            />
            <SidebarItem 
              icon={<GraduationCap size={18} />} 
              label="Training Center" 
              active={activeTab === 'sup-training'} 
              onClick={() => setActiveTab('sup-training')} 
            />
          </nav>
        </div>
        
        <div className="mt-auto p-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="text-sm font-medium text-white mb-1">Durga Clinic Space</h4>
            <p className="text-xs text-slate-400">Multi-tenant layout architecture active preview.</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 11. Header Design Implementation */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-900">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 font-medium">
              <span>Platform Reference</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900">
                {activeTab === 'spec' && 'Master Specification'}
                {activeTab === 'foundation' && 'Foundation'}
                {activeTab === 'components' && 'UI Components'}
                {activeTab === 'feedback' && 'States & Feedback'}
                {activeTab === 'sa-core' && 'Core & Telemetry'}
                {activeTab === 'sa-tenants' && 'Tenants & Users'}
                {activeTab === 'sa-infra' && 'Infra & Security'}
                {activeTab === 'sa-ops' && 'Platform Ops'}
                {activeTab === 'co-dashboard' && 'Business Overview'}
                {activeTab === 'co-analytics' && 'Clinical Analytics'}
                {activeTab === 'co-ops' && 'Operations & HR'}
                {activeTab === 'co-finance' && 'Finance & Support'}
                {activeTab === 'pm-directory' && 'Patient Directory'}
                {activeTab === 'pm-profile' && 'Patient Profile'}
                {activeTab === 'pm-workflows' && 'Patient Workflows'}
                {activeTab === 'am-calendar' && 'Calendar & Schedule'}
                {activeTab === 'am-queue' && 'Queue & Tokens'}
                {activeTab === 'am-reception' && 'Reception Desk'}
                {activeTab === 'emr-dashboard' && 'Doctor Dashboard'}
                {activeTab === 'emr-consultation' && 'Live Consultation'}
                {activeTab === 'emr-prescription' && 'Prescription (Rx)'}
                {activeTab === 'bp-dashboard' && 'Billing Dashboard'}
                {activeTab === 'bp-invoice' && 'Invoice Generation'}
                {activeTab === 'bp-payment' && 'Payments & Refunds'}
                {activeTab === 'inv-dashboard' && 'Inventory Dashboard'}
                {activeTab === 'inv-stock' && 'Stock Ledger'}
                {activeTab === 'inv-purchasing' && 'Purchasing & Vendors'}
                {activeTab === 'ea-patient' && 'Patient Intelligence'}
                {activeTab === 'ea-revenue' && 'Revenue & Financial Analytics'}
                {activeTab === 'ea-doctor' && 'Clinical Performance'}
                {activeTab === 'ea-ops' && 'Inventory & Operations Analytics'}
                {activeTab === 'sup-dashboard' && 'Support Dashboard'}
                {activeTab === 'sup-tickets' && 'Ticket Details'}
                {activeTab === 'sup-knowledge' && 'Knowledge Base'}
                {activeTab === 'sup-training' && 'Training Center'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
              <input 
                type="text" 
                placeholder="Search specs... (⌘K)" 
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all w-64"
              />
            </div>
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent border-2 border-white shadow-sm overflow-hidden text-xs text-white font-bold flex items-center justify-center">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'spec' && <ProductSpecView />}
            {activeTab === 'foundation' && <FoundationView />}
            {activeTab === 'components' && <ComponentsView />}
            {activeTab === 'feedback' && <FeedbackView />}
            {activeTab === 'sa-core' && <SuperAdminCoreView />}
            {activeTab === 'sa-tenants' && <SuperAdminTenantsView />}
            {activeTab === 'sa-infra' && <SuperAdminInfraView />}
            {activeTab === 'sa-ops' && <SuperAdminOpsView />}
            {activeTab === 'co-dashboard' && <OwnerDashboardView />}
            {activeTab === 'co-analytics' && <OwnerAnalyticsView />}
            {activeTab === 'co-ops' && <OwnerOperationsView />}
            {activeTab === 'co-finance' && <OwnerFinanceSupportView />}
            {activeTab === 'pm-directory' && <PatientDirectoryView />}
            {activeTab === 'pm-profile' && <PatientProfileView />}
            {activeTab === 'pm-workflows' && <PatientWorkflowsView />}
            {activeTab === 'am-calendar' && <ApptCalendarView />}
            {activeTab === 'am-queue' && <ApptQueueView />}
            {activeTab === 'am-reception' && <ApptReceptionView />}
            {activeTab === 'emr-dashboard' && <EmrDashboardView />}
            {activeTab === 'emr-consultation' && <EmrConsultationView />}
            {activeTab === 'emr-prescription' && <EmrPrescriptionView />}
            {activeTab === 'bp-dashboard' && <BillingDashboardView />}
            {activeTab === 'bp-invoice' && <InvoiceGeneratorView />}
            {activeTab === 'bp-payment' && <PaymentRefundsView />}
            {activeTab === 'inv-dashboard' && <InvDashboardView />}
            {activeTab === 'inv-stock' && <InvStockView />}
            {activeTab === 'inv-purchasing' && <InvPurchasingView />}
            {activeTab === 'ea-patient' && <ExecPatientView />}
            {activeTab === 'ea-revenue' && <ExecRevenueView />}
            {activeTab === 'ea-doctor' && <ExecDoctorView />}
            {activeTab === 'ea-ops' && <ExecOperationsView />}
            {activeTab === 'sup-dashboard' && <SupportDashboardView />}
            {activeTab === 'sup-tickets' && <TicketDetailsView />}
            {activeTab === 'sup-knowledge' && <KnowledgeBaseView />}
            {activeTab === 'sup-training' && <TrainingCenterView />}
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
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
        active 
          ? 'bg-primary text-white' 
          : 'text-slate-400 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
