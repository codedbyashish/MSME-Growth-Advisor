import React from 'react';
import { LayoutGrid, TrendingUp, Users, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthLayout({ children }) {
  const navigate = useNavigate();

  const benefits = [
    { 
      title: 'Sales & Revenue Insights', 
      desc: 'Clear performance metrics, transaction tracking, and revenue trends.',
      icon: LayoutGrid
    },
    { 
      title: 'Demand Forecasting', 
      desc: 'Predict upcoming sales demand based on past business data.',
      icon: TrendingUp
    },
    { 
      title: 'Customer Intelligence', 
      desc: 'Identify repeat buyers and understand purchasing patterns.',
      icon: Users
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] font-sans flex flex-col justify-between selection:bg-[#1E293B] selection:text-white">
      
      {/* Top Header matching Landing Page Navbar */}
      <header className="w-full bg-[#FAF8F5] border-b border-[#EAE6DF] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center space-x-2 select-none"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B]">
              MSME Growth Advisor
            </span>
          </div>

          {/* Right Navigation Link */}
          <button
            onClick={() => navigate('/')}
            className="text-sm font-semibold text-[#1E293B] hover:text-black flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

        </div>
      </header>

      {/* Main Content: 2-Column Layout */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Landing Page Style Brand Messaging & Features */}
          <div className="lg:col-span-6 space-y-7 text-left hidden lg:block">
            
            {/* Pill Badge matching HeroSection */}
            <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-wider text-[#475569] bg-[#F1F5F9] border border-[#CBD5E1] uppercase">
              FOR INDIAN MSMEs
            </div>

            {/* Headline matching HeroSection */}
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#1E293B] leading-[1.12]">
              Understand your business.<br />
              Predict what's next.<br />
              Grow smarter.
            </h1>

            {/* Subtitle */}
            <p className="text-base text-[#64748B] leading-relaxed max-w-lg font-normal">
              MSME Growth Advisor turns your scattered data into simple, actionable insights so you can make confident decisions every day.
            </p>

            {/* Feature Cards matching CoreFeaturesSection card style */}
            <div className="space-y-3.5 pt-2">
              {benefits.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-white p-4 sm:p-4.5 rounded-xl border border-[#E5E7EB] shadow-sm flex items-start space-x-4 max-w-lg transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center text-[#1E293B] shrink-0 mt-0.5">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1E293B]">{item.title}</h3>
                      <p className="text-xs text-[#64748B] font-normal leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Security Assurance */}
            <div className="flex items-center space-x-2 text-xs text-[#64748B] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span className="font-medium">Bank-grade data privacy and secure cloud infrastructure</span>
            </div>

          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-[460px] bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xl relative transition-all">
              {children}
            </div>
          </div>

        </div>
      </main>

      {/* Footer matching Landing Page Footer */}
      <footer className="bg-[#FAF8F5] border-t border-[#EAE6DF] py-6 text-center text-xs text-[#94A3B8]">
        <p>© {new Date().getFullYear()} MSME Growth Advisor. All rights reserved.</p>
      </footer>

    </div>
  );
}

