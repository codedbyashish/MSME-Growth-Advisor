import React from 'react';
import { BarChart3, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`border-t transition-colors ${
      isDark ? 'bg-[#0a0e1a] border-[#1e2739] text-[#94a3b8]' : 'bg-slate-900 border-slate-800 text-slate-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#1e2739]">
          
          {/* Logo & Description */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#10b981] flex items-center justify-center text-slate-950 font-bold shadow-md">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#f8fafc]">
                MSME <span className="text-[#10b981] font-medium">Growth Advisor</span>
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-md text-[#94a3b8]">
              AI-powered insights to help MSMEs understand their business, predict sales, and make smarter growth decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-semibold">
            
            <div className="space-y-3">
              <span className="text-[#f8fafc] font-extrabold uppercase tracking-wider text-[11px]">Navigation</span>
              <ul className="space-y-2 text-[#94a3b8]">
                <li><a href="#home" className="hover:text-[#10b981] transition-colors">Home</a></li>
                <li><a href="#features" className="hover:text-[#10b981] transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-[#10b981] transition-colors">How It Works</a></li>
                <li><a href="#about" className="hover:text-[#10b981] transition-colors">About</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-[#f8fafc] font-extrabold uppercase tracking-wider text-[11px]">Legal & Help</span>
              <ul className="space-y-2 text-[#94a3b8]">
                <li><a href="#privacy" className="hover:text-[#10b981] transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-[#10b981] transition-colors">Terms of Service</a></li>
                <li><a href="#contact" className="hover:text-[#10b981] transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <span className="text-[#f8fafc] font-extrabold uppercase tracking-wider text-[11px]">Platform</span>
              <p className="text-[#64748b] leading-normal text-xs font-normal">
                Designed for retail, manufacturing, services, and trading MSMEs.
              </p>
            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748b] gap-4">
          <p>© {new Date().getFullYear()} MSME Growth Advisor. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Built for MSME Growth</span>
            <Heart className="w-3.5 h-3.5 text-[#10b981] fill-[#10b981] inline" />
          </div>
        </div>

      </div>
    </footer>
  );
}
