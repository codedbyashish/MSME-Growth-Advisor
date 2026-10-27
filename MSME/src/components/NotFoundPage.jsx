import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#202B3C] font-sans flex flex-col justify-between selection:bg-[#202B3C] selection:text-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-[#E7E3DC] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#202B3C] text-white flex items-center justify-center font-bold text-sm">
              M
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#202B3C]">
              MSME Growth Advisor
            </span>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="text-xs sm:text-sm font-medium text-[#737D8B] hover:text-[#202B3C] flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </header>

      {/* Main 404 message */}
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E7E3DC] p-8 shadow-sm space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5F3EE] border border-[#E7E3DC] flex items-center justify-center text-[#202B3C]">
            <TrendingUp className="w-7 h-7 text-[#737D8B]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737D8B]">
              404 Error
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#202B3C]">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-[#737D8B] leading-relaxed">
              The page you're looking for doesn't exist or has been moved to a new destination.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#202B3C] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#151D2A] transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-[#E7E3DC] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#202B3C] hover:bg-[#FAF9F6] transition-colors"
            >
              <Home className="w-4 h-4 text-[#737D8B]" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7E3DC] bg-white py-4 text-center text-xs text-[#737D8B]">
        <p>© {new Date().getFullYear()} MSME Growth Advisor. All rights reserved.</p>
      </footer>
    </div>
  );
}
