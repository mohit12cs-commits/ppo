import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  CreditCard,
  Download,
  Laptop,
  Award,
  HelpCircle
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Online Application & College Verification',
      subtitle: 'Complete in 2 minutes',
      desc: 'Students submit their name, contact, University Registration Number, and select their College and Tech Domain. If pre-imported by the college administration, details auto-fill instantly upon roll number verification.',
      icon: FileText
    },
    {
      num: '02',
      title: 'Dynamic College-Subsidized Fee Payment',
      subtitle: 'Secure Razorpay processing',
      desc: 'Our system automatically calculates your registration fee based on your specific college’s institutional MoU. Payments are processed with bank-grade 256-bit encryption through Razorpay with instant receipt generation.',
      icon: CreditCard
    },
    {
      num: '03',
      title: 'Instant Offer Letter Generation',
      subtitle: 'Immediate PDF download in Student Dashboard',
      desc: 'Once payment verification completes, your official Internship Acceptance / Offer Letter is automatically allocated from your assigned cohort template, stamped, and ready to download.',
      icon: Download
    },
    {
      num: '04',
      title: '120-Hour Guided Project Execution',
      subtitle: '30 Days × 4 Hours daily modular rhythm',
      desc: 'Students access daily structured assignments, capstone repository repositories, and mentor guidance to build their real-world production project portfolio.',
      icon: Laptop
    },
    {
      num: '05',
      title: 'Final Evaluation & Tamper-Proof Certificate',
      subtitle: 'Recognized for University Course Credits',
      desc: 'Upon capstone submission, students receive their verified completion certificate equipped with a tamper-proof QR code directly linkable to their verified student registry record.',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-800 pt-28 pb-20">
      {/* Hero Banner with Breadcrumbs */}
      <section className="relative py-16 border-b border-slate-800/80 light:border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-4">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span>How It Works</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Student & Nodal Guide
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white light:text-slate-900 tracking-tight mt-3 mb-5">
              The Step-by-Step Internship Pathway
            </h1>
            <p className="text-base sm:text-lg text-slate-300 light:text-slate-600 leading-relaxed">
              Understand the transparent 5-stage lifecycle from initial enrollment to academic credit acceptance at your university.
            </p>
          </div>
        </div>
      </section>

      {/* 5-Step Detailed Journey */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-900/60 light:bg-white border border-slate-800/80 light:border-slate-200 flex flex-col md:flex-row items-start gap-6 relative group hover:border-emerald-500/40 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30 font-heading">
                  {step.num}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h3 className="text-xl font-bold text-white light:text-slate-900">
                      {step.title}
                    </h3>
                    <span className="text-xs font-semibold text-emerald-400 light:text-emerald-700 bg-emerald-500/10 px-2.5 py-0.5 rounded-full w-max">
                      {step.subtitle}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 light:text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick FAQ Section */}
          <div className="mt-24 p-8 rounded-3xl bg-slate-900/40 light:bg-white border border-slate-800/80 light:border-slate-200">
            <h3 className="text-xl font-bold text-white light:text-slate-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Frequently Asked Questions for New Registrations
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-400 light:text-slate-600">
              <div className="pb-4 border-b border-slate-800 light:border-slate-200">
                <p className="font-bold text-slate-200 light:text-slate-800 mb-1">
                  Q: What if my payment deducted but my dashboard still shows pending?
                </p>
                <p>
                  A: Our server reconciles Razorpay webhooks in real-time. If there is a bank server delay, please wait 5-10 minutes and click the refresh button, or reach out to our helpdesk with your payment ID.
                </p>
              </div>

              <div className="pb-4 border-b border-slate-800 light:border-slate-200">
                <p className="font-bold text-slate-200 light:text-slate-800 mb-1">
                  Q: Can I change my internship domain after paying?
                </p>
                <p>
                  A: Within 48 hours of enrollment, you can request a track change through the helpdesk before capstone mentors are locked.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-200 light:text-slate-800 mb-1">
                  Q: How is the offer letter verified by my college?
                </p>
                <p>
                  A: Every offer letter carries an official Letter Reference Number and QR code that college nodal officers can verify instantly against the student registry.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
            >
              <span>Ready? Begin Your Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
