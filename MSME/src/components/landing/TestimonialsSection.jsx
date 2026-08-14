import React from 'react';
import { Star } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function TestimonialsSection({ testimonialsData }) {
  const { isDark } = useTheme();

  if (!testimonialsData) return null;

  // Duplicate list for infinite marquee scrolling effect
  const reviewsList = [
    ...(testimonialsData.reviews || []),
    ...(testimonialsData.reviews || [])
  ];

  return (
    <section id="reviews" className={`relative z-10 py-24 px-6 border-t overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#0f1722] text-white border-slate-800/80' : 'bg-slate-100/90 text-slate-900 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {testimonialsData.badge && (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              <span>{testimonialsData.badge}</span>
            </div>
          )}

          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-poppins ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {testimonialsData.title}
          </h2>

          <p className={`text-base sm:text-lg font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {testimonialsData.subtitle} <span className="text-emerald-500 font-black">{testimonialsData.hoverNotice}</span>
          </p>
        </div>

        {/* Infinite Auto-Scrolling Reviews Marquee */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Soft edge blur gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0f1722] to-transparent z-20 pointer-events-none hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0f1722] to-transparent z-20 pointer-events-none hidden md:block" />

          <div className="animate-marquee space-x-6">
            {reviewsList.map((rev, idx) => (
              <div 
                key={idx}
                className={`w-96 rounded-3xl p-6 border flex flex-col justify-between shrink-0 fluid-hover-card transition-all duration-300 ${
                  isDark ? 'glass-panel-dark text-white' : 'glass-panel-light text-slate-900'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {rev.metric && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-sm">
                        {rev.metric}
                      </span>
                    )}
                  </div>

                  <p className={`text-xs leading-relaxed italic font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold font-poppins text-slate-900 dark:text-white">{rev.name}</h4>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold">{rev.role}</p>
                  </div>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">{rev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
