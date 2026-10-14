import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Aditya Srivastava',
      college: 'VIT Vellore',
      track: 'Full-Stack Web Engineering',
      role: 'Frontend Engineer @ FinEdge',
      quote: 'The capstone projects here were far beyond typical tutorials. Building an authenticated multi-tenant dashboard and deploying to production helped me crack my off-campus interview directly.',
      rating: 5
    },
    {
      name: 'Pooja Deshmukh',
      college: 'Pune Institute of Computer Technology',
      track: 'Generative AI & Machine Learning',
      role: 'Associate AI Engineer @ Nexus AI',
      quote: 'The weekly 1-on-1 mentor reviews were a game-changer. They gave me concrete feedback on vector search latency and RAG pipelines that impressed my recruiters during technical rounds.',
      rating: 5
    },
    {
      name: 'Karan Mehra',
      college: 'Delhi Technological University',
      track: 'Cloud Architecture & DevOps',
      role: 'Cloud Operations Intern @ TechCorp',
      quote: 'The certificate verification portal made it effortless for my college TPO and hiring managers to validate my 8-week internship completion and official letter of recommendation.',
      rating: 5
    }
  ];

  return (
    <section className="py-20 relative bg-slate-950/40 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Alumni Outcomes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Hear From Our <span className="gradient-text">Graduated Interns</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Over 50,000+ students from 500+ universities have leveraged our programs to bridge academic theory with industry requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-7 flex flex-col justify-between relative transition-all duration-300 hover:border-slate-700"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                  "{r.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="font-bold text-white text-base">{r.name}</h4>
                <p className="text-xs text-indigo-400 font-medium">{r.role}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{r.college} • {r.track}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
