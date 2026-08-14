import React, { useState } from 'react';
import { 
  Shirt, Factory, ShoppingBag, Laptop, Utensils, 
  Zap, Building2, TrendingUp, Sparkles, ArrowRight, CheckCircle2, ShieldCheck 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const iconMap = {
  Shirt,
  Factory,
  ShoppingBag,
  Laptop,
  Utensils,
  Zap,
  Building2,
  TrendingUp
};

export default function GrowthCalculatorSection({ calculatorData, onStart }) {
  const { isDark } = useTheme();

  const [selectedSector, setSelectedSector] = useState(calculatorData?.sectors?.[0]?.id || 'textile');
  const [selectedTurnover, setSelectedTurnover] = useState(calculatorData?.turnovers?.[1]?.id || 't2');
  const [selectedGoal, setSelectedGoal] = useState(calculatorData?.goals?.[0]?.id || 'cashflow');

  if (!calculatorData) return null;

  const currentTurnoverObj = calculatorData.turnovers.find(t => t.id === selectedTurnover) || calculatorData.turnovers[1];
  const multiplier = currentTurnoverObj.value;

  // Dynamic calculations based on user input
  const projectedBoost = (multiplier * 0.85).toFixed(1);
  const loanLimit = (multiplier * 1.5).toFixed(1);
  const daysFaster = Math.min(24, Math.round(multiplier * 0.8) + 12);
  const healthScore = Math.min(98, 82 + Math.round(multiplier * 0.3));

  const sectorName = calculatorData.sectors.find(s => s.id === selectedSector)?.name || 'MSME Enterprise';

  return (
    <section id="growth-calculator" className={`relative z-10 py-24 px-6 border-t transition-colors duration-300 ${
      isDark ? 'bg-[#0b1017] text-white border-slate-800/80' : 'bg-slate-50 text-slate-900 border-slate-200'
    }`}>
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{calculatorData.badge}</span>
          </div>

          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-poppins ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {calculatorData.title}
          </h2>

          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {calculatorData.subtitle}
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Box (Left 6 cols) */}
          <div className={`lg:col-span-6 rounded-3xl p-6 sm:p-8 border space-y-8 ${
            isDark ? 'glass-panel-dark' : 'glass-panel-light'
          }`}>
            {/* Step 1: Select Industry Sector */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>1. Select Your MSME Industry Sector</span>
                <span className="text-emerald-400 font-extrabold">{sectorName}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {calculatorData.sectors.map((sec) => {
                  const Icon = iconMap[sec.icon] || Factory;
                  const isSel = sec.id === selectedSector;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setSelectedSector(sec.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition-all duration-300 ${
                        isSel 
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-lg shadow-emerald-500/20 scale-[1.02]' 
                          : isDark
                            ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSel ? 'text-slate-950' : 'text-emerald-400'}`} />
                      <span className="text-xs truncate">{sec.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Monthly Turnover */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>2. Average Monthly Business Turnover</span>
                <span className="text-emerald-400 font-extrabold">{currentTurnoverObj.label}</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {calculatorData.turnovers.map((t) => {
                  const isSel = t.id === selectedTurnover;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTurnover(t.id)}
                      className={`py-3 px-4 rounded-2xl border text-center font-bold text-xs transition-all duration-300 ${
                        isSel 
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 border-emerald-300 shadow-md shadow-emerald-500/20 scale-[1.02]' 
                          : isDark
                            ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Select Primary Goal */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                3. Primary Growth Focus
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {calculatorData.goals.map((g) => {
                  const Icon = iconMap[g.icon] || Zap;
                  const isSel = g.id === selectedGoal;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGoal(g.id)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all duration-300 ${
                        isSel 
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20 scale-[1.02]' 
                          : isDark
                            ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSel ? 'text-slate-950' : 'text-emerald-400'}`} />
                      <span className="text-[11px] leading-tight">{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Output Box (Right 6 cols) */}
          <div className={`lg:col-span-6 rounded-3xl p-6 sm:p-8 border space-y-6 animate-rise-up ${
            isDark ? 'glass-panel-dark text-white' : 'glass-panel-light text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base font-poppins">Projected 90-Day MSME Growth Directive</h3>
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Score: {healthScore}/100
              </span>
            </div>

            {/* Dynamic Metric Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/40 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">90-Day Cash Flow Boost</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-poppins">
                  +₹{projectedBoost}L
                </div>
                <p className="text-[10px] text-slate-400">Unlocked working capital</p>
              </div>

              <div className="bg-slate-950/40 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">CGTMSE Credit Limit</span>
                <div className="text-2xl sm:text-3xl font-black text-teal-400 font-poppins">
                  ₹{loanLimit}L
                </div>
                <p className="text-[10px] text-slate-400">Collateral-free bank pre-approval</p>
              </div>
            </div>

            {/* Invoice Collection Days Saver */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300">Invoice Recovery Velocity</span>
                <p className="text-xs text-slate-400 mt-0.5">Automated UPI payment reminders reduce lag by</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-400 font-poppins">{daysFaster} Days</span>
                <p className="text-[10px] text-emerald-500 font-semibold">Faster Collection</p>
              </div>
            </div>

            {/* Personalized Action Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Tailored AI Growth Steps for {sectorName}:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Connect ledger to eliminate ₹{(multiplier * 0.15).toFixed(1)}L in uncollected receivables.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Auto-generate CGTMSE financial audit report for bank loan approval.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Receive 24/7 AI Co-Pilot alerts on low-stock inventory & vendor cost savings.</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <button
              onClick={onStart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-95"
            >
              <span>CLAIM YOUR MSME GROWTH PLAN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
