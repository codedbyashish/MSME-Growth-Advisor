import React from 'react';
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, Package, Activity, ArrowRight, Clock, Layers } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardShowcaseSection({ onStart }) {
  const { isDark } = useTheme();

  return (
    <section className={`py-20 md:py-28 relative overflow-hidden border-t border-b ${
      isDark ? 'bg-[#0F172A] border-[#243247]' : 'bg-slate-100/70 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${
            isDark ? 'bg-[#111B2E] text-[#94A3B8] border-[#243247]' : 'bg-[#66BB6A]/10 text-[#4CAF50] border border-[#66BB6A]/30'
          }`}>
            <Layers className="w-3.5 h-3.5 text-[#66BB6A]" />
            <span>Unified Control Center</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
            Everything You Need.{' '}
            <span className="text-[#66BB6A]">
              One Simple Dashboard.
            </span>
          </h2>

          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
            Consolidate your entire business operation into a clean, intuitive financial co-pilot interface built for daily clarity.
          </p>
        </div>

        {/* Visual Value Flow Banner (Always Dark Navy Surface) */}
        <div className="max-w-4xl mx-auto mb-10 p-3.5 sm:p-4 rounded-2xl bg-[#111B2E] border border-[#243247] text-center shadow-lg">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-extrabold tracking-wide uppercase">
            <span className="text-[#F8FAFC]">DATA</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#66BB6A]" />
            <span className="text-[#F8FAFC]">INSIGHTS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#66BB6A]" />
            <span className="text-[#F8FAFC]">PREDICTION</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#66BB6A]" />
            <span className="text-[#F8FAFC]">BETTER DECISIONS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#66BB6A]" />
            <span className="text-[#66BB6A] font-black">GROWTH 📈</span>
          </div>
        </div>

        {/* Full Dashboard Mock Container */}
        <div className={`rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isDark ? 'bg-[#162238] border-[#243247]' : 'bg-white border-slate-200 shadow-slate-200'
        }`}>
          
          {/* Dashboard Header Bar (Always Dark Navy) */}
          <div className="p-4 border-b border-[#243247] flex flex-wrap items-center justify-between gap-4 bg-[#111B2E]">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-[#66BB6A]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                MSME Business Growth Co-Pilot Dashboard
              </span>
            </div>
            
            <div className="flex items-center space-x-3 text-xs">
              <span className="text-[#66BB6A] font-semibold bg-[#66BB6A]/10 px-2.5 py-1 rounded-md border border-[#66BB6A]/30">
                Live Data Connected
              </span>
              <button
                onClick={onStart}
                className="px-3.5 py-1.5 rounded-lg bg-[#66BB6A] hover:bg-[#57a85b] text-[#0B1220] font-bold transition-all cursor-pointer shadow-sm"
              >
                Launch Demo
              </button>
            </div>
          </div>

          {/* Inner Dashboard Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Top 4 Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`flex items-center justify-between text-xs mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                  <span>Total Sales</span>
                  <DollarSign className="w-4 h-4 text-[#66BB6A]" />
                </div>
                <div className={`text-xl font-extrabold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                  ₹3,24,500
                </div>
                <span className="text-[11px] text-[#66BB6A] font-bold flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +16.4% YoY
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`flex items-center justify-between text-xs mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                  <span>Revenue</span>
                  <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div className={`text-xl font-extrabold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                  ₹2,80,000
                </div>
                <span className="text-[11px] text-[#3B82F6] font-bold flex items-center gap-1 mt-1">
                  Steady Cash Inflow
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`flex items-center justify-between text-xs mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                  <span>Expenses</span>
                  <Wallet className="w-4 h-4 text-[#F43F5E]" />
                </div>
                <div className={`text-xl font-extrabold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                  ₹1,12,000
                </div>
                <span className="text-[11px] text-[#66BB6A] font-bold flex items-center gap-1 mt-1">
                  Optimized (-4.2%)
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`flex items-center justify-between text-xs mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                  <span>Estimated Profit</span>
                  <TrendingUp className="w-4 h-4 text-[#66BB6A]" />
                </div>
                <div className="text-xl font-extrabold text-[#66BB6A]">
                  ₹1,68,000
                </div>
                <span className="text-[11px] text-[#66BB6A] font-bold flex items-center gap-1 mt-1">
                  Net Margin 60%
                </span>
              </div>
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Sales Prediction Card */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    AI Sales Forecast
                  </span>
                  <span className="text-[10px] bg-[#66BB6A]/10 text-[#66BB6A] font-bold px-2 py-0.5 rounded-full border border-[#66BB6A]/20">
                    Next Month
                  </span>
                </div>

                <div className="text-2xl font-black text-[#66BB6A] mb-1">
                  ₹70,000
                </div>
                <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                  Expected upward trend. Recommended action: restock top-selling items by 15th.
                </p>
              </div>

              {/* Health Score Summary */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    Business Health Score
                  </span>
                  <Activity className="w-4 h-4 text-[#66BB6A]" />
                </div>

                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-2xl font-black text-[#66BB6A]">82</span>
                  <span className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>/ 100</span>
                  <span className="text-xs font-bold text-[#66BB6A] bg-[#66BB6A]/10 px-2 py-0.5 rounded-full ml-auto border border-[#66BB6A]/20">
                    Healthy
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                  Cash flow & sales performance are performing strongly above sector benchmark.
                </p>
              </div>

              {/* Inventory Alert */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    Inventory Monitor
                  </span>
                  <Package className="w-4 h-4 text-amber-500" />
                </div>

                <div className="text-2xl font-black text-[#66BB6A] mb-1">
                  94% Optimal
                </div>
                <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                  2 items nearing re-order threshold. Reorder list auto-generated.
                </p>
              </div>

            </div>

            {/* Bottom Table: Recent Transactions */}
            <div className={`rounded-xl border p-4 ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold flex items-center space-x-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
                  <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Recent Business Transactions</span>
                </span>
                <span className={`text-[10px] ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>Auto-synced</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-[#243247] text-[#64748B]' : 'border-slate-200 text-slate-500'}`}>
                      <th className="pb-2 font-semibold">Date</th>
                      <th className="pb-2 font-semibold">Description</th>
                      <th className="pb-2 font-semibold">Category</th>
                      <th className="pb-2 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#243247]' : 'divide-slate-200'}`}>
                    <tr>
                      <td className={isDark ? 'py-2.5 text-[#64748B]' : 'py-2.5 text-slate-500'}>Today, 10:30 AM</td>
                      <td className={`py-2.5 font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Bulk Retail Order #1042</td>
                      <td className="py-2.5 text-[#66BB6A] font-semibold">Sales Revenue</td>
                      <td className="py-2.5 font-bold text-right text-[#66BB6A]">+₹18,500</td>
                    </tr>
                    <tr>
                      <td className={isDark ? 'py-2.5 text-[#64748B]' : 'py-2.5 text-slate-500'}>Yesterday</td>
                      <td className={`py-2.5 font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Vendor Stock Replenishment</td>
                      <td className="py-2.5 text-[#F43F5E] font-semibold">Inventory Expense</td>
                      <td className="py-2.5 font-bold text-right text-[#F43F5E]">-₹7,200</td>
                    </tr>
                    <tr>
                      <td className={isDark ? 'py-2.5 text-[#64748B]' : 'py-2.5 text-slate-500'}>14 Aug</td>
                      <td className={`py-2.5 font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>Online Store Payment Payout</td>
                      <td className="py-2.5 text-[#66BB6A] font-semibold">Sales Revenue</td>
                      <td className="py-2.5 font-bold text-right text-[#66BB6A]">+₹24,100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
