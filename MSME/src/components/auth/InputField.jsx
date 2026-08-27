import React from 'react';
import { AlertCircle } from 'lucide-react';

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
  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label htmlFor={name} className="block text-xs sm:text-sm font-semibold text-[#1E293B]">
          {label} {required && <span className="text-[#F43F5E]">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
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
          className={`w-full py-2.5 text-xs sm:text-sm rounded-lg border bg-white text-[#1E293B] placeholder-[#94A3B8] transition-all duration-200 focus:outline-none ${
            Icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } ${
            error
              ? 'border-[#F43F5E] focus:border-[#F43F5E] focus:ring-1 focus:ring-[#F43F5E]'
              : 'border-[#E2E8F0] focus:border-[#1E293B] focus:ring-1 focus:ring-[#1E293B]'
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

