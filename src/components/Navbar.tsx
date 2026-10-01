import React, { useState, useRef, useEffect } from 'react';
import { Github, Linkedin, RefreshCw, FileText, Menu, X, ArrowUpRight, Search, Terminal, Volume2, VolumeX, ChevronDown, Trophy, Sparkles } from 'lucide-react';
import { GithubUser } from '../types/github';
import { soundService, SoundProfile } from '../services/sound';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  user: GithubUser;
  onOpenSyncModal: () => void;
  onOpenResumeModal: () => void;
  onOpenCommandPalette: () => void;
  onOpenTerminal: () => void;
  onOpenChallenge?: () => void;
  isSyncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenSyncModal,
  onOpenResumeModal,
  onOpenCommandPalette,
  onOpenTerminal,
  onOpenChallenge,
  isSyncing,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundService.isEnabled());
  const [soundProfile, setSoundProfile] = useState<SoundProfile>(soundService.getProfile());
  const moreRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  // Track window scroll progress for top indicator bar
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close 'More' dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cycleSoundProfile = () => {
    if (!soundEnabled) {
      soundService.setEnabled(true);
      setSoundEnabled(true);
      soundService.setProfile('cherry');
      setSoundProfile('cherry');
      soundService.playSuccess();
      return;
    }

    if (soundProfile === 'cherry') {
      soundService.setProfile('sonar');
      setSoundProfile('sonar');
      soundService.playClick(280, 0.04);
    } else if (soundProfile === 'sonar') {
      soundService.setProfile('topre');
      setSoundProfile('topre');
      soundService.playClick(200, 0.04);
    } else {
      soundService.setEnabled(false);
      setSoundEnabled(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-slate-200/90 transition-colors shadow-xs">
      {/* Real-time reading scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-[#0059e8] z-50 transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark in display face */}
        <a
          href="#top"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 hover:text-[#0059e8] transition-colors font-display group"
        >
          <span>{user.name || user.login}</span>
          <span className="hidden md:inline text-xs font-mono font-medium text-slate-500 group-hover:text-[#0059e8] transition-colors">
            / Systems Engineer
          </span>
        </a>

        {/* Zone 2: Clean core links + quiet More dropdown */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700 font-sans">
          <a href="#featured" className="hover:text-[#0059e8] transition-colors">
            Projects
          </a>
          <a href="#systems-lab" className="hover:text-[#0059e8] transition-colors">
            Benchmarks
          </a>
          <a href="#peer-defense" className="hover:text-emerald-700 transition-colors text-emerald-700 font-semibold">
            Peer Defense
          </a>
          <a href="#experience" className="hover:text-[#0059e8] transition-colors">
            Experience
          </a>
          <a href="#interactive-globe" className="hover:text-sky-700 transition-colors text-sky-700 font-semibold">
            3D Globe
          </a>
          <a href="#contact" className="hover:text-[#0059e8] transition-colors">
            Contact
          </a>

          {/* More Sections Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => {
                soundService.playClick(200, 0.015);
                setMoreMenuOpen((prev) => !prev);
              }}
              className="flex items-center gap-1 hover:text-[#0059e8] transition-colors text-slate-700 font-medium cursor-pointer"
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreMenuOpen ? 'rotate-180 text-[#0059e8]' : ''}`} />
            </button>

            {moreMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 py-2 rounded-xl bg-white border border-slate-200 shadow-xl z-50 text-xs font-mono space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <a
                  href="#repositories"
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-3.5 py-2 text-slate-700 hover:text-[#0059e8] hover:bg-slate-50 transition-colors"
                >
                  04. Repositories (44)
                </a>
                <a
                  href="#telemetry"
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-3.5 py-2 text-slate-700 hover:text-[#0059e8] hover:bg-slate-50 transition-colors"
                >
                  05. Activity Heatmap
                </a>
                <a
                  href="#skills"
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-3.5 py-2 text-slate-700 hover:text-[#0059e8] hover:bg-slate-50 transition-colors"
                >
                  07. Tech Competencies
                </a>
                <a
                  href="#research"
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-3.5 py-2 text-slate-700 hover:text-[#0059e8] hover:bg-slate-50 transition-colors"
                >
                  08. Scientific Roots &amp; Lensing
                </a>
                <a
                  href="#articles"
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-3.5 py-2 text-slate-700 hover:text-[#0059e8] hover:bg-slate-50 transition-colors"
                >
                  09. Technical Publications
                </a>
                <a
                  href="#engineering-stream"
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-3.5 py-2 text-[#0059e8] hover:text-[#0048c4] hover:bg-blue-50/60 transition-colors font-semibold"
                >
                  11. Continuous Dispatches Stream
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: 1–2 primary actions + quick controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Peer Review Challenge Trigger */}
          {onOpenChallenge && (
            <button
              onClick={() => {
                soundService.playClick(260, 0.02);
                onOpenChallenge();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors cursor-pointer font-mono font-bold shadow-2xs"
              title="Test systems engineering invariants in peer defense challenge"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden xl:inline text-[11px]">Peer Quiz</span>
            </button>
          )}

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:text-[#0059e8] bg-slate-100/90 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer font-medium"
            title="Search or Run Commands (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#0059e8]" />
            <span className="hidden xl:inline text-[11px]">Command Menu</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-700 font-mono font-medium shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Terminal Shell Button */}
          <button
            onClick={onOpenTerminal}
            className="p-1.5 text-slate-700 hover:text-emerald-700 bg-slate-100/90 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-md transition-colors cursor-pointer"
            title="Interactive CLI Terminal"
          >
            <Terminal className="w-4 h-4 text-emerald-600" />
          </button>

          {/* Sound Profile Switcher Toggle */}
          <button
            onClick={cycleSoundProfile}
            className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-mono rounded-md border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-blue-50 border-blue-200 text-[#0059e8] font-bold shadow-2xs'
                : 'bg-slate-100/90 hover:bg-slate-200 border-slate-200 text-slate-600'
            }`}
            title={`Audio FX: ${soundEnabled ? soundProfile.toUpperCase() : 'MUTED'} (Click to cycle Cherry MX -> Subsea Sonar -> Topre -> Mute)`}
          >
            {soundEnabled ? (
              <div className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#0059e8]" />
                <span className="flex items-end gap-0.5 h-2.5" aria-hidden="true">
                  <span className="w-0.5 h-2 bg-[#0059e8] rounded-full animate-pulse" />
                  <span className="w-0.5 h-3 bg-[#0059e8] rounded-full animate-pulse delay-75" />
                  <span className="w-0.5 h-1.5 bg-[#0059e8] rounded-full animate-pulse delay-150" />
                </span>
              </div>
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="text-[10px] hidden md:inline uppercase">
              {soundEnabled ? soundProfile : 'Mute'}
            </span>
          </button>

          {/* Standalone PWA Install Trigger */}
          <PWAInstallButton variant="navbar" />

          {/* LinkedIn Profile */}
          <a
            href="https://www.linkedin.com/in/christian-otieno-9a9806229/"
            target="_blank"
            rel="noreferrer"
            title="LinkedIn Profile: Christian Otieno"
            className="p-1.5 text-slate-700 hover:text-[#0a66c2] bg-slate-100/90 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-md transition-colors"
          >
            <Linkedin className="w-4 h-4 text-[#0a66c2]" />
          </a>

          {/* GitHub Sync Button */}
          <button
            onClick={onOpenSyncModal}
            title="Switch GitHub Profile or enter token"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100/90 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Github className="w-3.5 h-3.5 text-[#0059e8]" />
            <span>@{user.login}</span>
            <RefreshCw className={`w-3 h-3 text-slate-600 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>

          {/* View CV Button (WPS Royal Blue Button) */}
          <button
            onClick={onOpenResumeModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-md transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View CV</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenCommandPalette}
            className="p-2 text-slate-700 rounded-md bg-slate-100 border border-slate-200"
            title="Search"
          >
            <Search className="w-4 h-4 text-[#0059e8]" />
          </button>
          <button
            onClick={onOpenTerminal}
            className="p-2 text-slate-700 rounded-md bg-slate-100 border border-slate-200"
            title="Terminal CLI"
          >
            <Terminal className="w-4 h-4 text-emerald-600" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <a
              href="#featured"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0059e8]"
            >
              Featured Architecture
            </a>
            <a
              href="#systems-lab"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-[#0059e8] font-semibold"
            >
              Systems Lab (Interactive)
            </a>
            <a
              href="#peer-defense"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-emerald-700 font-semibold"
            >
              Peer Code Defense
            </a>
            {onOpenChallenge && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChallenge();
                }}
                className="py-1.5 text-left text-amber-800 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>Take Peer Review Quiz</span>
              </button>
            )}
            <a
              href="#repositories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0059e8]"
            >
              GitHub Repositories (44)
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0059e8]"
            >
              Experience &amp; Leadership
            </a>
            <a
              href="#interactive-globe"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sky-700 font-semibold"
            >
              3D Network Globe
            </a>
            <a
              href="#articles"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0059e8]"
            >
              Articles
            </a>
            <a
              href="#research"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0059e8]"
            >
              Scientific Roots
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0059e8]"
            >
              Contact
            </a>
          </div>
          <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResumeModal();
              }}
              className="flex-1 py-2 text-xs font-semibold text-center text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-md shadow-xs"
            >
              View Full CV
            </button>
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-xs text-slate-700 bg-slate-100 border border-slate-200 rounded-md flex items-center gap-1"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/christian-otieno-9a9806229/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-xs text-[#0a66c2] bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

