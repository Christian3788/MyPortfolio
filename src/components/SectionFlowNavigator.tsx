import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ArrowUp } from 'lucide-react';
import { soundService } from '../services/sound';

interface SectionMarker {
  id: string;
  num: string;
  name: string;
}

const SECTIONS: SectionMarker[] = [
  { id: 'featured', num: '01', name: 'Flagship Systems' },
  { id: 'systems-lab', num: '02', name: 'Benchmark Lab' },
  { id: 'peer-defense', num: '03', name: 'Peer Defense' },
  { id: 'repositories', num: '04', name: 'Public Repos' },
  { id: 'telemetry', num: '05', name: 'Activity Heatmap' },
  { id: 'experience', num: '06', name: 'Career Milestones' },
  { id: 'skills', num: '07', name: 'Tech Matrix' },
  { id: 'research', num: '08', name: 'Scientific Roots' },
  { id: 'articles', num: '09', name: 'Publications' },
  { id: 'interactive-globe', num: '10', name: '3D Network Globe' },
  { id: 'engineering-stream', num: '11', name: 'Technical Stream' },
  { id: 'contact', num: '12', name: 'Contact & Sync' },
];

export const SectionFlowNavigator: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('featured');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Track active section via IntersectionObserver & scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, current)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    soundService.playClick(240, 0.02);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    soundService.playClick(180, 0.02);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Portfolio Section Navigator"
      className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-2"
    >
      {/* Expand / Collapse Toggle button */}
      <button
        onClick={() => {
          soundService.playClick(200, 0.015);
          setIsExpanded(!isExpanded);
        }}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 border border-slate-200/90 shadow-md text-[11px] font-mono font-medium text-slate-700 hover:text-[#0059e8] transition-all cursor-pointer backdrop-blur-xs"
        title={isExpanded ? 'Collapse section rail' : 'Expand section list'}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#0059e8] animate-pulse" />
        <span className="font-semibold">{Math.round(scrollProgress)}%</span>
        {isExpanded ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Navigator Container */}
      <div
        className={`p-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl transition-all duration-300 font-mono text-xs ${
          isExpanded ? 'w-52' : 'w-10'
        }`}
      >
        <div className="space-y-1">
          {SECTIONS.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full flex items-center gap-2 p-1.5 rounded-lg transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-blue-50 text-[#0059e8] font-bold border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
                title={`${sec.num}. ${sec.name}`}
              >
                {/* Dot / Indicator */}
                <span
                  className={`w-2 h-2 rounded-full shrink-0 transition-transform ${
                    isActive
                      ? 'bg-[#0059e8] scale-125'
                      : 'bg-slate-400 group-hover:bg-slate-600'
                  }`}
                />

                {/* Expanded text label */}
                {isExpanded && (
                  <div className="flex items-center justify-between flex-1 truncate text-[11px]">
                    <span className="truncate font-medium">{sec.name}</span>
                    <span className={`text-[10px] tabular-nums shrink-0 font-medium ${isActive ? 'text-[#0059e8] font-bold' : 'text-slate-600'}`}>
                      {sec.num}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick jump to top */}
        {isExpanded && (
          <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-700">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-[#0059e8] transition-colors cursor-pointer font-medium"
            >
              <ArrowUp className="w-3 h-3" />
              <span>Back to Top</span>
            </button>
            <span className="text-[#0059e8] font-semibold">12 Chapters</span>
          </div>
        )}
      </div>
    </aside>
  );
};
