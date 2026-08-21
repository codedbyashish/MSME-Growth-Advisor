import React from 'react';

export default function FinalCtaSection({ onStart }) {
  return (
    <section className="bg-[#1E293B] py-16 sm:py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
          Ready to understand your business better?
        </h2>

        <div>
          <button
            onClick={onStart}
            className="bg-white hover:bg-slate-100 text-[#1E293B] font-bold text-sm sm:text-base px-7 py-3.5 rounded-lg shadow-md transition-all cursor-pointer inline-flex items-center justify-center hover:scale-105 active:scale-95"
          >
            Start Your Free Trial
          </button>
        </div>
      </div>
    </section>
  );
}
