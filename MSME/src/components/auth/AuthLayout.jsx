import React from 'react';
import { TrendingUp, CheckCircle2, ShieldCheck, Sparkles, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function AuthLayout({ children }) {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();

  const benefits = [
    { title: 'Sales Insights', desc: 'Clear performance metrics & revenue trends' },
    { title: 'Future Sales Prediction', desc: 'AI-driven forecasting based on past data' },
    { title: 'Business Health Overview', desc: '0–100 composite stability score' },
  ];

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 selection:bg-[#10B981] selection:text-[#0B1220] ${
      isDark ? 'bg-[#0B1220] text-[#F8FAFC]' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Header with Theme Switcher */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 cursor-pointer group w-fit"
        >
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-[#0B1220] transition-colors duration-200 shadow-md shadow-[#10B981]/10">
            <TrendingUp className="w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <span className={`text-lg sm:text-xl font-bold tracking-tight flex items-center gap-1.5 ${
              isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
            }`}>
              <span>MSME</span>
              <span className="text-[#10B981] font-medium">Growth Advisor</span>
            </span>
            <span className={`text-[10px] font-semibold tracking-wider uppercase ${
              isDark ? 'text-[#94A3B8]' : 'text-slate-500'
            }`}>
              AI-Powered Business Growth
            </span>
          </div>
        </div>

        {/* Right Header Actions: Theme Switcher & Back to Home */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
              isDark 
                ? 'bg-[#111B2E] border-[#243247] text-[#94A3B8] hover:text-[#10B981]' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-indigo-500" />
            )}
          </button>

          <button
            onClick={() => navigate('/')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all hidden sm:block ${
              isDark
                ? 'bg-[#111B2E] border-[#243247] text-[#94A3B8] hover:text-[#F8FAFC]'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm'
            }`}
          >
            Home
          </button>
        </div>
      </header>

      {/* Main Content (2-Column Grid on Desktop) */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Business Marketing & Benefits (Desktop Visible) */}
          <div className="lg:col-span-6 space-y-8 text-left hidden lg:block">
            
            <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
              isDark ? 'bg-[#111B2E] border-[#243247] text-[#10B981]' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Financial Intelligence Co-Pilot</span>
            </div>

            <h1 className={`text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] ${
              isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
            }`}>
              Your Business.<br />
              Your Data.<br />
              <span className="text-[#10B981]">Your Growth.</span>
            </h1>

            <p className={`text-base leading-relaxed max-w-lg font-normal ${
              isDark ? 'text-[#94A3B8]' : 'text-slate-600'
            }`}>
              MSME Growth Advisor helps you understand your business data, identify trends, and plan ahead with AI-powered insights designed for business owners.
            </p>

            {/* 3 Business Benefits */}
            <div className="space-y-4 pt-2">
              {benefits.map((item, idx) => (
                <div key={idx} className={`flex items-start space-x-3 p-3.5 rounded-xl border max-w-lg ${
                  isDark ? 'bg-[#111B2E]/60 border-[#243247]' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>{item.title}</h3>
                    <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`flex items-center space-x-2 text-xs pt-2 ${
              isDark ? 'text-[#64748B]' : 'text-slate-500'
            }`}>
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Secure, Private & Enterprise-Grade Data Encryption</span>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className={`w-full max-w-[460px] border rounded-3xl p-6 sm:p-8 shadow-2xl relative transition-colors ${
              isDark 
                ? 'bg-[#111B2E] border-[#243247] shadow-[#0B1220]/90' 
                : 'bg-white border-slate-200 shadow-slate-200'
            }`}>
              {children}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className={`py-6 text-center text-xs border-t ${
        isDark ? 'text-[#64748B] border-[#243247]/60' : 'text-slate-500 border-slate-200'
      }`}>
        <p>© {new Date().getFullYear()} MSME Growth Advisor. All rights reserved.</p>
      </footer>

    </div>
  );
}
