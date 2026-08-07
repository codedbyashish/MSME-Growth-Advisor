import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight, 
  Building2, 
  BarChart3, 
  Zap, 
  Database,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({ onLaunchDashboard }) {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleStart = (e) => {
    if (e) e.preventDefault();
    if (onLaunchDashboard) {
      onLaunchDashboard();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d131a] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Grid pattern background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" 
      />

      {/* Navigation Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800/60 backdrop-blur-md">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-poppins">
            MSME <span className="text-emerald-400 font-medium">Growth Advisor</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
          <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
        </nav>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleStart}
            className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
          >
            LOGIN
          </button>
          <button 
            onClick={handleStart}
            className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-lg shadow-emerald-950/40 hover:shadow-emerald-700/20 active:scale-95"
          >
            GET STARTED
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Hero Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NEW : PREDICTIVE INSIGHTS ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] font-poppins">
            Know your business better than your accountant does.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Turn raw financial data into clear, actionable strategy. The MSME Growth Advisor acts as your continuous financial co-pilot, identifying risks and opportunities in real-time before they impact your bottom line.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button 
              onClick={handleStart}
              className="px-7 py-3.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm tracking-wider flex items-center space-x-2 transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95"
            >
              <span>START FREE ANALYSIS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button 
              onClick={handleStart}
              className="px-7 py-3.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-white font-medium text-sm border border-slate-700 transition-all flex items-center space-x-2 hover:border-slate-600"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>VIEW DEMO</span>
            </button>
          </div>
        </div>

        {/* Right Hero Graphic Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="relative bg-white text-slate-900 rounded-2xl p-6 shadow-2xl shadow-emerald-950/50 border border-slate-200 backdrop-blur-md">
            {/* Header of card */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Acme Corp Overview</h3>
                  <p className="text-xs text-slate-600 font-medium">Live Sync: QuickBooks</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                Active
              </span>
            </div>

            {/* Daily Growth Score */}
            <div className="mb-5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600">DAILY GROWTH SCORE</span>
              <div className="flex items-baseline space-x-3 mt-1">
                <span className="text-4xl font-extrabold text-emerald-950 font-poppins">81</span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center bg-emerald-50 px-2 py-0.5 rounded">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> +3.4%
                </span>
              </div>
            </div>

            {/* Metric boxes row */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-600">Net Revenue (MTD)</span>
                <div className="text-xl font-extrabold text-slate-900 mt-1 font-poppins">₹120k</div>
              </div>
              <div className="bg-red-50/80 p-3.5 rounded-xl border border-red-100">
                <span className="text-[10px] uppercase font-bold text-red-600">Burn Rate</span>
                <div className="text-xl font-extrabold text-red-800 mt-1 font-poppins">₹40k</div>
              </div>
            </div>

            {/* Graph Visualization Mock */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="h-32 flex items-end justify-between gap-3 pt-4 px-2">
                <div className="w-full bg-emerald-200/80 rounded-t-sm h-[45%]" />
                <div className="w-full bg-emerald-200/80 rounded-t-sm h-[65%]" />
                <div className="w-full bg-red-100 rounded-t-sm h-[30%]" />
                <div className="w-full bg-emerald-200/80 rounded-t-sm h-[85%]" />
                <div className="w-full bg-emerald-900 rounded-t-sm h-[100%] flex items-end justify-center pb-1 shadow-md">
                  <span className="text-[8px] text-emerald-200 font-mono">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="relative z-10 bg-slate-50 text-slate-900 py-20 px-6 border-t border-slate-800/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-poppins">
              Enterprise-grade intelligence for the MSME ecosystem.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              We strip away the complexity of financial modeling, providing you with clear directives rather than confusing spreadsheets.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: AI Strategic Advisor */}
            <div 
              onClick={handleStart}
              className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
                <MessageSquare className="w-6 h-6 text-slate-700 group-hover:text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins">AI Strategic Advisor</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Ask questions about your business in plain English. Get data-backed strategic advice instantly.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div className="bg-slate-200/80 text-slate-800 text-xs px-3 py-2 rounded-lg font-medium inline-block max-w-[85%]">
                  Can I afford a new hire?
                </div>
                <div className="bg-emerald-50 text-emerald-950 text-xs p-3 rounded-lg border border-emerald-100 flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                  <p className="text-[11px] leading-relaxed">
                    Based on ₹4k burn rate, yes. Suggest hiring in Q3.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Predictive Sales */}
            <div 
              onClick={handleStart}
              className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
                <TrendingUp className="w-6 h-6 text-slate-700 group-hover:text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins">Predictive Sales</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Forecast revenue confidently based on historical trends and current pipeline velocity.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
                <div className="flex justify-end text-[10px] font-bold text-slate-600 mb-2">Q4: ₹45.2k</div>
                <svg viewBox="0 0 200 60" className="w-full h-16 stroke-emerald-600 fill-none stroke-2">
                  <path d="M0,50 Q40,45 70,30 T130,25 T200,10" />
                  <path d="M0,50 Q40,45 70,30 T130,25 T200,10 L200,60 L0,60 Z" className="fill-emerald-50/50 stroke-none" />
                </svg>
              </div>
            </div>

            {/* Card 3: Business Health Score */}
            <div 
              onClick={handleStart}
              className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
                <ShieldCheck className="w-6 h-6 text-slate-700 group-hover:text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins">Business Health Score</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                A single metric summarizing cash flow, liabilities, and growth trajectory.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-700"
                      strokeDasharray="84, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xl font-bold text-slate-900 font-poppins">84</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Flow Section */}
      <section id="how-it-works" className="relative z-10 bg-slate-50 text-slate-900 py-20 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase">ONBOARDING</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-poppins">
              From zero to insight in minutes.
            </h2>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-emerald-800/30" />

            <div className="space-y-12">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-emerald-700 text-emerald-800 flex items-center justify-center font-bold text-lg z-10 shadow-md shrink-0">
                  1
                </div>
                <div className="pt-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Connect Data Sources</h3>
                    <div className="flex space-x-2 bg-slate-100 p-2 rounded-lg">
                      <Building2 className="w-4 h-4 text-slate-600" />
                      <Database className="w-4 h-4 text-slate-600" />
                      <Zap className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mt-1">
                    Securely link your accounting software, bank accounts, and CRM with one click.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 text-slate-500 flex items-center justify-center font-bold text-lg z-10 shadow-md shrink-0">
                  2
                </div>
                <div className="pt-1 flex-1">
                  <h3 className="text-lg font-bold text-slate-900">AI Processing</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Our engine categorizes transactions, identifies anomalies, and builds a baseline model.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 text-slate-500 flex items-center justify-center font-bold text-lg z-10 shadow-md shrink-0">
                  3
                </div>
                <div className="pt-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Act on Insights</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full border border-emerald-200">
                      Dashboard ready
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mt-1">
                    Review personalized recommendations and monitor your health score dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="relative z-10 bg-[#16212b] text-white py-24 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-poppins">
            Ready to scale with certainty?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Join thousands of MSMEs already optimizing their cash flow and predicting growth.
          </p>

          <form onSubmit={handleStart} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              className="flex-1 px-4 py-3 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/50 shrink-0"
            >
              GET STARTED
            </button>
          </form>

          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest pt-2">
            NO CREDIT CARD REQUIRED. 14-DAY FREE TRIAL.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0d131a] text-slate-400 py-10 px-6 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-medium">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-bold font-poppins">MSME Growth Advisor</span>
          </div>

          <div className="flex items-center space-x-8 text-slate-400">
            <a href="#product" className="hover:text-white transition-colors">Product</a>
            <a href="#company" className="hover:text-white transition-colors">Company</a>
            <a href="#support" className="hover:text-white transition-colors">Support</a>
            <a href="#legal" className="hover:text-white transition-colors">Legal</a>
          </div>

          <div className="text-slate-500">
            © 2026 MSME Growth Advisor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
