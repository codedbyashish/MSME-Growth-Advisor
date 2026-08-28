import React, { useState } from 'react';
import { UploadCloud, Cpu, LineChart, Sparkles, ArrowRight, CheckCircle2, FileSpreadsheet, ShieldCheck, Zap } from 'lucide-react';

export default function HowItWorksSection({ onStart }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Upload or Sync Sales Data',
      desc: 'Simply upload your CSV transaction files, Excel sheets, or connect your billing register. Zero manual entry needed.',
      icon: UploadCloud,
      badge: 'Data Ingestion',
      detailTitle: 'Seamless Data Integration',
      detailPoints: [
        'Supports CSV, Excel, Tally exports & Billing POS',
        'Automatic column detection & schema cleaning',
        'Bank-grade 256-bit encryption for all records',
      ],
      previewContent: {
        type: 'upload',
        fileName: 'sales_q3_transactions.csv',
        rows: '4,280 sales records loaded',
        status: 'Processed in 1.2s'
      }
    },
    {
      step: '02',
      title: 'AI Analyzes Business Trends',
      desc: 'Our machine learning engine analyzes revenue seasonality, customer retention, and top-performing product categories.',
      icon: Cpu,
      badge: 'ML Engine',
      detailTitle: 'Automated Pattern Detection',
      detailPoints: [
        'Identifies peak sales hours and days of the week',
        'Segments customers into Repeat vs One-time buyers',
        'Flags slow-moving stock & margin leakage',
      ],
      previewContent: {
        type: 'analysis',
        metrics: [
          { label: 'Seasonality Index', val: '+24% High Demand' },
          { label: 'Customer Retention', val: '68% Repeat Rate' },
          { label: 'Top Category', val: 'Electronics & Accessories' }
        ]
      }
    },
    {
      step: '03',
      title: 'Get Predictive Forecasts',
      desc: 'View forecasted sales and demand for next week or next month so you stock inventory with precision.',
      icon: LineChart,
      badge: 'Demand AI',
      detailTitle: 'Proactive Inventory & Cash Planning',
      detailPoints: [
        'Predicts product-level demand for next 30-90 days',
        'Prevents overstocking cash lockup and stockouts',
        'Provides confidence bounds for revenue targets',
      ],
      previewContent: {
        type: 'forecast',
        growth: '+18.5%',
        projectedRevenue: '₹4,85,000 Next Month',
        accuracy: '94.2% AI Accuracy'
      }
    },
    {
      step: '04',
      title: 'Execute Recommended Actions',
      desc: 'Receive clear, step-by-step actionable recommendations to optimize cash flow, margins, and store profitability.',
      icon: Sparkles,
      badge: 'Growth Engine',
      detailTitle: 'Smart Business Recommendations',
      detailPoints: [
        'Actionable re-order suggestions with timing',
        'Dynamic pricing strategies to clear slow inventory',
        'Cash flow optimization checklists',
      ],
      previewContent: {
        type: 'actions',
        actionItems: [
          'Reorder 50 units of Wireless Earbuds before Friday',
          'Offer 5% combo discount on accessories to boost basket size',
          'Collect ₹32,000 pending receivables from top 3 debtors'
        ]
      }
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#FAF8F5] py-16 md:py-24 border-t border-[#EAE6DF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider text-[#475569] bg-[#F1F5F9] border border-[#CBD5E1] uppercase">
            <Zap className="w-3.5 h-3.5 text-[#1E293B]" />
            <span>4 Simple Steps</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E293B] tracking-tight">
            How MSME Growth Advisor Works
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            Transform your raw daily transactions into intelligent growth recommendations in four effortless steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative border flex flex-col justify-between ${
                  isActive 
                    ? 'bg-white border-[#1E293B] shadow-xl ring-2 ring-[#1E293B]/10 -translate-y-1' 
                    : 'bg-white/80 border-[#E5E7EB] hover:bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Step Header Top */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-[#1E293B] text-white' : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full tracking-wider ${
                      isActive ? 'bg-[#1E293B]/10 text-[#1E293B]' : 'bg-[#F1F5F9] text-[#94A3B8]'
                    }`}>
                      STEP {item.step}
                    </span>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-lg font-bold text-[#1E293B] mb-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                {/* Step Footer Indicator */}
                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#1E293B]">
                  <span>{item.badge}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 text-[#1E293B]' : 'text-slate-300'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Interactive Preview Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            
            {/* Left Detail Text */}
            <div className="space-y-4 md:w-1/2">
              <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-[#475569] bg-[#F1F5F9] px-3 py-1 rounded-full">
                <span>Step {steps[activeStep].step} Spotlight</span>
              </div>
              
              <h4 className="text-xl sm:text-2xl font-bold text-[#1E293B]">
                {steps[activeStep].detailTitle}
              </h4>

              <ul className="space-y-2.5 pt-1">
                {steps[activeStep].detailPoints.map((pt, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-xs sm:text-sm text-[#475569]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3">
                <button
                  onClick={onStart}
                  className="bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center space-x-2"
                >
                  <span>Try Step {steps[activeStep].step} Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Interactive Card Display */}
            <div className="md:w-1/2 w-full bg-[#FAF8F5] rounded-xl border border-[#EAE6DF] p-5">
              {activeStep === 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{steps[0].previewContent.fileName}</p>
                      <p className="text-[11px] text-slate-500">{steps[0].previewContent.rows}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-emerald-50 px-3 py-2 rounded-md border border-emerald-200">
                    <span className="font-semibold text-emerald-800">Status: Complete</span>
                    <span className="text-emerald-700 font-mono text-[11px]">{steps[0].previewContent.status}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>256-bit SSL Encrypted & Private</span>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-slate-700 mb-2">Real-Time Pattern Analysis</p>
                  {steps[1].previewContent.metrics.map((m, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-600 font-medium">{m.label}</span>
                      <span className="font-bold text-[#1E293B] bg-slate-100 px-2 py-0.5 rounded">{m.val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-3 text-center py-2">
                  <p className="text-xs font-semibold text-slate-500">Projected Demand Growth</p>
                  <p className="text-3xl font-extrabold text-[#1E293B]">{steps[2].previewContent.projectedRevenue}</p>
                  <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    <span>{steps[2].previewContent.growth} Expected Growth</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">{steps[2].previewContent.accuracy}</p>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 mb-2">Smart Recommendation Checklist</p>
                  {steps[3].previewContent.actionItems.map((act, i) => (
                    <div key={i} className="flex items-start space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700">
                      <span className="w-4 h-4 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{act}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
