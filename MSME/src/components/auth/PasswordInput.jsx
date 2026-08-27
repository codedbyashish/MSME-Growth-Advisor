import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PasswordInput({
  label = 'Password',
  name = 'password',
  value,
  onChange,
  placeholder = 'Enter your password',
  error,
  required = false,
  autoComplete = 'current-password',
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label htmlFor={name} className="block text-xs sm:text-sm font-semibold text-[#1E293B]">
          {label} {required && <span className="text-[#F43F5E]">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={name}
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full py-2.5 pl-10 pr-10 text-xs sm:text-sm rounded-lg border bg-white text-[#1E293B] placeholder-[#94A3B8] transition-all duration-200 focus:outline-none ${
            error
              ? 'border-[#F43F5E] focus:border-[#F43F5E] focus:ring-1 focus:ring-[#F43F5E]'
              : 'border-[#E2E8F0] focus:border-[#1E293B] focus:ring-1 focus:ring-[#1E293B]'
          }`}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors focus:outline-none text-[#64748B] hover:text-[#1E293B]"
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {error && (
        <p className="flex items-center space-x-1 text-[11px] text-[#F43F5E] pt-0.5">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

