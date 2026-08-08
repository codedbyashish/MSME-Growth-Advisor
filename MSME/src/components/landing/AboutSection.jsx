import React from 'react';
import { Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AboutSection({ aboutData }) {
  const { isDark } = useTheme();

  if (!aboutData) return null;

  return (
    <section id="about" className={`relative z-10 py-24 px-6 border-t transition-colors duration-300 ${
      isDark ? 'bg-[#0d131a] text-white border-slate-800/80' : 'bg-white text-slate-900 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {aboutData.badge && (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>{aboutData.badge}</span>
            </div>
          )}
          <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight font-poppins ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {aboutData.title}
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {aboutData.description}
          </p>
        </div>

        {/* Impact Stat Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aboutData.stats?.map((stat, idx) => (
            <div 
              key={idx}
              className={`fluid-hover-card rounded-3xl p-6 border text-center space-y-2 ${
                isDark ? 'glass-panel-dark' : 'glass-panel-light'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black text-emerald-500 font-poppins">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</div>
              <p className="text-[11px] text-slate-500">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
