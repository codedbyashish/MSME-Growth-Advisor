import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function AuthButton({
  children,
  type = 'submit',
  loading = false,
  disabled = false,
  onClick,
  variant = 'primary',
}) {
  const isPrimary = variant === 'primary';

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`w-full py-3 px-5 rounded-lg font-semibold text-sm tracking-wide flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer ${
        isPrimary
          ? 'bg-[#1E293B] hover:bg-[#0F172A] text-white shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed'
          : 'bg-white hover:bg-slate-50 text-[#1E293B] border border-[#E2E8F0] shadow-sm disabled:opacity-50'
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {isPrimary && <ArrowRight className="w-4 h-4" />}
        </>
      )}
    </button>
  );
}

