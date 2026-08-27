import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, AlertCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import InputField from './InputField';
import PasswordInput from './PasswordInput';
import AuthButton from './AuthButton';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must contain at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate('/dashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to sign in. Please check your credentials.';
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setServerError('');

    try {
      alert('Google OAuth login is a frontend demo feature.');
    } catch (err) {
      setServerError('Failed to authenticate with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        
        {/* Title & Subtitle */}
        <div className="text-left space-y-1">
          <h2 className="text-2xl font-bold text-[#1E293B] tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] font-normal">
            Sign in to continue managing your business growth.
          </p>
        </div>

        {/* Global Server Error Notification */}
        {serverError && (
          <div className="p-3.5 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-[#F43F5E] text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={Mail}
            error={errors.email}
            required
            autoComplete="email"
          />

          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
            required
            autoComplete="current-password"
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 cursor-pointer select-none text-[#64748B] hover:text-[#1E293B]">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-[#CBD5E1] text-[#1E293B] focus:ring-[#1E293B]"
              />
              <span>Remember me</span>
            </label>

            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset link will be sent to your registered email.');
              }}
              className="font-semibold text-[#1E293B] hover:text-black hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <div className="pt-2">
            <AuthButton loading={loading}>
              Sign In
            </AuthButton>
          </div>
        </form>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E2E8F0] w-full" />
          <span className="px-3 text-[10px] uppercase font-bold text-[#94A3B8] bg-white absolute">
            OR
          </span>
        </div>

        {/* Social Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#1E293B] font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        {/* Footer Link */}
        <p className="text-xs text-center text-[#64748B] pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#1E293B] hover:text-black hover:underline">
            Create an account
          </Link>
        </p>

      </div>
    </AuthLayout>
  );
}

