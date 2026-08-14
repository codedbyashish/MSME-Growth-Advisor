import React from 'react';
import { MessageSquare, TrendingUp, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const iconMap = {
  MessageSquare: MessageSquare,
  TrendingUp: TrendingUp,
  ShieldCheck: ShieldCheck
};

export default function FeaturesSection({ featuresData, featuresVisible, onStart }) {
  const { isDark } = useTheme();

  if (!featuresData) return null;

  return (
    <section id="features" className={`relative z-10 py-20 px-6 border-t transition-colors duration-300 ${
      isDark ? 'bg-[#0a0f16] text-white border-slate-800/60' : 'bg-white text-slate-900 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-poppins">
            {featuresData.title}
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {featuresData.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuresData.items?.map((item, index) => {
            const IconComponent = iconMap[item.icon] || ShieldCheck;
            const isTeal = item.color === 'teal';

            return (
              <div 
                key={item.id || index}
                onClick={onStart}
                style={{ transitionDelay: `${index * 150}ms` }}
                className={`fluid-hover-card rounded-3xl p-7 transition-all duration-700 group cursor-pointer ${
                  featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${isDark ? 'glass-panel-dark text-white' : 'glass-panel-light text-slate-900'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 ${
                  isTeal 
                    ? 'bg-teal-500/20 border border-teal-500/40 group-hover:bg-teal-500/30' 
                    : 'bg-emerald-500/20 border border-emerald-500/40 group-hover:bg-emerald-500/30'
                }`}>
                  <IconComponent className={`w-6 h-6 stroke-[2.5] ${isTeal ? 'text-teal-400' : 'text-emerald-400'}`} />
                </div>
                <h3 className={`text-xl font-extrabold mb-2 font-poppins transition-colors ${
                  isTeal ? 'group-hover:text-teal-400' : 'group-hover:text-emerald-400'
                }`}>
                  {item.title}
                </h3>
                <p className={`text-sm mb-6 leading-relaxed font-normal ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {item.description}
                </p>

                {/* Sub Card Visuals */}
                {item.id === 'ai-advisor' && (
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'
                  }`}>
                    <div className={`text-xs px-3 py-2 rounded-xl font-bold inline-block max-w-[85%] ${
                      isDark ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900 border border-slate-300 shadow-sm'
                    }`}>
                      {item.badgeQuestion}
                    </div>
                    <div className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 text-xs p-3 rounded-xl border border-emerald-500/30 flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0 animate-ping" />
                      <p className="text-[11px] leading-relaxed font-medium">
                        {item.badgeAnswer}
                      </p>
                    </div>
                  </div>
                )}

                {item.id === 'predictive-sales' && (
                  <div className={`p-4 rounded-2xl border relative ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-100/80 border-slate-200'
                  }`}>
                    <div className="flex justify-end text-[10px] font-bold text-emerald-400 mb-2">{item.target}</div>
                    <svg viewBox="0 0 200 60" className="w-full h-16 stroke-emerald-400 fill-none stroke-2">
                      <path d="M0,50 Q40,45 70,30 T130,25 T200,10" />
                      <path d="M0,50 Q40,45 70,30 T130,25 T200,10 L200,60 L0,60 Z" className="fill-emerald-500/10 stroke-none" />
                    </svg>
                  </div>
                )}

                {item.id === 'health-score' && (
                  <div className={`p-4 rounded-2xl border flex items-center justify-center ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-100/80 border-slate-200'
                  }`}>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className={isDark ? "text-slate-800" : "text-slate-300"}
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-400"
                          strokeDasharray="84, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className={`absolute text-xl font-bold font-poppins ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.score}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
