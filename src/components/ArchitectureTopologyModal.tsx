import React, { useState, useEffect } from 'react';
import { X, Layers, Network, Database, Server, Cpu, ShieldCheck, ArrowRight, CheckCircle2, Copy, Check, Flame, Activity } from 'lucide-react';
import { FeaturedProject } from '../types/github';
import { soundService } from '../services/sound';

interface ArchitectureTopologyModalProps {
  project: FeaturedProject | null;
  isOpen: boolean;
  onClose: () => void;
}

type DiagramMode = 'topology' | 'dataflow' | 'schema' | 'chaos';

interface ChaosLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export const ArchitectureTopologyModal: React.FC<ArchitectureTopologyModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [activeMode, setActiveMode] = useState<DiagramMode>('topology');
  const [copiedContract, setCopiedContract] = useState(false);

  // Chaos Lab States
  const [redisDown, setRedisDown] = useState(false);
  const [highLatency, setHighLatency] = useState(false);
  const [s3Throttled, setS3Throttled] = useState(false);
  const [packetTracing, setPacketTracing] = useState(false);
  const [packetStep, setPacketStep] = useState<number>(0);
  const [chaosLogs, setChaosLogs] = useState<ChaosLog[]>([
    { timestamp: '00:00.012', level: 'info', message: 'System baseline initialized: All health checks green.' },
    { timestamp: '00:00.084', level: 'info', message: 'Redis cluster connected: 3 nodes / sub-millisecond keyspace.' },
    { timestamp: '00:00.120', level: 'info', message: 'PostGIS GiST R-Tree index verified: warm cache hit ratio 99.8%.' },
  ]);

  // Packet animation loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (packetTracing) {
      interval = setInterval(() => {
        setPacketStep((prev) => {
          const next = (prev + 1) % 4;
          if (next === 0) soundService.playClick(220, 0.02);
          else if (next === 1) soundService.playClick(280, 0.02);
          else if (next === 2) soundService.playClick(340, 0.02);
          else soundService.playClick(440, 0.03);
          return next;
        });
      }, highLatency ? 1200 : 600);
    } else {
      setPacketStep(0);
    }
    return () => clearInterval(interval);
  }, [packetTracing, highLatency]);

  const addChaosLog = (level: 'info' | 'warn' | 'error' | 'success', message: string) => {
    const now = new Date();
    const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    setChaosLogs((prev) => [...prev.slice(-9), { timestamp: timeStr, level, message }]);
  };

  const toggleRedis = () => {
    const next = !redisDown;
    setRedisDown(next);
    if (next) {
      soundService.playAlert();
      addChaosLog('error', 'CHAOS INJECTION: Redis primary severed connection! Simulating connection timeout.');
      setTimeout(() => {
        addChaosLog('warn', 'Circuit breaker tripped [RedisCachePool]. State changed to OPEN.');
        addChaosLog('success', 'Fallback activated: Diverting queries to PostgreSQL read-replica with serialized snapshot.');
      }, 350);
    } else {
      soundService.playSuccess();
      addChaosLog('success', 'RECOVERY: Redis cluster heartbeat restored. Health check OK. Circuit closed.');
    }
  };

  const toggleLatency = () => {
    const next = !highLatency;
    setHighLatency(next);
    if (next) {
      soundService.playAlert();
      addChaosLog('warn', 'NETWORK CHAOS: Injected 250ms WAN packet delay across TCP stream.');
      setTimeout(() => {
        addChaosLog('info', 'Go TCP streaming handler adapting: Scaled sliding window down to 32KB buffer.');
      }, 300);
    } else {
      soundService.playSuccess();
      addChaosLog('success', 'NETWORK RECOVERY: WAN latency normalized (< 12ms). TCP window restored.');
    }
  };

  const toggleS3 = () => {
    const next = !s3Throttled;
    setS3Throttled(next);
    if (next) {
      soundService.playAlert();
      addChaosLog('error', 'STORAGE CHAOS: MinIO S3 responding with 503 SlowDown / Byte-Range seek stalls.');
      setTimeout(() => {
        addChaosLog('warn', 'Fallback activated: Exponential backoff with jitter applied (attempt 1/3, wait 48ms).');
        addChaosLog('success', 'Served fallback stream chunk from local in-memory ring-buffer without drop.');
      }, 400);
    } else {
      soundService.playSuccess();
      addChaosLog('success', 'STORAGE RECOVERY: MinIO cluster recovered. All 206 partial responses optimal.');
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#0059e8]">
              <Layers className="w-3.5 h-3.5" />
              <span>Architectural Blueprint &amp; Systems Lab</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              {project.title} · System Topology
            </h2>
            <p className="text-xs text-slate-700 font-mono font-medium">
              {project.category} · Inspect data flow contracts, caching tiers, and live fault injection.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 w-fit">
          <button
            onClick={() => {
              setActiveMode('topology');
              soundService.playClick(200, 0.02);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
              activeMode === 'topology'
                ? 'bg-[#0059e8] text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Block Topology</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('dataflow');
              soundService.playClick(220, 0.02);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
              activeMode === 'dataflow'
                ? 'bg-[#0059e8] text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Data Flow Pipeline</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('schema');
              soundService.playClick(240, 0.02);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
              activeMode === 'schema'
                ? 'bg-[#0059e8] text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Entity &amp; Index Schema</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('chaos');
              soundService.playClick(260, 0.02);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
              activeMode === 'chaos'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-rose-700 hover:text-rose-900 hover:bg-rose-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Chaos &amp; Packet Lab</span>
          </button>
        </div>

        {/* Dynamic Diagram Views */}
        {activeMode === 'topology' && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/90 space-y-6">
              
              {/* Tier 1: Clients */}
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center w-64 shadow-xs">
                  <div className="text-xs font-mono font-bold text-[#0059e8]">Client Layer</div>
                  <div className="text-[11px] text-slate-900 font-semibold">Web Browser &amp; Mobile Clients</div>
                  <div className="text-[10px] text-slate-700 font-mono font-medium mt-0.5">HTTP/2 · WebSockets (RFC 6455)</div>
                </div>
                <div className="w-0.5 h-6 bg-blue-300" />
              </div>

              {/* Tier 2: Edge & Core Engine */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white border border-slate-200/90 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-mono text-[#0059e8] font-bold">
                    <span>Edge Proxy &amp; Auth</span>
                    <span className="text-[10px] text-emerald-800 font-bold">&lt; 1ms</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">Reverse Proxy &amp; Rate Limiter</div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    Validates JWT tokens, parses HTTP Range headers, and enforces IP bucket rate limits.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white border border-blue-200 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-mono text-[#0059e8] font-bold">
                    <span>Core Service Engine</span>
                    <span className="text-[10px] text-emerald-800 font-bold">Go / Next.js</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">Microservice Engine</div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    Zero-copy byte streaming via io.CopyN, transactional concurrency locks, and deterministic routing.
                  </p>
                </div>
              </div>

              {/* Connectors */}
              <div className="flex justify-around">
                <div className="w-0.5 h-6 bg-slate-400" />
                <div className="w-0.5 h-6 bg-slate-400" />
              </div>

              {/* Tier 3: Data & Storage Tiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-lg bg-white border border-slate-200/90 space-y-1 shadow-xs">
                  <div className="text-xs font-mono text-emerald-800 flex items-center gap-1 font-bold">
                    <Database className="w-3.5 h-3.5" />
                    <span>PostgreSQL / PostGIS</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">Transactional Store</div>
                  <div className="text-[11px] text-slate-700 font-medium">GiST spatial index, ACID serializable locks</div>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-slate-200/90 space-y-1 shadow-xs">
                  <div className="text-xs font-mono text-[#0059e8] flex items-center gap-1 font-bold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Redis Cache</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">In-Memory Pub/Sub</div>
                  <div className="text-[11px] text-slate-700 font-medium">WebSocket broadcast clusters, sub-millisecond keys</div>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-slate-200/90 space-y-1 shadow-xs">
                  <div className="text-xs font-mono text-sky-800 flex items-center gap-1 font-bold">
                    <Server className="w-3.5 h-3.5" />
                    <span>MinIO / S3 Object Store</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">Binary Media Storage</div>
                  <div className="text-[11px] text-slate-700 font-medium">HTTP 206 byte-range seek targets</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeMode === 'dataflow' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-4 font-mono text-xs">
              <div className="text-slate-600 text-[11px] pb-2 border-b border-slate-200 font-medium">
                Sequential Execution Flow · Client Request to Binary Byte-Stream Delivery
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0059e8] font-bold">01</span>
                  <div>
                    <div className="text-slate-900 font-semibold font-sans">Client Range Request</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      GET /stream/audio_track_01.mp3 with header `Range: bytes=1048576-2097151`
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0059e8] font-bold">02</span>
                  <div>
                    <div className="text-slate-900 font-semibold font-sans">Offset Parsing &amp; Verification</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      Go handler parses start and end bytes, verifying byte offsets against MinIO S3 object metadata.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0059e8] font-bold">03</span>
                  <div>
                    <div className="text-slate-900 font-semibold font-sans">Zero-Copy Chunk Streaming (io.CopyN)</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      Streamer sends HTTP 206 Partial Content, piping 64KB TCP packet windows directly to client socket.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">04</span>
                  <div>
                    <div className="text-slate-900 font-semibold font-sans">Socket ACK &amp; Heap Reclaim</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
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
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-4">
              <div className="text-slate-600 text-xs font-mono pb-2 border-b border-slate-200 font-medium">
                PostgreSQL Schema Definition &amp; Spatial GiST Index
              </div>

              <div className="rounded-lg bg-slate-950 border border-slate-800 p-4 overflow-x-auto text-xs font-mono text-slate-200 shadow-xs">
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

        {/* Chaos Engineering & Packet Tracer Simulator */}
        {activeMode === 'chaos' && (
          <div className="space-y-4">
            {/* Chaos Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <button
                onClick={toggleRedis}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                  redisDown
                    ? 'bg-rose-50 border-rose-400 text-rose-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold">Redis Cluster</span>
                  <span className={`w-2 h-2 rounded-full ${redisDown ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                </div>
                <div className="text-xs font-bold mt-1">{redisDown ? 'Severed (Killed)' : 'Online (Healthy)'}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">Click to toggle crash</div>
              </button>

              <button
                onClick={toggleLatency}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                  highLatency
                    ? 'bg-amber-50 border-amber-400 text-amber-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold">WAN Jitter</span>
                  <span className={`w-2 h-2 rounded-full ${highLatency ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                </div>
                <div className="text-xs font-bold mt-1">{highLatency ? '+250ms Injected' : '< 12ms Normal'}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">Click to inject lag</div>
              </button>

              <button
                onClick={toggleS3}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                  s3Throttled
                    ? 'bg-rose-50 border-rose-400 text-rose-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold">MinIO S3 Store</span>
                  <span className={`w-2 h-2 rounded-full ${s3Throttled ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                </div>
                <div className="text-xs font-bold mt-1">{s3Throttled ? '503 SlowDown' : 'Optimal'}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">Click to throttle</div>
              </button>

              <button
                onClick={() => {
                  soundService.playClick(240, 0.02);
                  setPacketTracing(!packetTracing);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                  packetTracing
                    ? 'bg-blue-50 border-blue-400 text-[#0059e8]'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold">Packet Tracer</span>
                  <Activity className={`w-3.5 h-3.5 ${packetTracing ? 'text-[#0059e8] animate-spin' : 'text-slate-400'}`} />
                </div>
                <div className="text-xs font-bold mt-1">{packetTracing ? 'Tracer ACTIVE' : 'Tracer IDLE'}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">Click to start trace</div>
              </button>
            </div>

            {/* Visual Live Packet Flow Stage */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-700 font-bold">
                <span>Active Packet Path</span>
                <span className="text-[#0059e8] font-bold">
                  {packetTracing ? `Tracing Step ${packetStep + 1} / 4` : 'Press "Packet Tracer" to animate'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className={`p-2.5 rounded-lg border transition-all ${packetStep === 0 && packetTracing ? 'bg-[#0059e8] text-white font-bold shadow-md scale-102' : 'bg-white border-slate-200 text-slate-700'}`}>
                  <div className="text-[10px] opacity-80">01. INGRESS</div>
                  <div className="font-bold text-xs truncate">Client Range</div>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${packetStep === 1 && packetTracing ? 'bg-[#0059e8] text-white font-bold shadow-md scale-102' : 'bg-white border-slate-200 text-slate-700'}`}>
                  <div className="text-[10px] opacity-80">02. EDGE</div>
                  <div className="font-bold text-xs truncate">Token Check</div>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${packetStep === 2 && packetTracing ? 'bg-[#0059e8] text-white font-bold shadow-md scale-102' : 'bg-white border-slate-200 text-slate-700'}`}>
                  <div className="text-[10px] opacity-80">03. GO CORE</div>
                  <div className="font-bold text-xs truncate">io.CopyN (64KB)</div>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${packetStep === 3 && packetTracing ? 'bg-emerald-600 text-white font-bold shadow-md scale-102' : 'bg-white border-slate-200 text-slate-700'}`}>
                  <div className="text-[10px] opacity-80">04. STORAGE</div>
                  <div className="font-bold text-xs truncate">{redisDown ? 'PostgreSQL Fallback' : 'S3 / Cache'}</div>
                </div>
              </div>
            </div>

            {/* Real-Time Failover Telemetry Logs */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-300">
                <span className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Chaos Engine Circuit Breaker Telemetry</span>
                </span>
                <span className="text-slate-400 text-[10px]">Auto-recovering</span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto font-mono text-[11px]">
                {chaosLogs.map((log, lIdx) => (
                  <div key={lIdx} className="flex items-start gap-2">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span className={`shrink-0 font-bold ${
                      log.level === 'error' ? 'text-rose-400' :
                      log.level === 'warn' ? 'text-amber-400' :
                      log.level === 'success' ? 'text-emerald-400' : 'text-sky-300'
                    }`}>
                      {log.level.toUpperCase()}:
                    </span>
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Notes */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-600">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zone01 Defended Systems Architecture</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0059e8] hover:bg-[#0048c4] text-white transition-colors cursor-pointer shadow-xs font-sans font-medium"
          >
            Close Blueprint
          </button>
        </div>

      </div>
    </div>
  );
};
