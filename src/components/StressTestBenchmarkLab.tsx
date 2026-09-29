import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Activity, Cpu, Zap, CheckCircle2, Server, ArrowRight, BarChart3, AlertCircle } from 'lucide-react';
import { soundService } from '../services/sound';

type BenchmarkType = 'go-streaming' | 'postgis-spatial';

export const StressTestBenchmarkLab: React.FC = () => {
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkType>('go-streaming');
  const [concurrency, setConcurrency] = useState<number>(250);
  const [payloadSizeMB, setPayloadSizeMB] = useState<number>(25);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<{
    naiveTime: number;
    optimizedTime: number;
    naiveMem: number;
    optimizedMem: number;
    throughputReqSec: number;
    p95Latency: number;
    p99Latency: number;
    speedup: string;
    memReduction: string;
  } | null>(null);

  const runStressTest = () => {
    soundService.playClick(220, 0.04);
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsRunning(false);

      if (selectedBenchmark === 'go-streaming') {
        // Go HTTP 206 Partial Streaming vs Naive Buffering
        const naiveMem = Number(((payloadSizeMB * concurrency) / 10).toFixed(1));
        const optimizedMem = Number(((concurrency * 0.064) + 1.2).toFixed(1)); // 64KB per goroutine
        const naiveTime = Number((140 + concurrency * 0.45).toFixed(1));
        const optimizedTime = Number((8.2 + (concurrency * 0.03)).toFixed(1));
        const speedup = (naiveTime / optimizedTime).toFixed(1);
        const memReduction = (((naiveMem - optimizedMem) / naiveMem) * 100).toFixed(0);

        setResults({
          naiveTime,
          optimizedTime,
          naiveMem,
          optimizedMem,
          throughputReqSec: Math.round((concurrency / (optimizedTime / 1000)) * 1.8),
          p95Latency: Number((optimizedTime * 1.4).toFixed(1)),
          p99Latency: Number((optimizedTime * 2.1).toFixed(1)),
          speedup: `${speedup}x`,
          memReduction: `${memReduction}%`,
        });
      } else {
        // PostGIS GiST Index vs Sequential Scan (100k polygon records)
        const naiveTime = Number((98 + concurrency * 0.38).toFixed(1));
        const optimizedTime = Number((2.8 + concurrency * 0.008).toFixed(2));
        const naiveMem = Number((142 + concurrency * 0.12).toFixed(1));
        const optimizedMem = Number((18.4 + concurrency * 0.02).toFixed(1));
        const speedup = (naiveTime / optimizedTime).toFixed(1);
        const memReduction = (((naiveMem - optimizedMem) / naiveMem) * 100).toFixed(0);

        setResults({
          naiveTime,
          optimizedTime,
          naiveMem,
          optimizedMem,
          throughputReqSec: Math.round((concurrency / (optimizedTime / 1000)) * 2.4),
          p95Latency: Number((optimizedTime * 1.3).toFixed(2)),
          p99Latency: Number((optimizedTime * 1.8).toFixed(2)),
          speedup: `${speedup}x`,
          memReduction: `${memReduction}%`,
        });
      }

      soundService.playSuccess();
    }, 700);
  };

  // Run automatically on first mount
  useEffect(() => {
    runStressTest();
  }, [selectedBenchmark]);

  return (
    <div className="rounded-2xl bg-[#090b12] border border-white/[0.08] p-5 sm:p-7 shadow-2xl space-y-6">
      
      {/* Header & Scenario Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Telemetry &amp; Stress-Test Runner</span>
          </div>
          <h3 className="text-xl font-bold text-white font-display mt-1">
            Production Systems Benchmark Lab
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate real-time concurrent loads comparing standard implementations against Christian's optimized systems.
          </p>
        </div>

        {/* Benchmark Scenario Selector */}
        <div className="flex items-center p-1 rounded-xl bg-[#05060a] border border-white/[0.08] self-start sm:self-auto">
          <button
            onClick={() => setSelectedBenchmark('go-streaming')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors font-mono ${
              selectedBenchmark === 'go-streaming'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Go HTTP 206 vs Buffer
          </button>
          <button
            onClick={() => setSelectedBenchmark('postgis-spatial')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors font-mono ${
              selectedBenchmark === 'postgis-spatial'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PostGIS GiST vs Scan
          </button>
        </div>
      </div>

      {/* Sliders Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Concurrency Slider */}
        <div className="md:col-span-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Concurrent Workers:</span>
            <span className="text-white font-bold">{concurrency} goroutines</span>
          </div>
          <input
            type="range"
            min="20"
            max="1000"
            step="20"
            value={concurrency}
            onChange={(e) => setConcurrency(Number(e.target.value))}
            disabled={isRunning}
            className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>20</span>
            <span>250 (Mid)</span>
            <span>500</span>
            <span>1,000 (Stress)</span>
          </div>
        </div>

        {/* Payload / Records Slider */}
        <div className="md:col-span-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              {selectedBenchmark === 'go-streaming' ? 'Media File Size:' : 'Polygon Dataset:'}
            </span>
            <span className="text-white font-bold">
              {selectedBenchmark === 'go-streaming' ? `${payloadSizeMB} MB` : '100,000 Polygons'}
            </span>
          </div>
          {selectedBenchmark === 'go-streaming' ? (
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={payloadSizeMB}
              onChange={(e) => setPayloadSizeMB(Number(e.target.value))}
              disabled={isRunning}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
          ) : (
            <div className="h-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 overflow-hidden">
              <div className="h-full bg-indigo-500 w-full animate-pulse" />
            </div>
          )}
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{selectedBenchmark === 'go-streaming' ? '5 MB' : '25k records'}</span>
            <span>{selectedBenchmark === 'go-streaming' ? '50 MB' : '50k records'}</span>
            <span>{selectedBenchmark === 'go-streaming' ? '100 MB' : '100k records'}</span>
          </div>
        </div>

        {/* Run Button */}
        <div className="md:col-span-4 flex items-center gap-3">
          <button
            onClick={runStressTest}
            disabled={isRunning}
            className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all ${
              isRunning
                ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25'
            }`}
          >
            {isRunning ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                <span>Running Simulation ({progress}%)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Execute Stress Benchmark</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Live Benchmark Visual Comparison Cards */}
      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Card 1: Standard / Naive System */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#06070d] border border-red-500/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-xs font-mono font-semibold text-red-300">
                  {selectedBenchmark === 'go-streaming'
                    ? 'Baseline: In-Memory io.ReadAll Buffering'
                    : 'Baseline: PostgreSQL Sequential Full Scan'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Unoptimized</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[11px] text-slate-400 font-mono">Response Latency</div>
                <div className="text-2xl font-bold text-red-400 font-mono tabular-nums mt-0.5">
                  {results.naiveTime} ms
                </div>
                <div className="text-[10px] text-slate-500">Time to first byte under load</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-mono">Heap Allocation</div>
                <div className="text-2xl font-bold text-red-400 font-mono tabular-nums mt-0.5">
                  {results.naiveMem} MB
                </div>
                <div className="text-[10px] text-slate-500">Memory footprint in RAM</div>
              </div>
            </div>

            {/* Simulated Latency Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Latency Burden</span>
                <span>100% (High Latency)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full w-full" />
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 pt-1">
              {selectedBenchmark === 'go-streaming'
                ? '⚠️ Reads entire media payload into memory before streaming; risks OOM panic under high concurrency.'
                : '⚠️ Scans all 100k polygon geometry rows sequentially; high disk I/O cost.'}
            </div>
          </div>

          {/* Card 2: Christian's Optimized Architecture */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#06070d] border border-emerald-500/30 space-y-4 shadow-lg shadow-emerald-500/5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-semibold text-emerald-300">
                  {selectedBenchmark === 'go-streaming'
                    ? 'Christian Amos: Go HTTP 206 Zero-Copy'
                    : 'Christian Amos: PostGIS Spatial GiST Index'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold">
                <span>{results.speedup} Faster</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[11px] text-slate-400 font-mono">Response Latency</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
                  {results.optimizedTime} ms
                </div>
                <div className="text-[10px] text-emerald-300/80">Immediate byte-range start</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-mono">Heap Allocation</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
                  {results.optimizedMem} MB
                </div>
                <div className="text-[10px] text-emerald-300/80">
                  -{results.memReduction} RAM Reduction
                </div>
              </div>
            </div>

            {/* Simulated Latency Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Latency Burden</span>
                <span className="text-emerald-400">
                  {((results.optimizedTime / results.naiveTime) * 100).toFixed(1)}% (Near-Zero)
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(4, (results.optimizedTime / results.naiveTime) * 100)}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] font-mono text-emerald-300/90 pt-1">
              {selectedBenchmark === 'go-streaming'
                ? '✓ Streams 64KB TCP chunks directly via io.CopyN; bounded heap overhead regardless of file size.'
                : '✓ Utilizes R-Tree GiST index spatial bounding boxes; sub-10ms bounding intersection.'}
            </div>
          </div>

        </div>
      )}

      {/* Production Telemetry Strip */}
      {results && (
        <div className="pt-2 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="text-slate-500 text-[11px]">System Throughput</div>
            <div className="text-white font-bold text-base mt-0.5">{results.throughputReqSec.toLocaleString()} req/s</div>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="text-slate-500 text-[11px]">p95 Tail Latency</div>
            <div className="text-white font-bold text-base mt-0.5">{results.p95Latency} ms</div>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="text-slate-500 text-[11px]">p99 Tail Latency</div>
            <div className="text-white font-bold text-base mt-0.5">{results.p99Latency} ms</div>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="text-slate-500 text-[11px]">Simulated Error Rate</div>
            <div className="text-emerald-400 font-bold text-base mt-0.5">0.00% (No Drops)</div>
          </div>
        </div>
      )}

    </div>
  );
};
