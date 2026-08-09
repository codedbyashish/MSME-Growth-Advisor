import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AuthHeader from './AuthHeader';
import AuthBenefits from './AuthBenefits';
import AuthTabSelector from './AuthTabSelector';
import SignupForm from './SignupForm';
import AuthSocialButtons from './AuthSocialButtons';
import { defaultAuthData } from '../../data/authData';

export default function SignupPage({
  authData = defaultAuthData,
  headerData = authData?.header || defaultAuthData.header,
  benefitsData = authData?.benefits || defaultAuthData.benefits,
  tabLabels = authData?.tabLabels || defaultAuthData.tabLabels,
  signupFormConfig = authData?.signupForm || defaultAuthData.signupForm,
  categories = authData?.msmeCategories || defaultAuthData.msmeCategories,
  socialProviders = authData?.socialProviders || defaultAuthData.socialProviders,
  successMessages = authData?.successMessages || defaultAuthData.successMessages,
  footerText = authData?.footerText || defaultAuthData.footerText
}) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    password: '',
    industry: categories[0]?.value || 'Retail & Trading',
    agreeTerms: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
    }, 1200);
  };

  const handleTabChange = (targetMode) => {
    if (targetMode === 'login') {
      navigate('/login');
    }
  };

  return (
    <div className={`min-h-screen relative font-sans selection:bg-emerald-500 selection:text-white flex flex-col justify-between transition-colors duration-300 ${
      isDark ? 'bg-[#0a0f16] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background Grid Pattern */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${
        isDark 
          ? 'bg-[linear-gradient(to_right,#1f293730_1px,transparent_1px),linear-gradient(to_bottom,#1f293730_1px,transparent_1px)]' 
          : 'bg-[linear-gradient(to_right,#cbd5e180_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e180_1px,transparent_1px)]'
      } bg-[size:32px_32px]`} />

      {/* Ambient Glow Orbs */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-transparent blur-[140px] rounded-full pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-gradient-to-br from-emerald-400/15 to-cyan-500/10 blur-[140px] rounded-full pointer-events-none animate-pulse-slow z-0" />

      {/* Header */}
      <AuthHeader headerData={headerData} />

      {/* Main Signup Container */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 py-8 grid lg:grid-cols-12 gap-8 items-center flex-1">
        
        {/* Left Side Benefits Highlights */}
        <AuthBenefits benefitsData={benefitsData} />

        {/* Right Side Glassmorphic Card */}
        <div className="lg:col-span-7">
          <div className={`relative rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl border transition-all duration-500 ${
            isDark 
              ? 'bg-slate-900/90 border-slate-800/80 text-white shadow-emerald-950/30' 
              : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-300/40'
          }`}>
            
            {/* Mode Switcher Pill Slider */}
            <AuthTabSelector 
              mode="signup" 
              setMode={handleTabChange} 
              tabLabels={tabLabels} 
            />

            {/* Title & Subtitle */}
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-bold font-poppins">
                {signupFormConfig?.title}
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {signupFormConfig?.subtitle}
              </p>
            </div>

            {/* Success Notification */}
            {success ? (
              <div className="py-12 text-center space-y-4 animate-scale-up">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold font-poppins">{successMessages.signupTitle}</h3>
                <p className="text-xs text-slate-400">{successMessages.subtitle}</p>
              </div>
            ) : (
              <>
                <SignupForm 
                  formData={formData} 
                  handleChange={handleChange} 
                  handleSubmit={handleSubmit} 
                  loading={loading} 
                  categories={categories} 
                  formConfig={signupFormConfig} 
                />

                <AuthSocialButtons 
                  socialProviders={socialProviders} 
                  dividerText={authData?.dividerText} 
                  onSocialAuth={handleSubmit} 
                />
              </>
            )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-6 text-center text-xs text-slate-500">
        {footerText}
      </footer>
    </div>
  );
}
