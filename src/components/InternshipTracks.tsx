import React, { useState } from 'react';
import { InternshipTrack } from '../types';
import { INTERNSHIP_TRACKS } from '../data/internships';
import { ArrowRight, BookOpen, CheckCircle, Clock, Code, Cpu, ExternalLink, Layers, Sparkles, Star, Trophy, Users } from 'lucide-react';

interface InternshipTracksProps {
  searchQuery: string;
  onSelectTrack: (track: InternshipTrack) => void;
}

const CATEGORIES = ['All Tracks', 'Full Stack', 'AI & ML', 'Cloud & DevOps', 'Cyber Security', 'Data Science', 'Mobile Dev'] as const;

export const InternshipTracks: React.FC<InternshipTracksProps> = ({ searchQuery, onSelectTrack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Tracks');
  const [expandedSyllabusId, setExpandedSyllabusId] = useState<string | null>(null);

  const filteredTracks = INTERNSHIP_TRACKS.filter((track) => {
    const matchesCategory = selectedCategory === 'All Tracks' || track.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() || 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.skillsGained.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      track.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section id="tracks" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Tech Domains
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Accelerate Your Skills With <span className="gradient-text">Live Capstone Tracks</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Choose from industry-vetted internship programs designed by seasoned engineering leaders. Every track includes hands-on projects, code reviews, and verifiable certification.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tracks Grid */}
        {filteredTracks.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-base mb-2">No internship tracks found matching "{searchQuery}".</p>
            <button
              onClick={() => setSelectedCategory('All Tracks')}
              className="text-sm font-semibold text-indigo-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
              >
                {/* Popular Glow Bar */}
                {track.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                )}

                <div>
                  {/* Card Header: Category & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {track.category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300" />
                      {track.rating} ({track.enrolledStudents.toLocaleString()}+)
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {track.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
                    {track.shortDesc}
                  </p>

                  {/* Duration Options */}
                  <div className="flex items-center gap-2 mb-4 text-xs text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration:</span>
                    <div className="flex gap-1.5">
                      {track.durationOptions.map((d) => (
                        <span key={d} className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 font-medium">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="mb-5">
                    <div className="text-xs font-medium text-slate-400 mb-2">Technologies Covered:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {track.skillsGained.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/50"
                        >
                          {skill}
                        </span>
                      ))}
                      {track.skillsGained.length > 4 && (
                        <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md text-slate-400">
                          +{track.skillsGained.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Collapsible Syllabus Section */}
                  {expandedSyllabusId === track.id ? (
                    <div className="mb-5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2 animate-in fade-in">
                      <div className="font-semibold text-slate-200 flex items-center justify-between">
                        <span>Modules Curriculum</span>
                        <button
                          onClick={() => setExpandedSyllabusId(null)}
                          className="text-slate-400 hover:text-white text-[11px]"
                        >
                          Hide
                        </button>
                      </div>
                      <ul className="space-y-1.5 text-slate-400">
                        {track.curriculum.map((m, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="font-semibold text-slate-300">Live Capstone:</span>
                        <p className="text-slate-400 italic mt-0.5">{track.projects[0]}</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpandedSyllabusId(track.id)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium mb-5 flex items-center gap-1 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      View Detailed Curriculum & Projects
                    </button>
                  )}
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    <span className="block font-medium text-slate-300">Offer Letter Included</span>
                    <span>Verified Certificate</span>
                  </div>
                  <button
                    onClick={() => onSelectTrack(track)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5 group-hover:gap-2"
                  >
                    Apply Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
