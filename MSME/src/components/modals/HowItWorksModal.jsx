import React from 'react';
import { X, UploadCloud, Cpu, LineChart, Sparkles } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose, onStart }) {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Upload or Sync Sales Data',
      desc: 'Simply upload your CSV transaction files or connect your existing billing register. No manual entry needed.',
      icon: UploadCloud,
    },
    {
      step: '02',
      title: 'AI Analyzes Business Trends',
      desc: 'Our machine learning models analyze revenue seasonality, top selling items, and customer retention metrics.',
      icon: Cpu,
    },
    {
      step: '03',
      title: 'Get Predictive Forecasts',
      desc: 'View forecasted demand for next week or next month so you order stock with exact precision.',
      icon: LineChart,
    },
    {
      step: '04',
      title: 'Execute Recommended Actions',
      desc: 'Receive clear step-by-step business recommendations to optimize cash flow, margin, and profitability.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF] max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#64748B] hover:text-[#1E293B] bg-white rounded-full border border-slate-200 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#475569] bg-[#F1F5F9] px-3 py-1 rounded-full border border-[#CBD5E1]">
            4 Simple Steps
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">
            How MSME Growth Advisor Works
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            From raw transaction records to intelligent growth recommendations in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center text-[#1E293B]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-[#94A3B8] tracking-wider">{item.step}</span>
                </div>
                <h3 className="text-sm font-bold text-[#1E293B] mb-1">{item.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              onClose();
              if (onStart) onStart();
            }}
            className="bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Try It Free Now
          </button>
        </div>

      </div>
    </div>
  );
}
