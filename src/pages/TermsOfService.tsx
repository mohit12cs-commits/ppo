import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans text-left pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-4">
          <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Terms of Service</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
          Terms of Service & Internship Guidelines
        </h1>
        <p className="text-xs text-slate-500 mb-8 font-medium">Effective Date: October 2026</p>

        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By enrolling in an internship track or accessing the Patliputra University (PPU) Internship portal, you agree to adhere to these Terms of Service, academic code of conduct, and university evaluation rules.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Internship Completion Standards</h2>
            <p>
              Under NEP-2020 120-hour rules, students are expected to complete modular learning tasks, capstone code assignments, and mentor milestones. Falsification of project submissions or plagiarized capstone repositories may result in credential withholding.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. College-Specific Fees & Refunds</h2>
            <p>
              Registration fees vary dynamically based on institutional MoUs signed between colleges and Patliputra University (PPU). Payments completed via Razorpay are confirmed with an instant digital receipt. Refunds are governed by academic batch cancellation guidelines prior to capstone mentor allocation.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Digital Credential Verification</h2>
            <p>
              Offer Letters and Completion Certificates issued by Patliputra University (PPU) Internship Portal carry cryptographic QR codes for institutional validation. Tampering with digital PDF certificates is strictly prohibited by law.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
