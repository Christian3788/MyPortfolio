import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Newspaper, Terminal, Copy, Check, Sparkles, Filter, RefreshCw, ArrowDown, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import { soundService } from '../services/sound';

export interface DispatchLogItem {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  tag: string;
  excerpt: string;
  technicalDeepDive: string;
  codeSnippet: string;
  language: string;
  architectureTakeaway: string;
}

const INITIAL_LOGS: DispatchLogItem[] = [
  {
    id: 'log-1',
    title: 'Zero-Copy Range Streaming: Bounding TCP Sockets via io.CopyN in Go',
    category: 'High-Throughput I/O',
    date: 'Zone01 Technical Memo',
    readTime: '3 min read',
    tag: '#go',
    excerpt: 'Analyzing why io.ReadAll on multi-hundred megabyte media payloads exhausts resident memory under concurrent listener bursts.',
    technicalDeepDive: 'By parsing HTTP 206 range offsets and streaming directly through io.CopyN on the raw TCP socket, intermediate allocations are strictly bounded to 64KB buffers regardless of total file size.',
    codeSnippet: `// Bounded 64KB TCP Window Streaming in Go
func StreamRange(w http.ResponseWriter, r *http.Request, src io.ReadSeeker, size int64) {
    start, end, _ := parseRangeHeader(r.Header.Get("Range"), size)
    w.Header().Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, size))
    w.WriteHeader(http.StatusPartialContent)
    src.Seek(start, io.SeekStart)
    io.CopyN(w, src, end-start+1) // Zero heap ballooning
}`,
    language: 'go',
    architectureTakeaway: 'Constrain heap allocations at the transport layer to maintain deterministic GC latency under sustained socket load.',
  },
  {
    id: 'log-2',
    title: 'PostGIS Hilbert Clustering: Slashing 100k Polygon Radius Query Latency',
    category: 'Geospatial Databases',
    date: 'Agritech Spatial Report',
    readTime: '4 min read',
    tag: '#databases',
    excerpt: 'How spatial Hilbert curve index clustering transforms disk page locality for sub-5ms polygon bounding checks.',
    technicalDeepDive: 'By physically sorting PostgreSQL table rows along the Hilbert space-filling curve with CLUSTER farm_coordinates USING idx_gist, disk block reads are reduced by 91% during ST_DWithin spatial queries.',
    codeSnippet: `CREATE INDEX idx_farms_spatial_gist ON farm_coordinates USING GIST (geom);
-- Physically order tuples along space-filling curve
CLUSTER farm_coordinates USING idx_farms_spatial_gist;
-- Bounding box intersection with 99.8% buffer cache hits
SELECT id, name FROM farm_coordinates
WHERE ST_DWithin(geom, ST_SetSRID(ST_Point(:lon, :lat), 4326), :radius_m);`,
    language: 'sql',
    architectureTakeaway: 'Align physical disk storage with query access patterns to transform random disk seek operations into sequential cache hits.',
  },
  {
    id: 'log-3',
    title: 'PostgreSQL Advisory Locks vs Row-Level Contention in KijijiShare',
    category: 'Concurrency Control',
    date: 'Zone01 Architecture Review',
    readTime: '3 min read',
    tag: '#systems',
    excerpt: 'Preventing double-booking race conditions across hyperlocal asset reservations with zero deadlocks.',
    technicalDeepDive: 'Using pg_try_advisory_xact_lock(hashtext(item_id)) inside a repeatable-read transaction acquires application-level serialization with immediate non-blocking rejection (409 Conflict) for duplicate concurrent requests.',
    codeSnippet: `const [lockAcquired] = await tx.$queryRaw\`
  SELECT pg_try_advisory_xact_lock(hashtext(\${itemId}::text));
\`;
if (!lockAcquired.pg_try_advisory_xact_lock) {
  throw new ConflictError("Asset claim is currently serialized");
}`,
    language: 'typescript',
    architectureTakeaway: 'Application-level advisory locks prevent database table lock escalation while maintaining atomic serializability.',
  },
];

export const DynamicInfiniteScrollStream: React.FC = () => {
  const [logs, setLogs] = useState<DispatchLogItem[]>(INITIAL_LOGS);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchNextLogs = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cursor: logs.length,
          tag: selectedTag,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setLogs((prev) => [...prev, ...data.items]);
          soundService.playSuccess();
        }
      }
    } catch {
      // Local dynamic fallback generation if offline
      const fallbackItem: DispatchLogItem = {
        id: `local-log-${Date.now()}`,
        title: `Dispatch #${logs.length + 1}: Linux epoll Edge-Triggered Network Poller`,
        category: 'Systems Architecture',
        date: 'Generated Stream',
        readTime: '3 min read',
        tag: selectedTag !== 'all' ? `#${selectedTag}` : '#systems',
        excerpt: 'Deconstructing the Linux epoll edge-triggered state machine for non-blocking goroutine socket parking.',
        technicalDeepDive: 'By multiplexing I/O readiness notifications directly into the runtime netpoller, Go achieves asynchronous network throughput while exposing simple synchronous socket APIs.',
        codeSnippet: `// Linux epoll netpoll abstraction in Go runtime\nfunc netpoll(delay int64) gList {\n    var events [128]epollevent\n    n := epollwait(epfd, &events[0], int32(len(events)), int32(delay))\n    // Unpark runnable goroutines without thread preemption\n}`,
        language: 'go',
        architectureTakeaway: 'Avoid blocking OS threads; delegate non-blocking socket state transitions to kernel edge-triggered event queues.',
      };
      setLogs((prev) => [...prev, fallbackItem]);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, logs.length, selectedTag]);

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (!autoScrollEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          fetchNextLogs();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [autoScrollEnabled, fetchNextLogs, isLoadingMore]);

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundService.playClick(280, 0.02);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLogs = logs.filter((log) => {
    if (selectedTag === 'all') return true;
    return log.tag.toLowerCase().includes(selectedTag.toLowerCase());
  });

  return (
    <section id="engineering-stream" className="py-20 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-indigo-400 uppercase font-mono mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>08. Dynamic Infinite Scroll · Continuous Engineering Logs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Systems Dispatches &amp; Technical Stream
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mt-1">
              An endless, dynamically generated engineering feed covering Go runtime internals, PostGIS spatial indexing, kernel I/O, and distributed consistency.
            </p>
          </div>

          {/* Tag Filters & Auto-scroll Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Tag Pills */}
            <div className="flex items-center p-1 rounded-xl bg-[#08090f] border border-white/[0.08] text-xs font-mono">
              {['all', 'go', 'databases', 'systems'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                    selectedTag === tag
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Autoscroll Toggle */}
            <button
              onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border transition-colors ${
                autoScrollEnabled
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
              title="Toggle automatic generation on scroll"
            >
              <span className={`w-2 h-2 rounded-full ${autoScrollEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span>{autoScrollEnabled ? 'Infinite Scroll ON' : 'Infinite Scroll OFF'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Dispatches Stream Feed */}
        <div className="space-y-6">
          {filteredLogs.map((item, index) => (
            <article
              key={item.id}
              className="p-6 sm:p-8 rounded-2xl bg-[#090b12] border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-300 shadow-xl space-y-5 group"
            >
              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 font-semibold">{item.category}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-300">{item.tag}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{item.readTime}</span>
                </div>
                <div className="text-slate-500">
                  Dispatch #{index + 1}
                </div>
              </div>

              {/* Title & Excerpt */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              {/* Deep Dive & Code Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Technical Analysis (Col 6) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
                    <div className="text-xs font-mono font-semibold text-indigo-400">
                      Engineering Mechanics &amp; Invariants:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {item.technicalDeepDive}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs font-mono text-indigo-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">Rule:</span>
                    <span>{item.architectureTakeaway}</span>
                  </div>
                </div>

                {/* Code Window (Col 6) */}
                <div className="lg:col-span-6 rounded-xl bg-[#050609] border border-white/[0.08] overflow-hidden shadow-lg">
                  <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{item.language.toLowerCase()}_implementation.{item.language === 'go' ? 'go' : item.language === 'sql' ? 'sql' : 'ts'}</span>
                    </div>
                    <button
                      onClick={() => copyCode(item.id, item.codeSnippet)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
                    >
                      {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                    <pre className="whitespace-pre">{item.codeSnippet}</pre>
                  </div>
                </div>

              </div>
            </article>
          ))}
        </div>

        {/* Loading Indicator & Sentinel for Infinite Scroll */}
        <div ref={sentinelRef} className="py-6 flex flex-col items-center justify-center space-y-3">
          {isLoadingMore ? (
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#090b14] border border-indigo-500/30 text-indigo-300 text-xs font-mono shadow-lg animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Synthesizing next technical dispatch via Gemini...</span>
            </div>
          ) : (
            <button
              onClick={fetchNextLogs}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-indigo-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all shadow-md group"
            >
              <span>Load More Systems Dispatches</span>
              <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            </button>
          )}
          <span className="text-[11px] text-slate-500 font-mono">
            {logs.length} Technical Dispatches Loaded · Seamless Infinite Scroll
          </span>
        </div>

      </div>
    </section>
  );
};
