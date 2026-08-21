import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import HeroSection from './landing/HeroSection';
import CoreFeaturesSection from './landing/CoreFeaturesSection';
import FinalCtaSection from './landing/FinalCtaSection';
import Footer from './landing/Footer';

// Modals
import PricingModal from './modals/PricingModal';
import FaqModal from './modals/FaqModal';
import HowItWorksModal from './modals/HowItWorksModal';
import ContactModal from './modals/ContactModal';
import PrivacyModal from './modals/PrivacyModal';

export default function LandingPage({ onLaunchDashboard }) {
  const navigate = useNavigate();

  // Modal State Management
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleStart = (e) => {
    if (e) e.preventDefault();
    if (onLaunchDashboard) {
      onLaunchDashboard();
    } else {
      navigate('/signup');
    }
  };

  const handleSelectPlan = (planName) => {
    navigate('/signup', { state: { selectedPlan: planName } });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] font-sans selection:bg-[#1E293B] selection:text-white relative">
      
      {/* Navigation Header */}
      <Navbar 
        onLaunchDashboard={onLaunchDashboard}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection 
          onStart={handleStart}
          onSeeHowItWorks={() => setIsHowItWorksOpen(true)}
        />

        {/* 6 Features Grid Section ("Everything you need to grow") */}
        <CoreFeaturesSection />

        {/* Final CTA Banner ("Ready to understand your business better?") */}
        <FinalCtaSection onStart={handleStart} />
      </main>

      {/* Footer */}
      <Footer 
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Interactive Modals */}
      <PricingModal 
        isOpen={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
        onSelectPlan={handleSelectPlan}
      />

      <FaqModal 
        isOpen={isFaqOpen} 
        onClose={() => setIsFaqOpen(false)} 
      />

      <HowItWorksModal 
        isOpen={isHowItWorksOpen} 
        onClose={() => setIsHowItWorksOpen(false)}
        onStart={handleStart}
      />

      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />

      <PrivacyModal 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
      />

    </div>
  );
}
