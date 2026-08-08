import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function LoginForm({ 
  formData, 
  handleChange, 
  handleSubmit, 
  loading, 
  formConfig 
}) {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email / Phone Field */}
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {formConfig?.emailLabel || 'Work Email / Phone'}
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder={formConfig?.emailPlaceholder || 'owner@msmebusiness.com'}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {formConfig?.passwordLabel || 'Password'}
          </label>
          {formConfig?.forgotPasswordText && (
            <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-emerald-500 hover:underline font-semibold">
              {formConfig.forgotPasswordText}
            </a>
          )}
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder={formConfig?.passwordPlaceholder || '••••••••••••'}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center space-x-2 cursor-pointer select-none">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 w-3.5 h-3.5"
          />
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            {formConfig?.rememberMeLabel || 'Keep me signed in'}
          </span>
        </label>
      </div>

      {/* Submit Action Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 disabled:opacity-75"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>{formConfig?.submitText || 'SIGN IN TO DASHBOARD'}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
