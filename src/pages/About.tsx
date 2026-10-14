import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Award,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Clock,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Laptop,
  Check
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
            <span>About Us</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Our Mission & Vision
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white light:text-slate-900 tracking-tight mt-3 mb-5">
              Empowering India's Next Generation of Skilled Engineers & Leaders
            </h1>
            <p className="text-base sm:text-lg text-slate-300 light:text-slate-600 leading-relaxed">
              PPO Intern is a dedicated pre-placement internship gateway created to bridge the critical gap between university curricula and real industry expectations through certified 120-hour programs.
            </p>
          </div>
        </div>
      </section>

      {/* Story, Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            <div className="p-8 rounded-3xl bg-slate-900/60 light:bg-white border border-slate-800 light:border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white light:text-slate-900 mb-3 font-heading">
                Our Mission
              </h3>
              <p className="text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                To democratize high-quality, practical tech and business internships for students across tier-1, tier-2, and tier-3 colleges with zero geographic barriers and full academic compliance.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/60 light:bg-white border border-slate-800 light:border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white light:text-slate-900 mb-3 font-heading">
                Our Vision
              </h3>
              <p className="text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                To become India's most trusted credit-verification and pre-placement pathway, connecting 1 million+ graduates with certified practical skillsets and verified hiring partners.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/60 light:bg-white border border-slate-800 light:border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white light:text-slate-900 mb-3 font-heading">
                Our Values
              </h3>
              <p className="text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                Academic integrity, transparent dynamic fee subsidies, tamper-proof audit trails, and rigorous real-world capstone evaluation over superficial certificate mills.
              </p>
            </div>
          </div>

          {/* 4 Quality Commitments */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Excellence Guaranteed
            </span>
            <h2 className="text-3xl font-extrabold text-white light:text-slate-900 mt-3 mb-3">
              Our 4 Pillars of Quality Commitment
            </h2>
            <p className="text-sm text-slate-400 light:text-slate-600">
              How we protect student interests, university compliance, and corporate recruitment standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {commitments.map((comm, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/40 light:bg-white border border-slate-800/80 light:border-slate-200"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <comm.icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white light:text-slate-900 mb-2 font-heading">
                  {comm.title}
                </h4>
                <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                  {comm.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Milestones
              </span>
              <h2 className="text-3xl font-extrabold text-white light:text-slate-900 mt-3">
                Our Journey & Milestones
              </h2>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-slate-800 light:before:bg-slate-300">
              {timelineEvents.map((item, idx) => (
                <div key={idx} className="flex items-start gap-6 relative">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30 font-heading">
                    {item.year}
                  </div>
                  <div className="flex-1 p-6 rounded-2xl bg-slate-900/60 light:bg-white border border-slate-800/80 light:border-slate-200">
                    <h3 className="text-base font-bold text-white light:text-slate-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
