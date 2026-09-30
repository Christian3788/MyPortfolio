import React from 'react';
import { RESEARCH_INTERESTS } from '../data/fallbackData';
import { Atom, Binary, Dna, BookOpen } from 'lucide-react';
import { GravitationalLensingSimulator } from './GravitationalLensingSimulator';

const ICONS: Record<string, React.ReactNode> = {
  'Physics Simulation': <Atom className="w-5 h-5 text-[#0059e8]" />,
  'Quantum CS': <Binary className="w-5 h-5 text-[#0059e8]" />,
  'Complex Systems': <Dna className="w-5 h-5 text-[#0059e8]" />,
  'Information Theory': <BookOpen className="w-5 h-5 text-[#0059e8]" />,
};

export const ResearchInterestsSection: React.FC = () => {
  return (
    <section id="research" className="py-20 border-t border-slate-200/90 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#0059e8] uppercase font-mono mb-2">
              08. Computational Inquiries &amp; Scientific Roots
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              Applied Mathematics &amp; Complex Systems
            </h2>
          </div>
          <p className="text-sm text-slate-700 font-medium max-w-md">
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
              className="rounded-xl bg-[#f8fafd] border border-slate-200/90 hover:border-[#0059e8]/50 transition-all p-6 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-blue-50 w-fit text-[#0059e8]">
                  {ICONS[item.badge] || <Atom className="w-5 h-5 text-[#0059e8]" />}
                </div>

                <div className="text-[11px] font-mono text-[#0059e8] font-bold">
                  {item.badge}
                </div>

                <h3 className="text-base font-bold text-slate-900 font-display leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-600 font-mono font-medium">
                First-principles formulation
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

