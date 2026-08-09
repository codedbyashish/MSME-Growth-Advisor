import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Sparkles, 
  ShieldCheck, 
  LayoutDashboard, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  LogOut, 
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  salesCount = 0, 
  expensesCount = 0, 
  inventoryCount = 0, 
  lowStockCount = 0, 
  onAddSale, 
  onOpenAiChat, 
  onOpenHealthAudit,
  mobileOpen,
  setMobileOpen
}) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'sales',
      label: 'Sales & Revenue',
      icon: TrendingUp,
      badge: salesCount > 0 ? salesCount : null,
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'expenses',
      label: 'Expenses & Costs',
      icon: TrendingDown,
      badge: expensesCount > 0 ? expensesCount : null,
      badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
    },
    {
      id: 'inventory',
      label: 'Inventory Stock',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : (inventoryCount > 0 ? inventoryCount : null),
      badgeColor: lowStockCount > 0 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'
    },
    {
      id: 'insights',
      label: 'AI Risk & Strategy',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    }
  ];

  const sidebarContent = (
    <div className={`h-full flex flex-col justify-between selection:bg-emerald-500 selection:text-white ${
      collapsed ? 'p-2 sm:p-3' : 'p-4'
    }`}>
      {/* Brand Header */}
      <div className="space-y-6">
        <div className={`flex items-center ${collapsed ? 'flex-col gap-3 justify-center text-center' : 'justify-between'} px-1 py-1`}>
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-3 cursor-pointer group select-none overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform shrink-0">
              <BarChart3 className="w-5 h-5 text-slate-950" />
            </div>

            {!collapsed && (
              <div className="flex flex-col">
                <span className={`text-base font-bold tracking-tight font-poppins flex items-center gap-1 transition-colors ${
                  isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-700'
                }`}>
                  MSME <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Advisor</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Financial Co-Pilot
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white transition-colors shrink-0"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Action Button */}
        {!collapsed ? (
          <div className="pt-1">
            <button
              onClick={() => {
                if (onAddSale) onAddSale();
                if (mobileOpen) setMobileOpen(false);
              }}
              className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>RECORD NEW SALE</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center pt-1">
            <button
              onClick={onAddSale}
              className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md hover:scale-105"
              title="Record New Sale"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        )}

        {/* Navigation Section */}
        <nav className="space-y-1 pt-2">
          {!collapsed && (
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
              Menu
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (mobileOpen) setMobileOpen(false);
                }}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center ${collapsed ? 'justify-center py-3' : 'justify-between px-3.5 py-2.5'} rounded-xl text-xs font-semibold transition-all group ${
                  isActive 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shadow-sm' 
                    : (isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Health Audit Extra Trigger */}
          <button
            onClick={() => {
              if (onOpenHealthAudit) onOpenHealthAudit();
              if (mobileOpen) setMobileOpen(false);
            }}
            title={collapsed ? "Bank Health Audit" : undefined}
            className={`w-full flex items-center ${collapsed ? 'justify-center py-3' : 'justify-between px-3.5 py-2.5'} rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/80 transition-all group`}
          >
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 group-hover:scale-105 transition-transform" />
              {!collapsed && <span>Bank Health Audit</span>}
            </div>
          </button>
        </nav>
      </div>

      {/* Footer User Card */}
      <div className="pt-4 border-t border-slate-800/80">
        {!collapsed ? (
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold flex items-center justify-center shrink-0">
                RS
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">Rajesh Sharma</span>
                <span className="text-[10px] text-slate-400 truncate">Surat Textiles Pvt Ltd</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Return to Landing Page"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold flex items-center justify-center" title="Rajesh Sharma">
              RS
            </div>
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Return to Landing Page"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={`hidden md:block sticky top-0 h-screen transition-all duration-300 z-40 border-r ${
        isDark ? 'bg-[#0b1017] border-slate-800/80 text-white' : 'bg-white border-slate-200 text-slate-900'
      } ${collapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in" 
          />
          <aside className={`relative w-72 h-full z-10 shadow-2xl transition-all duration-300 ${
            isDark ? 'bg-[#0b1017] text-white border-r border-slate-800' : 'bg-white text-slate-900 border-r border-slate-200'
          }`}>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
