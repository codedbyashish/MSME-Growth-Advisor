import React from 'react';
import { Target } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AboutSection() {
  const { isDark } = useTheme();

  const stats = [
    { value: '10,000+', label: 'MSMEs Empowered', sublabel: 'Across retail & manufacturing' },
    { value: '₹15 Cr+', label: 'Costs Saved', sublabel: 'Via expense optimization' },
    { value: '94%', label: 'Prediction Accuracy', sublabel: 'Historical sales modeling' },
    { value: '4.9/5', label: 'User Satisfaction', sublabel: 'Non-technical business owners' },
  ];

  return (
    <section id="about" className={`py-20 md:py-28 relative ${isDark ? 'bg-[#0a0e1a]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide ${
            isDark ? 'bg-[#101625] text-[#94a3b8] border border-[#1e2739]' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <Target className="w-3.5 h-3.5 text-[#64748b]" />
            <span>Our Mission</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${isDark ? 'text-[#f8fafc]' : 'text-slate-900'}`}>
            Built Specially For{' '}
            <span className="text-[#10b981]">
              MSME Business Owners
            </span>
          </h2>

          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
            Micro, Small, and Medium Enterprises form the backbone of the economy. We believe every business owner deserves enterprise-grade financial intelligence without complexity.
          </p>
        </div>

        {/* Impact Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border text-center space-y-2 transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-[#101625]/90 border-[#1e2739] hover:bg-[#141b2d]'
                  : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black text-[#10b981]">
                {stat.value}
              </div>
              <div className={`text-sm font-bold ${isDark ? 'text-[#f8fafc]' : 'text-slate-900'}`}>
                {stat.label}
              </div>
              <p className={`text-xs ${isDark ? 'text-[#64748b]' : 'text-slate-500'}`}>
                {stat.sublabel}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
