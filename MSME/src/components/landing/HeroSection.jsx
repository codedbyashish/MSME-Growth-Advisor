import React from 'react';
import { TrendingUp, ArrowRight, ShieldCheck, BarChart2, DollarSign, Package, Activity, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function HeroSection({ onStart }) {
  const { isDark } = useTheme();

  return (
    <section id="home" className={`relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden ${
      isDark ? 'bg-[#0B1220]' : 'bg-slate-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${
              isDark 
                ? 'bg-[#111B2E] border-[#243247] text-[#10B981]' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>AI-Powered MSME Growth Platform</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] ${
              isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
            }`}>
              Turn Your Business Data Into{' '}
              <span className="text-[#10B981]">
                Growth
              </span>
            </h1>

            <p className={`text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0 ${
              isDark ? 'text-[#94A3B8]' : 'text-slate-600'
            }`}>
              Understand your business, predict future sales, and make smarter decisions with AI-powered insights designed for MSMEs.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStart}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#10B981] hover:bg-[#0ea371] text-[#0B1220] font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center space-x-2.5 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Your Growth Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#features"
                className={`w-full sm:w-auto px-7 py-3.5 rounded-xl border text-sm sm:text-base font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  isDark
                    ? 'border-[#243247] bg-[#111B2E] text-[#F8FAFC] hover:bg-[#162238]'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
              >
                <span>Explore Features</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className={`pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs font-medium ${
              isDark ? 'text-[#64748B]' : 'text-slate-500'
            }`}>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Simple & Non-Technical</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#243247]" />
              <div className="flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                <span>Predictive AI Insights</span>
              </div>
            </div>
          </div>

          {/* Right Hero Preview Dashboard */}
          <div className="lg:col-span-6 relative">
            <div className={`relative rounded-2xl border p-5 sm:p-6 shadow-2xl transition-all ${
              isDark 
                ? 'bg-[#162238] border-[#243247]' 
                : 'bg-white border-slate-200 shadow-slate-200'
            }`}>
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#243247]">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-[#F43F5E]" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <span className={`text-xs font-bold uppercase tracking-wider pl-2 ${
                    isDark ? 'text-[#64748B]' : 'text-slate-500'
                  }`}>
                    Live Dashboard Preview
                  </span>
                </div>
                
                {/* Growth Badge */}
                <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Business Growth ↑</span>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center space-x-1.5 text-xs text-[#64748B] mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Revenue</span>
                  </div>
                  <div className={`text-base font-extrabold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    ₹2,45,000
                  </div>
                  <span className="text-[10px] text-[#10B981] font-semibold">+14.2% vs last mo</span>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center space-x-1.5 text-xs text-[#64748B] mb-1">
                    <BarChart2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Sales</span>
                  </div>
                  <div className={`text-base font-extrabold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    1,280 units
                  </div>
                  <span className="text-[10px] text-[#10B981] font-semibold">Upward trend</span>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center space-x-1.5 text-xs text-[#64748B] mb-1">
                    <Package className="w-3.5 h-3.5 text-amber-400" />
                    <span>Inventory</span>
                  </div>
                  <div className={`text-base font-extrabold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    94% Stocked
                  </div>
                  <span className="text-[10px] text-[#10B981] font-semibold">Optimal</span>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center space-x-1.5 text-xs text-[#64748B] mb-1">
                    <Activity className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Health Score</span>
                  </div>
                  <div className="text-base font-extrabold text-[#10B981]">
                    82 / 100
                  </div>
                  <span className="text-[10px] text-[#10B981] font-semibold">Healthy</span>
                </div>
              </div>

              {/* Chart Preview */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50/80 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-700'}`}>
                    Sales Performance & Prediction
                  </span>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="flex items-center space-x-1 text-[#94A3B8]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] inline-block" />
                      <span>Historical</span>
                    </span>
                    <span className="flex items-center space-x-1 text-[#10B981]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block" />
                      <span>AI Predicted ↑</span>
                    </span>
                  </div>
                </div>

                {/* SVG Trend Chart */}
                <div className="h-36 w-full relative pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="0" y1="30" x2="400" y2="30" stroke={isDark ? '#243247' : '#e2e8f0'} strokeDasharray="3 3" />
                    <line x1="0" y1="70" x2="400" y2="70" stroke={isDark ? '#243247' : '#e2e8f0'} strokeDasharray="3 3" />
                    
                    <path
                      d="M 0 90 L 60 80 L 120 70 L 180 60 L 240 45 L 300 35 L 360 20 L 400 15 L 400 120 L 0 120 Z"
                      fill="url(#heroGradient)"
                    />

                    {/* Historical (Blue/Cyan) */}
                    <path
                      d="M 0 90 L 60 80 L 120 70 L 180 60 L 240 45"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* AI Predicted (Green/Teal) */}
                    <path
                      d="M 240 45 L 300 35 L 360 20 L 400 15"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3.5"
                      strokeDasharray="5 4"
                      strokeLinecap="round"
                    />

                    <circle cx="0" cy="90" r="4" fill="#3B82F6" />
                    <circle cx="60" cy="80" r="4" fill="#3B82F6" />
                    <circle cx="120" cy="70" r="4" fill="#3B82F6" />
                    <circle cx="180" cy="60" r="4" fill="#3B82F6" />
                    <circle cx="240" cy="45" r="5" fill="#10B981" />
                    <circle cx="300" cy="35" r="4" fill="#10B981" />
                    <circle cx="360" cy="20" r="4" fill="#10B981" />
                    <circle cx="400" cy="15" r="5" fill="#10B981" />
                  </svg>
                </div>

                <div className="flex justify-between items-center text-[10px] text-[#64748B] pt-2 border-t border-[#243247]">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span className="text-[#10B981] font-bold">Jun (Predicted)</span>
                  <span className="text-[#10B981] font-bold">Jul (Predicted)</span>
                </div>
              </div>

              <p className={`text-[11px] text-center pt-3 italic ${isDark ? 'text-[#64748B]' : 'text-slate-500'}`}>
                * Designed to assist business planning; predictions are estimates based on historical trends.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
