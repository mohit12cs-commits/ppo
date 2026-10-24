import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans text-left pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-4">
          <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Privacy Policy</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mb-8 font-medium">Last Updated: October 2026</p>

        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Overview</h2>
            <p>
              Patliputra University (PPU) Internship Portal ("we", "our", or "us") is committed to safeguarding the privacy and personal academic data of university scholars, faculty nodal officers, and affiliated institutions. This Privacy Policy outlines our procedures concerning the collection, use, and disclosure of student information when registering for internship cohorts.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Information We Collect</h2>
            <p>
              During registration, we collect academic and contact identifiers including Full Name, Email, Contact Number, College / Institution Name, University Registration Number, Degree, Semester, and Selected Technical Domain. For fee payments, transactions are processed directly via Razorpay and we do not store raw card or UPI secrets.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Purpose of Data Processing</h2>
            <p>
              Your information is exclusively utilized for: (a) Issuing personalized, signed Internship Offer Letters and Payment Slips; (b) Verifying mandatory course credit transfer with your college nodal desk under NEP-2020 guidelines; and (c) Awarding tamper-proof QR-verifiable certificates upon project completion.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Third-Party Sharing</h2>
            <p>
              We do not sell, rent, or commercialize student data. Academic records are shared solely with verified university administrative auditors and authorized recruitment partners for pre-placement interviews.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Contact Grievance Officer</h2>
            <p>
              For data access, correction, or deletion inquiries, email us at <span className="text-indigo-600 font-bold">support@ppointern.com</span> or contact our helpline at +91 96939 21517.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
