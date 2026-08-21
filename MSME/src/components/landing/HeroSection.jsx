import React from 'react';
import heroOwnerImg from '../../assets/hero-owner.jpg';

export default function HeroSection({ onStart, onSeeHowItWorks }) {
  return (
    <section className="bg-[#FAF8F5] pt-12 pb-16 md:pt-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text Content */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-wider text-[#475569] bg-[#F1F5F9] border border-[#CBD5E1] uppercase">
              FOR INDIAN MSMEs
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1E293B] leading-[1.12]">
              Understand your business.<br />
              Predict what's next.<br />
              Grow smarter.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl font-normal">
              Clear, actionable insights without the jargon. We turn your scattered data into a simple dashboard that tells you exactly how your business is performing and what to do next.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={onStart}
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold text-base shadow-sm transition-all cursor-pointer text-center"
              >
                Get Started Free
              </button>

              <button
                onClick={() => {
                  if (onSeeHowItWorks) {
                    onSeeHowItWorks();
                  } else {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-[#1E293B] border border-[#E2E8F0] font-semibold text-base shadow-sm transition-all cursor-pointer text-center"
              >
                See how it works
              </button>
            </div>

          </div>

          {/* Right Column Hero Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-white">
              <img 
                src={heroOwnerImg} 
                alt="Indian business owner reviewing sales analytics on laptop in shop warehouse" 
                className="w-full h-[380px] sm:h-[450px] object-cover object-center"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Sub-hero Social Proof Banner Strip */}
      <div className="mt-16 md:mt-20 border-y border-[#EAE6DF] bg-[#F5F3EF] py-5 px-4 text-center">
        <p className="text-xs sm:text-sm md:text-base font-medium text-[#64748B]">
          Built for retail, manufacturing, wholesale, and service businesses across India
        </p>
      </div>

    </section>
  );
}
