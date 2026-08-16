import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';
import HeroSection from './landing/HeroSection';
import ProblemSection from './landing/ProblemSection';
import GrowthJourneySection from './landing/GrowthJourneySection';
import CoreFeaturesSection from './landing/CoreFeaturesSection';
import PredictionFeatureSection from './landing/PredictionFeatureSection';
import BusinessHealthSection from './landing/BusinessHealthSection';
import AiAssistantSection from './landing/AiAssistantSection';
import DashboardShowcaseSection from './landing/DashboardShowcaseSection';
import AboutSection from './landing/AboutSection';
import FinalCtaSection from './landing/FinalCtaSection';
import Footer from './landing/Footer';

export default function LandingPage({ onLaunchDashboard }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleStart = (e) => {
    if (e) e.preventDefault();
    if (onLaunchDashboard) {
      onLaunchDashboard();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-[#10b981] selection:text-white transition-colors duration-300 relative ${
      isDark ? 'bg-[#0a0e1a] text-[#f8fafc]' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background Subtle Grid Pattern */}
      <div 
        className={`absolute inset-0 pointer-events-none z-0 ${
          isDark 
            ? 'bg-[linear-gradient(to_right,#1e273930_1px,transparent_1px),linear-gradient(to_bottom,#1e273930_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(to_right,#cbd5e150_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e150_1px,transparent_1px)]'
        } bg-[size:32px_32px]`} 
      />

      {/* Navbar */}
      <Navbar onLaunchDashboard={onLaunchDashboard} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection onStart={handleStart} />
        <ProblemSection />
        <GrowthJourneySection />
        <CoreFeaturesSection />
        <PredictionFeatureSection />
        <BusinessHealthSection />
        <AiAssistantSection />
        <DashboardShowcaseSection onStart={handleStart} />
        <AboutSection />
        <FinalCtaSection onStart={handleStart} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
