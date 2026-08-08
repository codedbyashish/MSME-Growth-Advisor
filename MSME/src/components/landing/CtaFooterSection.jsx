import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function CtaFooterSection({ ctaData, footerData, email, setEmail, onStart }) {
  if (!ctaData || !footerData) return null;

  return (
    <>
      {/* CTA Footer Section */}
      <section className="relative z-10 bg-[#16212b] text-white py-24 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-poppins">
            {ctaData.title}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            {ctaData.subtitle}
          </p>

          <form onSubmit={onStart} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={ctaData.inputPlaceholder}
              required
              className="flex-1 px-4 py-3 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/50 shrink-0"
            >
              {ctaData.buttonText}
            </button>
          </form>

          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest pt-2">
            {ctaData.disclaimer}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0d131a] text-slate-400 py-10 px-6 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-medium">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-bold font-poppins">{footerData.brandName}</span>
          </div>

          <div className="flex items-center space-x-8 text-slate-400">
            {footerData.links?.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-white transition-colors">
                {link.name}
              </a>
            ))}
          </div>

          <div className="text-slate-500">
            {footerData.copyright}
          </div>
        </div>
      </footer>
    </>
  );
}
