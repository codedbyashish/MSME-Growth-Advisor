import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#64748B] hover:text-[#1E293B] bg-white rounded-full border border-slate-200 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#475569] bg-[#F1F5F9] px-3 py-1 rounded-full border border-[#CBD5E1]">
            We are here to help
          </span>
          <h2 className="text-2xl font-bold text-[#1E293B] pt-2">
            Contact MSME Growth Advisor
          </h2>
          <p className="text-xs text-[#64748B]">
            Reach out to our support team for any queries or onboarding help.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white p-8 rounded-xl border border-emerald-200 text-center space-y-3 my-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-[#1E293B]">Thank You!</h3>
            <p className="text-xs text-[#64748B]">
              Your message has been received. Our team will get back to you within 2 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#1E293B] focus:outline-none focus:border-[#1E293B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#1E293B] focus:outline-none focus:border-[#1E293B]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rajesh@business.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#1E293B] focus:outline-none focus:border-[#1E293B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1">Message / Business Requirement</label>
              <textarea
                rows={3}
                required
                placeholder="How can we help your business?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#1E293B] focus:outline-none focus:border-[#1E293B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-bold rounded-lg shadow transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-[#64748B] space-y-1.5">
          <div className="flex items-center space-x-2">
            <Mail className="w-3.5 h-3.5 text-[#1E293B]" />
            <span>support@msmegrowthadvisor.in</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-3.5 h-3.5 text-[#1E293B]" />
            <span>+91 1800-123-MSME (Toll-Free)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
