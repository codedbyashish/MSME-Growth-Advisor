import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

export default function FaqModal({ isOpen, onClose }) {
  const [openIdx, setOpenIdx] = useState(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How does MSME Growth Advisor predict future sales?',
      a: 'Our AI engine uses historical sales trends, demand seasonality, and product-level patterns to generate probabilistic sales forecasts. It helps you stock the right amount of inventory and prepare for peak demand periods without overspending.',
    },
    {
      q: 'Do I need technical skills or IT staff to use this software?',
      a: 'No! The interface was engineered specifically for small business owners in India. If you can use WhatsApp or Excel, you can use MSME Growth Advisor with zero learning curve.',
    },
    {
      q: 'Is my business and customer data safe & confidential?',
      a: '100% yes. We implement end-to-end 256-bit SSL encryption. Your data is isolated in secure cloud environments, and we never share or monetize your transaction data with third parties.',
    },
    {
      q: 'Can I import data from Tally, Vyapar, or Excel?',
      a: 'Yes, you can drag-and-drop CSV or Excel sales reports from popular Indian accounting software like Tally, Vyapar, Zoho Books, or manual registers.',
    },
    {
      q: 'Is there a free trial period?',
      a: 'Yes! We offer a full 14-day free trial on our Pro Growth plan with no credit card required so you can experience the power of predictive insights risk-free.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF] max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#64748B] hover:text-[#1E293B] bg-white rounded-full border border-slate-200 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#475569] bg-[#F1F5F9] px-3 py-1 rounded-full border border-[#CBD5E1]">
            Got Questions?
          </span>
          <h2 className="text-2xl font-bold text-[#1E293B] pt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#64748B]">
            Find answers to common questions about MSME Growth Advisor.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-sm text-[#1E293B] hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#1E293B] shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0 ml-2" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-[#64748B] leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
