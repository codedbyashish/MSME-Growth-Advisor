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
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_GROUPS = [
  {
    label: 'Business',
    items: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'sales', label: 'Sales', icon: TrendingUp },
      { id: 'orders', label: 'Orders', icon: ShoppingBag },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'inventory', label: 'Inventory', icon: Warehouse },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'insights', label: 'AI Growth Advisor', icon: Sparkles, highlight: true },
      { id: 'forecasts', label: 'Demand Forecasts', icon: LineChart },
      { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
    ],
  },
];

const BOTTOM_ITEMS = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Docs', icon: HelpCircle },
  { id: 'profile', label: 'Business Profile', icon: User },
];

function NavButton({ item, isActive, onClick, compact = false }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`
        group relative w-full flex items-center gap-3 rounded-lg text-left
        text-[13px] font-medium transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#202B3C]/40
        ${compact ? 'px-3 py-1.5' : 'px-3 py-2'}
        ${isActive
          ? 'bg-white text-[#202B3C] font-semibold shadow-[0_1px_2px_rgba(32,43,60,0.08),0_0_0_1px_rgba(32,43,60,0.06)]'
          : 'text-[#5C5446] hover:bg-[#EBE7DF] hover:text-[#202B3C]'}
      `}
    >
      {/* Active indicator */}
      <span
        aria-hidden="true"
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-[#202B3C]
          transition-all duration-200 motion-reduce:transition-none
          ${isActive ? 'h-5 opacity-100' : 'h-0 opacity-0'}
        `}
      />

      <Icon
        className={`
          w-[18px] h-[18px] shrink-0 transition-colors
          ${isActive
            ? item.highlight ? 'text-[#B7791F]' : 'text-[#202B3C]'
            : item.highlight ? 'text-[#B7791F]/80 group-hover:text-[#B7791F]' : 'text-[#7C8593] group-hover:text-[#202B3C]'}
        `}
        strokeWidth={isActive ? 2.2 : 1.8}
      />

      <span className="truncate flex-1">{item.label}</span>

      {item.highlight && !isActive && (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#F6E7C8] text-[#8A5A12]">
          AI
        </span>
      )}
    </button>
  );
}

export default function Sidebar({
  activeTab = 'dashboard',
  setActiveTab = () => {},
  mobileOpen = false,
  setMobileOpen = () => {},
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const displayName = user?.name || user?.businessName || 'MSME Owner';
  const initialLetter = (user?.name || user?.businessName || 'M').charAt(0).toUpperCase();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 bg-[#202B3C]/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        aria-label="Main navigation"
        className={`
          fixed top-0 bottom-0 left-0 z-50 lg:z-auto lg:static
          w-64 flex flex-col justify-between
          bg-[#F5F3EE] border-r border-[#E7E3DC]
          px-3 py-4 font-sans select-none
          transition-transform duration-200 ease-out motion-reduce:transition-none
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col min-h-0">
          {/* Brand */}
          <div className="flex items-center justify-between px-2 pb-5">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="group flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#202B3C]/40"
            >
              <div className="w-9 h-9 rounded-xl bg-[#202B3C] text-white flex items-center justify-center text-base font-semibold shrink-0 shadow-sm group-hover:bg-[#151D2A] transition-colors">
                M
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-[15px] font-semibold text-[#202B3C] leading-tight tracking-tight truncate">
                  MSME Growth
                </span>
                <span className="text-xs text-[#7C8593] leading-tight">
                  Business Advisor
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-md text-[#7C8593] hover:text-[#202B3C] hover:bg-[#EBE7DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#202B3C]/40"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Grouped navigation */}
          <nav className="flex-1 overflow-y-auto space-y-5 pr-0.5">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="px-3 pb-1.5 text-xs font-medium text-[#9AA2AD]">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavButton
                      key={item.id}
                      item={item}
                      isActive={activeTab === item.id}
                      onClick={() => handleTabClick(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="pt-3 mt-3 border-t border-[#E7E3DC] space-y-0.5">
          {BOTTOM_ITEMS.filter((i) => i.id !== 'profile').map((item) => (
            <NavButton
              key={item.id}
              item={item}
              compact
              isActive={activeTab === item.id}
              onClick={() => handleTabClick(item.id)}
            />
          ))}

          {/* Profile card */}
          <button
            type="button"
            onClick={() => handleTabClick('profile')}
            title="View business profile"
            aria-current={activeTab === 'profile' ? 'page' : undefined}
            className={`
              mt-2 w-full flex items-center gap-3 p-2.5 rounded-xl border text-left
              transition-colors duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#202B3C]/40
              ${activeTab === 'profile'
                ? 'bg-white border-[#D8D2C6] shadow-sm'
                : 'bg-[#FAF9F6] border-[#E7E3DC] hover:bg-white hover:border-[#D8D2C6]'}
            `}
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-lg bg-[#202B3C] text-white flex items-center justify-center text-sm font-semibold">
                {initialLetter}
              </div>
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#FAF9F6]"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[#202B3C] truncate leading-tight">
                {displayName}
              </p>
              <p className="text-xs text-[#7C8593] truncate leading-tight mt-0.5">
                {user?.businessName || 'Verified Enterprise'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9AA2AD] shrink-0" />
          </button>
        </div>
      </aside>
    </>
  );
}