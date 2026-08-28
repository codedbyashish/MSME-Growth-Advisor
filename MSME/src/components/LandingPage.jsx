import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import HeroSection from './landing/HeroSection';
import HowItWorksSection from './landing/HowItWorksSection';
import CoreFeaturesSection from './landing/CoreFeaturesSection';
import PricingSection from './landing/PricingSection';
import FaqSection from './landing/FaqSection';
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

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFaq = () => {
    const el = document.getElementById('faq');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] font-sans selection:bg-[#1E293B] selection:text-white relative">
      
      {/* Navigation Header */}
      <Navbar 
        onLaunchDashboard={onLaunchDashboard}
        onOpenPricing={scrollToPricing}
        onOpenFaq={scrollToFaq}
        onOpenHowItWorks={scrollToHowItWorks}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection 
          onStart={handleStart}
          onSeeHowItWorks={scrollToHowItWorks}
        />

        {/* How It Works Section directly in landing page */}
        <HowItWorksSection onStart={handleStart} />

        {/* 6 Features Grid Section ("Everything you need to grow") */}
        <CoreFeaturesSection />

        {/* Pricing Section directly in landing page */}
        <PricingSection onSelectPlan={handleSelectPlan} />

        {/* FAQ Section directly in landing page */}
        <FaqSection onOpenContact={() => setIsContactOpen(true)} />

        {/* Final CTA Banner ("Ready to understand your business better?") */}
        <FinalCtaSection onStart={handleStart} />
      </main>

      {/* Footer */}
      <Footer 
        onOpenPricing={scrollToPricing}
        onOpenFaq={scrollToFaq}
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
