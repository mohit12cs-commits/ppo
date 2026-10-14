import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Code2,
  BrainCircuit,
  ShieldAlert,
  Database,
  Cloud,
  Megaphone,
  ChevronRight,
  GraduationCap,
  Award
} from 'lucide-react';
import { INTERNSHIP_DOMAINS } from '../lib/constants';

export const Programs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Software Engineering', 'AI & Data', 'Security', 'Infrastructure', 'Marketing & Commerce'];

  const filteredDomains = INTERNSHIP_DOMAINS.filter(
    d => selectedCategory === 'All' || d.category === selectedCategory
  );

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
            <span>Programs</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              NEP-2020 120-Hour Tracks
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white light:text-slate-900 tracking-tight mt-3 mb-5">
              Certified Technical & Industry Internship Domains
            </h1>
            <p className="text-base sm:text-lg text-slate-300 light:text-slate-600 leading-relaxed">
              Every track includes structured daily learning modules, live project capstone development, mentor reviews, and a verifiable completion certificate recognized for academic credit audits.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Catalog */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-900 light:bg-white text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 border border-slate-800 light:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDomains.map((domain) => (
              <div
                key={domain.id}
                className="p-7 rounded-3xl bg-slate-900/60 light:bg-white border border-slate-800/80 light:border-slate-200 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {domain.badge}
                    </span>
                    <span className="text-xs text-slate-400 light:text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {domain.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white light:text-slate-900 mb-2.5">
                    {domain.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 leading-relaxed mb-6">
                    {domain.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 light:text-slate-700 mb-2">
                        Key Skills Acquired
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {domain.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 light:bg-slate-100 text-slate-300 light:text-slate-700 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 light:border-slate-200">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 light:text-slate-700 mb-1">
                        Eligibility
                      </h4>
                      <p className="text-xs text-slate-400 light:text-slate-500">
                        {domain.eligibility}
                      </p>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 light:text-slate-700 mb-1">
                        Credential Awarded
                      </h4>
                      <p className="text-xs text-emerald-400 light:text-emerald-700 font-semibold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        Official 120-Hr NEP Compliant Certificate with QR
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 light:border-slate-200">
                  <Link
                    to={`/register?domain=${encodeURIComponent(domain.name)}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
                  >
                    <span>Register for This Track</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
