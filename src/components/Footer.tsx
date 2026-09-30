import React from 'react';
import { Github, Mail, Linkedin, ArrowUp } from 'lucide-react';
import { GithubUser } from '../types/github';

interface FooterProps {
  user: GithubUser;
}

export const Footer: React.FC<FooterProps> = ({ user }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/90 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left: Quiet Brand & Copyright */}
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-sm font-semibold text-slate-900 font-display">
            {user.name || 'Christian Amos'}
          </div>
          <div className="text-xs text-slate-700 font-mono font-medium">
            Senior Systems &amp; Software Engineer · Built with GitHub API · © {currentYear}
          </div>
        </div>

        {/* Center: Clean links */}
        <div className="flex items-center gap-6 text-xs text-slate-700 font-mono font-medium">
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#0059e8] transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/christian-otieno-9a9806229/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#0059e8] transition-colors flex items-center gap-1.5"
          >
            <Linkedin className="w-3.5 h-3.5 text-[#0059e8]" />
            <span>LinkedIn</span>
          </a>
          <a
            href={`mailto:${user.email || 'christianamos67@gmail.com'}`}
            className="hover:text-[#0059e8] transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </a>
          <button
            onClick={scrollToTop}
            className="hover:text-[#0059e8] transition-colors flex items-center gap-1.5 text-slate-700 font-medium cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
