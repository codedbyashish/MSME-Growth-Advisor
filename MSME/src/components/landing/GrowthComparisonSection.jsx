import React, { useState } from 'react';
import { XCircle, CheckCircle2, Zap, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function GrowthComparisonSection({ comparisonData, onStart }) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('all');

  if (!comparisonData) return null;

  return (
    <section id="comparison" className={`relative z-10 py-24 px-6 border-t transition-colors duration-300 ${
      isDark ? 'bg-[#0f1722] text-white border-slate-800/80' : 'bg-slate-100/90 text-slate-900 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {comparisonData.badge && (
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>{comparisonData.badge}</span>
            </div>
          )}

          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-poppins ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {comparisonData.title}
          </h2>

          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {comparisonData.subtitle}
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Traditional Way (Pain Points) */}
          <div className={`rounded-3xl p-7 border space-y-6 relative overflow-hidden ${
            isDark ? 'bg-slate-950/60 border-red-900/30' : 'bg-red-50/40 border-red-200'
          }`}>
            <div className="flex items-center justify-between border-b pb-4 border-red-200 dark:border-red-900/40">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-red-500">TRADITIONAL METHOD</span>
                <h3 className="text-xl font-bold font-poppins text-slate-800 dark:text-slate-200">Manual Bookkeeping & Excel</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-500 font-extrabold text-xs">
                Slow & Reactive
              </span>
            </div>

            <div className="space-y-6">
              {comparisonData.items?.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3.5 p-3 rounded-2xl bg-red-500/5 border border-red-500/10">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.traditional}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* With MSME Growth Advisor (Growth Transformation) */}
          <div className={`rounded-3xl p-7 border space-y-6 relative overflow-hidden shadow-2xl ${
            isDark 
              ? 'glass-panel-dark border-emerald-500/50 shadow-emerald-950/40' 
              : 'bg-white border-emerald-500/40 shadow-emerald-500/10'
          }`}>
            {/* Glowing Tag */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-400 to-teal-400 text-slate-950 font-black text-[10px] uppercase px-4 py-1.5 rounded-bl-2xl shadow-md">
              Growth Engine Active
            </div>

            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400">THE GROWTH ADVISOR WAY</span>
                <h3 className="text-xl font-bold font-poppins text-slate-900 dark:text-white flex items-center space-x-2">
                  <span>AI Strategic Financial Co-Pilot</span>
                </h3>
              </div>
            </div>

            <div className="space-y-6">
              {comparisonData.items?.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between space-x-3.5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{item.advisor}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 shrink-0">
                    {item.impact}
                  </span>
                </div>
              ))}
            </div>

            {/* Launch Action */}
            <button
              onClick={onStart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-95 mt-4"
            >
              <span>TRANSFORM YOUR BUSINESS TODAY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
