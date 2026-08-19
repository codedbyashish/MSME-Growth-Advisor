import React from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function BusinessHealthSection() {
  const { isDark } = useTheme();

  const metrics = [
    { name: 'Sales Performance', score: 88, status: 'Strong', color: 'bg-[#66BB6A]' },
    { name: 'Expense Control', score: 76, status: 'Optimal', color: 'bg-[#81C784]' },
    { name: 'Inventory Health', score: 85, status: 'Good', color: 'bg-[#3B82F6]' },
    { name: 'Growth Trend', score: 80, status: 'Positive', color: 'bg-[#66BB6A]' },
  ];

  return (
    <section className={`py-20 md:py-28 relative border-t border-b ${
      isDark ? 'bg-[#0F172A] border-[#243247]' : 'bg-slate-100/70 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${
            isDark ? 'bg-[#111B2E] text-[#94A3B8] border-[#243247]' : 'bg-[#66BB6A]/10 text-[#4CAF50] border border-[#66BB6A]/30'
          }`}>
            <Activity className="w-3.5 h-3.5 text-[#66BB6A]" />
            <span>Instant Diagnostics</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
            Know the Health of Your Business{' '}
            <span className="text-[#66BB6A]">
              at a Glance
            </span>
          </h2>

          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
            A simple score helps business owners quickly understand where their business is performing well and where attention may be needed.
          </p>
        </div>

        {/* Business Health Card Container */}
        <div className="max-w-4xl mx-auto">
          <div className={`p-8 sm:p-10 rounded-3xl border shadow-2xl transition-all ${
            isDark ? 'bg-[#162238] border-[#243247]' : 'bg-white border-slate-200 shadow-slate-200/80'
          }`}>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Score Display */}
              <div className={`md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl border text-center ${
                isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-xs font-extrabold uppercase tracking-widest mb-3 ${isDark ? 'text-[#64748B]' : 'text-slate-500'}`}>
                  Overall Health Score
                </span>

                {/* Score Circle Ring */}
                <div className="relative w-40 h-40 flex items-center justify-center mb-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={isDark ? '#243247' : '#e2e8f0'}
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#66BB6A"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="45"
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-black ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                      82
                    </span>
                    <span className="text-xs font-semibold text-[#64748B]">/ 100</span>
                  </div>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#66BB6A] text-[#0B1220] text-xs font-black uppercase tracking-wider shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Healthy Status</span>
                </div>
              </div>

              {/* Breakdown Bars */}
              <div className="md:col-span-7 space-y-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                  Core Health Pillars
                </h3>

                <div className="space-y-4">
                  {metrics.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className={isDark ? 'text-[#94A3B8]' : 'text-slate-700'}>
                          {item.name}
                        </span>
                        <div className="space-x-2">
                          <span className="text-[#66BB6A]">{item.status}</span>
                          <span className={isDark ? 'text-[#64748B]' : 'text-slate-500'}>
                            {item.score}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className={`h-2.5 w-full rounded-full overflow-hidden ${
                        isDark ? 'bg-[#111B2E]' : 'bg-slate-100'
                      }`}>
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
                  isDark ? 'bg-[#111B2E] border-[#243247] text-[#94A3B8]' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <strong>Why it matters:</strong> Instead of sorting through complex accounting ledgers, a simple score helps business owners quickly understand where their business is performing well and where attention may be needed.
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
