import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  ArrowRight,
  FileText,
  CreditCard,
  Download,
  Laptop,
  Award,
  HelpCircle,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Clock,
  Sparkles,
  Users
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      num: '01',
      title: 'Online Application & College Verification',
      subtitle: 'Complete in 2 minutes',
      desc: 'Students submit their name, contact, University Registration Number, and select their College and Tech Domain with instant validation.',
      icon: FileText
    },
    {
      num: '02',
      title: 'Dynamic College-Subsidized Fee Payment',
      subtitle: 'Secure institutional processing',
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

  const faqs = [
    {
      q: 'Is this internship program aligned with National Education Policy (NEP) 2020?',
      a: 'Yes, completely. Our 120-hour modular framework (30 days × 4 hours per day) is structured strictly according to UGC and AICTE internship credit transfer guidelines, allowing students to earn 3 to 4 university semester credits.'
    },
    {
      q: 'How does my College Internship Nodal Officer (CINO) verify my enrollment?',
      a: 'Every student receives an official Offer Letter with a distinct Letter Reference ID (IM/2026/IAL/...). Your college nodal officer can verify this letter and download verification sheets directly from the institutional portal desk.'
    },
    {
      q: 'What if my college has a specific subsidized fee rate?',
      a: 'Our portal supports dynamic institutional pricing. When you select your enrolled college in the registration form, the fee updates automatically to reflect your college’s specific institutional MoU rate.'
    },
    {
      q: 'When and where can I download my Offer Letter?',
      a: 'Immediately upon completing registration and fee verification. You can log into your Student Dashboard using your registered email and password to download your official PDF offer letter and fee receipt 24/7.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans text-left pt-28 pb-20">
      
      {/* Hero Banner with Breadcrumbs */}
      <section className="relative py-14 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-4">
            <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>How It Works</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Student & Nodal Guide
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              The Step-by-Step Internship Pathway
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
              Understand the transparent 5-stage lifecycle from initial enrollment to academic credit acceptance at your university.
            </p>
          </div>
        </div>
      </section>

      {/* 5-Step Detailed Journey */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start gap-6 relative group hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20 font-mono">
                  {step.num}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h3 className="text-xl font-black text-slate-900">
                      {step.title}
                    </h3>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full w-max border border-indigo-100">
                      {step.subtitle}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4">
                    {step.desc}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>NEP-2020 UGC Compliant Stage</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Institutional Presentation & Defense Feature Showcase */}
          <div className="mt-16 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4 text-left">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                  Academic Defense & Viva
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Institutional Capstone Defense & Nodal Review
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  At the end of your 120-hour program, students present their production capstone projects before academic evaluators and industrial mentors. This rigorous viva ensures academic integrity and gives students confidence during campus recruitment drives.
                </p>

                <div className="space-y-2 pt-2 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Peer-reviewed presentation slide decks and live code walk-throughs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Standardized UGC logbook records stamped with daily attendance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Letter of Recommendation (LOR) for top 15% outstanding performers</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-slate-100 relative group">
                  <img
                    src="/images/student_presentation_nodal.jpg"
                    alt="Student Capstone Project Presentation and Nodal Review"
                    className="w-full h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-5">
                    <p className="text-white text-xs font-bold">
                      Formal Capstone Defense & Academic Evaluation Session
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="mt-16 text-left">
            <div className="mb-8 space-y-2">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                Clarifications
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Help Desk Callout */}
          <div className="mt-16 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Questions About Institutional Onboarding?
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  Contact our College Internship Nodal Officer (CINO) desk for batch integrations.
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm transition whitespace-nowrap cursor-pointer"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
