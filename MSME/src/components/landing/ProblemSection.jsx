import React from 'react';
import { TrendingDown, HelpCircle, DollarSign, Package, Calendar, ArrowDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ProblemSection() {
  const { isDark } = useTheme();

  const problems = [
    {
      title: 'Sales Data',
      question: 'Am I growing?',
      description: 'Daily transaction records accumulate fast, but calculating true growth rates and identifying top drivers remains confusing.',
      icon: TrendingDown,
    },
    {
      title: 'Expenses',
      question: 'Where is my money going?',
      description: 'Hidden operational costs and unexpected vendor payouts silently drain business cash flow month after month.',
      icon: DollarSign,
    },
    {
      title: 'Inventory',
      question: 'What should I stock?',
      description: 'Uncertainty leads to either cash tied up in dead stock or lost customers due to sudden out-of-stock items.',
      icon: Package,
    },
    {
      title: 'Future Sales',
      question: 'What could my next month look like?',
      description: 'Relying solely on gut feeling makes budgeting, staffing, and purchasing for upcoming demand risky.',
      icon: Calendar,
    },
  ];

  return (
    <section className={`py-20 md:py-24 relative border-t border-b ${
      isDark ? 'bg-[#0F172A] border-[#243247]' : 'bg-slate-100/70 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
            isDark ? 'bg-[#111B2E] text-[#94A3B8] border-[#243247]' : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            <HelpCircle className="w-3.5 h-3.5 text-[#64748B]" />
            <span>The MSME Data Dilemma</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
            Every Business Has Data. <br className="hidden sm:inline" />
            <span className="text-[#10B981]">
              The Challenge Is Knowing What It Means.
            </span>
          </h2>

          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
            MSMEs generate valuable data every day across billing apps, ledger books, and spreadsheets, but often struggle to convert raw numbers into actionable growth decisions.
          </p>
        </div>

        {/* 4 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#111B2E] border-[#243247] hover:bg-[#162238]'
                    : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${
                  isDark ? 'bg-[#0B1220] border-[#243247] text-[#64748B]' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#64748B]' : 'text-slate-500'}`}>
                    {prob.title}
                  </span>
                  
                  <h3 className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    "{prob.question}"
                  </h3>

                  <p className={`text-sm leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                    {prob.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Connector to Solution */}
        <div className="mt-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
            <ArrowDown className="w-5 h-5" />
          </div>
          <span className={`text-xs font-extrabold uppercase tracking-widest ${isDark ? 'text-[#10B981]' : 'text-emerald-600'}`}>
            MSME Growth Advisor Bridges The Gap
          </span>
        </div>

      </div>
    </section>
  );
}
