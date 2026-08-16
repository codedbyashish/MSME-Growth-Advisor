import React, { useState } from 'react';
import { Bot, User, Send, Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AiAssistantSection() {
  const { isDark } = useTheme();

  const sampleQuestions = [
    {
      q: "How were my sales this month?",
      a: "Your sales increased by 14.2% compared with the previous month. Your strongest sales period was the second week.",
    },
    {
      q: "What were my highest-selling months?",
      a: "October and Festive November were your highest-selling months last year, generating ₹3.2 Lakhs and ₹3.8 Lakhs in total revenue respectively.",
    },
    {
      q: "Which expenses increased?",
      a: "Raw material procurement expenses rose by 8% this month. Negotiating bulk supplier terms or adjusting inventory order cycles could save approx ₹12,000 monthly.",
    },
    {
      q: "What are my predicted sales?",
      a: "Based on your 6-month historical trend, projected sales for next month are ₹70,000, representing a steady 12-14% upward growth trajectory.",
    },
    {
      q: "How is my business performing?",
      a: "Your overall Business Health Score is 82/100 (Healthy). Sales performance and inventory rotation are strong, while expense control is operating at optimal levels.",
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className={`py-20 md:py-28 relative ${isDark ? 'bg-[#0a0e1a]' : 'bg-slate-100/70'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide ${
            isDark ? 'bg-[#101625] text-[#94a3b8] border border-[#1e2739]' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <Bot className="w-3.5 h-3.5 text-[#64748b]" />
            <span>Natural Language Business Intelligence</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${isDark ? 'text-[#f8fafc]' : 'text-slate-900'}`}>
            Ask Your Business.{' '}
            <span className="text-[#10b981]">
              Get Simple Answers.
            </span>
          </h2>

          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
            No SQL queries, complex formulas, or code required. Simply ask your AI business co-pilot standard business questions in plain English.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Left Sample Question Chips */}
          <div className="lg:col-span-4 space-y-3">
            <span className={`text-xs font-extrabold uppercase tracking-wider block px-1 ${isDark ? 'text-[#64748b]' : 'text-slate-500'}`}>
              Try Sample Questions
            </span>

            <div className="space-y-2">
              {sampleQuestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    activeIdx === idx
                      ? 'bg-[#10b981] text-slate-950 border-[#10b981] shadow-md font-bold'
                      : isDark
                      ? 'bg-[#101625]/80 border-[#1e2739] text-[#94a3b8] hover:bg-[#141b2d]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <span className="truncate pr-2">"{item.q}"</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Simulated Interactive Chat Box */}
          <div className="lg:col-span-8">
            <div className={`rounded-2xl border shadow-2xl overflow-hidden transition-all ${
              isDark ? 'bg-[#101625] border-[#1e2739]' : 'bg-white border-slate-200 shadow-slate-200'
            }`}>
              
              {/* Chat Title bar */}
              <div className="p-4 border-b border-[#1e2739] flex items-center justify-between bg-[#0a0e1a]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#10b981] flex items-center justify-center text-slate-950 font-bold shadow">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold ${isDark ? 'text-[#f8fafc]' : 'text-slate-900'}`}>
                      MSME Business Assistant
                    </h3>
                    <span className="text-[10px] text-[#22c55e] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                      Active & Connected to your ledger data
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                  AI Mode
                </span>
              </div>

              {/* Chat Thread */}
              <div className="p-6 space-y-5 min-h-[260px] flex flex-col justify-end">
                
                {/* User Message Bubble */}
                <div className="flex items-start justify-end space-x-2">
                  <div className="max-w-md p-4 rounded-2xl rounded-tr-none bg-[#10b981] text-slate-950 font-semibold text-xs sm:text-sm shadow">
                    {sampleQuestions[activeIdx].q}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#0a0e1a] border border-[#1e2739] flex items-center justify-center text-[#64748b] text-xs shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* AI Response Bubble */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#10b981] flex items-center justify-center text-slate-950 text-xs shrink-0 shadow">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className={`max-w-md p-4 rounded-2xl rounded-tl-none border text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'bg-[#0a0e1a] border-[#1e2739] text-[#f8fafc]' : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}>
                    {sampleQuestions[activeIdx].a}
                  </div>
                </div>

              </div>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-[#1e2739] flex items-center space-x-3 bg-[#0a0e1a]">
                <input
                  type="text"
                  readOnly
                  value={sampleQuestions[activeIdx].q}
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                    isDark ? 'bg-[#101625] border-[#1e2739] text-[#94a3b8]' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                />
                <button
                  onClick={() => setActiveIdx((prev) => (prev + 1) % sampleQuestions.length)}
                  className="px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#0ea371] text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow transition-all cursor-pointer"
                >
                  <span>Ask AI</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
