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

        {/* Footer Link */}
        <p className="text-xs text-center text-[#64748B] pt-4 border-t border-[#E2E8F0]">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#1E293B] hover:text-black hover:underline">
            Create an account
          </Link>
        </p>

      </div>
    </AuthLayout>
  );
}

