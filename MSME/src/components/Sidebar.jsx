import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Package, 
  Warehouse, 
  Sparkles, 
  LineChart, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  User,
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeTab = 'dashboard', 
  setActiveTab = () => {}, 
  mobileOpen = false,
  setMobileOpen = () => {}
}) {
  const navigate = useNavigate();

  const mainNavItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Warehouse },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'forecasts', label: 'Forecasts', icon: LineChart },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const bottomNavItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity" 
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 lg:z-auto lg:static
        w-64 bg-[#F5F3EE] border-r border-[#E5E0D6] flex flex-col justify-between p-4 sm:p-5
        transition-transform duration-300 ease-in-out font-sans select-none
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Brand Header matching mockup */}
          <div className="flex items-center justify-between px-1 pt-1">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#1C2A39] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs shrink-0 group-hover:bg-[#274258] transition-colors">
                M
              </div>

              <div className="flex flex-col">
                <span className="font-serif text-base font-bold text-[#1C2A39] leading-tight tracking-tight">
                  MSME Growth
                </span>
                <span className="font-serif text-sm font-bold text-[#1C2A39] leading-tight tracking-tight">
                  Advisor
                </span>
                <span className="text-[10px] text-[#786E60] font-normal tracking-wide mt-0.5">
                  Business Intelligence
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-[#786E60] hover:text-[#1C2A39] p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left
                    ${isActive 
                      ? 'bg-[#EAE5DB] text-[#1C2A39] font-semibold shadow-2xs' 
                      : 'text-[#5C5446] hover:bg-[#ECE8DF] hover:text-[#1C2A39]'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1C2A39]' : 'text-[#786E60]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-[#E5E0D6] space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left
                  ${isActive 
                    ? 'bg-[#EAE5DB] text-[#1C2A39] font-semibold shadow-2xs' 
                    : 'text-[#5C5446] hover:bg-[#ECE8DF] hover:text-[#1C2A39]'
                  }
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1C2A39]' : 'text-[#786E60]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
