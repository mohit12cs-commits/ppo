import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Layers,
  Award,
  Terminal,
  ShieldCheck,
  Check
} from 'lucide-react';
import { INTERNSHIP_DOMAINS } from '../lib/constants';

export const Programs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Software Engineering', 'AI & Data', 'Security', 'Infrastructure', 'Marketing & Commerce'];

  const filteredDomains = INTERNSHIP_DOMAINS.filter(
    d => selectedCategory === 'All' || d.category === selectedCategory
  );

  const curriculumMilestones = [
    {
      week: 'Week 01',
      title: 'Foundations & Architecture Setup',
      hours: '30 Hours',
      topics: ['Development environment orchestration & Git flow', 'Core architectural patterns & system requirements', 'Code conventions, linting & test harnesses', 'First module deliverable and peer code review']
    },
    {
      week: 'Week 02',
      title: 'Deep-Dive Implementation & APIs',
      hours: '30 Hours',
      topics: ['Advanced state management / database models', 'RESTful & GraphQL API integration pipelines', 'Security safeguards, auth flows & input sanitization', 'Mid-term mentor code walk-through & progress check']
    },
    {
      week: 'Week 03',
      title: 'Industry Capstone Project Build',
      hours: '30 Hours',
      topics: ['Production feature implementation for real clients', 'Continuous integration & Docker containerization', 'Performance tuning & error logging benchmarks', 'Pre-release deployment to staging cluster']
    },
    {
      week: 'Week 04',
      title: 'Evaluation, Viva & Documentation',
      hours: '30 Hours',
      topics: ['Final technical report submission for CINO review', 'Technical presentation & project viva evaluation', 'Logbook verification and mentor attendance sign-off', 'Tamper-proof verifiable credential & certificate issuance']
    }
  ];

  const creditMatrix = [
    { degree: 'B.Tech / B.E. (All Branches)', semester: 'Sem 4, 6 or 7', hours: '120 Hours', credits: '4 Academic Credits', body: 'UGC & AICTE Mandated' },
    { degree: 'BCA / B.Sc (Computer Science / IT)', semester: 'Sem 4 or 5', hours: '120 Hours', credits: '4 Academic Credits', body: 'University Syllabus Matrix' },
    { degree: 'MCA / M.Sc (Tech)', semester: 'Sem 2 or 3', hours: '120 Hours', credits: '6 Academic Credits', body: 'Major Industry Project' },
    { degree: 'B.Com / BBA / B.A. (Vocational)', semester: 'Sem 3, 4 or 5', hours: '120 Hours', credits: '3 Academic Credits', body: 'NEP Experiential Track' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans text-left pt-28 pb-20">
      
      {/* Hero Banner with Breadcrumbs & Workspace Image */}
      <section className="relative py-14 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-4">
            <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Programs</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                NEP-2020 120-Hour Tracks
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Certified Technical & Industry Internship Domains
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                Every track includes structured daily learning modules, live project capstone development, mentor reviews, and a verifiable completion certificate recognized for academic credit audits across all affiliated colleges.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Academic Credit Aligned</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>College Nodal Verification Ready</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>30 Days × 4 Hours Daily Rhythm</span>
                </div>
              </div>
            </div>

            {/* Visual Hero Showcase Image */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 relative group">
                <img
                  src="/images/programs_tech_workspace.jpg"
                  alt="Modern Technology Lab and Development Workspace"
                  className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-600 text-white inline-block mb-1">
                      Innovation Labs
                    </span>
                    <p className="text-sm font-extrabold">Next-Gen Industry Development Environments</p>
                    <p className="text-xs text-slate-200">Hands-on repositories with real production code standards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Breakdown Section */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-2">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              Systematic Learning Rhythm
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              120-Hour Modular Curriculum Roadmap
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Every enrolled student follows a clear 4-week timeline designed to fulfill University Academic Council requirements without disrupting college lectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {curriculumMilestones.map((m, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-mono">
                      {m.week}
                    </span>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {m.hours}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mb-3">
                    {m.title}
                  </h3>

                  <ul className="space-y-2 text-xs text-slate-600">
                    {m.topics.map((t, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/60 text-[11px] font-bold text-indigo-700">
                  Status: NEP Verified
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs & Catalog */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 space-y-2">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              Domain Tracks
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Select Your Specialization Track
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Choose the program aligned with your academic department or personal career aspirations.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDomains.map((domain) => (
              <div
                key={domain.id}
                className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {domain.badge}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-bold">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {domain.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-2.5">
                    {domain.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                    {domain.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Core Competencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {domain.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block mb-1">
                        Eligibility & Prerequisites
                      </span>
                      <p className="text-xs font-semibold text-slate-800">
                        {domain.eligibility}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Course Fit</span>
                    <span className="text-xs font-bold text-slate-800">120 Hours (4 Credits)</span>
                  </div>
                  <Link
                    to={`/register?domain=${encodeURIComponent(domain.name)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer"
                  >
                    <span>Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Credit Matrix Table */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 space-y-2">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
              University Accreditation
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Academic Credit Transfer Matrix
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Clear mapping of student hours to university academic council credits across major degree programs.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Degree / Program</th>
                  <th className="py-4 px-6">Recommended Semester</th>
                  <th className="py-4 px-6">Internship Hours</th>
                  <th className="py-4 px-6">Credits Awarded</th>
                  <th className="py-4 px-6">Regulatory Body</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {creditMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white transition">
                    <td className="py-3.5 px-6 font-bold text-slate-900">{row.degree}</td>
                    <td className="py-3.5 px-6 text-slate-600 font-semibold">{row.semester}</td>
                    <td className="py-3.5 px-6 text-indigo-700 font-mono font-bold">{row.hours}</td>
                    <td className="py-3.5 px-6 font-extrabold text-emerald-700">{row.credits}</td>
                    <td className="py-3.5 px-6 text-slate-500">{row.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Begin Your Certified Internship Journey?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            Join thousands of engineering and commerce scholars gaining real industry credentials and credit recognition today.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-black text-sm uppercase tracking-wider shadow-xl transition cursor-pointer"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Programs;
