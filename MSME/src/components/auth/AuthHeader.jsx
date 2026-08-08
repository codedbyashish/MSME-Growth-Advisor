import React from 'react';
import { BarChart3, Sun, Moon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function AuthHeader({ headerData }) {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!headerData) return null;

  return (
    <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
      <div 
        onClick={() => navigate('/')}
        className="flex items-center space-x-3 cursor-pointer group select-none"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform">
          <BarChart3 className="w-5 h-5 text-slate-950" />
        </div>
        <span className="text-xl font-bold tracking-tight font-poppins">
          MSME <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Growth Advisor</span>
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 shadow-sm ${
            isDark 
              ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-emerald-400' 
              : 'bg-white border-slate-300 text-slate-700 hover:text-emerald-600'
          }`}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
        </button>

        <button 
          onClick={() => navigate('/')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 border transition-all ${
            isDark 
              ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800' 
              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{headerData.homeBtnText || 'Home'}</span>
        </button>
      </div>
    </header>
  );
}
