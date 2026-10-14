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
  Briefcase,
  ChevronDown,
  Building2,
  Clock,
  Code2,
  BrainCircuit,
  ShieldAlert,
  Database,
  Cloud,
  Megaphone,
  Star,
  FileText,
  Search
} from 'lucide-react';
import { INTERNSHIP_DOMAINS, DEFAULT_SITE_SETTINGS } from '../lib/constants';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const Home: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    // Fetch live settings if updated by admin
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'siteSettings', 'public'));
        if (snap.exists()) {
          setSiteSettings(prev => ({ ...prev, ...snap.data() }));
        }
      } catch (err) {
        // Fallback to DEFAULT_SITE_SETTINGS
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-800">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-emerald-600/20 via-teal-600/15 to-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 light:bg-emerald-50 border border-slate-700/80 light:border-emerald-200 shadow-sm mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300 light:text-emerald-800">
                Admissions Open 2026 • NEP-2020 & AICTE Compliant 120-Hr Framework
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white light:text-slate-900 leading-[1.15] mb-6">
              Launch Your Career With{' '}
              <span className="gradient-text-emerald">Industry-Accredited</span> Internships
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 light:text-slate-600 mb-8 leading-relaxed">
              Work on live production capstone projects, gain hands-on technical mentorship, and graduate with verifiable certificates recognized for academic credit audits across top universities.
            </p>

            {/* 2 CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-xl shadow-emerald-600/25 active:scale-95 transition-all"
              >
                <span>Register Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/programs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm sm:text-base font-semibold text-slate-200 light:text-slate-800 bg-slate-900/80 light:bg-white hover:bg-slate-800 light:hover:bg-slate-100 border border-slate-800 light:border-slate-300 rounded-xl transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Explore Programs</span>
              </Link>
            </div>

            {/* Trust Pill Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              {[
                { title: 'Instant Offer Letter', desc: 'Auto-issued upon enrollment' },
                { title: '120-Hour Track', desc: 'Full academic credit compliance' },
                { title: 'Tamper-Proof QR', desc: 'Verifiable digital credentials' },
                { title: 'College Subsidized', desc: 'Dynamic MoU institution pricing' }
              ].map((feat, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900/50 light:bg-white border border-slate-800/80 light:border-slate-200"
                >
                  <p className="text-xs font-bold text-white light:text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat.title}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 light:text-slate-500 mt-0.5">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS STRIP (Editable by Admin) */}
      {/* ========================================================================= */}
      <section className="py-10 bg-slate-900/80 light:bg-slate-100 border-y border-slate-800/80 light:border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 light:text-emerald-600 font-heading">
                {siteSettings.statsStudentsEnrolled.toLocaleString('en-IN')}+
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-400 light:text-slate-600 mt-1">
                Students Enrolled
              </p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-400 light:text-teal-600 font-heading">
                {siteSettings.statsColleges.toLocaleString('en-IN')}+
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-400 light:text-slate-600 mt-1">
                Affiliated Colleges
              </p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-400 light:text-blue-600 font-heading">
                {siteSettings.statsUniversities.toLocaleString('en-IN')}+
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-400 light:text-slate-600 mt-1">
                Partner Universities
              </p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-400 light:text-purple-600 font-heading">
                {siteSettings.statsCertificatesIssued.toLocaleString('en-IN')}+
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-400 light:text-slate-600 mt-1">
                Certificates Issued
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ABOUT SNIPPET */}
      {/* ========================================================================= */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                About Our Vision
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white light:text-slate-900 tracking-tight mb-5">
                Bridging Higher Education With Practical Industry Experience
              </h2>
              <p className="text-slate-300 light:text-slate-600 leading-relaxed mb-6">
                Under the National Education Policy (NEP) 2020, university students in undergraduate and postgraduate programs are required to complete structured internships for course credit. PPO Intern provides institutional accreditation, guided daily learning modules, live project evaluations, and automated verifiable records.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  '120 hours of hands-on technical curriculum (30 Days x 4 Hours/Day)',
                  'Official Letter of Acceptance issued instantly upon registration',
                  'Tamper-proof QR verification recognized by academic nodal officers',
                  'Subsidized fee tiers per college under institutional partnership MoUs'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-slate-300 light:text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 light:text-emerald-600 hover:text-emerald-300 transition-colors group"
              >
                <span>Read our full story and mission</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Visual Card Display */}
            <div className="relative">
              <div className="p-8 rounded-3xl bg-slate-900/70 light:bg-white border border-slate-800 light:border-slate-200 shadow-2xl relative z-10">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800 light:border-slate-200">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white light:text-slate-900">
                      University Academic Verification
                    </h3>
                    <p className="text-xs text-slate-400">Institutional Accreditation Standard</p>
                  </div>
                </div>
                <div className="space-y-4 text-xs text-slate-300 light:text-slate-600">
                  <div className="p-4 rounded-2xl bg-slate-950/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      NEP-2020 Compliance
                    </span>
                    <p className="mt-1 font-semibold text-slate-200 light:text-slate-800">
                      Mandatory Undergraduate Internship Framework (120 Hours)
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                      Dynamic Batching & Templates
                    </span>
                    <p className="mt-1 font-semibold text-slate-200 light:text-slate-800">
                      Multi-cohort distribution engine with corporate signatory validation
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PROGRAMS / DOMAINS PREVIEW */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-900/40 light:bg-slate-100/60 border-t border-slate-800/80 light:border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Curated Technical Tracks
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white light:text-slate-900 tracking-tight mt-3 mb-4">
              Explore Our Internship Domains
            </h2>
            <p className="text-sm sm:text-base text-slate-400 light:text-slate-600">
              Select from practical technology and business domains designed to convert academic knowledge into workplace skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTERNSHIP_DOMAINS.map((domain) => (
              <div
                key={domain.id}
                className="group relative p-6 rounded-3xl bg-slate-900/70 light:bg-white border border-slate-800/80 light:border-slate-200 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {domain.badge}
                    </span>
                    <span className="text-xs text-slate-400 light:text-slate-500 font-medium">
                      {domain.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white light:text-slate-900 mb-2 group-hover:text-emerald-400 transition-colors">
                    {domain.name}
                  </h3>
                  <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed mb-4">
                    {domain.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {domain.skills.slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 light:bg-slate-100 text-slate-300 light:text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/register?domain=${encodeURIComponent(domain.name)}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl text-white bg-slate-800 light:bg-slate-900 hover:bg-emerald-600 light:hover:bg-emerald-600 transition-colors"
                >
                  <span>Register for this Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-slate-900 light:bg-white text-slate-200 light:text-slate-800 border border-slate-800 light:border-slate-300 hover:border-emerald-500 transition-all"
            >
              <span>View Detailed Curriculum & All 20+ Domains</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS */}
      {/* ========================================================================= */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Clear 5-Step Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white light:text-slate-900 tracking-tight mt-3 mb-4">
              How the Internship Process Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400 light:text-slate-600">
              From online registration to official university credit transfer in 5 simple stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Register Online',
                desc: 'Fill in your academic profile, roll number, and choose your preferred tech domain.'
              },
              {
                step: '02',
                title: 'College Fee Pay',
                desc: 'Fee is dynamically matched to your college tier and verified securely via Razorpay.'
              },
              {
                step: '03',
                title: 'Get Offer Letter',
                desc: 'Instantly download your official signed Offer Letter with Ref No & Stamp.'
              },
              {
                step: '04',
                title: 'Complete 120-Hrs',
                desc: 'Complete practical hands-on tasks, daily logbooks, and capstone mentor assignments.'
              },
              {
                step: '05',
                title: 'Verified Certificate',
                desc: 'Receive tamper-proof QR certificate for university credits and placement portfolios.'
              }
            ].map((stepItem, sIdx) => (
              <div
                key={sIdx}
                className="p-5 rounded-2xl bg-slate-900/60 light:bg-white border border-slate-800/80 light:border-slate-200 relative group hover:border-emerald-500/40 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-3">
                  {stepItem.step}
                </div>
                <h3 className="text-sm font-bold text-white light:text-slate-900 mb-1.5">
                  {stepItem.title}
                </h3>
                <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                  {stepItem.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <span>Read detailed guideline for students and nodal officers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHY CHOOSE US / BENEFITS */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-900/40 light:bg-slate-100/60 border-t border-slate-800/80 light:border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Institutional Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white light:text-slate-900 tracking-tight mt-3 mb-4">
              Why Colleges & Students Choose PPO Intern
            </h2>
            <p className="text-sm sm:text-base text-slate-400 light:text-slate-600">
              Designed from ground-up to satisfy both rigorous university audits and modern tech recruitment requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'NEP 2020 Framework',
                desc: 'Complies with all mandatory credit guidelines issued by UGC & State Higher Education councils.'
              },
              {
                icon: FileText,
                title: 'Official Offer Letters',
                desc: 'Download authentic company-stamped offer letters featuring Ref IDs and signatory verification.'
              },
              {
                icon: Award,
                title: 'Verifiable Digital Credentials',
                desc: 'Tamper-proof QR codes enable instant online validation by academic examiners and employers.'
              },
              {
                icon: Clock,
                title: 'Structured 120 Hours',
                desc: 'Curated 30-day modular progression ensuring balance between college classes and internship tasks.'
              },
              {
                icon: Users,
                title: 'Dedicated Nodal Desk',
                desc: 'Direct helpline and coordination desk for College Internship Nodal Officers (CINO).'
              },
              {
                icon: Sparkles,
                title: 'Pre-Placement Pathway',
                desc: 'Top performers in capstone projects are shortlisted for direct corporate pre-placement offer interviews.'
              }
            ].map((ben, bIdx) => (
              <div
                key={bIdx}
                className="p-6 rounded-3xl bg-slate-900/60 light:bg-white border border-slate-800/80 light:border-slate-200"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <ben.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white light:text-slate-900 mb-2">
                  {ben.title}
                </h3>
                <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                  {ben.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PARTNER COLLEGES & UNIVERSITIES MARQUEE */}
      {/* ========================================================================= */}
      <section className="py-14 border-y border-slate-800/80 light:border-slate-200 overflow-hidden bg-slate-950 light:bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-400 light:text-slate-500">
            Trusted by Scholars from Leading Higher Education Institutions
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-4">
            {[...siteSettings.marqueeInstitutions, ...siteSettings.marqueeInstitutions].map(
              (inst, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800/80 light:border-slate-300 shrink-0"
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-200 light:text-slate-800">
                    {inst}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Student Voices
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white light:text-slate-900 tracking-tight mt-3 mb-4">
              What Interns Say About Their Experience
            </h2>
            <p className="text-sm sm:text-base text-slate-400 light:text-slate-600">
              Real feedback from students who completed their mandatory NEP internship and secured certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteSettings.testimonials.map((test, tIdx) => (
              <div
                key={tIdx}
                className="p-6 rounded-3xl bg-slate-900/60 light:bg-white border border-slate-800/80 light:border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 light:text-slate-700 leading-relaxed italic mb-6">
                    "{test.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800 light:border-slate-200">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white light:text-slate-900">{test.name}</h4>
                    <p className="text-[11px] text-slate-400 light:text-slate-500">
                      {test.role} • {test.college}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FAQ ACCORDION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-900/40 light:bg-slate-100/60 border-t border-slate-800/80 light:border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white light:text-slate-900 tracking-tight mt-3 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400 light:text-slate-600">
              Everything you need to know about enrollment, college fees, offer letters, and credits.
            </p>
          </div>

          <div className="space-y-3">
            {siteSettings.faqs.map((faq, fIdx) => {
              const isOpen = activeFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  className="rounded-2xl bg-slate-900/70 light:bg-white border border-slate-800/80 light:border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : fIdx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="text-sm font-bold text-white light:text-slate-900">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 light:text-slate-600 leading-relaxed border-t border-slate-800/40 light:border-slate-100 pt-3">
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
      {/* 10. FINAL CTA BANNER */}
      {/* ========================================================================= */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-emerald-900/90 via-teal-900/80 to-slate-900 border border-emerald-500/30 shadow-2xl text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                2026 Academic Registrations
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4 mb-4">
                Start Your Internship Journey Today
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                Join over 50,000+ university scholars who accelerated their career, fulfilled university NEP credits, and earned verifiable certificates.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Register for Internship
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/10 rounded-xl transition-all"
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
