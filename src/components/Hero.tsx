import React, { useState } from 'react';
import { ArrowRight, Award, CheckCircle2, Search, ShieldCheck, Sparkles, Star, Users, Zap } from 'lucide-react';

interface HeroProps {
  onSearch: (query: string) => void;
  onOpenApply: () => void;
  onOpenVerify: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onOpenApply, onOpenVerify }) => {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    const tracksSection = document.getElementById('tracks');
    if (tracksSection) {
      tracksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background ambient glowing mesh gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Trust Accreditation Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">
              Patliputra University (PPU) • 2026 Cohorts Open • NEP-2020 Aligned
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            Patliputra University <br className="hidden sm:inline" />
            <span className="gradient-text">Official Internship</span> Portal
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed font-normal">
            Certified 120-hour industry internships for Patliputra University (PPU) students across all affiliated colleges. Work on live projects under senior mentors with instant verifiable offer letters.
          </p>

          {/* Interactive Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-10 relative">
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center shadow-2xl rounded-2xl overflow-hidden bg-slate-900/90 border border-indigo-500/30 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all p-1.5 gap-1.5 sm:gap-0">
              <div className="flex items-center flex-1">
                <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tracks: Full Stack, AI & ML, Cloud..."
                  className="w-full bg-transparent border-none py-2.5 sm:py-3 px-2 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Find Tracks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {/* Quick Filter Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
              <span>Popular searches:</span>
              {['Full Stack Web', 'Generative AI', 'Cloud DevOps', 'Cyber Security'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setQuery(tag);
                    onSearch(tag);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onOpenApply}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:brightness-110 text-white font-semibold rounded-xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Apply for Internship
            </button>
            <button
              onClick={onOpenVerify}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Verify Certificate
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
            <div className="p-2 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading">50,000+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Students Enrolled</div>
            </div>
            <div className="p-2 text-center border-l border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-heading">94.8%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Placement / Referral Rate</div>
            </div>
            <div className="p-2 text-center border-l border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-heading">250+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Hiring Corporate Partners</div>
            </div>
            <div className="p-2 text-center border-l border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-heading">4.9 / 5</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Student Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
