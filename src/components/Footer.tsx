import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200/90 pt-16 pb-12 font-sans text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 font-heading">
                  PPU<span className="text-indigo-600">Intern</span>
                </span>
                <span className="ml-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  PPU • NEP 2020
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm font-medium">
              Empowering Patliputra University (PPU) students with accredited 120-hour internships, industry-aligned capstone modules, and verifiable credentials compliant with NEP-2020 & UGC guidelines.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-500 font-semibold">
                Admissions Open for 2026 Academic Cohorts
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4 font-heading">
              Portal Pages
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold">
              <li>
                <Link to="/" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Internship Programs
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Program Domains */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4 font-heading">
              Key Domains
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600">
              <li>
                <Link to="/programs" className="hover:text-indigo-600 transition-colors">
                  Web & Full Stack Development
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-indigo-600 transition-colors">
                  Artificial Intelligence & ML
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-indigo-600 transition-colors">
                  Cyber Security & Defense
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-indigo-600 transition-colors">
                  Data Science & Analytics
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-indigo-600 transition-colors">
                  Cloud Computing & DevOps
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact Details */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4 font-heading">
              Support Desk
            </h3>
            <ul className="space-y-3 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span className="font-bold text-slate-900">+91 96939 21517</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>support@ppuintern.in</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Mon – Sat: 10:00 AM – 7:00 PM IST</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Patliputra University Campus, Kankarbagh Road, Patna, Bihar</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal and Disclaimer Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Patliputra University (PPU) Internship Portal. All rights reserved. NEP-2020 Aligned.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-indigo-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-indigo-600 transition-colors">
              Help Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
