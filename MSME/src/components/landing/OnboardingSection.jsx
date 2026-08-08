import React from 'react';
import { Check, Building2, Database, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function OnboardingSection({ onboardingData, scrollProgress }) {
  const { isDark } = useTheme();

  if (!onboardingData) return null;

  return (
    <section id="how-it-works" className={`relative z-10 py-24 px-6 border-t transition-colors duration-300 ${
      isDark ? 'bg-[#0f1722] text-white border-slate-800/80' : 'bg-slate-100/90 text-slate-900 border-slate-200'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          {onboardingData.tag && (
            <span className="text-xs font-extrabold tracking-widest text-emerald-500 uppercase">{onboardingData.tag}</span>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-poppins">
            {onboardingData.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {onboardingData.subtitle}
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto px-4">
          {/* Timeline track line background */}
          <div className="absolute left-[31px] top-8 bottom-8 w-1.5 rounded-full bg-slate-300 dark:bg-slate-800" />
          
          {/* Scroll-driven animated progress bar */}
          <div 
            style={{ height: `${scrollProgress}%` }} 
            className="absolute left-[31px] top-8 max-h-[calc(100%-4rem)] w-1.5 rounded-full bg-gradient-to-b from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.9)] transition-all duration-150" 
          />

          <div className="space-y-14 relative z-10">
            {onboardingData.steps?.map((step) => {
              const isActive = scrollProgress >= step.triggerScroll;

              return (
                <div 
                  key={step.number}
                  className={`flex items-start space-x-6 p-4 rounded-2xl transition-all duration-500 ${
                    isActive 
                      ? (isDark ? 'bg-slate-900/90 border border-emerald-500/40 shadow-xl shadow-emerald-950/40' : 'bg-white border border-emerald-500/40 shadow-xl') 
                      : 'opacity-70'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-all duration-500 ${
                    isActive 
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 scale-110 shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                  }`}>
                    {isActive ? <Check className="w-6 h-6 stroke-[3]" /> : step.number}
                  </div>
                  <div className="pt-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-bold font-poppins transition-colors ${isActive ? 'text-emerald-400' : ''}`}>
                        {step.title}
                      </h3>

                      {step.icons && (
                        <div className="flex space-x-2 bg-slate-200/60 dark:bg-slate-800 p-2 rounded-xl border border-slate-300 dark:border-slate-700">
                          <Building2 className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <Database className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                          <Zap className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                        </div>
                      )}

                      {step.badge && isActive && (
                        <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                          step.badge === 'Active Engine' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse'
                            : 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                        }`}>
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
