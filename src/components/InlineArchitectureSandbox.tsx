import React, { useState, useEffect } from 'react';
import {
  Flame,
  Activity,
  Layers,
  ArrowRight,
  Maximize2,
  RefreshCw,
  Zap,
  Server,
  Database,
  Radio,
  HardDrive,
  Cpu,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { soundService } from '../services/sound';
import { FeaturedProject } from '../types/github';

interface InlineArchitectureSandboxProps {
  onOpenTopologyModal?: (project: FeaturedProject) => void;
  featuredProjects: FeaturedProject[];
}

interface TopoNode {
  id: string;
  name: string;
  role: string;
  type: 'gateway' | 'worker' | 'storage' | 'database' | 'cache' | 'client';
  status: 'nominal' | 'degraded' | 'rerouted';
  metrics: string;
}

export const InlineArchitectureSandbox: React.FC<InlineArchitectureSandboxProps> = ({
  onOpenTopologyModal,
  featuredProjects,
}) => {
  const [selectedSystem, setSelectedSystem] = useState<'lyric' | 'spatial'>('lyric');
  const [chaosActive, setChaosActive] = useState(false);
  const [packetTracing, setPacketTracing] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [inspectedNode, setInspectedNode] = useState<string | null>('gateway');

  // Switch systems
  const currentProject =
    selectedSystem === 'lyric'
      ? featuredProjects[0] || { id: 'lyric', title: 'LYRIC Media Engine' }
      : featuredProjects[1] || { id: 'spatial', title: 'Spatial Risk Engine' };

  const lyricNodes: TopoNode[] = [
    {
      id: 'client',
      name: 'Client Browser / WebSocket',
      role: 'Range Header Request (bytes=0-1048576)',
      type: 'client',
      status: 'nominal',
      metrics: 'TCP Keep-Alive · RTT 12ms',
    },
    {
      id: 'gateway',
      name: 'Go 1.22 HTTP/2 Gateway',
      role: 'Range Parser & Epoll Event Loop',
      type: 'gateway',
      status: 'nominal',
      metrics: '24,500 conn/s · 0.2% CPU',
    },
    {
      id: 'ringbuffer',
      name: 'Sync.Pool Bounded Buffer',
      role: 'Zero-Copy io.CopyBuffer (64KB chunks)',
      type: 'cache',
      status: chaosActive ? 'degraded' : 'nominal',
      metrics: chaosActive ? 'Failover: Reallocated 64KB' : 'Heap Alloc: 0 bytes (reused)',
    },
    {
      id: 'storage',
      name: 'MinIO S3 / NVMe RAID-0',
      role: 'Direct io.SectionReader Disk Seek',
      type: 'storage',
      status: chaosActive ? 'rerouted' : 'nominal',
      metrics: chaosActive ? 'Replica B active (p99 1.4ms)' : 'Primary Disk IO: 420 MB/s',
    },
  ];

  const spatialNodes: TopoNode[] = [
    {
      id: 'client',
      name: 'Field IoT Geofence Ping',
      role: 'WGS84 GPS (Lat/Lon) 10Hz Feed',
      type: 'client',
      status: 'nominal',
      metrics: 'UDP Telemetry · 10,000 pings/s',
    },
    {
      id: 'gateway',
      name: 'Go Ingestion Pipeline',
      role: 'Kafka Batcher & Coordinate Validator',
      type: 'gateway',
      status: 'nominal',
      metrics: 'Sub-1ms JSON decode',
    },
    {
      id: 'cache',
      name: 'Redis GeoSpatial Ring',
      role: 'GEOSEARCH L1 Radius Filter (500m)',
      type: 'cache',
      status: chaosActive ? 'degraded' : 'nominal',
      metrics: chaosActive ? 'Cache Miss -> Bypassing to DB' : 'Hit Ratio: 94.2%',
    },
    {
      id: 'database',
      name: 'PostgreSQL 16 + PostGIS',
      role: 'GiST 2D R-Tree Hilbert Clustered Scan',
      type: 'database',
      status: 'nominal',
      metrics: chaosActive ? 'Latency 3.12ms under failover' : 'Indexed Exec Time: 2.8ms',
    },
  ];

  const currentNodes = selectedSystem === 'lyric' ? lyricNodes : spatialNodes;

  // Packet tracing animation loop
  useEffect(() => {
    if (!packetTracing) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % currentNodes.length);
      soundService.playClick(280 + activeStep * 40, 0.015);
    }, 600);
    return () => clearInterval(interval);
  }, [packetTracing, currentNodes.length, activeStep]);

  const toggleChaos = () => {
    const next = !chaosActive;
    setChaosActive(next);
    if (next) {
      soundService.playAlert();
    } else {
      soundService.playSuccess();
    }
  };

  const triggerPacketTrace = () => {
    soundService.playClick(320, 0.02);
    setPacketTracing((prev) => !prev);
  };

  const selectedNodeData = currentNodes.find((n) => n.id === inspectedNode) || currentNodes[1];

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
      {/* Top Header / Switcher Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-lg bg-[#0059e8]/30 border border-[#0059e8]/50 text-blue-300">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold font-display tracking-tight text-white">
                Live Systems Architecture &amp; Chaos Workbench
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                INTERACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Inspect data pipelines, trace byte allocations, or inject synthetic failure modes in real time.
            </p>
          </div>
        </div>

        {/* System Selector Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundService.playClick(200, 0.02);
              setSelectedSystem('lyric');
              setChaosActive(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              selectedSystem === 'lyric'
                ? 'bg-[#0059e8] text-white shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-slate-300'
            }`}
          >
            01. LYRIC (Go HTTP 206)
          </button>
          <button
            onClick={() => {
              soundService.playClick(200, 0.02);
              setSelectedSystem('spatial');
              setChaosActive(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              selectedSystem === 'spatial'
                ? 'bg-[#0059e8] text-white shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-slate-300'
            }`}
          >
            02. PostGIS Spatial Engine
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          {/* Chaos Switch */}
          <button
            onClick={toggleChaos}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer border ${
              chaosActive
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm animate-pulse'
                : 'bg-white text-rose-700 hover:bg-rose-50 border-rose-300'
            }`}
            title="Inject simulated latency and packet drop fault"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{chaosActive ? 'Fault Injected (Failover Active)' : 'Inject Chaos Fault'}</span>
          </button>

          {/* Packet Tracer Button */}
          <button
            onClick={triggerPacketTrace}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-semibold transition-all cursor-pointer border ${
              packetTracing
                ? 'bg-[#0059e8] text-white border-[#0048c4]'
                : 'bg-white text-slate-700 hover:text-[#0059e8] border-slate-300 hover:border-blue-300'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${packetTracing ? 'animate-spin' : ''}`} />
            <span>{packetTracing ? 'Tracing Packets...' : 'Trace Data Packets'}</span>
          </button>
        </div>

        {/* Modal Deep Dive Expand */}
        {onOpenTopologyModal && (
          <button
            onClick={() => {
              soundService.playClick(240, 0.02);
              onOpenTopologyModal(currentProject as FeaturedProject);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-slate-800 hover:text-[#0059e8] bg-white hover:bg-blue-50/60 border border-slate-300 rounded-lg transition-colors font-mono font-medium cursor-pointer shadow-2xs"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#0059e8]" />
            <span>Launch Fullscreen Topology Lab</span>
          </button>
        )}
      </div>

      {/* Visual Topology DAG Interactive Canvas */}
      <div className="p-6 bg-slate-900 text-slate-100 relative overflow-hidden">
        {/* Ambient Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" 
        />

        <div className="relative z-10 space-y-6">
          {/* Node Flow Representation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {currentNodes.map((node, idx) => {
              const isInspected = inspectedNode === node.id;
              const isCurrentTraceStep = packetTracing && activeStep === idx;
              const isFailedNode = chaosActive && (node.type === 'storage' || node.type === 'cache');

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    soundService.playClick(220, 0.015);
                    setInspectedNode(node.id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                    isInspected
                      ? 'bg-slate-800/90 border-[#0059e8] ring-2 ring-[#0059e8]/50 shadow-lg'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-slate-500'
                  } ${isCurrentTraceStep ? 'ring-2 ring-emerald-400 bg-emerald-950/30' : ''}`}
                >
                  {/* Step Sequence Badge */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-700/60">
                    <div className="flex items-center gap-1.5">
                      {node.type === 'gateway' && <Cpu className="w-3.5 h-3.5 text-blue-400" />}
                      {node.type === 'storage' && <HardDrive className="w-3.5 h-3.5 text-amber-400" />}
                      {node.type === 'database' && <Database className="w-3.5 h-3.5 text-emerald-400" />}
                      {node.type === 'cache' && <Zap className="w-3.5 h-3.5 text-sky-400" />}
                      {node.type === 'client' && <Radio className="w-3.5 h-3.5 text-purple-400" />}
                      <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                        Node 0{idx + 1}
                      </span>
                    </div>

                    {isFailedNode ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>FAILOVER</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>HEALTHY</span>
                      </span>
                    )}
                  </div>

                  <div className="py-3 space-y-1">
                    <h5 className="text-sm font-bold text-white font-mono group-hover:text-blue-300 transition-colors">
                      {node.name}
                    </h5>
                    <p className="text-xs text-slate-300 leading-snug">
                      {node.role}
                    </p>
                  </div>

                  {/* Telemetry Footer */}
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                    <span className="truncate">{node.metrics}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </div>

                  {/* Packet tracer indicator */}
                  {isCurrentTraceStep && (
                    <div className="absolute -top-1.5 right-4 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[9px] font-extrabold shadow-md animate-bounce">
                      PACKET ARRIVED
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Node Detail Inspector Banner */}
          <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#0059e8] uppercase">
                  Inspected Node:
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {selectedNodeData.name}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                {selectedNodeData.role} — Under load, allocations are held static via reuse rings, preventing Stop-The-World GC pauses.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-300 shrink-0">
              <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">THROUGHPUT:</span>
                <span className="text-emerald-400 font-bold">24,500 req/s</span>
              </div>
              <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">p99 LATENCY:</span>
                <span className="text-blue-300 font-bold">2.41 ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
