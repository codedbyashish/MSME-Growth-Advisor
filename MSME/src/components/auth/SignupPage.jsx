import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Other Territory',
];

const BUSINESS_TYPES = [
  'Retail Store',
  'Wholesale / B2B',
  'Manufacturing',
  'Services & Consulting',
  'E-Commerce',
  'Food & Restaurant',
  'Other',
];

const SECTORS = [
  'Apparel & Fashion',
  'Electronics & Hardware',
  'FMCG & Grocery',
  'Automotive & Spares',
  'Healthcare & Pharma',
  'Industrial & Materials',
  'IT & Digital Services',
  'Home & Furniture',
  'Other',
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  // 4-Step Form State
  const [formData, setFormData] = useState({
    // Step 1: Business Info
    businessName: '',
    ownerName: '',
    phone: '',
    city: '',
    state: '',

    // Step 2: Business Category & Details
    businessType: 'Retail Store',
    sector: 'FMCG & Grocery',
    gstin: '',
    annualTurnover: '₹10L - ₹50L',

    // Step 3: Financials & Operations
    monthlyRevenue: '',
    monthlyExpenses: '',
    salesChannel: 'Physical Store',
    employeeCount: '1-5 Employees',

    // Step 4: Account Credentials
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  // Validation per step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Please enter your business name.';
      }
      if (!formData.ownerName.trim()) {
        newErrors.ownerName = 'Please enter owner / legal name.';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Please enter mobile number.';
      } else if (!/^\d{10}$/.test(formData.phone.trim().replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number.';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'Please enter city.';
      }
      if (!formData.state) {
        newErrors.state = 'Please select state.';
      }
    }

    if (step === 2) {
      if (!formData.businessType) {
        newErrors.businessType = 'Please select business type.';
      }
      if (!formData.sector) {
        newErrors.sector = 'Please select industry sector.';
      }
    }

    if (step === 3) {
      // Financials optional or soft validated
      if (formData.monthlyRevenue && isNaN(Number(formData.monthlyRevenue.replace(/,/g, '')))) {
        newErrors.monthlyRevenue = 'Please enter a valid amount.';
      }
    }

    if (step === 4) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Please enter your email address.';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }

      if (!formData.password) {
        newErrors.password = 'Please create a password.';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters.';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm password.';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }

      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must accept the terms to proceed.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setLoading(true);
    setServerError('');

    try {
      await register({
        name: formData.ownerName.trim(),
        fullName: formData.ownerName.trim(),
        businessName: formData.businessName.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        state: formData.state,
        businessType: formData.businessType,
        sector: formData.sector,
        gstin: formData.gstin.trim(),
        annualTurnover: formData.annualTurnover,
        monthlyRevenue: formData.monthlyRevenue,
        monthlyExpenses: formData.monthlyExpenses,
        salesChannel: formData.salesChannel,
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate('/dashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Setup failed. Please try again.';
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step Header Labels
  const stepTitles = [
    'Business Info',
    'Business Details',
    'Sales & Operations',
    'Account Security',
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-1.5">
        <div 
          onClick={() => navigate('/')} 
          className="cursor-pointer inline-block select-none"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
            MSME Growth Advisor
          </h1>
        </div>
        <p className="text-sm text-[#64748B] font-normal">
          Set up your business profile
        </p>
      </div>

      {/* Main Card Container */}
      <div className="max-w-xl w-full mx-auto bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 sm:p-9 transition-all">
        
        {/* Step Progress Header */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1E293B]">
              {stepTitles[currentStep - 1]}
            </h2>
            <span className="text-xs font-semibold text-[#64748B]">
              Step {currentStep} of 4
            </span>
          </div>

          {/* 4 Segment Progress Bar */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  stepNum <= currentStep ? 'bg-[#274258]' : 'bg-[#E2E8F0]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Global Error Banner */}
        {serverError && (
          <div className="mb-5 p-3 rounded-lg bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-[#F43F5E] text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={currentStep === 4 ? handleSubmit : handleNextStep} className="space-y-4">
          
          {/* STEP 1: BUSINESS INFO (Matches Screenshot Exactly) */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Business Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Sharma Enterprises"
                  className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none transition-all ${
                    errors.businessName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                  }`}
                  autoFocus
                />
                {errors.businessName && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.businessName}</p>
                )}
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Owner Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Full Legal Name"
                  className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none transition-all ${
                    errors.ownerName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                  }`}
                />
                {errors.ownerName && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.ownerName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Phone Number
                </label>
                <div className={`flex rounded-md border overflow-hidden focus-within:border-[#274258] transition-all ${
                  errors.phone ? 'border-red-500' : 'border-[#CBD5E1]'
                }`}>
                  <span className="bg-[#F8FAFC] text-[#64748B] px-3.5 py-2.5 text-sm font-semibold border-r border-[#CBD5E1] select-none flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full px-3.5 py-2.5 text-sm text-[#1E293B] bg-white focus:outline-none"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.phone}</p>
                )}
              </div>

              {/* City & State (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none transition-all ${
                      errors.city ? 'border-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    State
                  </label>
                  <div className="relative">
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none appearance-none pr-8 transition-all ${
                        errors.state ? 'border-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                      }`}
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3 top-3 pointer-events-none" />
                  </div>
                  {errors.state && (
                    <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BUSINESS DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Business Type
                </label>
                <div className="relative">
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#CBD5E1] text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#274258] appearance-none pr-8"
                  >
                    {BUSINESS_TYPES.map((bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Industry / Sector
                </label>
                <div className="relative">
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#CBD5E1] text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#274258] appearance-none pr-8"
                  >
                    {SECTORS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  GSTIN Number (Optional)
                </label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="e.g. 27AAAAA0000A1Z5"
                  maxLength={15}
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#CBD5E1] text-sm text-[#1E293B] uppercase placeholder:normal-case bg-white focus:outline-none focus:border-[#274258]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Annual Turnover Bracket
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['< ₹10 Lakhs', '₹10L - ₹50L', '₹50L - ₹2 Cr', '> ₹2 Cr'].map((bracket) => (
                    <button
                      key={bracket}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, annualTurnover: bracket }))}
                      className={`p-2.5 rounded-md border font-medium text-left transition-all ${
                        formData.annualTurnover === bracket
                          ? 'border-[#274258] bg-[#274258]/5 text-[#274258] font-bold'
                          : 'border-[#CBD5E1] text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      {bracket}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SALES & OPERATIONS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Estimated Monthly Sales (₹)
                  </label>
                  <input
                    type="text"
                    name="monthlyRevenue"
                    value={formData.monthlyRevenue}
                    onChange={handleChange}
                    placeholder="e.g. 2,50,000"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#CBD5E1] text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#274258]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Estimated Monthly Expenses (₹)
                  </label>
                  <input
                    type="text"
                    name="monthlyExpenses"
                    value={formData.monthlyExpenses}
                    onChange={handleChange}
                    placeholder="e.g. 1,20,000"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#CBD5E1] text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#274258]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Primary Sales Channel
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Physical Store', 'Online / Website', 'WhatsApp & Direct', 'B2B Distributors'].map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, salesChannel: ch }))}
                      className={`p-2.5 rounded-md border font-medium text-left transition-all ${
                        formData.salesChannel === ch
                          ? 'border-[#274258] bg-[#274258]/5 text-[#274258] font-bold'
                          : 'border-[#CBD5E1] text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Team Size
                </label>
                <div className="relative">
                  <select
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#CBD5E1] text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#274258] appearance-none pr-8"
                  >
                    <option value="1 (Owner Solo)">1 (Owner Solo)</option>
                    <option value="1-5 Employees">1-5 Employees</option>
                    <option value="6-20 Employees">6-20 Employees</option>
                    <option value="20+ Employees">20+ Employees</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ACCOUNT SECURITY */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Work Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="owner@business.com"
                  className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none transition-all ${
                    errors.email ? 'border-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Create Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none transition-all ${
                    errors.password ? 'border-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-[#CBD5E1] text-[#274258] focus:ring-[#274258]"
                />
                <label htmlFor="agreeTerms" className="text-xs text-[#64748B]">
                  I agree to the MSME Growth Advisor{' '}
                  <span className="text-[#1E293B] font-semibold underline cursor-pointer">Terms of Service</span>{' '}
                  and{' '}
                  <span className="text-[#1E293B] font-semibold underline cursor-pointer">Privacy Policy</span>.
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-[11px] text-red-500 font-medium">{errors.agreeTerms}</p>
              )}
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="pt-4 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2.5 rounded-md border border-[#CBD5E1] text-xs font-semibold text-[#1E293B] hover:bg-slate-50 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-md bg-[#274258] hover:bg-[#1C3142] text-white text-xs font-semibold transition-all flex items-center space-x-2 shadow-sm cursor-pointer ml-auto"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-md bg-[#274258] hover:bg-[#1C3142] text-white text-xs font-semibold transition-all flex items-center space-x-2 shadow-sm cursor-pointer ml-auto disabled:opacity-50"
              >
                {loading ? (
                  <span>Creating Profile...</span>
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

        </form>

        {/* Existing User Login Link */}
        <p className="text-xs text-center text-[#64748B] pt-6 border-t border-[#E2E8F0] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#1E293B] hover:underline">
            Sign in
          </Link>
        </p>

      </div>

      {/* Security Footer (Matches Screenshot) */}
      <div className="mt-6 text-center flex items-center justify-center space-x-1.5 text-xs text-[#64748B]">
        <Lock className="w-3.5 h-3.5 text-[#64748B]" />
        <span>Your Information is securely encrypted</span>
      </div>

    </div>
  );
}

export { SignupPage as RegisterPage };
