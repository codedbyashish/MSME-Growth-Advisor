import React, { useState } from 'react';
import { TrendingUp, Sparkles, AlertCircle, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PredictionFeatureSection() {
  const { isDark } = useTheme();
  const [selectedHorizon, setSelectedHorizon] = useState('30days');

  return (
    <section className={`py-20 md:py-28 relative overflow-hidden ${
      isDark ? 'bg-[#0B1220]' : 'bg-slate-100/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Explanation */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${
              isDark ? 'bg-[#111B2E] text-[#66BB6A] border-[#243247]' : 'bg-[#66BB6A]/10 text-[#4CAF50] border border-[#66BB6A]/30'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-[#66BB6A]" />
              <span>Predictive Sales AI</span>
            </div>

            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
              Don't Just Look at Yesterday.{' '}
              <span className="text-[#66BB6A]">
                Plan for Tomorrow.
              </span>
            </h2>

            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
              Analyze your historical sales data to identify seasonal trends and estimate future sales, helping you plan inventory, control expenses, and make proactive business decisions.
            </p>

            {/* Callout Card Highlight */}
            <div className={`p-5 rounded-2xl border flex items-center justify-between shadow-lg ${
              isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-white border-[#66BB6A]/30 shadow-slate-200/80'
            }`}>
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#64748B]' : 'text-slate-500'}`}>
                  Next Month's Predicted Sales
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    ₹70,000
                  </span>
                  <span className="text-xs font-bold text-[#66BB6A] bg-[#66BB6A]/10 px-2 py-0.5 rounded-full border border-[#66BB6A]/20 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Growing
                  </span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-xl bg-[#66BB6A]/10 border border-[#66BB6A]/30 text-[#66BB6A] flex items-center justify-center font-bold text-lg">
                ↑ 14%
              </div>
            </div>

            <div className={`flex items-start space-x-2 text-xs leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
              <Info className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
              <span>
                Sales predictions evaluate patterns from past monthly revenue to provide reliable statistical estimates for upcoming stock planning.
              </span>
            </div>
          </div>

          {/* Right SVG Dual-Line Chart */}
          <div className="lg:col-span-7">
            <div className={`rounded-2xl border p-6 shadow-2xl transition-all ${
              isDark ? 'bg-[#111B2E] border-[#243247]' : 'bg-white border-slate-200 shadow-slate-200'
            }`}>
              
              {/* Chart Header controls */}
              <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 mb-4 border-b gap-3 ${
                isDark ? 'border-[#243247]' : 'border-slate-200'
              }`}>
                <div>
                  <h3 className={`text-base font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    Sales Forecast Visualization
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                    Historical Records vs. AI Projection Curve
                  </p>
                </div>

                <div className={`flex items-center space-x-2 p-1 rounded-xl text-xs font-semibold border ${
                  isDark ? 'bg-[#0B1220] border-[#243247]' : 'bg-slate-100 border-slate-200'
                }`}>
                  <button
                    onClick={() => setSelectedHorizon('30days')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedHorizon === '30days'
                        ? 'bg-[#66BB6A] text-[#0B1220] font-bold shadow'
                        : isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Next 30 Days
                  </button>
                  <button
                    onClick={() => setSelectedHorizon('60days')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedHorizon === '60days'
                        ? 'bg-[#66BB6A] text-[#0B1220] font-bold shadow'
                        : isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Next 60 Days
                  </button>
                </div>
              </div>

              {/* Chart Legends */}
              <div className="flex items-center space-x-6 text-xs mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-1 bg-[#3B82F6] rounded-full inline-block" />
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-slate-700'}>Historical Sales (Actual)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-1 bg-[#66BB6A] rounded-full inline-block border border-dashed border-[#66BB6A]" />
                  <span className="text-[#66BB6A] font-semibold">Predicted Sales (AI Forecast)</span>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="h-64 w-full relative pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#66BB6A" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#66BB6A" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke={isDark ? '#243247' : '#f1f5f9'} strokeWidth="1" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke={isDark ? '#243247' : '#f1f5f9'} strokeWidth="1" />
                  <line x1="0" y1="130" x2="500" y2="130" stroke={isDark ? '#243247' : '#f1f5f9'} strokeWidth="1" />

                  {/* Vertical Dividing Line for Current Month */}
                  <line x1="280" y1="10" x2="280" y2="160" stroke="#66BB6A" strokeDasharray="4 4" strokeWidth="1.5" />
                  <text x="285" y="25" fill="#66BB6A" fontSize="10" fontWeight="bold">Today</text>

                  {/* Shaded Area under prediction */}
                  <path
                    d="M 280 85 L 350 65 L 420 40 L 500 25 L 500 160 L 280 160 Z"
                    fill="url(#predictionGradient)"
                  />

                  {/* Solid Historical Line (Jan - May) -> Info color #3B82F6 */}
                  <path
                    d="M 10 135 L 75 125 L 140 110 L 210 100 L 280 85"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Dashed Prediction Line (June - August) -> Primary green #66BB6A */}
                  <path
                    d="M 280 85 L 350 65 L 420 40 L 500 25"
                    fill="none"
                    stroke="#66BB6A"
                    strokeWidth="4"
                    strokeDasharray="6 5"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  <circle cx="10" cy="135" r="5" fill="#3B82F6" />
                  <circle cx="75" cy="125" r="5" fill="#3B82F6" />
                  <circle cx="140" cy="110" r="5" fill="#3B82F6" />
                  <circle cx="210" cy="100" r="5" fill="#3B82F6" />
                  
                  <circle cx="280" cy="85" r="6" fill="#66BB6A" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="350" cy="65" r="5" fill="#66BB6A" />
                  <circle cx="420" cy="40" r="5" fill="#66BB6A" />
                  <circle cx="500" cy="25" r="6" fill="#66BB6A" stroke="#ffffff" strokeWidth="2" />
                </svg>
              </div>

              {/* Month Labels */}
              <div className={`flex justify-between items-center text-xs pt-3 border-t ${
                isDark ? 'border-[#243247] text-[#64748B]' : 'border-slate-200 text-slate-500'
              }`}>
                <span>Jan (₹42k)</span>
                <span>Feb (₹46k)</span>
                <span>Mar (₹52k)</span>
                <span>Apr (₹58k)</span>
                <span className="font-bold text-[#66BB6A]">May (₹61k)</span>
                <span className="font-bold text-[#66BB6A]">Jun (₹65k)</span>
                <span className="font-bold text-[#66BB6A]">Jul (₹70k)</span>
              </div>

              {/* Disclaimer footer */}
              <div className={`mt-4 p-3 rounded-xl flex items-center space-x-2 text-[11px] ${
                isDark ? 'bg-[#0B1220] text-[#94A3B8]' : 'bg-slate-100 text-slate-600'
              }`}>
                <AlertCircle className="w-4 h-4 text-[#66BB6A] shrink-0" />
                <span>
                  Predictions are calculated statistically using historical growth trends to aid inventory and expense planning.
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
