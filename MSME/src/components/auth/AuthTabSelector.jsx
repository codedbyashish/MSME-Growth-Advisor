import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function AuthTabSelector({ mode, setMode, tabLabels }) {
  const { isDark } = useTheme();

  return (
    <div className="relative p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 flex items-center mb-8">
      <div 
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/30 transition-transform duration-300 ${
          mode === 'signup' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
        }`}
      />
      <button
        type="button"
        onClick={() => setMode('login')}
        className={`relative z-10 flex-1 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-colors text-center ${
          mode === 'login' ? 'text-slate-950' : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
        }`}
      >
        {tabLabels?.login || 'Sign In'}
      </button>
      <button
        type="button"
        onClick={() => setMode('signup')}
        className={`relative z-10 flex-1 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-colors text-center ${
          mode === 'signup' ? 'text-slate-950' : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
        }`}
      >
        {tabLabels?.signup || 'Create Account'}
      </button>
    </div>
  );
}
