import React from 'react';
import { Database, LineChart, Cpu, CheckCircle2, TrendingUp, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function GrowthJourneySection() {
  const { isDark } = useTheme();

  const steps = [
    {
      number: '01',
      title: 'Track',
      description: 'Add your sales, expenses, inventory, and customer data simply without complex accounting setups.',
      icon: Database,
      badge: 'Data Entry',
    },
    {
      number: '02',
      title: 'Understand',
      description: 'View clear dashboards and business performance metrics tailored for non-technical business owners.',
      icon: LineChart,
      badge: 'Visual Analytics',
    },
    {
      number: '03',
      title: 'Predict',
      description: 'Use historical sales data to estimate upcoming sales trends and plan ahead with confidence.',
      icon: Cpu,
      badge: 'AI Forecasting',
    },
    {
      number: '04',
      title: 'Decide',
      description: 'Use AI-generated insights and recommendations to make informed, data-driven decisions.',
      icon: CheckCircle2,
      badge: 'Smart Recommendations',
    },
    {
      number: '05',
      title: 'Grow',
      description: 'Improve planning, reduce unnecessary costs, manage inventory better, and achieve sustainable growth.',
      icon: TrendingUp,
      badge: 'Sustainable Success',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide ${
            isDark ? 'bg-[#101625] text-[#94a3b8] border border-[#1e2739]' : 'bg-[#66BB6A]/10 text-[#4CAF50] border border-[#66BB6A]/30'
          }`}>
            <span>5-Step Visual Framework</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${isDark ? 'text-[#f8fafc]' : 'text-slate-900'}`}>
            Your Journey From{' '}
            <span className="text-[#66BB6A]">
              Data to Growth
            </span>
          </h2>

          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
            A clear step-by-step roadmap that transforms raw daily numbers into confident, profitable business actions.
          </p>
        </div>

        {/* 5-Step Journey Flow */}
        <div className="relative">
          {/* Connection Line */}
          <div className={`hidden lg:block absolute top-1/2 left-4 right-4 h-1 -translate-y-6 ${
            isDark ? 'bg-[#1e2739]' : 'bg-slate-200'
          }`} />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div
                  key={step.number}
                  className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                    isLast
                      ? isDark
                        ? 'bg-[#101625] border-[#66BB6A] shadow-lg shadow-[#66BB6A]/10'
                        : 'bg-gradient-to-b from-[#66BB6A]/10 to-white border-[#66BB6A] shadow-md'
                      : isDark
                      ? 'bg-[#101625]/90 border-[#1e2739] hover:bg-[#141b2d]'
                      : 'bg-white border-slate-200 hover:border-[#66BB6A]/50 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Top Step Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-2xl font-black ${
                        isLast ? 'text-[#66BB6A]' : isDark ? 'text-[#64748b] group-hover:text-[#66BB6A]' : 'text-slate-400'
                      }`}>
                        {step.number}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isLast
                          ? 'bg-[#66BB6A] text-slate-950'
                          : isDark
                          ? 'bg-[#0a0e1a] text-[#64748b]'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {step.badge}
                      </span>
                    </div>

                    {/* Step Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                      isLast
                        ? 'bg-[#66BB6A] text-slate-950'
                        : isDark
                        ? 'bg-[#0a0e1a] text-[#64748b] group-hover:text-[#66BB6A]'
                        : 'bg-[#66BB6A]/10 text-[#4CAF50]'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Step Title */}
                    <h3 className={`text-xl font-bold mb-2 flex items-center justify-between ${
                      isDark ? 'text-[#f8fafc]' : 'text-slate-900'
                    }`}>
                      <span>{step.title}</span>
                      {!isLast && <ChevronRight className="w-4 h-4 text-[#64748b] hidden lg:block" />}
                    </h3>

                    {/* Step Description */}
                    <p className={`text-xs leading-relaxed ${
                      isDark ? 'text-[#94a3b8]' : 'text-slate-600'
                    }`}>
                      {step.description}
                    </p>
                  </div>

                  {!isLast && (
                    <div className="pt-4 flex justify-center lg:hidden">
                      <div className="w-6 h-6 rounded-full bg-[#66BB6A]/10 text-[#66BB6A] flex items-center justify-center text-xs">
                        ↓
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
