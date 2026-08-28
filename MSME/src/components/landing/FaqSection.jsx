import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageSquare } from 'lucide-react';

export default function FaqSection({ onOpenContact }) {
  const [openIdx, setOpenIdx] = useState(0);

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
    {
      q: 'Can I use MSME Growth Advisor on my smartphone?',
      a: 'Absolutely. The platform is fully responsive and optimized for mobile browsers so shop managers and business owners can view analytics anywhere on the go.',
    },
  ];

  return (
    <section id="faq" className="bg-[#FAF8F5] py-16 md:py-24 border-t border-[#EAE6DF] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider text-[#475569] bg-[#F1F5F9] border border-[#CBD5E1] uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-[#1E293B]" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E293B] tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            Everything you need to know about MSME Growth Advisor. Can't find your answer? Reach out to our team.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  isOpen ? 'border-[#1E293B] ring-1 ring-[#1E293B]/10 shadow-md' : 'border-[#E5E7EB] hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-base text-[#1E293B] hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  {isOpen ? (
                    <div className="w-7 h-7 rounded-full bg-[#1E293B] text-white flex items-center justify-center shrink-0">
                      <ChevronUp className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-[#475569] leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA Banner */}
        <div className="mt-12 max-w-3xl mx-auto bg-white rounded-2xl border border-[#E2E8F0] p-6 text-center space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#F1F5F9] text-[#1E293B] flex items-center justify-center mx-auto">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#1E293B]">Have more questions?</h3>
          <p className="text-xs sm:text-sm text-[#64748B]">Our support team is here to help you get set up and answer any queries.</p>
          <button
            onClick={onOpenContact}
            className="bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center space-x-2 mt-1"
          >
            <span>Contact Support</span>
          </button>
        </div>

      </div>
    </section>
  );
}
