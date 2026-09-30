import React from 'react';
import { RESEARCH_INTERESTS } from '../data/fallbackData';
import { Atom, Binary, Dna, BookOpen } from 'lucide-react';
import { GravitationalLensingSimulator } from './GravitationalLensingSimulator';

const ICONS: Record<string, React.ReactNode> = {
  'Physics Simulation': <Atom className="w-5 h-5 text-indigo-400" />,
  'Quantum CS': <Binary className="w-5 h-5 text-indigo-400" />,
  'Complex Systems': <Dna className="w-5 h-5 text-indigo-400" />,
  'Information Theory': <BookOpen className="w-5 h-5 text-indigo-400" />,
};

export const ResearchInterestsSection: React.FC = () => {
  return (
    <section id="research" className="py-20 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase font-mono mb-2">
              09. Computational Inquiries & Scientific Roots
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Applied Mathematics & Complex Systems
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Grounding software architecture in formal physics simulations, computational biology, and information theory.
          </p>
        </div>

        {/* Live Relativistic Lensing Simulator */}
        <GravitationalLensingSimulator />

        {/* Interests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RESEARCH_INTERESTS.map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-[#0f1118] border border-white/[0.08] hover:border-white/[0.18] transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-indigo-600/10 w-fit">
                  {ICONS[item.badge] || <Atom className="w-5 h-5 text-indigo-400" />}
                </div>

                <div className="text-[11px] font-mono text-indigo-400 font-semibold">
                  {item.badge}
                </div>

                <h3 className="text-base font-bold text-white font-display leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.04] text-[11px] text-slate-500 font-mono">
                First-principles formulation
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

