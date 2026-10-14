import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Database, 
  FileCheck2, 
  Mail, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  GraduationCap, 
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard, exact: true },
  { path: '/admin/students', label: 'Student Candidates', icon: Users },
  { path: '/admin/payments', label: 'Fee Transactions', icon: CreditCard },
  { path: '/admin/master-data', label: 'Master Data & Pricing', icon: Database },
  { path: '/admin/offer-letters', label: 'Offer Letter Engine', icon: FileCheck2 },
  { path: '/admin/inquiries', label: 'Inquiries Inbox', icon: Mail },
  { path: '/admin/settings', label: 'Site Configuration', icon: Settings },
];

export default function AdminLayout() {
  const { adminProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-xs tracking-tight text-slate-900 block">PPO INTERN</span>
            <span className="text-[10px] font-extrabold text-indigo-600 uppercase">Admin Panel</span>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Desktop & Mobile Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h2 className="font-black text-sm tracking-tight text-slate-900 leading-none">
                  PPO INTERN
                </h2>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block mt-0.5">
                  Admin Console
                </span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] text-left">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Quick CTAs */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-left">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0">
                A
              </div>
              <div className="truncate text-xs">
                <p className="font-extrabold text-slate-900 truncate">
                  {adminProfile?.fullName || 'Administrator'}
                </p>
                <p className="text-[10px] text-slate-500 truncate font-mono">
                  {adminProfile?.email || 'admin@ppointern.com'}
                </p>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </a>
            <button
              onClick={handleLogout}
              className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold flex items-center justify-center transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
