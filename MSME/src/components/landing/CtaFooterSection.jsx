import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function CtaFooterSection({ ctaData, footerData, email, setEmail, onStart }) {
  if (!ctaData || !footerData) return null;

  return (
    <>
      {/* CTA Footer Section */}
      <section className="relative z-10 bg-[#16212b] text-white py-24 px-6 border-t border-slate-700">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-poppins text-white">
            {ctaData.title}
          </h2>
          <p className="text-slate-200 text-base sm:text-lg max-w-xl mx-auto font-medium">
            {ctaData.subtitle}
          </p>

          <form onSubmit={onStart} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={ctaData.inputPlaceholder}
              required
              className="flex-1 px-4 py-3.5 rounded-xl bg-white text-slate-950 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold border border-slate-300 shadow-inner"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/30 shrink-0"
            >
              {ctaData.buttonText}
            </button>
          </form>

          <p className="text-xs font-bold text-slate-300 uppercase tracking-widest pt-2">
            {ctaData.disclaimer}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0b1017] text-slate-300 py-10 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-semibold">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
            <span className="text-white font-extrabold font-poppins text-sm">{footerData.brandName}</span>
          </div>

          <div className="flex items-center space-x-8 text-slate-200">
            {footerData.links?.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-emerald-400 transition-colors font-bold">
                {link.name}
              </a>
            ))}
          </div>

          <div className="text-slate-400 font-medium">
            {footerData.copyright}
          </div>
        </div>
      </footer>
    </>
  );
}
