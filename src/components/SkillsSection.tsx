import React from 'react';
import { SKILLS_DATA } from '../data/fallbackData';
import { CheckCircle2, Terminal, Cpu, Database, Server, Layers } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Backend & Systems': <Server className="w-4 h-4 text-indigo-400" />,
  'Database & Data Architecture': <Database className="w-4 h-4 text-indigo-400" />,
  'Frontend & UI Engineering': <Layers className="w-4 h-4 text-indigo-400" />,
  'Infrastructure & Tooling': <Terminal className="w-4 h-4 text-indigo-400" />,
  'Algorithms & Computing': <Cpu className="w-4 h-4 text-indigo-400" />,
};

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-20 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase font-mono mb-2">
              07. Technical Competencies
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Architecture & Technology Matrix
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Practiced across decades of production deployments, algorithmic problem-solving, and mission-critical SaaS operations.
          </p>
        </div>

        {/* Competency Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS_DATA.map((cat) => (
            <div
              key={cat.category}
              className="rounded-xl bg-[#0f1118] border border-white/[0.08] hover:border-white/[0.18] transition-all p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Category Header */}
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
                  <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
                    {CATEGORY_ICONS[cat.category] || <Cpu className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      {cat.category}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {cat.description}
                </p>

                {/* Skills as Clean Unboxed Text with Separators (NO PILLS) */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                  {cat.skills.map((skill, sIdx) => (
                    <React.Fragment key={skill}>
                      <span className="font-medium hover:text-indigo-300 transition-colors">
                        {skill}
                      </span>
                      {sIdx < cat.skills.length - 1 && (
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
