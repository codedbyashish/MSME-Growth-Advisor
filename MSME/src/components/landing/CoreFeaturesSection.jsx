import React from 'react';
import { TrendingUp, BarChart3, Wallet, PackageCheck, Activity, Bot } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function CoreFeaturesSection() {
  const { isDark } = useTheme();

  const features = [
    {
      name: 'Sales Prediction',
      description: 'Predict future sales based on historical business data so you can prepare stock and manage cash flow effectively.',
      icon: TrendingUp,
    },
    {
      name: 'Sales Analytics',
      description: 'Understand sales performance, growth trends, peak selling windows, and total revenue with clean visuals.',
      icon: BarChart3,
    },
    {
      name: 'Expense Management',
      description: 'Track operational expenses, categorize vendor payouts, and identify wasteful spending patterns instantly.',
      icon: Wallet,
    },
    {
      name: 'Inventory Management',
      description: 'Monitor stock levels, avoid stock-outs during peak demand, and identify slow-moving inventory issues early.',
      icon: PackageCheck,
    },
    {
      name: 'Business Health Score',
      description: 'Get a simple, composite 0–100 overview of your overall business stability, revenue strength, and efficiency.',
      icon: Activity,
    },
    {
      name: 'AI Business Assistant',
      description: 'Ask plain-language questions about your business data and receive simple, actionable advice in real time.',
      icon: Bot,
    },
  ];

  return (
    <section id="features" className={`py-20 md:py-28 relative ${isDark ? 'bg-[#0a0e1a]' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide ${
            isDark ? 'bg-[#101625] text-[#94a3b8] border border-[#1e2739]' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <span>Tailored for MSMEs</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${isDark ? 'text-[#f8fafc]' : 'text-slate-900'}`}>
            Tools Built Around Your{' '}
            <span className="text-[#10b981]">
              Business Growth
            </span>
          </h2>

          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
            Everything a growing small-to-medium enterprise needs in one clean, straightforward toolkit.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isDark
                    ? 'bg-[#101625]/90 border-[#1e2739] hover:bg-[#141b2d]'
                    : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${
                  isDark 
                    ? 'bg-[#0a0e1a] border-[#1e2739] text-[#64748b]' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className={`text-xl font-bold mb-2.5 ${isDark ? 'text-[#f8fafc]' : 'text-slate-900'}`}>
                  {feat.name}
                </h3>

                <p className={`text-sm leading-relaxed ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
