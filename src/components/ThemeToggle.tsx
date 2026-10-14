import React from 'react';
import { useTheme } from '../lib/theme';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
        theme === 'dark'
          ? 'bg-slate-900 border border-slate-800 text-amber-400 hover:bg-slate-800'
          : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
      } ${className}`}
      aria-label="Toggle Dark and Light theme"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
