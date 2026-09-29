import React, { useState } from 'react';
import { Github, MapPin, Building, Calendar, ArrowRight, Terminal, Sparkles, CheckCircle2, Copy, Check, Code2, Briefcase, Download, ShieldCheck, Eye, X, ZoomIn } from 'lucide-react';
import { GithubUser } from '../types/github';

interface HeroProps {
  user: GithubUser;
  totalReposCount: number;
  onExploreWorks: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  user,
  totalReposCount,
  onExploreWorks,
  onContactClick,
}) => {
  const [copiedClone, setCopiedClone] = useState(false);
  const [audiencePersona, setAudiencePersona] = useState<'tech-lead' | 'recruiter'>('tech-lead');
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false);

  const copyCloneCmd = () => {
    navigator.clipboard.writeText(`git clone https://github.com/${user.login}/LYRIC.git`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <section id="top" className="relative pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-indigo-600/[0.08] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Persona Switcher Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Audience View:</span>
            <div className="flex items-center p-1 rounded-lg bg-[#0f1118] border border-white/[0.08]">
              <button
                onClick={() => setAudiencePersona('tech-lead')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  audiencePersona === 'tech-lead'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Tech Lead View</span>
              </button>
              <button
                onClick={() => setAudiencePersona('recruiter')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  audiencePersona === 'recruiter'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Recruiter View</span>
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Zone01 Kisumu · Peer-Defended Mastery</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Editorial Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Location & Institution (NO PILLS) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {user.location || 'Kisumu, Kenya'}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                Zone01 Kisumu & Aga Khan University
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 font-medium">
                EAT (UTC+3)
              </span>
            </div>

            {/* Display Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.08] text-balance">
                Christian Amos Otieno
              </h1>
              
              {audiencePersona === 'tech-lead' ? (
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                  Systems-focused software engineer specializing in low-overhead network protocols in{' '}
                  <span className="text-white font-semibold">Go</span>, high-throughput spatial indexing in{' '}
                  <span className="text-white font-semibold">PostGIS</span>, and deterministic interfaces in{' '}
                  <span className="text-white font-semibold">Next.js &amp; TypeScript</span>.
                </p>
              ) : (
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                  Full-stack software developer experienced in building production web platforms, low-latency microservices,
                  and high-reliability systems with verified peer-defended code mastery at Zone01 Kisumu.
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreWorks}
                className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center gap-2 group"
              >
                <span>Explore Featured Systems</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onContactClick}
                className="px-5 py-3 text-sm font-semibold text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.2] rounded-lg transition-colors"
              >
                Get in Touch
              </button>

              <a
                href="/resume.pdf"
                download="Christian_Amos_Otieno_Resume.pdf"
                className="px-4 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Resume (PDF)</span>
              </a>
            </div>

            {/* Adjacent Proof Metrics */}
            <div className="pt-8 border-t border-white/[0.08] grid grid-cols-3 gap-6 max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
                  3.12ms
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  PostGIS GiST Latency (down from 118ms)
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
                  78%
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  Heap Memory Reduction (HTTP 206)
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
                  {totalReposCount || 44}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
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
                className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-indigo-500/25 via-sky-500/15 to-transparent blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative rounded-2xl bg-[#0e1017] border border-white/[0.12] p-4 shadow-2xl space-y-4">
                
                {/* Portrait Image Frame */}
                <div 
                  onClick={() => setIsPhotoLightboxOpen(true)}
                  className="relative aspect-[3/3.8] rounded-xl overflow-hidden bg-slate-900 border border-white/[0.1] shadow-inner cursor-pointer group/img"
                  title="Click to view full portrait"
                >
                  <img
                    src="/IMG_20260926_072914.jpg"
                    alt={user.name || 'Christian Amos Otieno'}
                    className="w-full h-full object-cover object-[50%_15%] contrast-[1.05] brightness-95 group-hover/img:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/profile.jpg';
                    }}
                  />

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017]/90 via-[#0e1017]/20 to-transparent pointer-events-none" />

                  {/* Floating Status: Kisumu UTC+3 */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#070b14]/85 border border-emerald-500/40 backdrop-blur-md font-mono text-[11px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Kisumu · UTC+3</span>
                  </div>

                  {/* Quick Expand Button / Hover Lens */}
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono shadow-md">
                    <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Expand</span>
                  </div>

                  {/* Floating Zone01 Verification Badge */}
                  <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070b14]/90 border border-indigo-500/50 backdrop-blur-md shadow-lg font-mono text-[11px] text-indigo-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Zone01 Kisumu · Peer-Defended</span>
                  </div>
                </div>

                {/* Identity & Credentials */}
                <div className="space-y-1 px-1">
                  <div className="flex items-baseline justify-between">
                    <h2 className="text-lg font-bold text-white font-display">
                      {user.name || 'Christian Amos Otieno'}
                    </h2>
                    <span className="text-xs text-indigo-400 font-mono">@{user.login}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Systems-Focused Software Engineer · Zone01 Kisumu
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    B.Sc. Microbiology & Biotechnology (Aga Khan Univ)
                  </p>
                </div>

                {/* Terminal Quick Clone */}
                <div className="rounded-lg bg-[#07080c] border border-white/[0.08] overflow-hidden">
                  <div className="px-3 py-1.5 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Terminal className="w-3 h-3 text-indigo-400" />
                      <span>flagship-repo</span>
                    </div>
                    <button
                      onClick={copyCloneCmd}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
                      title="Copy Git Clone Command"
                    >
                      {copiedClone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedClone ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 text-[11px] font-mono text-slate-300 space-y-0.5 overflow-x-auto">
                    <div className="text-slate-500">$ git clone https://github.com/{user.login}/LYRIC.git</div>
                    <div className="text-emerald-400 flex items-center gap-1">
                      <span>✓ Go HTTP 206 Partial Streamer</span>
                      <span className="text-slate-500">· WebSockets · MinIO</span>
                    </div>
                  </div>
                </div>

                {/* Key Domains */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-[10px] text-slate-400">Core Specialty</div>
                    <div className="text-xs font-semibold text-white mt-0.5">Go & Network I/O</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">HTTP 206 & WebSockets</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-[10px] text-slate-400">Database Optimization</div>
                    <div className="text-xs font-semibold text-white mt-0.5">PostGIS Spatial GiST</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Sub-10ms Polygon Queries</div>
                  </div>
                </div>

                {/* Status footer */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 text-indigo-400 text-[11px]">
                    <Sparkles className="w-3 h-3" />
                    GitHub @{user.login}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {totalReposCount || 44} Public Repos
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Portrait Photo Full-Resolution Lightbox Modal */}
      {isPhotoLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsPhotoLightboxOpen(false)}
        >
          <div 
            className="relative max-w-lg w-full rounded-2xl bg-[#0e1017] border border-white/[0.15] p-4 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono text-slate-300 font-semibold">
                  Christian Amos Otieno · Verified Portrait
                </span>
              </div>
              <button
                onClick={() => setIsPhotoLightboxOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-res image display */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black border border-white/[0.1] shadow-2xl">
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
              <div className="text-slate-400">
                <span className="text-white font-medium">Christian Amos Otieno</span>
                <span className="text-slate-500"> · Zone01 Kisumu & Aga Khan Univ</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/IMG_20260926_072914.jpg"
                  download="Christian_Amos_Otieno.jpg"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
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
