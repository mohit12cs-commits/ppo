import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Building2,
  Clock,
  Star,
  FileText,
  ChevronDown,
  ExternalLink,
  Laptop,
  Check
} from 'lucide-react';
import { INTERNSHIP_DOMAINS, DEFAULT_SITE_SETTINGS } from '../lib/constants';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const Home: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'siteSettings', 'public'));
        if (snap.exists()) {
          setSiteSettings(prev => ({ ...prev, ...snap.data() }));
        }
      } catch (err) {
        // Fallback to defaults
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans text-left">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH 4K AESTHETIC VISUAL */}
      {/* ========================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-slate-50">
        {/* Soft background accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-100/60 via-cyan-100/40 to-blue-50/30 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Accreditation Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-xs font-extrabold tracking-wide">
                  NEP-2020 & UGC Approved • 120-Hour Industrial Framework
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Transform Your Degree With{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  Accredited Practical
                </span>{' '}
                Internships
              </h1>

              {/* Sub-text */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                Work on live production capstone projects, gain hands-on technical mentorship, and graduate with verifiable certificates recognized for academic credit audits across top universities.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Register for Internship</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/programs"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-sm sm:text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Explore 20+ Domains</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                {[
                  { title: 'Instant Offer Letter', desc: 'Auto-issued upon enrollment' },
                  { title: '120-Hour Track', desc: 'Mandatory NEP-2020 credit fit' },
                  { title: 'Verifiable QR Code', desc: 'Online digital credentials' },
                  { title: 'College Subsidized', desc: 'MoU based institute pricing' }
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs"
                  >
                    <p className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat.title}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">{feat.desc}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Visual Column (4K Generated Showcase Image) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl p-3 bg-white border border-slate-200/80 shadow-2xl">
                <div className="rounded-2xl overflow-hidden relative aspect-4/3 bg-slate-100">
                  <img
                    src="/images/hero_students_collab.jpg"
                    alt="Indian engineering students collaborating in advanced computer lab"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Floating Overlay Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
                          <Laptop size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">Hands-on Lab Simulation</p>
                          <p className="text-[11px] text-slate-500 font-medium">Over 50,000+ Enrolled Undergraduates</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        4K Certified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Glow behind the image */}
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS BAR */}
      {/* ========================================================================= */}
      <section className="py-12 bg-white border-y border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl hover:bg-slate-50 transition">
              <p className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">
                {siteSettings.statsStudentsEnrolled.toLocaleString('en-IN')}+
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                Students Enrolled
              </p>
            </div>
            <div className="p-4 rounded-2xl hover:bg-slate-50 transition">
              <p className="text-3xl sm:text-4xl font-black text-cyan-600 tracking-tight">
                {siteSettings.statsColleges.toLocaleString('en-IN')}+
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                Affiliated Colleges
              </p>
            </div>
            <div className="p-4 rounded-2xl hover:bg-slate-50 transition">
              <p className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                {siteSettings.statsUniversities.toLocaleString('en-IN')}+
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                Partner Universities
              </p>
            </div>
            <div className="p-4 rounded-2xl hover:bg-slate-50 transition">
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                {siteSettings.statsCertificatesIssued.toLocaleString('en-IN')}+
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                Certificates Awarded
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MENTORSHIP & INDUSTRY GUIDANCE (WITH 4K IMAGE 2) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column Left */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-3xl p-3 bg-white border border-slate-200/80 shadow-xl">
                <div className="rounded-2xl overflow-hidden aspect-4/3 bg-slate-100">
                  <img
                    src="/images/mentor_guidance_4k.jpg"
                    alt="Senior engineering mentor guiding university students"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                {/* Floating pill badge */}
                <div className="absolute sm:-top-4 sm:-right-4 top-2 right-2 p-2.5 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg flex items-center gap-2 sm:gap-2.5 max-w-[calc(100%-1rem)]">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                    <Star size={16} className="fill-indigo-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">1-on-1 Code Reviews</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold">Weekly Milestone Viva</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column Right */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-200/80">
                <Sparkles size={14} className="text-indigo-600" />
                <span>Industry Alignment Framework</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Bridging Higher Education With Practical Technical Mentorship
              </h2>

              <p className="text-slate-600 leading-relaxed font-medium text-sm sm:text-base">
                Under the National Education Policy (NEP) 2020, university students in undergraduate and postgraduate programs are required to complete structured internships for course credit. Patliputra University (PPU) Internship Portal provides institutional accreditation, guided daily learning modules, live project evaluations, and automated verifiable records.
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  '120 hours of hands-on technical curriculum (30 Days x 4 Hours/Day)',
                  'Official Letter of Acceptance issued instantly upon registration',
                  'Tamper-proof QR verification recognized by academic nodal officers',
                  'Subsidized fee tiers per college under institutional partnership MoUs'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-extrabold text-indigo-600 hover:text-indigo-700 group cursor-pointer"
                >
                  <span>Learn more about our university accreditation standard</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DOMAINS PREVIEW */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Curated Technical Tracks
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Explore Our Internship Domains
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Select from practical technology and engineering domains designed to turn classroom theory into hireable workplace skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTERNSHIP_DOMAINS.map((domain) => (
              <div
                key={domain.id}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                      {domain.badge}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      {domain.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">
                    {domain.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 font-medium">
                    {domain.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {domain.skills.slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/register?domain=${encodeURIComponent(domain.name)}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-extrabold uppercase tracking-wider rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
                >
                  <span>Register for this Track</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-extrabold rounded-2xl bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
            >
              <span>View Detailed Curriculum & All 20+ Domains</span>
              <ArrowRight size={16} className="text-indigo-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. STUDENT SUCCESS & CERTIFICATION (WITH 4K IMAGE 3) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Content Left */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                <Award size={14} className="text-emerald-600" />
                <span>Academic Credit Transfer Ready</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Verifiable Certificates Recognized By Examination Regulators
              </h2>

              <p className="text-slate-600 leading-relaxed font-medium text-sm sm:text-base">
                Each certificate issued by Patliputra University (PPU) Internship Portal contains an immutable cryptographic QR code linked directly to the student's verified attendance log, capstone score, and industrial mentor signature.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                    Tamper-Proof Verification
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Nodal officers can scan the QR code to verify student participation without emailing back and forth.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                    UGC Credit Weightage
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Formatted specifically to satisfy 2-4 semester credit conversions per state university curricula.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-md shadow-indigo-600/20 transition cursor-pointer"
                >
                  <span>Claim Your Internship Seat</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Visual Right (4K Image 3) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-3 bg-white border border-slate-200/80 shadow-xl">
                <div className="rounded-2xl overflow-hidden aspect-4/3 bg-slate-100">
                  <img
                    src="/images/student_achievement_4k.jpg"
                    alt="Proud graduate student holding verified internship completion certificate"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                {/* Floating pill badge */}
                <div className="absolute sm:-bottom-4 sm:-left-4 bottom-2 left-2 p-2.5 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg flex items-center gap-2 sm:gap-3 max-w-[calc(100%-1rem)]">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">100% Audit Cleared</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold">Accepted by 150+ Affiliated Colleges</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PARTNER INSTITUTIONS */}
      {/* ========================================================================= */}
      <section className="py-14 border-y border-slate-200/80 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <p className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
            Trusted by Scholars from Leading Higher Education Institutions
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-4">
            {[...siteSettings.marqueeInstitutions, ...siteSettings.marqueeInstitutions].map(
              (inst, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 shrink-0"
                >
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">
                    {inst}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FAQ ACCORDION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Everything you need to know about enrollment, college fees, offer letters, and credits.
            </p>
          </div>

          <div className="space-y-3">
            {siteSettings.faqs.map((faq, fIdx) => {
              const isOpen = activeFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : fIdx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  >
                    <span className="text-sm font-bold text-slate-900">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FINAL CTA BANNER */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/20">
                2026 Academic Admissions
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Start Your Internship Journey Today
              </h2>
              <p className="text-sm sm:text-base text-indigo-100 leading-relaxed font-medium">
                Join over 50,000+ university scholars who accelerated their career, fulfilled university NEP credits, and earned verifiable certificates.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 text-xs font-black uppercase tracking-wider text-indigo-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Register for Internship
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white border border-white/30 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                >
                  Talk to Student Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
