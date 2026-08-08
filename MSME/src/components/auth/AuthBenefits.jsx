import React from 'react';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AuthBenefits({ benefitsData }) {
  const { isDark } = useTheme();

  if (!benefitsData) return null;

  return (
    <div className="lg:col-span-5 space-y-8 hidden lg:block">
      {benefitsData.badge && (
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{benefitsData.badge}</span>
        </div>
      )}

      <h1 className="text-4xl font-extrabold tracking-tight font-poppins leading-tight">
        {benefitsData.title}
      </h1>

      <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        {benefitsData.description}
      </p>

      <div className="space-y-4 pt-2">
        {benefitsData.items?.map((item, idx) => {
          const isTeal = item.color === 'teal';
          return (
            <div key={idx} className="flex items-start space-x-3.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                isTeal ? 'bg-teal-500/20 text-teal-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {isTeal ? <CheckCircle2 className="w-4.5 h-4.5" /> : <ShieldCheck className="w-4.5 h-4.5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
