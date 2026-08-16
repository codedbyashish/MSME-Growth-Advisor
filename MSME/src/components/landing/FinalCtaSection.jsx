import React from 'react';
import { TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function FinalCtaSection({ onStart }) {
  const { isDark } = useTheme();

  return (
    <section className={`py-20 md:py-28 relative overflow-hidden ${
      isDark ? 'bg-[#0a0e1a]' : 'bg-slate-900 text-white'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#101625] border border-[#1e2739] text-[#22c55e] text-xs font-semibold tracking-wide">
          <TrendingUp className="w-4 h-4" />
          <span>Ready For Sustainable Business Growth</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-[#f8fafc]">
          Your Business Has the Data.{' '}
          <span className="text-[#10b981]">
            Now Turn It Into Growth.
          </span>
        </h2>

        <p className="text-base sm:text-xl text-[#94a3b8] leading-relaxed max-w-2xl mx-auto font-normal">
          Start understanding your business better, make informed decisions, and plan for what's ahead.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#10b981] hover:bg-[#0ea371] text-slate-950 font-extrabold text-base tracking-wide flex items-center justify-center space-x-2.5 shadow-xl shadow-[#10b981]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Start Your Growth Journey</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-7 py-4 rounded-xl border border-[#1e2739] bg-[#101625] hover:bg-[#141b2d] text-[#f8fafc] text-base font-semibold transition-all cursor-pointer text-center"
          >
            Learn How It Works
          </a>
        </div>

        <div className="pt-4 flex items-center justify-center space-x-6 text-xs text-[#64748b]">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span>No Complex Setup Required</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#1e2739]" />
          <span>Built Exclusively for MSMEs</span>
        </div>

      </div>
    </section>
  );
}
