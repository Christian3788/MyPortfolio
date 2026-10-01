import React, { useState, useEffect } from 'react';
import { Search, X, Code2, Zap, Terminal, FileText, ArrowRight, Github, Linkedin, Mail, Volume2, VolumeX, Briefcase, Eye, Sparkles, Globe as GlobeIcon, Trophy, Flame } from 'lucide-react';
import { soundService } from '../services/sound';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (id: string) => void;
  onOpenResume: () => void;
  onOpenSync: () => void;
  onSwitchPersona: (persona: 'tech-lead' | 'recruiter') => void;
  onOpenChallenge?: () => void;
  onOpenTopology?: () => void;
}

interface ActionItem {
  id: string;
  category: 'Navigation' | 'Systems Lab' | 'Persona' | 'Actions' | 'Zone01 Mastery' | 'Astrophysics Research';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  handler: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onOpenResume,
  onOpenSync,
  onSwitchPersona,
  onOpenChallenge,
  onOpenTopology,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [soundState, setSoundState] = useState(soundService.isEnabled());

  const actions: ActionItem[] = [
    {
      id: 'proj-lyric',
      category: 'Navigation',
      title: 'LYRIC – Audio Streaming Platform',
      subtitle: 'Go HTTP 206 Byte-Range & WebSocket Sync',
      icon: <Code2 className="w-4 h-4 text-indigo-400" />,
      handler: () => {
        onClose();
        const el = document.getElementById('featured');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'proj-spatial',
      category: 'Navigation',
      title: 'Spatial Risk Analytics Engine',
      subtitle: 'PostGIS GiST Spatial Indexing Simulator',
      icon: <Code2 className="w-4 h-4 text-indigo-400" />,
      handler: () => {
        onClose();
        const el = document.getElementById('featured');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'proj-vector',
      category: 'Navigation',
      title: 'Vector-Vanguard Engine',
      subtitle: 'SIMD 4-Way Loop Unrolled Nearest Neighbor Search',
      icon: <Zap className="w-4 h-4 text-indigo-400" />,
      handler: () => {
        onClose();
        const el = document.getElementById('featured');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'proj-kijiji',
      category: 'Navigation',
      title: 'kijijiShare Platform',
      subtitle: 'Hyperlocal gift economy & atomic reservations',
      icon: <Code2 className="w-4 h-4 text-indigo-400" />,
      handler: () => {
        onClose();
        const el = document.getElementById('featured');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'lab-stress',
      category: 'Systems Lab',
      title: 'Run Concurrency Stress Benchmark',
      subtitle: 'Simulate 1,000 goroutines on Go HTTP 206 vs Naive Buffering',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      handler: () => {
        onClose();
        const el = document.getElementById('systems-lab');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-peer-defense',
      category: 'Zone01 Mastery',
      title: 'Peer Code Defense Replay',
      subtitle: 'Inspect PR review critiques, defense rationale, and benchmark proof',
      icon: <Code2 className="w-4 h-4 text-emerald-400" />,
      handler: () => {
        onClose();
        const el = document.getElementById('peer-defense');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-lensing',
      category: 'Astrophysics Research',
      title: 'Gravitational Lensing Canvas',
      subtitle: 'Interactive Schwarzschild null geodesic ray-tracing',
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      handler: () => {
        onClose();
        const el = document.getElementById('research');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'lab-simd',
      category: 'Systems Lab',
      title: 'Run Vector SIMD Benchmark',
      subtitle: 'Live in-browser float32 distance performance delta',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      handler: () => {
        onClose();
        const el = document.getElementById('systems-lab');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'lab-bloom',
      category: 'Systems Lab',
      title: 'Bloom Filter Playground',
      subtitle: 'Interactive 32-bit array with 3 hash functions',
      icon: <Terminal className="w-4 h-4 text-indigo-400" />,
      handler: () => {
        onClose();
        const el = document.getElementById('systems-lab');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'lab-heap',
      category: 'Systems Lab',
      title: '64-Byte Cache-Line Memory Allocator',
      subtitle: 'Simulate malloc, free, and GC memory compaction',
      icon: <Terminal className="w-4 h-4 text-indigo-400" />,
      handler: () => {
        onClose();
        const el = document.getElementById('systems-lab');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-stream',
      category: 'Navigation',
      title: 'Systems Dispatches Stream (Infinite Scroll)',
      subtitle: 'Dynamic stream of Go runtime, PostGIS, and systems engineering logs',
      icon: <FileText className="w-4 h-4 text-indigo-400" />,
      handler: () => {
        onClose();
        const el = document.getElementById('engineering-stream');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-globe',
      category: 'Navigation',
      title: 'Real-World 3D Geolocation Globe',
      subtitle: 'HTML5 GPS location detection, OpenStreetMap reverse geocoding & Kisumu link',
      icon: <GlobeIcon className="w-4 h-4 text-emerald-400" />,
      handler: () => {
        onClose();
        const el = document.getElementById('interactive-globe');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'persona-tech',
      category: 'Persona',
      title: 'Switch to Tech Lead View',
      subtitle: 'Focus on low-overhead network I/O, Go, and PostGIS',
      icon: <Eye className="w-4 h-4 text-cyan-400" />,
      handler: () => {
        onSwitchPersona('tech-lead');
        onClose();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'persona-recruiter',
      category: 'Persona',
      title: 'Switch to Recruiter View',
      subtitle: 'Focus on full-stack web platforms and Zone01 mastery',
      icon: <Briefcase className="w-4 h-4 text-indigo-400" />,
      handler: () => {
        onSwitchPersona('recruiter');
        onClose();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'action-peer-quiz',
      category: 'Zone01 Mastery',
      title: 'Take Peer Review Quiz (Spot Invariant Violations)',
      subtitle: 'Interactive test on Go concurrency leaks, PostGIS GiST, and sync.Pool',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      handler: () => {
        onClose();
        onOpenChallenge?.();
      },
    },
    {
      id: 'action-chaos-lab',
      category: 'Systems Lab',
      title: 'Inspect System Topology & Chaos Fault Lab',
      subtitle: 'Live packet tracer and simulated Redis/S3 circuit breaker recovery',
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      handler: () => {
        onClose();
        onOpenTopology?.();
      },
    },
    {
      id: 'action-resume',
      category: 'Actions',
      title: 'View & Download CV (PDF / JSON / Markdown)',
      subtitle: 'Detailed experience, education, and skills',
      icon: <FileText className="w-4 h-4 text-indigo-400" />,
      handler: () => {
        onClose();
        onOpenResume();
      },
    },
    {
      id: 'action-sound',
      category: 'Actions',
      title: soundState ? 'Disable Audio Click Haptics' : 'Enable Audio Click Haptics',
      subtitle: 'Subtle Web Audio API synthesizer feedback',
      icon: soundState ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />,
      handler: () => {
        const next = !soundState;
        soundService.setEnabled(next);
        setSoundState(next);
        if (next) soundService.playSuccess();
      },
    },
    {
      id: 'action-sync',
      category: 'Actions',
      title: 'GitHub Switcher & Token Settings',
      subtitle: 'Sync any GitHub user or enter access token',
      icon: <Github className="w-4 h-4 text-indigo-400" />,
      handler: () => {
        onClose();
        onOpenSync();
      },
    },
    {
      id: 'action-linkedin',
      category: 'Actions',
      title: 'Connect on LinkedIn',
      subtitle: 'Open Christian Otieno (@christian-otieno-9a9806229) on LinkedIn',
      icon: <Linkedin className="w-4 h-4 text-[#0a66c2]" />,
      handler: () => {
        onClose();
        const a = document.createElement('a');
        a.href = 'https://www.linkedin.com/in/christian-otieno-9a9806229/';
        a.target = '_blank';
        a.rel = 'noreferrer';
        a.click();
      },
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].handler();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/80">
          <Search className="w-4 h-4 text-[#0059e8] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search systems, benchmarks, repos..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-500 focus:outline-none font-mono"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] text-slate-700 font-semibold bg-white border border-slate-300 rounded font-mono shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Action Items List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-700 font-mono font-medium">
              No matching commands found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => item.handler()}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  idx === selectedIndex
                    ? 'bg-blue-50 text-slate-900 border border-blue-200'
                    : 'text-slate-800 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-[#0059e8] shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-700 font-semibold">
                  <span>{item.category}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-700 font-medium">
          <span>Navigate: ↑ ↓ · Select: ↵</span>
          <span className="text-[#0059e8] font-bold">Christian Amos Otieno · Systems Portfolio</span>
        </div>
      </div>
    </div>
  );
};
