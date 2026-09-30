import React from 'react';
import { ShieldCheck, Cpu, Database, Zap, GitPullRequest, Radio } from 'lucide-react';

interface Invariant {
  icon: React.ReactNode;
  label: string;
  metric: string;
}

const INVARIANTS: Invariant[] = [
  {
    icon: <Cpu className="w-3.5 h-3.5 text-[#0059e8]" />,
    label: 'Go HTTP 206 Streaming',
    metric: 'Zero-Copy 64KB TCP Window',
  },
  {
    icon: <Database className="w-3.5 h-3.5 text-emerald-600" />,
    label: 'PostGIS GiST R-Tree',
    metric: '3.12ms Query / 99.8% Cache Hits',
  },
  {
    icon: <ShieldCheck className="w-3.5 h-3.5 text-[#0059e8]" />,
    label: 'Zone01 Kisumu Peer-Defended',
    metric: 'Unanimous Merged Sign-offs',
  },
  {
    icon: <Zap className="w-3.5 h-3.5 text-amber-600" />,
    label: 'Vector-Vanguard SIMD Search',
    metric: '4-Way Loop Unrolled',
  },
  {
    icon: <GitPullRequest className="w-3.5 h-3.5 text-emerald-600" />,
    label: 'PostgreSQL Advisory Locks',
    metric: 'Deadlock-Free Concurrent Claims',
  },
  {
    icon: <Radio className="w-3.5 h-3.5 text-[#0059e8]" />,
    label: 'Aga Khan University B.Sc.',
    metric: 'Reaction-Diffusion & Complexity',
  },
];

export const ArchitectureInvariantRibbon: React.FC = () => {
  return (
    <div className="w-full bg-white border-y border-slate-200/90 py-3 overflow-hidden shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 overflow-x-auto py-1 scrollbar-none text-xs font-mono">
          
          <div className="flex items-center gap-2 text-slate-900 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider text-[#0059e8] font-bold">
              Verified Invariants
            </span>
            <span aria-hidden="true" className="text-slate-500 font-bold">·</span>
          </div>

          <div className="flex items-center gap-8 shrink-0">
            {INVARIANTS.map((inv, idx) => (
              <div key={idx} className="flex items-center gap-2 shrink-0 group">
                <span className="p-1 rounded bg-slate-50 border border-slate-200 group-hover:border-[#0059e8]/40 transition-colors">
                  {inv.icon}
                </span>
                <span className="text-slate-900 font-bold">{inv.label}</span>
                <span aria-hidden="true" className="text-slate-500 font-bold">/</span>
                <span className="text-slate-700 font-medium">{inv.metric}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
