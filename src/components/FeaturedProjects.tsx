import React from 'react';
import { ArrowUpRight, Code2, Database, Activity, Sparkles, Terminal } from 'lucide-react';
import { FeaturedProject } from '../types/github';
import { AudioVisualizerWidget } from './AudioVisualizerWidget';
import { GisSimulatorWidget } from './GisSimulatorWidget';

interface FeaturedProjectsProps {
  projects: FeaturedProject[];
  onSelectProject: (project: FeaturedProject) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  onSelectProject,
}) => {
  return (
    <section id="featured" className="py-20 border-t border-slate-200/90 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#0059e8] uppercase font-mono mb-2">
              01. Architectural Case Studies
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display text-balance">
              Featured Systems &amp; Engineering Works
            </h2>
          </div>
          <p className="text-sm text-slate-700 font-medium max-w-md">
            Production-ready architectures built with low-overhead network protocols, PostGIS indexing, and SIMD optimizations.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Card 1: LYRIC - Music Streaming Engine */}
          {projects[0] && (
            <div className="lg:col-span-12 rounded-2xl bg-white border border-slate-200/90 hover:border-[#0059e8]/40 shadow-[0_4px_24px_-4px_rgba(30,95,199,0.06)] hover:shadow-[0_12px_36px_-6px_rgba(30,95,199,0.12)] transition-all p-6 sm:p-8 flex flex-col justify-between group">
              <div className="space-y-6">
                
                {/* Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0059e8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">{projects[0].category}</span>
                    <span aria-hidden="true" className="text-slate-400 font-bold">·</span>
                    <span className="text-slate-800 font-semibold">{projects[0].role}</span>
                    <span aria-hidden="true" className="text-slate-400 font-bold">·</span>
                    <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">{projects[0].status}</span>
                  </div>
                  <div className="text-slate-700 font-mono font-medium">
                    {projects[0].timeframe}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left explanation */}
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display group-hover:text-[#0059e8] transition-colors">
                      {projects[0].title}
                    </h3>
                    <p className="text-xs text-[#0059e8] font-mono font-semibold">
                      {projects[0].subtitle}
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed font-normal">
                      {projects[0].description}
                    </p>

                    {/* Problem -> Constraint -> Solution */}
                    <div className="space-y-2.5 pt-2 text-xs">
                      <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-300">
                        <span className="text-amber-950 font-mono font-bold block mb-0.5">Architectural Constraint:</span>
                        <span className="text-slate-800">{projects[0].constraint}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-300">
                        <span className="text-emerald-950 font-mono font-bold block mb-0.5">Engineering Solution:</span>
                        <span className="text-slate-800">{projects[0].solution}</span>
                      </div>
                    </div>

                    {/* Impact outcomes */}
                    <div className="pt-2 space-y-1.5 text-xs text-slate-800 font-medium">
                      {projects[0].impactMetrics.map((metric, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[#0059e8] mt-0.5 font-bold">▸</span>
                          <span>{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right side: Live interactive Audio Waveform Visualizer */}
                  <div className="lg:col-span-6 space-y-4">
                    <AudioVisualizerWidget />
                    
                    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-xs font-mono text-slate-200 space-y-2 shadow-inner">
                      <div className="text-slate-300 font-semibold">// Go HTTP 206 Byte-Range Pipeline</div>
                      <div className="text-slate-200 leading-relaxed">
                        io.CopyBuffer(w, io.NewSectionReader(audioReader, start, end-start+1), buf)
                      </div>
                      <div className="text-[11px] text-emerald-400 font-medium pt-1">
                        ✓ Eliminates heap allocations during multi-megabyte scrubbing
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer bar */}
                <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                    <span className="text-slate-800 font-mono font-bold">Stack:</span>
                    {projects[0].techStack.map((tech, i) => (
                      <React.Fragment key={tech}>
                        <span className="text-slate-900 font-medium">{tech}</span>
                        {i < projects[0].techStack.length - 1 && (
                          <span aria-hidden="true" className="text-slate-400 font-bold">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectProject(projects[0])}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-lg transition-colors shadow-xs cursor-pointer"
                    >
                      <span>View Code &amp; Architecture</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Card 2: Spatial Risk Analytics Engine */}
          {projects[1] && (
            <div className="lg:col-span-12 rounded-2xl bg-white border border-slate-200/90 hover:border-[#0059e8]/40 shadow-[0_4px_24px_-4px_rgba(30,95,199,0.06)] hover:shadow-[0_12px_36px_-6px_rgba(30,95,199,0.12)] transition-all p-6 sm:p-8 flex flex-col justify-between group">
              <div className="space-y-6">
                
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0059e8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">{projects[1].category}</span>
                    <span aria-hidden="true" className="text-slate-400 font-bold">·</span>
                    <span className="text-slate-800 font-semibold">{projects[1].role}</span>
                    <span aria-hidden="true" className="text-slate-400 font-bold">·</span>
                    <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">{projects[1].status}</span>
                  </div>
                  <div className="text-slate-700 font-mono font-medium">
                    02. Case Study
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  <div className="lg:col-span-5 space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display group-hover:text-[#0059e8] transition-colors">
                      {projects[1].title}
                    </h3>
                    <p className="text-xs text-[#0059e8] font-mono font-semibold">
                      {projects[1].subtitle}
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed font-normal">
                      {projects[1].description}
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-300">
                        <span className="text-amber-950 font-mono font-bold block mb-0.5">Bottleneck:</span>
                        <span className="text-slate-800">{projects[1].problem}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-300">
                        <span className="text-emerald-950 font-mono font-bold block mb-0.5">PostGIS Optimization:</span>
                        <span className="text-slate-800">{projects[1].solution}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Live PostGIS GIS Coordinate Simulator */}
                  <div className="lg:col-span-7">
                    <GisSimulatorWidget />
                  </div>

                </div>

                {/* Footer bar */}
                <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                    <span className="text-slate-800 font-mono font-bold">Stack:</span>
                    {projects[1].techStack.map((tech, i) => (
                      <React.Fragment key={tech}>
                        <span className="text-slate-900 font-medium">{tech}</span>
                        {i < projects[1].techStack.length - 1 && (
                          <span aria-hidden="true" className="text-slate-400 font-bold">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectProject(projects[1])}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    <span>View PostGIS Query Plan</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Cards 3 & 4: Vector-Vanguard and kijijiShare */}
          {projects.slice(2, 4).map((proj, idx) => (
            <div
              key={proj.id}
              className="lg:col-span-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#0059e8]/40 shadow-[0_4px_24px_-4px_rgba(30,95,199,0.06)] hover:shadow-[0_12px_36px_-6px_rgba(30,95,199,0.12)] transition-all p-6 sm:p-7 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0059e8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">{proj.category}</span>
                    <span aria-hidden="true" className="text-slate-400 font-bold">·</span>
                    <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">{proj.status}</span>
                  </div>
                  <div className="text-slate-700 font-mono font-medium text-[11px]">
                    0{idx + 3}. Project
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display group-hover:text-[#0059e8] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-[#0059e8] font-mono mt-1 font-semibold">
                    {proj.subtitle}
                  </p>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {proj.description}
                </p>

                {/* Problem & Solution block */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="p-2.5 rounded bg-amber-50/70 border border-amber-300">
                    <span className="text-amber-950 font-mono font-bold block mb-0.5">Constraint:</span>
                    <span className="text-slate-800">{proj.constraint}</span>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-50/70 border border-emerald-300">
                    <span className="text-emerald-950 font-mono font-bold block mb-0.5">Resolution:</span>
                    <span className="text-slate-800">{proj.solution}</span>
                  </div>
                </div>

              </div>

              {/* Bottom bar */}
              <div className="pt-6 mt-6 border-t border-slate-200/80 space-y-4">
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700">
                  {proj.techStack.map((tech, i) => (
                    <React.Fragment key={tech}>
                      <span className="text-slate-900 font-medium">{tech}</span>
                      {i < proj.techStack.length - 1 && (
                        <span aria-hidden="true" className="text-slate-400 font-bold">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectProject(proj)}
                    className="text-xs font-semibold text-[#0059e8] hover:text-[#0048c4] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Read Architecture Deep Dive</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1 font-semibold"
                    >
                      <Code2 className="w-3.5 h-3.5 text-[#0059e8]" />
                      <span>Repo</span>
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
