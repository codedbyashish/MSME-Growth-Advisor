import React, { useState } from 'react';
import { Check, Zap, Sparkles } from 'lucide-react';

export default function PricingSection({ onSelectPlan }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  const plans = [
    {
      name: 'Starter Free',
      price: '₹0',
      period: 'Forever free',
      desc: 'Ideal for single-shop owners and nano-enterprises starting out.',
      features: [
        'Up to 100 sales transactions / mo',
        'Basic Sales Dashboard',
        'Manual CSV data import',
        'Low stock inventory alerts',
        'Standard Email support',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Pro Growth',
      price: billingCycle === 'annual' ? '₹799' : '₹999',
      period: 'per month',
      desc: 'Everything growing MSMEs need for AI-driven sales forecasting & insights.',
      features: [
        'Unlimited sales transactions',
        'AI Sales & Demand Prediction',
        'Customer Insights & Retention Cohorts',
        'Automated Smart Inventory Alerts',
        'Business Health Score & Action Plan',
        'Priority Phone & Chat Support',
      ],
      cta: 'Start 14-Day Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Billed annually',
      desc: 'For multi-branch retail chains, wholesalers, and manufacturers.',
      features: [
        'Multi-location & branch sync',
        'Custom POS & Tally integrations',
        'Dedicated AI model training',
        'Custom financial reports',
        '24/7 Dedicated Account Manager',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="bg-[#FAF8F5] py-16 md:py-24 border-t border-[#EAE6DF] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider text-[#475569] bg-[#F1F5F9] border border-[#CBD5E1] uppercase">
            <Zap className="w-3.5 h-3.5 text-[#1E293B]" />
            <span>Transparent Pricing</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E293B] tracking-tight">
            Simple plans for every MSME stage
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            No hidden fees, no long-term contracts. Upgrade or cancel anytime.
          </p>

          {/* Billing Cycle Selector Toggle */}
          <div className="pt-4 flex items-center justify-center space-x-3">
            <span className={`text-xs sm:text-sm font-semibold ${billingCycle === 'monthly' ? 'text-[#1E293B]' : 'text-slate-400'}`}>
              Monthly Billed
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 bg-[#1E293B] rounded-full p-1 transition-colors relative focus:outline-none cursor-pointer"
              aria-label="Toggle Billing Cycle"
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs sm:text-sm font-semibold flex items-center space-x-1.5 ${billingCycle === 'annual' ? 'text-[#1E293B]' : 'text-slate-400'}`}>
              <span>Annual Billed</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-7 flex flex-col justify-between relative transition-all duration-300 ${
                plan.popular
                  ? 'bg-white border-2 border-[#1E293B] shadow-xl scale-[1.03] z-10'
                  : 'bg-white/90 border border-[#E5E7EB] hover:bg-white hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1E293B] text-white text-[11px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-[#1E293B]">{plan.name}</h3>
                
                <div className="mt-4 flex items-baseline space-x-1">
                  <span className="text-4xl font-extrabold text-[#1E293B] tracking-tight">{plan.price}</span>
                  <span className="text-xs text-[#64748B] font-medium">{plan.period}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#64748B] mt-2.5 leading-relaxed">{plan.desc}</p>

                <div className="my-6 border-t border-slate-100 pt-5">
                  <p className="text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-3">Included Features:</p>
                  <ul className="space-y-3 text-xs sm:text-sm text-[#334155]">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    if (onSelectPlan) onSelectPlan(plan.name);
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-[#1E293B] hover:bg-[#0F172A] text-white shadow-md hover:shadow-lg'
                      : 'bg-slate-100 hover:bg-slate-200 text-[#1E293B]'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
