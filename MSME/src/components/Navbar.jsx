import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar({ onLaunchDashboard, onOpenPricing, onOpenFaq, onOpenHowItWorks }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleGetStarted = () => {
    setMobileMenuOpen(false);
    if (onLaunchDashboard) {
      onLaunchDashboard();
    } else {
      navigate('/signup');
    }
  };

  const isDashboard = location.pathname === '/dashboard';

  return (
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

        {/* Desktop Navigation Links */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#475569]">
            <a 
              href="#features" 
              className="hover:text-[#1E293B] transition-colors"
            >
              Features
            </a>
            <a 
              href="#how-it-works"
              onClick={(e) => {
                if (onOpenHowItWorks) {
                  e.preventDefault();
                  onOpenHowItWorks();
                }
              }} 
              className="hover:text-[#1E293B] transition-colors cursor-pointer"
            >
              How it Works
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => {
                if (onOpenPricing) {
                  e.preventDefault();
                  onOpenPricing();
                }
              }}
              className="hover:text-[#1E293B] transition-colors cursor-pointer"
            >
              Pricing
            </a>
            <a 
              href="#faq" 
              onClick={(e) => {
                if (onOpenFaq) {
                  e.preventDefault();
                  onOpenFaq();
                }
              }}
              className="hover:text-[#1E293B] transition-colors cursor-pointer"
            >
              FAQ
            </a>
          </nav>
        )}

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center space-x-6">
          {isDashboard ? (
            <button 
              onClick={() => navigate('/')}
              className="text-sm font-semibold text-[#1E293B] hover:text-black transition-colors"
            >
              Back to Home
            </button>
          ) : (
            <>
              <button 
                onClick={handleLogin}
                className="text-sm font-semibold text-[#1E293B] hover:text-black transition-colors cursor-pointer"
              >
                Log in
              </button>

              <button 
                onClick={handleGetStarted}
                className="bg-[#1E293B] hover:bg-[#0F172A] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1E293B] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#EAE6DF] px-4 pt-2 pb-6 space-y-4">
          {!isDashboard && (
            <nav className="flex flex-col space-y-3 text-base font-medium text-[#475569]">
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#1E293B] py-1"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenHowItWorks) onOpenHowItWorks();
                }}
                className="hover:text-[#1E293B] py-1"
              >
                How it Works
              </a>
              <a 
                href="#pricing" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenPricing) onOpenPricing();
                }}
                className="hover:text-[#1E293B] py-1"
              >
                Pricing
              </a>
              <a 
                href="#faq" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenFaq) onOpenFaq();
                }}
                className="hover:text-[#1E293B] py-1"
              >
                FAQ
              </a>
            </nav>
          )}

          <div className="pt-3 border-t border-[#EAE6DF] flex flex-col space-y-3">
            <button 
              onClick={handleLogin}
              className="w-full text-left font-semibold text-[#1E293B] py-2"
            >
              Log in
            </button>
            <button 
              onClick={handleGetStarted}
              className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold py-3 rounded-lg text-center"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
