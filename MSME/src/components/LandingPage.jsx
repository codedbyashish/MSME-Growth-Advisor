import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';
import HeroSection from './landing/HeroSection';
import FeaturesSection from './landing/FeaturesSection';
import OnboardingSection from './landing/OnboardingSection';
import AboutSection from './landing/AboutSection';
import PricingSection from './landing/PricingSection';
import TestimonialsSection from './landing/TestimonialsSection';
import CtaFooterSection from './landing/CtaFooterSection';
import { defaultLandingData } from '../data/landingData';

export default function LandingPage({ 
  onLaunchDashboard, 
  data = defaultLandingData,
  heroData = data?.hero || defaultLandingData.hero,
  featuresData = data?.features || defaultLandingData.features,
  onboardingData = data?.onboarding || defaultLandingData.onboarding,
  aboutData = data?.about || defaultLandingData.about,
  pricingData = data?.pricing || defaultLandingData.pricing,
  testimonialsData = data?.testimonials || defaultLandingData.testimonials,
  ctaData = data?.cta || defaultLandingData.cta,
  footerData = data?.footer || defaultLandingData.footer
}) {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [isAnnual, setIsAnnual] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Onboarding scroll progress
      const section = document.getElementById('how-it-works');
      if (section) {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalHeight = rect.height;
        const currentScroll = windowHeight - rect.top - (windowHeight * 0.25);
        const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
        setScrollProgress(progress);
      }

      // Features section scroll reveal
      const featEl = document.getElementById('features');
      if (featEl) {
        const rect = featEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
          setFeaturesVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStart = (e) => {
    if (e) e.preventDefault();
    if (onLaunchDashboard) {
      onLaunchDashboard();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-300 ${
      isDark ? 'bg-[#0d131a] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Grid pattern background */}
      <div 
        className={`absolute inset-0 pointer-events-none z-0 ${
          isDark 
            ? 'bg-[linear-gradient(to_right,#1f293730_1px,transparent_1px),linear-gradient(to_bottom,#1f293730_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(to_right,#cbd5e180_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e180_1px,transparent_1px)]'
        } bg-[size:32px_32px]`} 
      />

      {/* Fluid Glassmorphic Navbar */}
      <Navbar onLaunchDashboard={onLaunchDashboard} />

      {/* Ambient Gradient Fluid Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-transparent blur-[140px] rounded-full pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute top-60 right-10 w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/15 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none animate-pulse-slow z-0" />

      {/* Modular Landing Page Sections */}
      <HeroSection 
        heroData={heroData} 
        onStart={handleStart} 
      />

      <FeaturesSection 
        featuresData={featuresData} 
        featuresVisible={featuresVisible} 
        onStart={handleStart} 
      />

      <OnboardingSection 
        onboardingData={onboardingData} 
        scrollProgress={scrollProgress} 
      />

      <AboutSection 
        aboutData={aboutData} 
      />

      <PricingSection 
        pricingData={pricingData} 
        isAnnual={isAnnual} 
        setIsAnnual={setIsAnnual} 
        onStart={handleStart} 
      />

      <TestimonialsSection 
        testimonialsData={testimonialsData} 
      />

      <CtaFooterSection 
        ctaData={ctaData} 
        footerData={footerData} 
        email={email} 
        setEmail={setEmail} 
        onStart={handleStart} 
      />
    </div>
  );
}
