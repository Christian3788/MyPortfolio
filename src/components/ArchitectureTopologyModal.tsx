import React, { useState } from 'react';
import { X, Layers, Network, Database, Server, Cpu, ShieldCheck, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react';
import { FeaturedProject } from '../types/github';

interface ArchitectureTopologyModalProps {
  project: FeaturedProject | null;
  isOpen: boolean;
  onClose: () => void;
}

type DiagramMode = 'topology' | 'dataflow' | 'schema';

export const ArchitectureTopologyModal: React.FC<ArchitectureTopologyModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [activeMode, setActiveMode] = useState<DiagramMode>('topology');
  const [copiedContract, setCopiedContract] = useState(false);

  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-[#0c0e15] border border-white/[0.12] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <Layers className="w-3.5 h-3.5" />
              <span>Architectural Blueprint &amp; Topology</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-display">
              {project.title} · System Topology
            </h2>
            <p className="text-xs text-slate-400">
              {project.category} · Inspect data flow contracts, caching tiers, and schema design.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#06070d] border border-white/[0.06] w-fit">
          <button
            onClick={() => setActiveMode('topology')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
              activeMode === 'topology'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Block Topology</span>
          </button>

          <button
            onClick={() => setActiveMode('dataflow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
              activeMode === 'dataflow'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Data Flow Pipeline</span>
          </button>

          <button
            onClick={() => setActiveMode('schema')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
              activeMode === 'schema'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Entity &amp; Index Schema</span>
          </button>
        </div>

        {/* Dynamic Diagram Views */}
        {activeMode === 'topology' && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-[#06070c] border border-white/[0.08] space-y-6">
              
              {/* Tier 1: Clients */}
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/40 text-center w-64 shadow-lg">
                  <div className="text-xs font-mono font-semibold text-indigo-300">Client Layer</div>
                  <div className="text-[11px] text-slate-300">Web Browser &amp; Mobile Clients</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">HTTP/2 · WebSockets (RFC 6455)</div>
                </div>
                <div className="w-0.5 h-6 bg-indigo-500/40" />
              </div>

              {/* Tier 2: Edge & Core Engine */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-indigo-400">
                    <span>Edge Proxy &amp; Auth</span>
                    <span className="text-[10px] text-emerald-400">&lt; 1ms</span>
                  </div>
                  <div className="text-sm font-semibold text-white">Reverse Proxy &amp; Rate Limiter</div>
                  <p className="text-xs text-slate-400">
                    Validates JWT tokens, parses HTTP Range headers, and enforces IP bucket rate limits.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/[0.02] border border-indigo-500/30 space-y-2 shadow-lg shadow-indigo-600/5">
                  <div className="flex items-center justify-between text-xs font-mono text-indigo-400">
                    <span>Core Service Engine</span>
                    <span className="text-[10px] text-emerald-400">Go / Next.js</span>
                  </div>
                  <div className="text-sm font-semibold text-white">Microservice Engine</div>
                  <p className="text-xs text-slate-400">
                    Zero-copy byte streaming via io.CopyN, transactional concurrency locks, and deterministic routing.
                  </p>
                </div>
              </div>

              {/* Connectors */}
              <div className="flex justify-around">
                <div className="w-0.5 h-6 bg-white/[0.1]" />
                <div className="w-0.5 h-6 bg-white/[0.1]" />
              </div>

              {/* Tier 3: Data & Storage Tiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Database className="w-3.5 h-3.5" />
                    <span>PostgreSQL / PostGIS</span>
                  </div>
                  <div className="text-xs font-semibold text-white">Transactional Store</div>
                  <div className="text-[11px] text-slate-400">GiST spatial index, ACID serializable locks</div>
                </div>

                <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <div className="text-xs font-mono text-indigo-400 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Redis Cache</span>
                  </div>
                  <div className="text-xs font-semibold text-white">In-Memory Pub/Sub</div>
                  <div className="text-[11px] text-slate-400">WebSocket broadcast clusters, sub-millisecond keys</div>
                </div>

                <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <div className="text-xs font-mono text-sky-400 flex items-center gap-1">
                    <Server className="w-3.5 h-3.5" />
                    <span>MinIO / S3 Object Store</span>
                  </div>
                  <div className="text-xs font-semibold text-white">Binary Media Storage</div>
                  <div className="text-[11px] text-slate-400">HTTP 206 byte-range seek targets</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeMode === 'dataflow' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#06070c] border border-white/[0.08] space-y-4 font-mono text-xs">
              <div className="text-slate-400 text-[11px] pb-2 border-b border-white/[0.06]">
                Sequential Execution Flow · Client Request to Binary Byte-Stream Delivery
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 font-bold">01</span>
                  <div>
                    <div className="text-white font-semibold">Client Range Request</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      GET /stream/audio_track_01.mp3 with header `Range: bytes=1048576-2097151`
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 font-bold">02</span>
                  <div>
                    <div className="text-white font-semibold">Offset Parsing &amp; Verification</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Go handler parses start and end bytes, verifying byte offsets against MinIO S3 object metadata.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 font-bold">03</span>
                  <div>
                    <div className="text-white font-semibold">Zero-Copy Chunk Streaming (io.CopyN)</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Streamer sends HTTP 206 Partial Content, piping 64KB TCP packet windows directly to client socket.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300 font-bold">04</span>
                  <div>
                    <div className="text-white font-semibold">Socket ACK &amp; Heap Reclaim</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Kernel transmits bytes; Go runtime recycles 64KB slice into sync.Pool with 0 GC overhead.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMode === 'schema' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#06070c] border border-white/[0.08] space-y-4">
              <div className="text-slate-400 text-xs font-mono pb-2 border-b border-white/[0.06]">
                PostgreSQL Schema Definition &amp; Spatial GiST Index
              </div>

              <div className="rounded-lg bg-[#040509] border border-white/[0.06] p-4 overflow-x-auto text-xs font-mono text-slate-300">
                <pre className="whitespace-pre">
{`-- Production PostgreSQL Schema & Spatial Partitioning
CREATE TABLE spatial_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    owner_id VARCHAR(64) NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL,
    status VARCHAR(32) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generalized Search Tree (GiST) Spatial Indexing
CREATE INDEX idx_spatial_assets_gist 
ON spatial_assets USING GIST (geom);

-- Composite Index for Fast Multi-tenant Queries
CREATE INDEX idx_spatial_assets_tenant_status 
ON spatial_assets (owner_id, status);`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Footer Notes */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zone01 Defended Systems Architecture</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white transition-colors"
          >
            Close Blueprint
          </button>
        </div>

      </div>
    </div>
  );
};
