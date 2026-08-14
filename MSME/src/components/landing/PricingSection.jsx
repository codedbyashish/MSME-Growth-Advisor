import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PricingSection({ pricingData, isAnnual, setIsAnnual, onStart }) {
  const { isDark } = useTheme();

  if (!pricingData) return null;

  return (
    <section id="pricing" className={`relative z-10 py-24 px-6 border-t transition-colors duration-300 ${
      isDark ? 'bg-[#0a0f16] text-white border-slate-800/80' : 'bg-slate-50 text-slate-900 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          {pricingData.badge && (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{pricingData.badge}</span>
            </div>
          )}

          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-poppins ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {pricingData.title}
          </h2>

          <p className={`text-base sm:text-lg font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {pricingData.subtitle}
          </p>

          {/* Billing Toggle Switch */}
          <div className="pt-4 flex items-center justify-center space-x-4">
            <span className={`text-xs font-black uppercase ${!isAnnual ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className={`w-14 h-7 rounded-full p-1 relative border transition-colors focus:outline-none ${
                isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-300 border-slate-400'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-emerald-500 transition-transform duration-300 ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-black uppercase ${isAnnual ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-400'}`}>
                Annual Billing
              </span>
              {pricingData.discountBadge && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase shadow-sm">
                  {pricingData.discountBadge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {pricingData.plans?.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            if (plan.isPopular) {
              return (
                <div 
                  key={plan.id}
                  className={`rounded-3xl p-8 flex flex-col justify-between relative scale-[1.03] transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-900 border-2 border-emerald-500 text-white shadow-2xl shadow-emerald-950/80' 
                      : 'bg-white border-2 border-emerald-500 text-slate-900 shadow-2xl shadow-emerald-500/20'
                  }`}
                >
                  {plan.popularBadge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-md">
                      {plan.popularBadge}
                    </div>
                  )}

                  <div className="space-y-6 pt-2">
                    <div>
                      <h3 className="text-xl font-black font-poppins flex items-center justify-between text-slate-900 dark:text-white">
                        <span>{plan.name}</span>
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                      </h3>
                      <p className={`text-xs mt-1.5 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        {plan.subtitle}
                      </p>
                    </div>

                    <div className="flex items-baseline space-x-1">
                      <span className="text-4xl font-black text-emerald-500 dark:text-emerald-400 font-poppins">
                        ₹{price}
                      </span>
                      <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>/ month</span>
                    </div>

                    <div className={`w-full h-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

                    <ul className={`space-y-3.5 text-xs font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {plan.features?.map((feat, i) => (
                        <li key={i} className="flex items-center space-x-3">
                          <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={onStart}
                    className="mt-8 w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/30"
                  >
                    {plan.ctaText}
                  </button>
                </div>
              );
            }

            return (
              <div 
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between border transition-all duration-300 shadow-xl ${
                  isDark 
                    ? 'bg-slate-900 border-slate-700 text-white hover:border-emerald-500/50' 
                    : 'bg-white border-slate-300 text-slate-900 shadow-slate-200/50 hover:border-emerald-500/50'
                }`}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold font-poppins text-slate-900 dark:text-white">{plan.name}</h3>
                    <p className={`text-xs mt-1.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {plan.subtitle}
                    </p>
                  </div>

                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-black font-poppins text-slate-900 dark:text-white">
                      ₹{price}
                    </span>
                    <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>/ month</span>
                  </div>

                  <div className={`w-full h-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

                  <ul className={`space-y-3.5 text-xs font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {plan.features?.map((feat, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    {plan.disabledFeatures?.map((feat, i) => (
                      <li key={i} className="flex items-center space-x-3 text-slate-400 dark:text-slate-500 line-through">
                        <Check className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={onStart}
                  className={`mt-8 w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                    isDark 
                      ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                  }`}
                >
                  {plan.ctaText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
