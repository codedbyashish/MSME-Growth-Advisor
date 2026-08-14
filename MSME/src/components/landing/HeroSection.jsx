import React, { useState } from 'react';
import { ArrowRight, Play, Building2, TrendingUp, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function HeroSection({ heroData, onStart }) {
  const { isDark } = useTheme();
  const prompts = heroData?.heroPrompts || [];
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  if (!heroData) return null;
  const currentPrompt = prompts[activePromptIndex] || prompts[0];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20 grid lg:grid-cols-12 gap-12 items-center">
      {/* Left Hero Content */}
      <div className="lg:col-span-7 space-y-6">
        {heroData.badge && (
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider backdrop-blur-md shadow-sm shadow-emerald-500/10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{heroData.badge}</span>
          </div>
        )}

        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-poppins ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {heroData.title.split("Real-Time AI")[0]}
          <span className="text-gradient-emerald">Real-Time AI</span>
          {heroData.title.split("Real-Time AI")[1]}
        </h1>

        <p className={`text-base sm:text-lg max-w-2xl leading-relaxed ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {heroData.description}
        </p>

        {/* Interactive Quick Prompts Bar */}
        <div className="pt-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-500 mb-2 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Drive AI Co-Pilot Live:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {prompts.map((p, idx) => {
              const isActive = idx === activePromptIndex;
              return (
                <button
                  key={p.id || idx}
                  onClick={() => setActivePromptIndex(idx)}
                  className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-300 border flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/25 scale-[1.03]'
                      : isDark
                        ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-emerald-500/40'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-500/40 shadow-sm'
                  }`}
                >
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button 
            onClick={onStart}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm tracking-wider flex items-center space-x-2 transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.03] active:scale-95"
          >
            <span>{heroData.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={onStart}
            className={`px-7 py-4 rounded-xl font-semibold text-sm border backdrop-blur-md transition-all flex items-center space-x-2 ${
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
          {/* Upward Floating Micro Badges */}
          <div className="absolute -top-5 -right-4 z-20 px-3.5 py-1.5 rounded-2xl bg-emerald-500/90 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/30 backdrop-blur-md flex items-center space-x-1.5 animate-bounce">
            <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>+38% Capital Velocity</span>
          </div>

          <div className="absolute -bottom-6 -left-4 z-20 px-3.5 py-2 rounded-2xl bg-slate-900/90 text-emerald-400 font-bold text-xs border border-emerald-500/40 shadow-xl shadow-emerald-950/50 backdrop-blur-md flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>98/100 Bank Audit Ready</span>
          </div>

          <div className={`relative rounded-3xl p-6 shadow-2xl transition-all duration-500 animate-float-slow ${
            isDark ? 'glass-panel-dark text-white' : 'glass-panel-light text-slate-900'
          }`}>
            {/* Header of card */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{heroData.companyMock.name}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">{heroData.companyMock.syncSource}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                {heroData.companyMock.status}
              </span>
            </div>

            {/* Simulated AI Co-Pilot Live Output */}
            {currentPrompt && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-950/30 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-2 animate-rise-up">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>AI Directive Output</span>
                  </span>
                  <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-extrabold">{currentPrompt.growthMetric}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{currentPrompt.answer}"
                </p>
              </div>
            )}

            {/* Daily Growth Score */}
            <div className="mb-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">PROJECTED GROWTH SCORE</span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-3xl font-black text-emerald-400 font-poppins">
                    {currentPrompt?.growthScore || heroData.companyMock.growthScore}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" /> {heroData.companyMock.growthTrend}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Net Monthly Revenue</span>
                <div className="text-lg font-bold font-poppins">{heroData.companyMock.netRevenue}</div>
              </div>
            </div>

            {/* Graph Visualization Mock with Dynamic Heights */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-2">
                <span>90-DAY ASCENDING TRAJECTORY</span>
                <span className="text-emerald-400">+100% Growth Target</span>
              </div>
              <div className="h-24 flex items-end justify-between gap-2.5 pt-2 px-1">
                {(currentPrompt?.bars || [45, 65, 30, 85, 100]).map((h, i) => (
                  <div key={i} className="w-full flex flex-col items-center">
                    <div 
                      style={{ height: `${h}%` }}
                      className={`w-full rounded-t-md transition-all duration-700 ${
                        i === 4
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/40'
                          : 'bg-emerald-500/30'
                      }`} 
                    />
                    <span className="text-[9px] font-mono text-slate-400 mt-1">M{i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

