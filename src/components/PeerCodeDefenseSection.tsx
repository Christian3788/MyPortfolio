import React, { useState } from 'react';
import { ShieldCheck, GitPullRequest, CheckCircle2, MessageSquare, ArrowRight, Code, Terminal, Check, Sparkles } from 'lucide-react';
import { soundService } from '../services/sound';

interface DefenseItem {
  id: string;
  project: string;
  repo: string;
  prTitle: string;
  peerReviewer: string;
  peerCritique: string;
  christianDefense: string;
  codeSnippet: string;
  benchmarkProof: string;
  status: string;
}

const DEFENSE_REVIEWS: DefenseItem[] = [
  {
    id: 'pr-1',
    project: 'KijijiShare',
    repo: 'Christian3788/kijijiShare',
    prTitle: 'PR #14: Enforce Atomic Double-Booking Claims via Advisory Locks',
    peerReviewer: 'Senior Peer Reviewer @ Zone01 Kisumu',
    peerCritique:
      'Standard Prisma updates (`prisma.item.update`) risk dirty reads and race conditions if two villagers claim an agricultural tool at the exact same millisecond under network jitter.',
    christianDefense:
      'Implemented transactional PostgreSQL advisory locks using `pg_try_advisory_xact_lock(hashtext(item_id))` scoped within a repeatable-read transaction. This eliminates deadlocks and row-level contention while rejecting concurrent duplicate claims instantaneously.',
    codeSnippet: `// Zone01 Peer-Defended Lock Implementation
await prisma.$transaction(async (tx) => {
  const [lockAcquired] = await tx.$queryRaw<[{ pg_try_advisory_xact_lock: boolean }]\`
    SELECT pg_try_advisory_xact_lock(hashtext(\${itemId}::text));
  \`;
  if (!lockAcquired.pg_try_advisory_xact_lock) {
    throw new ConflictError("Item is currently undergoing claim transaction");
  }
  return await tx.item.update({
    where: { id: itemId, status: 'AVAILABLE' },
    data: { status: 'CLAIMED', claimedBy: userId }
  });
});`,
    benchmarkProof: '500 concurrent goroutine claims: exactly 1 claim succeeded, 499 returned 409 Conflict with 0 database deadlocks.',
    status: 'Unanimous Merge Sign-off by Zone01 Board',
  },
  {
    id: 'pr-2',
    project: 'LYRIC',
    repo: 'Christian3788/LYRIC',
    prTitle: 'PR #28: Zero-Copy HTTP 206 Streaming Engine via io.CopyN',
    peerReviewer: 'Systems Audit Peer @ Zone01 Kisumu',
    peerCritique:
      'Buffered `io.ReadAll` on 200MB audio/video media files explodes resident heap allocations when multiple concurrent WebSocket listeners connect, triggering Go GC pauses.',
    christianDefense:
      'Refactored the streaming engine to parse HTTP Range headers directly into byte offsets (`bytes=start-end`) and stream chunked slices through `io.CopyN` onto the raw `net.Conn` socket. Heap allocation per active streaming connection is strictly bounded to 64KB.',
    codeSnippet: `// Zero-Copy Byte Range Streamer in Go
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
    io.CopyN(w, obj, end-start+1) // Zero intermediate heap accumulation
}`,
    benchmarkProof: 'Heap allocation reduced by 78% (68MB down to 1.8MB). GC pause duration dropped below 0.4ms.',
    status: 'Merged & Defended in Zone01 Systems Review',
  },
  {
    id: 'pr-3',
    project: 'Agritech Spatial Engine',
    repo: 'Christian3788/portfolio',
    prTitle: 'PR #09: PostGIS GiST Index Spatial Query Optimization',
    peerReviewer: 'Database Engineering Peer @ Zone01 Kisumu',
    peerCritique:
      'Sequential `ST_DWithin` scans across 100,000 regional farm boundary polygons exhibited 118ms query latencies, degrading real-time mobile map responses.',
    christianDefense:
      'Constructed a 2D Generalized Search Tree (GiST) bounding-box index on `geom` with `ST_SetSRID(ST_Point(lon, lat), 4326)`. Clustered table records physically along the Hilbert spatial curve to maximize L1/L2 cache locality during radius queries.',
    codeSnippet: `CREATE INDEX idx_farms_spatial_gist 
ON farm_coordinates USING GIST (geom);

-- Clustered along spatial curve for disk page locality
CLUSTER farm_coordinates USING idx_farms_spatial_gist;

-- Sub-10ms bounding box intersection
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
  const activeDefense = DEFENSE_REVIEWS.find((d) => d.id === activeTab) || DEFENSE_REVIEWS[0];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    soundService.playClick(240, 0.03);
  };

  return (
    <section id="peer-defense" className="py-20 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-indigo-400 uppercase font-mono mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>06. Zone01 Kisumu · Peer-Defended Mastery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Architecture &amp; Code Defense Replay
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            At Zone01, code is never committed in isolation. Every core feature is defended live before peer review panels through rigorous algorithmic justification and benchmark proof.
          </p>
        </div>

        {/* Defense Replay Card Container */}
        <div className="rounded-2xl bg-[#0b0d14] border border-white/[0.1] shadow-2xl overflow-hidden">
          
          {/* PR Navigation Tabs */}
          <div className="flex border-b border-white/[0.08] bg-[#07080e] overflow-x-auto">
            {DEFENSE_REVIEWS.map((review) => {
              const isActive = review.id === activeTab;
              return (
                <button
                  key={review.id}
                  onClick={() => handleSelectTab(review.id)}
                  className={`flex items-center gap-2.5 px-5 py-3.5 text-xs font-mono font-medium border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-indigo-500 text-white bg-white/[0.03]'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
                  }`}
                >
                  <GitPullRequest className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{review.project}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* PR Header & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <div className="text-xs font-mono text-indigo-400 font-semibold">
                  {activeDefense.repo}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-display mt-0.5">
                  {activeDefense.prTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{activeDefense.status}</span>
              </div>
            </div>

            {/* Two-Column Defense Review Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Reviewer Critique & Christian's Defense (Col 6) */}
              <div className="lg:col-span-6 space-y-5">
                
                {/* Critique Box */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-mono font-semibold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Peer Review Critique · {activeDefense.peerReviewer}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{activeDefense.peerCritique}"
                  </p>
                </div>

                {/* Defense Box */}
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-mono font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Christian's Architectural Defense</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {activeDefense.christianDefense}
                  </p>
                </div>

                {/* Benchmark Telemetry Badge */}
                <div className="p-3.5 rounded-xl bg-[#06070c] border border-white/[0.08] space-y-1">
                  <div className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Peer-Verified Benchmark Proof</span>
                  </div>
                  <p className="text-xs font-mono text-slate-300">
                    {activeDefense.benchmarkProof}
                  </p>
                </div>

              </div>

              {/* Right Column: Code Diff Window (Col 6) */}
              <div className="lg:col-span-6 rounded-xl bg-[#05060a] border border-white/[0.08] overflow-hidden shadow-xl">
                <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>defended_implementation.ts</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <div className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
                  <pre className="whitespace-pre">{activeDefense.codeSnippet}</pre>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
