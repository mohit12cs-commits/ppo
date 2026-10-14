import React from 'react';
import { Award, CheckCircle2, Code2, FileCheck, GitBranch, Laptop, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const perks = [
    {
      icon: GitBranch,
      title: 'Production-Grade GitHub Portfolios',
      desc: 'Build real-world full-stack architectures and open-source style workflows. Graduate with high-impact repos to showcase on your resume.'
    },
    {
      icon: Users,
      title: '1-on-1 Senior Tech Mentorship',
      desc: 'Weekly code review sessions and architectural office hours led by seasoned engineers from product companies.'
    },
    {
      icon: ShieldCheck,
      title: 'Verifiable Credentials & LOR',
      desc: 'Tamper-proof verifiable completion certificates with unique QR codes and Letters of Recommendation for top performing interns.'
    },
    {
      icon: Award,
      title: 'College & University Credit Aligned',
      desc: 'Formal acceptance letters, mid-term logbooks, and final project evaluation dossiers recognized for semester academic credits.'
    },
    {
      icon: Laptop,
      title: 'Flexible Hybrid & Remote Schedule',
      desc: 'Self-paced project tracks with milestone deadlines designed to balance university lectures and exams seamlessly.'
    },
    {
      icon: Trophy,
      title: 'Interview Preparation & Hiring Referrals',
      desc: 'Direct resume referrals to 250+ vetted corporate tech partners, mock technical interviews, and portfolio workshops.'
    }
  ];

  return (
    <section id="why-us" className="py-20 relative bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Why We Are Different
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Engineered For <span className="gradient-text">Real Career Outcomes</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Forget passive video tutorials. Our experiential internship programs push you to write real code, debug edge cases, and deploy live production systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {perks.map((perk, index) => {
            const Icon = perk.icon;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl p-7 relative transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 font-heading">
                  {perk.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
