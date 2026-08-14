import React, { useState, useEffect } from 'react';
import { TrendingUp, X, Sparkles, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function GrowthLiveTicker({ tickerEvents = [] }) {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!tickerEvents || tickerEvents.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerEvents.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tickerEvents]);

  if (!isVisible || !tickerEvents || tickerEvents.length === 0) return null;

  const current = tickerEvents[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm w-full animate-rise-up">
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500 ${
        isDark 
          ? 'bg-slate-900/90 border-emerald-500/40 text-white shadow-emerald-950/60' 
          : 'bg-white/95 border-emerald-500/40 text-slate-900 shadow-xl'
      }`}>
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300" />

        <div className="flex items-start justify-between space-x-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-extrabold uppercase">{current.city}</span>
                <span>•</span>
                <span>{current.sector}</span>
              </div>
              <p className="text-xs font-extrabold font-poppins mt-0.5 text-slate-900 dark:text-white leading-tight">
                {current.result}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center space-x-1 text-emerald-500 font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Live MSME Growth Milestone</span>
          </span>
          <span className="font-mono">{current.time}</span>
        </div>
      </div>
    </div>
  );
}
