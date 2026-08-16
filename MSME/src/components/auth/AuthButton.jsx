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
      className={`w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center space-x-2 transition-all duration-200 shadow-md ${
        isPrimary
          ? 'bg-[#10B981] hover:bg-[#0ea371] text-[#0B1220] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[#10B981]/20'
          : 'bg-[#0B1220] hover:bg-[#162238] text-[#F8FAFC] border border-[#243247] hover:border-[#10B981]/50'
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
