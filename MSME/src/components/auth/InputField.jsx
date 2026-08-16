import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function InputField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  autoComplete,
}) {
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
        {Icon && (
          <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
            isDark ? 'text-[#64748B]' : 'text-slate-400'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full py-2.5 text-xs sm:text-sm rounded-xl border transition-all duration-200 focus:outline-none ${
            Icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } ${
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
