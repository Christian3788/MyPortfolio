import React, { useState } from 'react';
import { Github, RefreshCw, FileText, Menu, X, ArrowUpRight, Search, Terminal, Volume2, VolumeX } from 'lucide-react';
import { GithubUser } from '../types/github';
import { soundService } from '../services/sound';

interface NavbarProps {
  user: GithubUser;
  onOpenSyncModal: () => void;
  onOpenResumeModal: () => void;
  onOpenCommandPalette: () => void;
  onOpenTerminal: () => void;
  isSyncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenSyncModal,
  onOpenResumeModal,
  onOpenCommandPalette,
  onOpenTerminal,
  isSyncing,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundService.isEnabled());

  const toggleSound = () => {
    const next = !soundEnabled;
    soundService.setEnabled(next);
    setSoundEnabled(next);
    if (next) soundService.playSuccess();
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#090a0f]/85 border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark in display face */}
        <a
          href="#top"
          className="text-lg font-semibold tracking-tight text-white hover:text-indigo-300 transition-colors font-display"
        >
          {user.name || user.login}
        </a>

        {/* Zone 2: 4–6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#featured" className="hover:text-white transition-colors">
            Featured
          </a>
          <a href="#systems-lab" className="hover:text-white transition-colors text-indigo-300">
            Systems Lab
          </a>
          <a href="#repositories" className="hover:text-white transition-colors">
            Repositories
          </a>
          <a href="#experience" className="hover:text-white transition-colors">
            Experience
          </a>
          <a href="#articles" className="hover:text-white transition-colors">
            Articles
          </a>
          <a href="#research" className="hover:text-white transition-colors">
            Research
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </nav>

        {/* Zone 3: 1–2 primary actions + quick controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md transition-colors"
            title="Search or Run Commands (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xl:inline text-[11px]">Command Menu</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white/[0.06] border border-white/[0.1] rounded text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Terminal Shell Button */}
          <button
            onClick={onOpenTerminal}
            className="p-1.5 text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md transition-colors"
            title="Interactive CLI Terminal"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Sound Haptics Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md transition-colors"
            title={soundEnabled ? 'Mute Mechanical Click Sound' : 'Enable Mechanical Click Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* GitHub Sync Button */}
          <button
            onClick={onOpenSyncModal}
            title="Switch GitHub Profile or enter token"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] rounded-md transition-colors whitespace-nowrap"
          >
            <Github className="w-3.5 h-3.5 text-indigo-400" />
            <span>@{user.login}</span>
            <RefreshCw className={`w-3 h-3 text-slate-400 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>

          {/* View CV Button */}
          <button
            onClick={onOpenResumeModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-sm whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View CV</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenCommandPalette}
            className="p-2 text-slate-300 rounded-md bg-white/[0.04] border border-white/[0.08]"
            title="Search"
          >
            <Search className="w-4 h-4 text-indigo-400" />
          </button>
          <button
            onClick={onOpenTerminal}
            className="p-2 text-slate-300 rounded-md bg-white/[0.04] border border-white/[0.08]"
            title="Terminal CLI"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-white/[0.08] bg-[#0c0e14] px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            <a
              href="#featured"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              Featured Architecture
            </a>
            <a
              href="#systems-lab"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-indigo-300 font-semibold"
            >
              Systems Lab (Interactive)
            </a>
            <a
              href="#repositories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              GitHub Repositories (44)
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              Experience
            </a>
            <a
              href="#articles"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              Articles
            </a>
            <a
              href="#research"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              Scientific Roots
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              Contact
            </a>
          </div>
          <div className="pt-3 border-t border-white/[0.08] flex items-center gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResumeModal();
              }}
              className="flex-1 py-2 text-xs font-semibold text-center text-white bg-indigo-600 rounded-md"
            >
              View Full CV
            </button>
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-xs text-slate-300 bg-white/[0.04] border border-white/[0.08] rounded-md flex items-center gap-1"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

