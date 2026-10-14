import React from 'react';
import { Award, GraduationCap, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenApply: () => void;
  onOpenVerify: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApply, onOpenVerify }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Brand & Accreditation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                PPO<span className="text-indigo-400">Intern</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              India's premier certified industry internship and pre-placement offer acceleration platform. Connecting students with real production engineering, verifiable credentials, and high-growth recruiters.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ISO 9001:2015 Quality Certified
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                MSME Registered Enterprise
              </span>
            </div>
          </div>

          {/* Col 3: Tracks */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 font-heading">Top Internship Tracks</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#tracks" className="hover:text-white transition-colors">Full-Stack Web Engineering</a></li>
              <li><a href="#tracks" className="hover:text-white transition-colors">Generative AI & LLMs</a></li>
              <li><a href="#tracks" className="hover:text-white transition-colors">Cloud & DevOps Engineering</a></li>
              <li><a href="#tracks" className="hover:text-white transition-colors">Cyber Security & Ethical Hacking</a></li>
              <li><a href="#tracks" className="hover:text-white transition-colors">Data Science & Analytics</a></li>
              <li><a href="#tracks" className="hover:text-white transition-colors">Cross-Platform Mobile Dev</a></li>
            </ul>
          </div>

          {/* Col 4: Quick Portals */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 font-heading">Candidate Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenApply} className="hover:text-white transition-colors text-left">
                  Apply for Internship
                </button>
              </li>
              <li>
                <button onClick={onOpenVerify} className="hover:text-indigo-400 transition-colors text-left flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verify Certificate
                </button>
              </li>
              <li><a href="#why-us" className="hover:text-white transition-colors">Curriculum Standard</a></li>
              <li><a href="#partners" className="hover:text-white transition-colors">Campus MoU Inquiries</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Help & FAQ</a></li>
            </ul>
          </div>

          {/* Col 5: Contact & Support */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 font-heading">Candidate Support</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>support@ppointern.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>+91 98765 43210 (Mon-Sat, 10am-6pm)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Technology Hub, Phase II, New Delhi / Jaipur, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} PPO Intern Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Enrollment</a>
            <a href="#" className="hover:text-white transition-colors">Security & Verification</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
