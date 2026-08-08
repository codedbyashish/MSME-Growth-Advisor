import React, { useState, useEffect } from 'react';
import { BarChart3, ArrowRight, Menu, X, Sparkles, ChevronRight, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onLaunchDashboard }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
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
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' }
  ];

  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="sticky top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto transition-all duration-500">
      <header 
        className={`fluid-nav-container ${!isDark ? 'light-theme' : ''} rounded-2xl transition-all duration-500 px-4 sm:px-6 py-3 flex items-center justify-between ${
          scrolled ? 'scrolled py-2.5 shadow-2xl scale-[0.99]' : 'animate-float-nav'
        }`}
      >
        {/* Animated Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <BarChart3 className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400" />
          </div>

          <div className="flex flex-col">
            <span className={`text-lg font-bold tracking-tight font-poppins flex items-center gap-1.5 transition-colors ${
              isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-700'
            }`}>
              MSME <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 font-medium">Growth Advisor</span>
            </span>
            <span className={`text-[10px] font-medium tracking-wider uppercase hidden sm:block ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Financial Co-Pilot
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`nav-link-fluid py-1 transition-colors ${
                  isDark ? 'text-slate-300 hover:text-emerald-400' : 'text-slate-700 hover:text-emerald-600 font-bold'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>
        )}

        {/* Action Call-To-Action Buttons & Theme Toggle */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Theme Switcher Button */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all hover:scale-110 active:scale-95 shadow-md flex items-center justify-center group ${
              isDark 
                ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-emerald-400' 
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-emerald-600'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 group-hover:-rotate-12 transition-transform" />
            )}
          </button>

          {isDashboard ? (
            <button 
              onClick={() => navigate('/')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 border ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <span>Back to Home</span>
            </button>
          ) : (
            <>
              <button 
                onClick={handleLogin}
                className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all ${
                  isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/80'
                }`}
              >
                LOGIN
              </button>

              <button 
                onClick={handleSignup}
                className="group relative px-5 py-2.5 rounded-xl text-slate-950 text-xs font-extrabold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-glow"
              >
                {/* Shimmer background layer */}
                <div className="absolute inset-0 animate-shimmer" />
                <div className="relative flex items-center space-x-2">
                  <span>GET STARTED</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </>
          )}
        </div>

        {/* Mobile Animated Hamburger Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-xl border transition-all ${
            isDark 
              ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white' 
              : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
          }`}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-emerald-500 rotate-90 transition-transform duration-300" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </header>

      {/* Animated Fluid Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden mt-2 p-5 rounded-2xl backdrop-blur-2xl border shadow-2xl animate-slide-down space-y-4 ${
          isDark 
            ? 'bg-slate-950/95 border-emerald-500/30 text-white' 
            : 'bg-white/95 border-emerald-500/40 text-slate-900'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Theme</span>
            <button 
              onClick={toggleTheme}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              <span>Switch to {isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          {!isDashboard && (
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isDark ? 'hover:bg-slate-900 text-slate-300 hover:text-emerald-400' : 'hover:bg-slate-100 text-slate-800 hover:text-emerald-700'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </nav>
          )}

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2.5">
            <button 
              onClick={handleStart}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50"
            >
              <span>{isDashboard ? 'GO TO DASHBOARD' : 'LAUNCH APP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
