import React from 'react';
import { ArrowRight, Play, Building2, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function HeroSection({ heroData, onStart }) {
  const { isDark } = useTheme();

  if (!heroData) return null;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-center">
      {/* Left Hero Content */}
      <div className="lg:col-span-7 space-y-6">
        {heroData.badge && (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{heroData.badge}</span>
          </div>
        )}

        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] font-poppins ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {heroData.title}
        </h1>

        <p className={`text-base sm:text-lg max-w-2xl leading-relaxed ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          {heroData.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button 
            onClick={onStart}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm tracking-wider flex items-center space-x-2 transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.03] active:scale-95"
          >
            <span>{heroData.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={onStart}
            className={`px-7 py-3.5 rounded-xl font-semibold text-sm border backdrop-blur-md transition-all flex items-center space-x-2 ${
              isDark 
                ? 'bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700/80 hover:border-emerald-500/40' 
                : 'bg-white/80 hover:bg-white text-slate-800 border-slate-300 hover:border-emerald-500/40 shadow-sm'
            }`}
          >
            <Play className={`w-4 h-4 ${isDark ? 'fill-white text-white' : 'fill-slate-800 text-slate-800'}`} />
            <span>{heroData.ctaSecondary}</span>
          </button>
        </div>
      </div>

      {/* Right Hero Graphic Mockup */}
      {heroData.companyMock && (
        <div className="lg:col-span-5 relative">
          <div className={`relative rounded-3xl p-6 shadow-2xl transition-all duration-500 animate-float-slow ${
            isDark ? 'glass-panel-dark text-white' : 'glass-panel-light text-slate-900'
          }`}>
            {/* Header of card */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-800 dark:text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{heroData.companyMock.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{heroData.companyMock.syncSource}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 rounded-full">
                {heroData.companyMock.status}
              </span>
            </div>

            {/* Daily Growth Score */}
            <div className="mb-5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">DAILY GROWTH SCORE</span>
              <div className="flex items-baseline space-x-3 mt-1">
                <span className="text-4xl font-extrabold text-emerald-500 font-poppins">{heroData.companyMock.growthScore}</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> {heroData.companyMock.growthTrend}
                </span>
              </div>
            </div>

            {/* Metric boxes row */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Net Revenue (MTD)</span>
                <div className="text-xl font-extrabold mt-1 font-poppins">{heroData.companyMock.netRevenue}</div>
              </div>
              <div className="bg-red-50/80 dark:bg-red-950/40 p-3.5 rounded-xl border border-red-100 dark:border-red-900/40">
                <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400">Burn Rate</span>
                <div className="text-xl font-extrabold text-red-800 dark:text-red-300 mt-1 font-poppins">{heroData.companyMock.burnRate}</div>
              </div>
            </div>

            {/* Graph Visualization Mock */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="h-32 flex items-end justify-between gap-3 pt-4 px-2">
                <div className="w-full bg-emerald-200/80 dark:bg-emerald-500/30 rounded-t-sm h-[45%]" />
                <div className="w-full bg-emerald-200/80 dark:bg-emerald-500/30 rounded-t-sm h-[65%]" />
                <div className="w-full bg-red-100 dark:bg-red-900/30 rounded-t-sm h-[30%]" />
                <div className="w-full bg-emerald-200/80 dark:bg-emerald-500/30 rounded-t-sm h-[85%]" />
                <div className="w-full bg-emerald-600 dark:bg-emerald-500 rounded-t-sm h-[100%] flex items-end justify-center pb-1 shadow-md">
                  <span className="text-[8px] text-white font-mono">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
