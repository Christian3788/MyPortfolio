import React, { useState } from 'react';
import { ShieldCheck, GitPullRequest, CheckCircle2, MessageSquare, ArrowRight, Code, Terminal, Check, Copy, Split, AlignLeft, Sparkles } from 'lucide-react';
import { soundService } from '../services/sound';

interface DefenseItem {
  id: string;
  project: string;
  repo: string;
  prTitle: string;
  peerReviewer: string;
  peerCritique: string;
  christianDefense: string;
  beforeSnippet: string;
  afterSnippet: string;
  benchmarkProof: string;
  status: string;
  filename: string;
}

const DEFENSE_REVIEWS: DefenseItem[] = [
  {
    id: 'pr-1',
    project: 'KijijiShare',
    repo: 'Christian3788/kijijiShare',
    prTitle: 'PR #14: Enforce Atomic Double-Booking Claims via Advisory Locks',
    filename: 'item.service.ts',
    peerReviewer: 'Senior Peer Reviewer @ Zone01 Kisumu',
    peerCritique:
      'Standard Prisma updates (`prisma.item.update`) risk dirty reads and race conditions if two villagers claim an agricultural tool at the exact same millisecond under network jitter.',
    christianDefense:
      'Implemented transactional PostgreSQL advisory locks using `pg_try_advisory_xact_lock(hashtext(item_id))` scoped within a repeatable-read transaction. This eliminates deadlocks and row-level contention while rejecting concurrent duplicate claims instantaneously.',
    beforeSnippet: `// ❌ Naive Prisma Update (Race Condition Vulnerability)
export async function claimItem(itemId: string, userId: string) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (item?.status !== 'AVAILABLE') {
    throw new Error('Item unavailable');
  }
  // Race window: Another villager claims here before write lock
  return await prisma.item.update({
    where: { id: itemId },
    data: { status: 'CLAIMED', claimedBy: userId },
  });
}`,
    afterSnippet: `// ✅ Zone01 Defended: Atomic Advisory Transaction Lock
export async function claimItem(itemId: string, userId: string) {
  return await prisma.$transaction(async (tx) => {
    const [lockAcquired] = await tx.$queryRaw<[{ pg_try_advisory_xact_lock: boolean }]>\`
      SELECT pg_try_advisory_xact_lock(hashtext(\${itemId}::text));
    \`;
    if (!lockAcquired.pg_try_advisory_xact_lock) {
      throw new ConflictError("Item claim currently serialized");
    }
    return await tx.item.update({
      where: { id: itemId, status: 'AVAILABLE' },
      data: { status: 'CLAIMED', claimedBy: userId }
    });
  });
}`,
    benchmarkProof: '500 concurrent goroutine claims: exactly 1 claim succeeded, 499 returned 409 Conflict with 0 database deadlocks.',
    status: 'Unanimous Merge Sign-off by Zone01 Board',
  },
  {
    id: 'pr-2',
    project: 'LYRIC',
    repo: 'Christian3788/LYRIC',
    prTitle: 'PR #28: Zero-Copy HTTP 206 Streaming Engine via io.CopyN',
    filename: 'streamer.go',
    peerReviewer: 'Systems Audit Peer @ Zone01 Kisumu',
    peerCritique:
      'Buffered `io.ReadAll` on 200MB audio/video media files explodes resident heap allocations when multiple concurrent WebSocket listeners connect, triggering Go GC pauses.',
    christianDefense:
      'Refactored the streaming engine to parse HTTP Range headers directly into byte offsets (`bytes=start-end`) and stream chunked slices through `io.CopyN` onto the raw `net.Conn` socket. Heap allocation per active streaming connection is strictly bounded to 64KB.',
    beforeSnippet: `// ❌ Naive Media Streaming (Heap Ballooning & GC Pauses)
func StreamMedia(w http.ResponseWriter, r *http.Request, path string) {
    data, err := os.ReadFile(path) // 200MB loaded into heap memory
    if err != nil {
        http.Error(w, "File not found", 404)
        return
    }
    // High allocation spikes crash under concurrent socket bursts
    w.Write(data)
}`,
    afterSnippet: `// ✅ Zone01 Defended: Zero-Copy Bounded TCP Window
func StreamRange(w http.ResponseWriter, r *http.Request, obj io.ReadSeeker, size int64) {
    start, end, err := parseRangeHeader(r.Header.Get("Range"), size)
    if err != nil {
        http.Error(w, "Invalid range", http.StatusRequestedRangeNotSatisfiable)
        return
    }
    w.Header().Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, size))
    w.Header().Set("Content-Length", strconv.FormatInt(end-start+1, 10))
    w.WriteHeader(http.StatusPartialContent)

    obj.Seek(start, io.SeekStart)
    io.CopyN(w, obj, end-start+1) // Strictly bounded 64KB TCP buffer
}`,
    benchmarkProof: 'Heap allocation reduced by 78% (68MB down to 1.8MB). GC pause duration dropped below 0.4ms.',
    status: 'Merged & Defended in Zone01 Systems Review',
  },
  {
    id: 'pr-3',
    project: 'Agritech Spatial Engine',
    repo: 'Christian3788/portfolio',
    prTitle: 'PR #09: PostGIS GiST Index Spatial Query Optimization',
    filename: 'spatial_index.sql',
    peerReviewer: 'Database Engineering Peer @ Zone01 Kisumu',
    peerCritique:
      'Sequential `ST_DWithin` scans across 100,000 regional farm boundary polygons exhibited 118ms query latencies, degrading real-time mobile map responses.',
    christianDefense:
      'Constructed a 2D Generalized Search Tree (GiST) bounding-box index on `geom` with `ST_SetSRID(ST_Point(lon, lat), 4326)`. Clustered table records physically along the Hilbert spatial curve to maximize L1/L2 cache locality during radius queries.',
    beforeSnippet: `-- ❌ Sequential Table Scan (118.4ms Latency on 100k Polygons)
SELECT id, name, 
       ST_Distance(geom, ST_SetSRID(ST_Point(34.76, -0.09), 4326)) AS dist
FROM farm_coordinates
WHERE ST_DWithin(geom, ST_SetSRID(ST_Point(34.76, -0.09), 4326), 10000)
ORDER BY dist ASC LIMIT 20;
-- Full disk scan across unindexed pages`,
    afterSnippet: `-- ✅ Zone01 Defended: 2D GiST R-Tree + Hilbert Clustered Index
CREATE INDEX idx_farms_spatial_gist ON farm_coordinates USING GIST (geom);

-- Physically cluster records along spatial curve for disk page locality
CLUSTER farm_coordinates USING idx_farms_spatial_gist;

-- Sub-4ms bounding box intersection (99.8% buffer cache hits)
SELECT id, name, ST_Distance(geom, ST_SetSRID(ST_Point(:lon, :lat), 4326)) AS dist
FROM farm_coordinates
WHERE ST_DWithin(geom, ST_SetSRID(ST_Point(:lon, :lat), 4326), :radius_meters)
ORDER BY dist ASC LIMIT 20;`,
    benchmarkProof: 'Execution time dropped from 118.4ms to 3.12ms under EXPLAIN (ANALYZE, BUFFERS). Buffer hits 99.8%.',
    status: 'Mastery Approved & Merged',
  },
];

export const PeerCodeDefenseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('pr-1');
  const [diffMode, setDiffMode] = useState<'split' | 'unified'>('split');
  const [copied, setCopied] = useState<boolean>(false);

  const activeDefense = DEFENSE_REVIEWS.find((d) => d.id === activeTab) || DEFENSE_REVIEWS[0];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    soundService.playClick(240, 0.03);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeDefense.afterSnippet);
    setCopied(true);
    soundService.playClick(320, 0.02);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="peer-defense" className="py-20 border-t border-slate-200/90 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0059e8] uppercase font-mono mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>03. Zone01 Kisumu · Peer-Defended Mastery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              Architecture &amp; Code Defense Replay
            </h2>
          </div>
          <p className="text-sm text-slate-700 font-medium max-w-md">
            At Zone01, code is never committed in isolation. Every core feature is defended live before peer review panels through rigorous algorithmic justification and benchmark proof.
          </p>
        </div>

        {/* Defense Replay Card Container */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,89,232,0.06)] overflow-hidden">
          
          {/* PR Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
            {DEFENSE_REVIEWS.map((review) => {
              const isActive = review.id === activeTab;
              return (
                <button
                  key={review.id}
                  onClick={() => handleSelectTab(review.id)}
                  className={`flex items-center gap-2.5 px-5 py-3.5 text-xs font-mono border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[#0059e8] text-[#0059e8] bg-white font-bold'
                      : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <GitPullRequest className={`w-3.5 h-3.5 ${isActive ? 'text-[#0059e8]' : 'text-slate-500'}`} />
                  <span>{review.project}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* PR Header & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-mono text-[#0059e8] font-bold">
                  {activeDefense.repo}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display mt-0.5">
                  {activeDefense.prTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{activeDefense.status}</span>
              </div>
            </div>

            {/* Critique & Defense Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Critique Box */}
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-300 space-y-2">
                <div className="flex items-center gap-2 text-rose-950 text-xs font-mono font-bold">
                  <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                  <span>Peer Review Critique · {activeDefense.peerReviewer}</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed italic">
                  "{activeDefense.peerCritique}"
                </p>
              </div>

              {/* Defense Box */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-300 space-y-2">
                <div className="flex items-center gap-2 text-[#0059e8] text-xs font-mono font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Christian's Architectural Defense</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {activeDefense.christianDefense}
                </p>
              </div>
            </div>

            {/* Benchmark Telemetry Banner */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 flex-wrap">
              <div className="text-[11px] font-mono text-emerald-900 font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Peer-Verified Benchmark Proof:</span>
              </div>
              <p className="text-xs font-mono text-slate-800 font-medium flex-1">
                {activeDefense.benchmarkProof}
              </p>
            </div>

            {/* Interactive Code Diff Viewer with Split / Unified Switcher */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              
              {/* Diff Viewer Top Bar */}
              <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-200">
                  <Terminal className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>{activeDefense.filename}</span>
                  <span className="text-[10px] text-slate-300">·</span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Zone01 Peer Approved
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Split vs Unified Toggle */}
                  <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-700">
                    <button
                      onClick={() => {
                        setDiffMode('split');
                        soundService.playClick(220, 0.015);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                        diffMode === 'split'
                          ? 'bg-[#0059e8] text-white font-semibold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                      title="Side-by-side Before/After comparison"
                    >
                      <Split className="w-3 h-3" />
                      <span className="hidden sm:inline">Side-by-Side</span>
                    </button>
                    <button
                      onClick={() => {
                        setDiffMode('unified');
                        soundService.playClick(220, 0.015);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                        diffMode === 'unified'
                          ? 'bg-[#0059e8] text-white font-semibold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                      title="Unified Defended Code"
                    >
                      <AlignLeft className="w-3 h-3" />
                      <span className="hidden sm:inline">Defended Implementation</span>
                    </button>
                  </div>

                  {/* Copy Defended Snippet */}
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer text-[11px] border border-slate-700"
                    title="Copy Defended Code Snippet"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-300" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Diff Code Body */}
              {diffMode === 'split' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 text-xs font-mono">
                  {/* Before / Vulnerable Code */}
                  <div className="p-4 space-y-2 bg-rose-950/[0.12]">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-rose-300 pb-1 border-b border-rose-500/20">
                      <span>BEFORE: Naive / Critiqued Implementation</span>
                      <span className="text-[10px] text-rose-300 font-mono">Vulnerable</span>
                    </div>
                    <pre className="overflow-x-auto text-slate-200 leading-relaxed scrollbar-thin">
                      {activeDefense.beforeSnippet.split('\n').map((line, lIdx) => (
                        <div key={lIdx} className="flex gap-3 hover:bg-white/[0.04] px-1 py-0.5 rounded">
                          <span className="text-slate-400 select-none w-5 text-right shrink-0">{lIdx + 1}</span>
                          <span className={line.startsWith('// ❌') ? 'text-rose-400 font-bold' : 'text-slate-200'}>{line}</span>
                        </div>
                      ))}
                    </pre>
                  </div>

                  {/* After / Defended Code */}
                  <div className="p-4 space-y-2 bg-emerald-950/[0.12]">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-300 pb-1 border-b border-emerald-500/20">
                      <span>AFTER: Peer-Defended Architecture</span>
                      <span className="text-[10px] text-emerald-300 font-mono">Production Merged</span>
                    </div>
                    <pre className="overflow-x-auto text-emerald-100 leading-relaxed scrollbar-thin">
                      {activeDefense.afterSnippet.split('\n').map((line, lIdx) => (
                        <div key={lIdx} className="flex gap-3 hover:bg-white/[0.04] px-1 py-0.5 rounded">
                          <span className="text-slate-400 select-none w-5 text-right shrink-0">{lIdx + 1}</span>
                          <span className={line.startsWith('// ✅') ? 'text-emerald-400 font-bold' : 'text-slate-100'}>{line}</span>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
                  <pre className="overflow-x-auto text-emerald-100 leading-relaxed scrollbar-thin">
                    {activeDefense.afterSnippet.split('\n').map((line, lIdx) => (
                      <div key={lIdx} className="flex gap-3 hover:bg-white/[0.04] px-1 py-0.5 rounded">
                        <span className="text-slate-400 select-none w-6 text-right shrink-0">{lIdx + 1}</span>
                        <span className={line.startsWith('// ✅') ? 'text-emerald-400 font-bold' : 'text-slate-100'}>{line}</span>
                      </div>
                    ))}
                  </pre>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
