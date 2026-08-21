import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF] max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#64748B] hover:text-[#1E293B] bg-white rounded-full border border-slate-200 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#1E293B]" />
            <h2 className="text-xl font-bold text-[#1E293B]">Privacy Policy & Data Security</h2>
          </div>
          <p className="text-xs text-[#64748B]">Last updated: August 2026</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] space-y-4 text-xs text-[#475569] leading-relaxed">
          <h3 className="font-bold text-[#1E293B] text-sm">1. Commitment to MSME Privacy</h3>
          <p>
            MSME Growth Advisor ("we", "our") respects the absolute confidentiality of your small business sales records, customer invoices, and financial performance data.
          </p>

          <h3 className="font-bold text-[#1E293B] text-sm">2. Data Storage & Encryption</h3>
          <p>
            All uploaded billing records and AI predictions are encrypted both in transit (TLS 1.3) and at rest using AES 256-bit encryption standards stored securely in Indian data centers.
          </p>

          <h3 className="font-bold text-[#1E293B] text-sm">3. No Data Selling or Sharing</h3>
          <p>
            We do NOT sell, rent, or trade your transactional or business operational data to credit agencies, competitors, or marketing firms under any circumstances.
          </p>

          <h3 className="font-bold text-[#1E293B] text-sm">4. Data Ownership & Export</h3>
          <p>
            Your data belongs 100% to your business. You can request a complete export or permanent deletion of your account data at any time with single-click ease.
          </p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-[#1E293B] text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-[#0F172A] transition-all cursor-pointer"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
}
