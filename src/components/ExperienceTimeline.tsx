import React from 'react';
import { Briefcase, Building, MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { ExperienceItem } from '../types/github';

interface ExperienceTimelineProps {
  history: ExperienceItem[];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ history }) => {
  return (
    <section id="experience" className="py-20 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase font-mono mb-2">
              04. Career Milestones
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Work Experience & System Leadership
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Over a decade of continuous engineering tenure delivering resilient enterprise software, high-throughput databases, and cloud services.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="space-y-8">
          {history.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0f1118] border border-white/[0.1] hover:border-white/[0.18] transition-all p-6 sm:p-8"
            >
              <div className="space-y-6">
                
                {/* Header Row: Clean unboxed metadata with separators (NO PILLS) */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                      {item.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mt-1 font-medium">
                      <span className="text-indigo-400 font-semibold flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {item.company}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col sm:items-end justify-between text-xs text-slate-400 font-mono">
                    <span className="text-indigo-300 font-semibold">{item.period}</span>
                    <span className="text-slate-500 mt-0.5">0{idx + 1} // Milestones</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {item.summary}
                </p>

                {/* Highlights List */}
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                    Key Technical Contributions & Accomplishments
                  </div>
                  <ul className="space-y-2">
                    {item.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className="text-indigo-400 mt-1 shrink-0">▸</span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies: Unboxed text with typographic separators (NO PILLS) */}
                <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="text-slate-500 font-mono">Core Toolchain:</span>
                  {item.technologies.map((tech, tIdx) => (
                    <React.Fragment key={tech}>
                      <span className="text-slate-300 font-medium">{tech}</span>
                      {tIdx < item.technologies.length - 1 && (
                        <span aria-hidden="true" className="text-slate-600">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
