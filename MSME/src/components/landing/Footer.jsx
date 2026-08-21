import React from 'react';

export default function Footer({ onOpenPricing, onOpenFaq, onOpenContact, onOpenPrivacy }) {
  return (
    <footer className="bg-[#FAF8F5] border-t border-[#EAE6DF] pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 pb-12">
          
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-lg font-bold text-[#1E293B]">
              MSME Growth Advisor
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-sm font-normal">
              Empowering Indian small businesses with clarity, control, and predictable growth.
            </p>
          </div>

          {/* Column 2: PRODUCT */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              PRODUCT
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#64748B]">
              <li><a href="#features" className="hover:text-[#1E293B] transition-colors">Features</a></li>
              <li>
                <button 
                  onClick={onOpenPricing} 
                  className="hover:text-[#1E293B] transition-colors text-left cursor-pointer"
                >
                  Pricing
                </button>
              </li>
              <li><a href="#changelog" className="hover:text-[#1E293B] transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              COMPANY
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#64748B]">
              <li><a href="#about" className="hover:text-[#1E293B] transition-colors">About Us</a></li>
              <li>
                <button 
                  onClick={onOpenContact} 
                  className="hover:text-[#1E293B] transition-colors text-left cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li><a href="#blog" className="hover:text-[#1E293B] transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Column 4: LEGAL */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              LEGAL
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#64748B]">
              <li>
                <button 
                  onClick={onOpenPrivacy} 
                  className="hover:text-[#1E293B] transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li><a href="#terms" className="hover:text-[#1E293B] transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright line */}
        <div className="pt-6 border-t border-[#EAE6DF] text-xs text-[#94A3B8]">
          <p>© 2024 MSME Growth Advisor. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
