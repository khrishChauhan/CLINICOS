import { useState } from 'react';
import { LayoutGrid, Type, Box, MessageSquare, Bell, Search, Menu, Stethoscope, LayoutDashboard, Users, Server, LifeBuoy } from 'lucide-react';
import FoundationView from './views/FoundationView';
import ComponentsView from './views/ComponentsView';
import FeedbackView from './views/FeedbackView';
import SuperAdminCoreView from './views/superadmin/SuperAdminCoreView';
import SuperAdminTenantsView from './views/superadmin/SuperAdminTenantsView';
import SuperAdminInfraView from './views/superadmin/SuperAdminInfraView';
import SuperAdminOpsView from './views/superadmin/SuperAdminOpsView';

type Tab = 'foundation' | 'components' | 'feedback' | 'sa-core' | 'sa-tenants' | 'sa-infra' | 'sa-ops';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('foundation');

  return (
    <div className="min-h-screen flex bg-background">
      {/* 10. Sidebar Design Implementation */}
      <aside className="w-64 bg-secondary text-slate-300 hidden md:flex flex-col flex-shrink-0 relative z-20">
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
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3">Design System</div>
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
                {activeTab === 'foundation' && 'Foundation'}
                {activeTab === 'components' && 'UI Components'}
                {activeTab === 'feedback' && 'States & Feedback'}
                {activeTab === 'sa-core' && 'Core & Telemetry'}
                {activeTab === 'sa-tenants' && 'Tenants & Users'}
                {activeTab === 'sa-infra' && 'Infra & Security'}
                {activeTab === 'sa-ops' && 'Platform Ops'}
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
            {activeTab === 'foundation' && <FoundationView />}
            {activeTab === 'components' && <ComponentsView />}
            {activeTab === 'feedback' && <FeedbackView />}
            {activeTab === 'sa-core' && <SuperAdminCoreView />}
            {activeTab === 'sa-tenants' && <SuperAdminTenantsView />}
            {activeTab === 'sa-infra' && <SuperAdminInfraView />}
            {activeTab === 'sa-ops' && <SuperAdminOpsView />}
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
