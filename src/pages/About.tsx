import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Laptop,
  Check,
  Award,
  Building2,
  GraduationCap
} from 'lucide-react';

export const About: React.FC = () => {
  const timelineEvents = [
    {
      year: '2020',
      title: 'NEP 2020 Alignment',
      desc: 'Founded to deliver structured, credit-compliant digital internships directly mapped to National Education Policy guidelines.'
    },
    {
      year: '2022',
      title: 'LMS & Capstone Architecture',
      desc: 'Launched the 120-hour modular framework (30 days x 4 hours/day) with practical industry assessments.'
    },
    {
      year: '2024',
      title: 'Institutional MoUs',
      desc: 'Partnered with over 100+ state and central university colleges for direct student recognition and nodal officer desks.'
    },
    {
      year: '2026',
      title: 'National Scale & Pre-Placement Pathways',
      desc: 'Over 50,000+ interns certified with dynamic company cohort templates and direct corporate placement linkages.'
    }
  ];

  const commitments = [
    {
      title: 'University Accredited Quality',
      desc: 'Every track is vetted by academic deans to ensure alignment with NEP-2020 and AICTE internship credit criteria.',
      icon: ShieldCheck
    },
    {
      title: '120-Hour Disciplined Pace',
      desc: 'Modules are balanced into 4 daily hours across 30 days, preventing burnout alongside regular college exams.',
      icon: Clock
    },
    {
      title: 'Hands-On Capstone Project',
      desc: 'Interns write real code and analyze production data rather than only watching pre-recorded video lectures.',
      icon: Laptop
    },
    {
      title: '24/7 Nodal & Student Helpdesk',
      desc: 'Dedicated coordination team assisting College Internship Nodal Officers (CINO) and enrolled scholars.',
      icon: Users
    }
  ];

  const stats = [
    { value: '50,000+', label: 'Certified Scholars' },
    { value: '100+', label: 'Partner Colleges' },
    { value: '120 Hours', label: 'NEP Modular Cadence' },
    { value: '98.4%', label: 'Credit Approval Rate' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans text-left pt-28 pb-20">
      
      {/* Hero Banner with Breadcrumbs & Visual Image */}
      <section className="relative py-14 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-4">
            <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>About Us</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Our Mission & Vision
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Empowering India's Next Generation of Skilled Engineers & Leaders
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                PPO Intern is a dedicated pre-placement internship gateway created to bridge the critical gap between university curricula and real industry expectations through certified 120-hour programs aligned with NEP-2020.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {stats.map((s, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <p className="text-2xl font-black text-indigo-600 font-mono">{s.value}</p>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 relative group">
                <img
                  src="/images/about_students.jpg"
                  alt="Students Collaborating in Higher Education Innovation Lab"
                  className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white inline-block mb-1">
                      Campus Impact
                    </span>
                    <p className="text-sm font-black">Reaching 100+ Colleges Across India</p>
                    <p className="text-xs text-slate-200">Democratizing access to high-impact technical mentors.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story, Mission & Vision */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Our Core Mission</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                To democratize career-accelerating technical internships for students from every district and state university college, ensuring equitable access to high-grade industrial mentorship and job-ready technical portfolios.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Institutional Vision</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                To become India's primary credit-integrated internship partner for 500+ colleges by combining verifiable digital credentialing, dynamic corporate cohort models, and strict NEP-2020 compliance standards.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Placement Linkage</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                We work directly with recruiters who prioritize candidate capstone code repositories and live project evaluations over standard marks sheets during preliminary campus interview screenings.
              </p>
            </div>
          </div>

          {/* Mentorship Spotlight Feature */}
          <div className="mb-20 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-slate-100 relative group">
                  <img
                    src="/images/mentor_guidance_4k.jpg"
                    alt="Senior Industry Technical Mentor Guiding Undergraduates"
                    className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-5">
                    <p className="text-white text-xs font-bold">
                      Direct Hands-on Mentorship & Architecture Reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                  Personalized Mentoring
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Guided by Experienced Industry Practitioners
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  At PPO Intern, students are not left alone with video recordings. Every cohort is assigned technical mentors who conduct live code reviews, debug challenging problems, and impart professional design standards used at top software product companies.
                </p>

                <div className="space-y-2.5 pt-2 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Weekly 1-on-1 and small group code architecture audits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Industry best practices: Git branching, CI/CD, and automated testing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Interview preparation and resume portfolio polishing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Our Evolution
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Our Journey Towards Academic Excellence
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {timelineEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs relative"
                >
                  <span className="text-2xl font-black text-indigo-600 block mb-2 font-mono">
                    {evt.year}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">{evt.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{evt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pillars & Commitments */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-extrabold uppercase text-indigo-600 tracking-wider">
                Uncompromising Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 mb-3">
                Built Strictly for Academic Credit Audits
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                We take educational compliance seriously. Every module and certificate is crafted to withstand state university scrutiny.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {commitments.map((c, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{c.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-600">
                Ready to kick off your university-accredited training?
              </span>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer"
              >
                <span>Register for Internship</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
