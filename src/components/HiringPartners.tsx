import React from 'react';
import { Building2, CheckCircle, GraduationCap, Handshake, Sparkles } from 'lucide-react';

export const HiringPartners: React.FC = () => {
  const partners = [
    { name: 'TechCorp Cloud', tag: 'Cloud & Infrastructure' },
    { name: 'Nexus AI Labs', tag: 'Artificial Intelligence' },
    { name: 'FinEdge Solutions', tag: 'FinTech Products' },
    { name: 'CyberShield Systems', tag: 'Security & InfoSec' },
    { name: 'OmniData Platforms', tag: 'Big Data & Analytics' },
    { name: 'ScaleLogic Networks', tag: 'Full-Stack SaaS' },
  ];

  return (
    <section id="partners" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Handshake className="w-3.5 h-3.5" />
            Industry Network
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Where Our <span className="gradient-text">Interns Get Placed</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Our alumni work at forward-thinking technology companies, high-growth unicorn startups, and global enterprises.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {partners.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center justify-center text-center hover:border-slate-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3 text-indigo-400">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-sm mb-1">{p.name}</span>
              <span className="text-[10px] text-slate-400">{p.tag}</span>
            </div>
          ))}
        </div>

        {/* University & Institutional MoU Banner */}
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Partner With Us For Campus Internship MoUs</h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Are you a Training & Placement Officer (TPO) or college Dean? Partner with us for accredited bulk internship tracks, AICTE-aligned curriculum, and student performance dashboards.
              </p>
            </div>
          </div>
          <a
            href="mailto:partnerships@internshipportal.com?subject=College%20MoU%20Partnership%20Inquiry"
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 shrink-0 transition-all whitespace-nowrap"
          >
            Initiate Campus MoU
          </a>
        </div>
      </div>
    </section>
  );
};
