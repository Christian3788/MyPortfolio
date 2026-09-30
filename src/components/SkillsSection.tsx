import React from 'react';
import { SKILLS_DATA } from '../data/fallbackData';
import { CheckCircle2, Terminal, Cpu, Database, Server, Layers } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Backend & Systems': <Server className="w-4 h-4 text-[#0059e8]" />,
  'Database & Data Architecture': <Database className="w-4 h-4 text-[#0059e8]" />,
  'Frontend & UI Engineering': <Layers className="w-4 h-4 text-[#0059e8]" />,
  'Infrastructure & Tooling': <Terminal className="w-4 h-4 text-[#0059e8]" />,
  'Algorithms & Computing': <Cpu className="w-4 h-4 text-[#0059e8]" />,
};

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-20 border-t border-slate-200/90 bg-[#f8fafd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#0059e8] uppercase font-mono mb-2">
              07. Technical Competencies
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              Architecture &amp; Technology Matrix
            </h2>
          </div>
          <p className="text-sm text-slate-700 font-medium max-w-md">
            Practiced across decades of production deployments, algorithmic problem-solving, and mission-critical SaaS operations.
          </p>
        </div>

        {/* Competency Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS_DATA.map((cat) => (
            <div
              key={cat.category}
              className="rounded-xl bg-white border border-slate-200/90 hover:border-[#0059e8]/50 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Category Header */}
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="p-2 rounded-lg bg-blue-50 text-[#0059e8]">
                    {CATEGORY_ICONS[cat.category] || <Cpu className="w-4 h-4 text-[#0059e8]" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      {cat.category}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {cat.description}
                </p>

                {/* Skills as Clean Unboxed Text with Separators (NO PILLS) */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-800">
                  {cat.skills.map((skill, sIdx) => (
                    <React.Fragment key={skill}>
                      <span className="font-semibold text-slate-900 hover:text-[#0059e8] transition-colors">
                        {skill}
                      </span>
                      {sIdx < cat.skills.length - 1 && (
                        <span aria-hidden="true" className="text-slate-500 font-bold">·</span>
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
