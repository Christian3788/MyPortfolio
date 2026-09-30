import React from 'react';
import { Briefcase, Building, MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { ExperienceItem } from '../types/github';

interface ExperienceTimelineProps {
  history: ExperienceItem[];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ history }) => {
  return (
    <section id="experience" className="py-20 border-t border-slate-200/90 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#0059e8] uppercase font-mono mb-2">
              06. Career Milestones &amp; Leadership
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              Work Experience &amp; System Leadership
            </h2>
          </div>
          <p className="text-sm text-slate-700 font-medium max-w-md">
            Over a decade of continuous engineering tenure delivering resilient enterprise software, high-throughput databases, and cloud services.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="space-y-8">
          {history.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-slate-200/90 hover:border-[#0059e8]/50 shadow-xs hover:shadow-md transition-all p-6 sm:p-8"
            >
              <div className="space-y-6">
                
                {/* Header Row: Clean unboxed metadata with separators (NO PILLS) */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                      {item.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-800 mt-1 font-medium">
                      <span className="text-[#0059e8] font-bold flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {item.company}
                      </span>
                      <span aria-hidden="true" className="text-slate-500 font-bold">·</span>
                      <span className="flex items-center gap-1 text-slate-800 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-700" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col sm:items-end justify-between text-xs text-slate-700 font-mono">
                    <span className="text-[#0059e8] font-bold">{item.period}</span>
                    <span className="text-slate-600 font-medium mt-0.5">0{idx + 1} // Milestones</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {item.summary}
                </p>

                {/* Highlights List */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    Key Technical Contributions &amp; Accomplishments
                  </div>
                  <ul className="space-y-2">
                    {item.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2.5 text-sm text-slate-800">
                        <span className="text-[#0059e8] mt-1 shrink-0 font-bold">▸</span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies: Unboxed text with typographic separators (NO PILLS) */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-700">
                  <span className="text-slate-800 font-mono font-bold">Core Toolchain:</span>
                  {item.technologies.map((tech, tIdx) => (
                    <React.Fragment key={tech}>
                      <span className="text-slate-900 font-semibold">{tech}</span>
                      {tIdx < item.technologies.length - 1 && (
                        <span aria-hidden="true" className="text-slate-400 font-bold">·</span>
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
