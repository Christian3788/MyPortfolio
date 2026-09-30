import React, { useState } from 'react';
import { Github, Linkedin, MapPin, Building, Calendar, ArrowRight, Terminal, Sparkles, CheckCircle2, Copy, Check, Code2, Briefcase, Download, ShieldCheck, Eye, X, ZoomIn } from 'lucide-react';
import { GithubUser } from '../types/github';

interface HeroProps {
  user: GithubUser;
  totalReposCount: number;
  onExploreWorks: () => void;
  onContactClick: () => void;
  audiencePersona?: 'tech-lead' | 'recruiter';
  onPersonaChange?: (persona: 'tech-lead' | 'recruiter') => void;
}

export const Hero: React.FC<HeroProps> = ({
  user,
  totalReposCount,
  onExploreWorks,
  onContactClick,
  audiencePersona,
  onPersonaChange,
}) => {
  const [copiedClone, setCopiedClone] = useState(false);
  const [internalPersona, setInternalPersona] = useState<'tech-lead' | 'recruiter'>('tech-lead');
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false);

  const activePersona = audiencePersona ?? internalPersona;
  const setPersona = (p: 'tech-lead' | 'recruiter') => {
    setInternalPersona(p);
    onPersonaChange?.(p);
  };

  const copyCloneCmd = () => {
    navigator.clipboard.writeText(`git clone https://github.com/${user.login}/LYRIC.git`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <section id="top" className="relative pt-12 pb-20 md:pt-16 md:pb-24 bg-gradient-to-b from-[#edf4ff]/70 via-[#f8fafd] to-white border-b border-slate-200/80 overflow-hidden wps-mesh-bg">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-[#0059e8]/[0.05] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Persona Switcher Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-700 font-semibold">Audience View:</span>
            <div className="flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200">
              <button
                onClick={() => setPersona('tech-lead')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activePersona === 'tech-lead'
                    ? 'bg-[#0059e8] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Tech Lead View</span>
              </button>
              <button
                onClick={() => setPersona('recruiter')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activePersona === 'recruiter'
                    ? 'bg-[#0059e8] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Recruiter View</span>
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Zone01 Kisumu · Peer-Defended Mastery</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Editorial Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Location & Institution */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1 text-slate-900 font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#0059e8]" />
                {user.location || 'Kisumu, Kenya'}
              </span>
              <span aria-hidden="true" className="text-slate-500 font-bold">·</span>
              <span className="flex items-center gap-1 text-slate-900 font-bold">
                <Building className="w-3.5 h-3.5 text-[#0059e8]" />
                Zone01 Kisumu &amp; Aga Khan University
              </span>
              <span aria-hidden="true" className="text-slate-500 font-bold">·</span>
              <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                EAT (UTC+3)
              </span>
            </div>

            {/* Display Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.08] text-balance">
                Christian Amos Otieno
              </h1>
              
              {activePersona === 'tech-lead' ? (
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-normal">
                  Systems-focused software engineer specializing in low-overhead network protocols in{' '}
                  <span className="text-[#0059e8] font-bold">Go</span>, high-throughput spatial indexing in{' '}
                  <span className="text-[#0059e8] font-bold">PostGIS</span>, and deterministic interfaces in{' '}
                  <span className="text-[#0059e8] font-bold">Next.js &amp; TypeScript</span>.
                </p>
              ) : (
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-normal">
                  Full-stack software developer experienced in building production web platforms, low-latency microservices,
                  and high-reliability systems with verified peer-defended code mastery at Zone01 Kisumu.
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreWorks}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-lg transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Featured Systems</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onContactClick}
                className="px-5 py-3 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Get in Touch
              </button>

              <a
                href="https://www.linkedin.com/in/christian-otieno-9a9806229/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 text-sm font-semibold text-slate-800 hover:text-[#0a66c2] bg-white hover:bg-blue-50/60 border border-slate-300 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
                title="Connect with Christian on LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-[#0a66c2]" />
                <span>LinkedIn</span>
              </a>

              <a
                href="/resume.pdf"
                download="Christian_Amos_Otieno_Resume.pdf"
                className="px-4 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Resume (PDF)</span>
              </a>
            </div>

            {/* Adjacent Proof Metrics */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6 max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
                  3.12ms
                </div>
                <div className="text-xs text-slate-700 font-medium mt-0.5">
                  PostGIS GiST Latency (down from 118ms)
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
                  78%
                </div>
                <div className="text-xs text-slate-700 font-medium mt-0.5">
                  Heap Memory Reduction (HTTP 206)
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
                  {totalReposCount || 44}
                </div>
                <div className="text-xs text-slate-700 font-medium mt-0.5">
                  Public Repositories on GitHub
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High-Res Editorial Portrait Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group w-full max-w-[340px] sm:max-w-[370px]">
              
              {/* Backlight Glow Aura */}
              <div 
                className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-blue-500/20 via-sky-400/15 to-transparent blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative rounded-2xl bg-white border border-slate-200/90 p-4 shadow-[0_12px_40px_-10px_rgba(30,95,199,0.08)] space-y-4">
                
                {/* Portrait Image Frame */}
                <div 
                  onClick={() => setIsPhotoLightboxOpen(true)}
                  className="relative aspect-[3/3.8] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner cursor-pointer group/img"
                  title="Click to view full portrait"
                >
                  <img
                    src="/IMG_20260926_072914.jpg"
                    alt={user.name || 'Christian Amos Otieno'}
                    className="w-full h-full object-cover object-[50%_15%] contrast-[1.03] group-hover/img:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/profile.jpg';
                    }}
                  />

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Status: Kisumu UTC+3 */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 border border-emerald-300 backdrop-blur-md font-mono text-[11px] text-emerald-800 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Kisumu · UTC+3</span>
                  </div>

                  {/* Quick Expand Button / Hover Lens */}
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded-md bg-white/90 backdrop-blur-md border border-slate-300 text-slate-800 text-[11px] font-mono shadow-md">
                    <ZoomIn className="w-3.5 h-3.5 text-[#0059e8]" />
                    <span>Expand</span>
                  </div>

                  {/* Floating Zone01 Verification Badge */}
                  <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 border border-[#0059e8]/40 backdrop-blur-md shadow-md font-mono text-[11px] text-[#0059e8]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0059e8]" />
                    <span>Zone01 Kisumu · Peer-Defended</span>
                  </div>
                </div>

                {/* Identity & Credentials */}
                <div className="space-y-1 px-1">
                  <div className="flex items-baseline justify-between">
                    <h2 className="text-lg font-bold text-slate-900 font-display">
                      {user.name || 'Christian Amos Otieno'}
                    </h2>
                    <span className="text-xs text-[#0059e8] font-mono font-medium">@{user.login}</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium">
                    Systems-Focused Software Engineer · Zone01 Kisumu
                  </p>
                  <p className="text-[11px] text-slate-700 font-mono font-medium">
                    B.Sc. Microbiology &amp; Biotechnology (Aga Khan Univ)
                  </p>
                </div>

                {/* Terminal Quick Clone */}
                <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shadow-inner">
                  <div className="px-3 py-1.5 bg-slate-800 border-b border-slate-700/80 flex items-center justify-between text-xs text-slate-300 font-mono">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Terminal className="w-3 h-3 text-[#38bdf8]" />
                      <span>flagship-repo</span>
                    </div>
                    <button
                      onClick={copyCloneCmd}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-slate-300 hover:text-white bg-slate-700/80 hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Copy Git Clone Command"
                    >
                      {copiedClone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedClone ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 text-[11px] font-mono text-slate-200 space-y-0.5 overflow-x-auto">
                    <div className="text-slate-300">$ git clone https://github.com/{user.login}/LYRIC.git</div>
                    <div className="text-emerald-400 flex items-center gap-1">
                      <span>✓ Go HTTP 206 Partial Streamer</span>
                      <span className="text-slate-300">· WebSockets · MinIO</span>
                    </div>
                  </div>
                </div>

                {/* Key Domains */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">Core Specialty</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">Go &amp; Network I/O</div>
                    <div className="text-[10px] text-slate-700 font-medium mt-0.5">HTTP 206 &amp; WebSockets</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">Database Optimization</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">PostGIS Spatial GiST</div>
                    <div className="text-[10px] text-slate-700 font-medium mt-0.5">Sub-10ms Polygon Queries</div>
                  </div>
                </div>

                {/* Status footer */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-700 font-mono font-medium">
                  <div className="flex items-center gap-3">
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-[#0059e8] hover:text-[#0048c4] transition-colors text-[11px] font-semibold"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>@{user.login}</span>
                    </a>
                    <span className="text-slate-500 font-bold">·</span>
                    <a
                      href="https://www.linkedin.com/in/christian-otieno-9a9806229/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[#0a66c2] hover:text-[#084e96] transition-colors text-[11px] font-semibold"
                    >
                      <Linkedin className="w-3 h-3" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                  <span className="text-slate-700 font-medium text-[11px]">
                    {totalReposCount || 44} Public Repos
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Portrait Photo Full-Resolution Lightbox Modal (Light Modern Aesthetic) */}
      {isPhotoLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsPhotoLightboxOpen(false)}
        >
          <div 
            className="relative max-w-lg w-full rounded-2xl bg-white border border-slate-200 p-4 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0059e8]" />
                <span className="text-xs font-mono text-slate-800 font-semibold">
                  Christian Amos Otieno · Verified Portrait
                </span>
              </div>
              <button
                onClick={() => setIsPhotoLightboxOpen(false)}
                className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-res image display */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
              <img
                src="/IMG_20260926_072914.jpg"
                alt="Christian Amos Otieno"
                className="w-full h-full object-cover object-[50%_15%]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/profile.jpg';
                }}
              />
            </div>

            {/* Lightbox Footer Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs font-mono">
              <div className="text-slate-700">
                <span className="text-slate-900 font-bold">Christian Amos Otieno</span>
                <span className="text-slate-700 font-medium"> · Zone01 Kisumu &amp; Aga Khan Univ</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/IMG_20260926_072914.jpg"
                  download="Christian_Amos_Otieno.jpg"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0059e8] hover:bg-[#0048c4] text-white font-medium text-xs transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
