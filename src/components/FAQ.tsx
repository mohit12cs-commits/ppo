import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are these internships recognized for college academic credit?',
      a: 'Yes, 100%. Our internship programs are designed to adhere strictly to AICTE and university curriculum guidelines. You will receive an official Offer Letter, weekly progress logbooks, and an authenticated Completion Certificate with verified QR codes that college Training & Placement Cells (TPO) accept.'
    },
    {
      q: 'How does the certificate and offer letter verification work?',
      a: 'Every student receives a unique, tamper-proof Credential ID (e.g. INT-2026-XXXX). Anyone, including college administrators and hiring recruiters, can verify your credentials in real-time 24/7 directly on our portal.'
    },
    {
      q: 'Is the internship program completely online or remote?',
      a: 'Yes, the internships are structured to be 100% remote and self-paced, allowing students across all regions to participate without disrupting regular college lectures and exams. Mentor reviews and doubt-clearing sessions are conducted live online.'
    },
    {
      q: 'Will I get an official Letter of Recommendation (LOR)?',
      a: 'Students who submit all project milestones with high quality and score Grade A/A+ receive a personalized Letter of Recommendation signed by our lead technical architects and senior mentors.'
    },
    {
      q: 'How do I pay the enrollment / kit fee and is Razorpay secure?',
      a: 'All transactions are processed securely via Razorpay with 256-bit SSL encryption. We support UPI (Google Pay, PhonePe, Paytm), NetBanking, Credit/Debit Cards, and Wallets. You will receive an instant payment receipt upon completion.'
    }
  ];

  return (
    <section id="faq" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Common Queries
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-400 text-base">
            Everything you need to know about our certified industry internship tracks and credential validation.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white text-base hover:text-indigo-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
