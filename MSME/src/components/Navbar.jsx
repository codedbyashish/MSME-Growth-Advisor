import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight, Menu, X, Sun, Moon, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onLaunchDashboard }) {
  const { toggleTheme, isDark } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleSignup = () => {
    setMobileMenuOpen(false);
    navigate('/signup');
  };

  const handleStart = () => {
    setMobileMenuOpen(false);
    if (onLaunchDashboard) {
      onLaunchDashboard();
    } else {
      navigate('/dashboard');
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#about' }
  ];

  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="sticky top-3 z-50 px-4 sm:px-6 max-w-[1240px] mx-auto transition-all duration-300">
      <header 
        className={`rounded-2xl border transition-all duration-300 px-5 sm:px-6 py-3 flex items-center justify-between shadow-lg ${
          isDark 
            ? 'bg-[#101827] border-[#243247] shadow-[#0B1220]/80' 
            : 'bg-white border-slate-200 shadow-slate-200'
        } ${scrolled ? 'py-2.5 border-[#66BB6A]/30 shadow-xl' : ''}`}
      >
        
        {/* Left — Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#66BB6A]/10 border border-[#66BB6A]/30 flex items-center justify-center text-[#66BB6A] group-hover:bg-[#66BB6A] group-hover:text-[#0B1220] transition-colors duration-200">
            <TrendingUp className="w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <span className={`text-base sm:text-lg font-bold tracking-tight flex items-center gap-1.5 transition-colors ${
              isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
            }`}>
              <span>MSME</span>
              <span className="text-[#66BB6A] font-medium">Growth Advisor</span>
            </span>
            <span className={`text-[10px] font-semibold tracking-wider uppercase ${
              isDark ? 'text-[#94A3B8]' : 'text-slate-500'
            }`}>
              AI-Powered Business Growth
            </span>
          </div>
        </div>

        {/* Center — Navigation */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeTab === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveTab(link.name)}
                  className={`relative py-1 transition-colors duration-200 ${
                    isActive
                      ? 'text-[#66BB6A] font-semibold'
                      : isDark
                      ? 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#66BB6A] rounded-full transition-all duration-200" />
                  )}
                </a>
              );
            })}
          </nav>
        )}

        {/* Right — Actions */}
        <div className="hidden md:flex items-center space-x-3 shrink-0">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
              isDark 
                ? 'bg-[#0B1220] border-[#243247] text-[#94A3B8] hover:text-[#66BB6A] hover:border-[#66BB6A]/50' 
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {isDashboard ? (
            <button 
              onClick={() => navigate('/')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all border ${
                isDark 
                  ? 'bg-[#0B1220] hover:bg-[#162238] text-[#F8FAFC] border-[#243247]' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <span>Back to Home</span>
            </button>
          ) : (
            <>
              {/* Login Button */}
              <button 
                onClick={handleLogin}
                className={`text-xs font-semibold px-4 py-2 rounded-xl border border-transparent transition-all duration-200 ${
                  isDark 
                    ? 'text-[#F8FAFC] hover:border-[#243247] hover:bg-[#162238]' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                LOGIN
              </button>

              {/* Get Started Button */}
              <button 
                onClick={handleSignup}
                className="px-5 py-2.5 rounded-xl bg-[#66BB6A] hover:bg-[#57a85b] text-[#0B1220] text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#66BB6A]/20 flex items-center space-x-1.5"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-[#0B1220] border-[#243247] text-[#94A3B8]' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl border transition-all ${
              isDark 
                ? 'bg-[#0B1220] border-[#243247] text-[#94A3B8] hover:text-[#F8FAFC]' 
                : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#66BB6A]" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden mt-2 p-5 rounded-2xl border shadow-2xl space-y-4 animate-slide-down ${
          isDark 
            ? 'bg-[#101827] border-[#243247] text-[#F8FAFC]' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {!isDashboard && (
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveTab(link.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === link.name
                      ? 'bg-[#66BB6A]/10 text-[#66BB6A] font-semibold'
                      : isDark
                      ? 'hover:bg-[#162238] text-[#94A3B8] hover:text-[#F8FAFC]'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-[#64748B]" />
                </a>
              ))}
            </nav>
          )}

          <div className="pt-3 border-t border-[#243247] flex flex-col space-y-2.5">
            <button 
              onClick={handleStart}
              className="w-full py-3 rounded-xl bg-[#66BB6A] hover:bg-[#57a85b] text-[#0B1220] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md"
            >
              <span>{isDashboard ? 'GO TO DASHBOARD' : 'GET STARTED'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!isDashboard && (
              <button 
                onClick={handleLogin}
                className={`w-full py-2.5 rounded-xl border text-xs font-semibold ${
                  isDark ? 'border-[#243247] text-[#F8FAFC] bg-[#0B1220]' : 'border-slate-300 text-slate-800 bg-slate-50'
                }`}
              >
                LOGIN
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
