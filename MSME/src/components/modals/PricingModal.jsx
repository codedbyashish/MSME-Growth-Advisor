import React from 'react';
import { X, Check } from 'lucide-react';

export default function PricingModal({ isOpen, onClose, onSelectPlan }) {
  if (!isOpen) return null;

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
        'Email support',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Pro Growth',
      price: '₹999',
      period: 'per month',
      desc: 'Everything growing MSMEs need for AI-driven sales forecasting & insights.',
      features: [
        'Unlimited sales transactions',
        'AI Sales & Demand Prediction',
        'Customer Insights & Cohorts',
        'Automated Smart Inventory Alerts',
        'Business Health Score & Recommendations',
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
        '24/7 Account Manager',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF] max-w-4xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
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
            Transparent Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">
            Simple plans for every MSME stage
          </h2>
          <p className="text-sm text-[#64748B]">
            No hidden fees. Cancel or upgrade anytime with 1-click.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-6 flex flex-col justify-between relative transition-all ${
                plan.popular
                  ? 'bg-white border-2 border-[#1E293B] shadow-lg scale-[1.02]'
                  : 'bg-white border border-[#E5E7EB] shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1E293B] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-[#1E293B]">{plan.name}</h3>
                <div className="mt-3 flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-[#1E293B]">{plan.price}</span>
                  <span className="text-xs text-[#64748B] font-medium">{plan.period}</span>
                </div>
                <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{plan.desc}</p>

                <div className="my-6 border-t border-slate-100 pt-4">
                  <ul className="space-y-2.5 text-xs text-[#334155]">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-[#1E293B] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onSelectPlan) onSelectPlan(plan.name);
                }}
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  plan.popular
                    ? 'bg-[#1E293B] hover:bg-[#0F172A] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#1E293B]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
