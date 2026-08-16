import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark } = useTheme();

  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label htmlFor={name} className={`block text-xs font-semibold ${
          isDark ? 'text-[#F8FAFC]' : 'text-slate-700'
        }`}>
          {label} {required && <span className="text-[#F43F5E]">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
          isDark ? 'text-[#64748B]' : 'text-slate-400'
        }`}>
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
          className={`w-full py-2.5 pl-10 pr-10 text-xs sm:text-sm rounded-xl border transition-all duration-200 focus:outline-none ${
            isDark 
              ? 'bg-[#0B1220] text-[#F8FAFC] placeholder-[#64748B]' 
              : 'bg-slate-50 text-slate-900 placeholder-slate-400'
          } ${
            error
              ? 'border-[#F43F5E] focus:border-[#F43F5E] focus:ring-1 focus:ring-[#F43F5E]'
              : isDark
              ? 'border-[#243247] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]'
              : 'border-slate-300 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]'
          }`}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors focus:outline-none ${
            isDark ? 'text-[#64748B] hover:text-[#94A3B8]' : 'text-slate-400 hover:text-slate-600'
          }`}
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
