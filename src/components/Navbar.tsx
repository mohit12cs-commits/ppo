import React, { useState, useEffect } from 'react';
import { Award, Briefcase, CheckCircle, Menu, ShieldCheck, X, Sparkles, GraduationCap } from 'lucide-react';

interface NavbarProps {
  onOpenApply: () => void;
  onOpenVerify: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenApply, onOpenVerify }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-heading">
                PPO<span className="text-indigo-400">Intern</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Certified
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">Pre-Placement Internships & Career Hub</p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#tracks" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Internship Tracks
            </a>
            <button 
              onClick={onOpenVerify}
              className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verify Certificate
            </button>
            <a href="#why-us" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Why PPO Intern
            </a>
            <a href="#partners" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Hiring Partners
            </a>
            <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenVerify}
              className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700/80 rounded-lg hover:border-slate-500 transition-all bg-slate-900/50"
            >
              Verify Credential
            </button>
            <button
              onClick={onOpenApply}
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Apply for Internship
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 space-y-3 border-t border-slate-800/80 mt-3 animate-in fade-in slide-in-from-top-2">
            <a 
              href="#tracks" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800/60 rounded-lg"
            >
              Internship Tracks
            </a>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenVerify(); }}
              className="w-full text-left px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800/60 rounded-lg flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verify Certificate
            </button>
            <a 
              href="#why-us" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800/60 rounded-lg"
            >
              Why PPO Intern
            </a>
            <a 
              href="#partners" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800/60 rounded-lg"
            >
              Hiring Partners
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenApply(); }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
              >
                Apply for Internship
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
