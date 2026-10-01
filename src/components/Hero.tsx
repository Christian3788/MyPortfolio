import React, { useState } from 'react';
import {
  Github,
  Linkedin,
  MapPin,
  Building,
  Calendar,
  ArrowRight,
  Terminal,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  Briefcase,
  Download,
  ShieldCheck,
  Eye,
  X,
  ZoomIn,
  FileText,
  Clock,
  Layers,
  Flame,
  ArrowUpRight,
  Mail
} from 'lucide-react';
import { GithubUser } from '../types/github';
import { soundService } from '../services/sound';

interface HeroProps {
  user: GithubUser;
  totalReposCount: number;
  onExploreWorks: () => void;
  onContactClick: () => void;
  onOpenChallenge?: () => void;
  onOpenResume?: () => void;
  onOpenTerminal?: () => void;
  audiencePersona?: 'tech-lead' | 'recruiter';
  onPersonaChange?: (persona: 'tech-lead' | 'recruiter') => void;
}

export const Hero: React.FC<HeroProps> = ({
  user,
  totalReposCount,
  onExploreWorks,
  onContactClick,
  onOpenChallenge,
  onOpenResume,
  onOpenTerminal,
  audiencePersona,
  onPersonaChange,
}) => {
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<'txt' | 'md' | null>(null);
  const [internalPersona, setInternalPersona] = useState<'tech-lead' | 'recruiter'>('tech-lead');
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false);

  const activePersona = audiencePersona ?? internalPersona;
  const setPersona = (p: 'tech-lead' | 'recruiter') => {
    soundService.playClick(240, 0.02);
    setInternalPersona(p);
    onPersonaChange?.(p);
  };

  const copyCloneCmd = () => {
    navigator.clipboard.writeText(`git clone https://github.com/${user.login}/LYRIC.git`);
    setCopiedClone(true);
    soundService.playClick(320, 0.02);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const copyResumePlainText = () => {
    const text = `================================================================================
CHRISTIAN AMOS OTIENO
Systems-Focused Software Engineer
Location: ${user.location || 'Kisumu, Kenya'} | Email: ${user.email || 'christianamos67@gmail.com'}
GitHub: https://github.com/${user.login} | LinkedIn: https://www.linkedin.com/in/christian-otieno-9a9806229/
================================================================================

SUMMARY:
Systems-focused software engineer specializing in low-overhead network protocols in Go,
high-throughput spatial indexing in PostGIS, and deterministic web interfaces in Next.js & TypeScript.
Proven peer-defended code mastery at Zone01 Kisumu. Background in microbiology and computational biology.

CORE TECH STACK:
- Languages: Go (Golang), TypeScript, JavaScript, SQL, Python, C
- Backend & Systems: HTTP/2, WebSocket, Docker, Linux Systems Programming, MinIO S3
- Databases: PostgreSQL, PostGIS GiST Indexing, Redis, SQLite
- Frontend: React 18/19, Next.js, Tailwind CSS, Three.js

ZONE01 PEER DEFENSE HIGHLIGHTS:
- LYRIC Audio Engine: Zero-copy HTTP 206 byte streaming reducing heap allocations by 78%.
- Spatial Risk Engine: PostGIS GiST R-Tree Hilbert curve optimization reducing latency from 118ms to 3.12ms.
- Concurrency Claim: PostgreSQL advisory transaction lock eliminating race conditions under 500 concurrent goroutines.`;

    navigator.clipboard.writeText(text);
    setCopiedFormat('txt');
    soundService.playSuccess();
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const copyResumeMarkdown = () => {
    const md = `# Christian Amos Otieno
**Systems-Focused Software Engineer**
Location: ${user.location || 'Kisumu, Kenya'} | Timezone: EAT (UTC+3)
Email: ${user.email || 'christianamos67@gmail.com'} | GitHub: https://github.com/${user.login}

## Core Competencies
- **Systems & Protocols**: Go (Golang), HTTP 206 Streaming, WebSocket, Linux Systems, Docker
- **Data Engineering**: PostgreSQL, PostGIS 2D GiST, Hilbert Spatial Clustering, Redis
- **Frontend Architecture**: React 19, TypeScript, Next.js App Router, Tailwind CSS, Three.js

## Verified Engineering Proofs
- **LYRIC HTTP 206 Engine**: 78% heap allocation reduction via bounded 64KB TCP window.
- **PostGIS Spatial Analytics**: 118ms to 3.12ms query response under 100k farm boundary polygons.
- **Zone01 Peer Defense**: Unanimous merge sign-off on concurrency advisory lock transactions.`;

    navigator.clipboard.writeText(md);
    setCopiedFormat('md');
    soundService.playSuccess();
    setTimeout(() => setCopiedFormat(null), 2500);
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

            {/* Persona-Adaptive Fast-Track Bar */}
            {activePersona === 'recruiter' ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-200/90 shadow-[0_4px_20px_-4px_rgba(0,89,232,0.08)] space-y-3.5 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-blue-50 text-[#0059e8]">
                      <Briefcase className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                      Recruiter Fast-Track Hub
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                    ● Available for Full-Time Systems &amp; Backend Roles
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Copy Plaintext CV */}
                  <button
                    onClick={copyResumePlainText}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-[#0059e8]/50 text-xs font-mono text-slate-800 font-semibold transition-all cursor-pointer shadow-2xs group"
                  >
                    {copiedFormat === 'txt' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied Plaintext!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#0059e8]" />
                        <span>Copy Plaintext CV</span>
                      </>
                    )}
                  </button>

                  {/* Copy Markdown CV */}
                  <button
                    onClick={copyResumeMarkdown}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-[#0059e8]/50 text-xs font-mono text-slate-800 font-semibold transition-all cursor-pointer shadow-2xs group"
                  >
                    {copiedFormat === 'md' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied Markdown!</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#0059e8]" />
                        <span>Copy Markdown CV</span>
                      </>
                    )}
                  </button>

                  {/* Instant 15-Min Meeting */}
                  <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=15-Min+Systems+Architecture+Chat+with+Christian+Amos+Otieno&details=Discussion+on+distributed+systems,+Go+streaming,+and+software+engineering+opportunities.&add=christianamos67@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0059e8] hover:bg-[#0048c4] text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-xs group"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book 15m Chat</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 font-sans pt-1">
                  <span>Remote Friendly (UTC-5 to UTC+4 overlap) · Fast Response Time</span>
                  {onOpenResume && (
                    <button
                      onClick={() => {
                        soundService.playClick(200, 0.02);
                        onOpenResume();
                      }}
                      className="text-[#0059e8] font-bold hover:underline font-mono cursor-pointer"
                    >
                      Open Full Interactive Resume Modal →
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300">Fast Systems Jump:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {onOpenChallenge && (
                    <button
                      onClick={() => {
                        soundService.playClick(260, 0.02);
                        onOpenChallenge();
                      }}
                      className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      ⚔ Concurrency Challenge
                    </button>
                  )}
                  {onOpenTerminal && (
                    <button
                      onClick={() => {
                        soundService.playClick(220, 0.02);
                        onOpenTerminal();
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      ❯ CLI Terminal
                    </button>
                  )}
                  <a
                    href="#architecture-sandbox"
                    className="px-2.5 py-1 rounded bg-[#0059e8]/30 hover:bg-[#0059e8]/50 text-blue-300 border border-[#0059e8]/60 text-[11px] font-bold transition-colors"
                  >
                    ⬡ Live Topology Sandbox
                  </a>
                </div>
              </div>
            )}

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
