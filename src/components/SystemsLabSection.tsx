import React, { useState } from 'react';
import { Cpu, Zap, Activity, HardDrive, Terminal, Play, RotateCcw, Check, AlertCircle, Sparkles, Layers } from 'lucide-react';
import { soundService } from '../services/sound';
import { StressTestBenchmarkLab } from './StressTestBenchmarkLab';

export const SystemsLabSection: React.FC = () => {
  // === 1. SIMD Benchmark State ===
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState<{
    jsTime: number;
    optTime: number;
    speedup: string;
    iterations: number;
  } | null>(null);

  // === 2. Bloom Filter State ===
  const [bloomArray, setBloomArray] = useState<number[]>(() =>
    Array.from({ length: 32 }, (_, i) => (i === 4 || i === 12 || i === 23 ? 1 : 0))
  );
  const [bloomInput, setBloomInput] = useState<string>('auth_token_hash');
  const [bloomMatch, setBloomMatch] = useState<boolean | null>(null);

  // === 3. Memory Heap State ===
  const [memoryHeap, setMemoryHeap] = useState<Array<{ id: number; allocated: boolean; size: number }>>(
    () => Array.from({ length: 32 }, (_, i) => ({ id: i, allocated: i % 5 === 0 || i % 7 === 0, size: 64 }))
  );
  const [lastMalloc, setLastMalloc] = useState<string>('0x0480');

  // === 4. Go Channel State ===
  const [channelBuffer, setChannelBuffer] = useState<number[]>([42]);
  const [channelCapacity] = useState<number>(2);
  const [channelMsg, setChannelMsg] = useState<string | null>(null);
  const [isDeadlocked, setIsDeadlocked] = useState(false);

  // Benchmark function
  const runVectorBenchmark = () => {
    soundService.playClick(180, 0.03);
    setIsBenchmarking(true);
    setBenchmarkResults(null);

    setTimeout(() => {
      const iterations = 40000;
      const dim = 128;
      const a = new Float32Array(dim);
      const b = new Float32Array(dim);
      for (let i = 0; i < dim; i++) {
        a[i] = Math.random();
        b[i] = Math.random();
      }

      // 1. Standard Distance Loop
      const t0 = performance.now();
      let sum1 = 0;
      for (let iter = 0; iter < iterations; iter++) {
        let d = 0;
        for (let i = 0; i < dim; i++) {
          const diff = a[i] - b[i];
          d += diff * diff;
        }
        sum1 += d;
      }
      const t1 = performance.now();

      // 2. SIMD 4-Way Loop Unrolled Distance
      const t2 = performance.now();
      let sum2 = 0;
      for (let iter = 0; iter < iterations; iter++) {
        let d = 0;
        for (let i = 0; i < dim; i += 4) {
          const d0 = a[i] - b[i];
          const d1 = a[i + 1] - b[i + 1];
          const d2 = a[i + 2] - b[i + 2];
          const d3 = a[i + 3] - b[i + 3];
          d += d0 * d0 + d1 * d1 + d2 * d2 + d3 * d3;
        }
        sum2 += d;
      }
      const t3 = performance.now();

      const jsTime = Number((t1 - t0).toFixed(2));
      const optTime = Number((t3 - t2).toFixed(2));
      const ratio = (jsTime / (optTime || 0.01)).toFixed(1);

      setBenchmarkResults({
        jsTime,
        optTime,
        speedup: `${ratio}x`,
        iterations,
      });
      setIsBenchmarking(false);
      soundService.playSuccess();
    }, 40);
  };

  // Bloom Filter Hash Functions
  const hash1 = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 32;
    return Math.abs(h);
  };
  const hash2 = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 17 + s.charCodeAt(i)) % 32;
    return Math.abs(h);
  };
  const hash3 = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 53 + s.charCodeAt(i)) % 32;
    return Math.abs(h);
  };

  const handleBloomInsert = () => {
    if (!bloomInput.trim()) return;
    const i1 = hash1(bloomInput);
    const i2 = hash2(bloomInput);
    const i3 = hash3(bloomInput);

    setBloomArray((prev) => {
      const next = [...prev];
      next[i1] = 1;
      next[i2] = 1;
      next[i3] = 1;
      return next;
    });
    setBloomMatch(true);
    soundService.playClick(240, 0.03);
  };

  const handleBloomCheck = () => {
    if (!bloomInput.trim()) return;
    const i1 = hash1(bloomInput);
    const i2 = hash2(bloomInput);
    const i3 = hash3(bloomInput);

    const isPresent = bloomArray[i1] === 1 && bloomArray[i2] === 1 && bloomArray[i3] === 1;
    setBloomMatch(isPresent);
    if (isPresent) {
      soundService.playSuccess();
    } else {
      soundService.playAlert();
    }
  };

  // Memory Allocator functions
  const allocateMemoryBlock = () => {
    soundService.playClick(160, 0.02);
    setMemoryHeap((prev) => {
      const next = [...prev];
      const freeIdx = next.findIndex((b) => !b.allocated);
      if (freeIdx !== -1) {
        next[freeIdx] = { ...next[freeIdx], allocated: true };
        const addr = (0x0400 + freeIdx * 64).toString(16).toUpperCase();
        setLastMalloc(`0x${addr}`);
      }
      return next;
    });
  };

  const freeMemoryBlock = () => {
    soundService.playClick(120, 0.02);
    setMemoryHeap((prev) => {
      const next = [...prev];
      let allocIdx = -1;
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].allocated) {
          allocIdx = i;
          break;
        }
      }
      if (allocIdx !== -1) {
        next[allocIdx] = { ...next[allocIdx], allocated: false };
      }
      return next;
    });
  };

  const compactHeap = () => {
    soundService.playSuccess();
    setMemoryHeap((prev) => {
      const allocated = prev.filter((b) => b.allocated);
      const freed = prev.filter((b) => !b.allocated);
      return [...allocated, ...freed].map((b, i) => ({ ...b, id: i }));
    });
  };

  // Channel Operations
  const handleSendToChannel = () => {
    if (channelBuffer.length >= channelCapacity) {
      setIsDeadlocked(true);
      setChannelMsg('fatal error: all goroutines are asleep - deadlock! (Channel buffer full)');
      soundService.playAlert();
      return;
    }
    setIsDeadlocked(false);
    const nextVal = Math.floor(Math.random() * 90) + 10;
    setChannelBuffer((prev) => [...prev, nextVal]);
    setChannelMsg(`Sent payload ${nextVal} into ch <- val`);
    soundService.playClick(200, 0.03);
  };

  const handleReceiveFromChannel = () => {
    if (channelBuffer.length === 0) {
      setIsDeadlocked(true);
      setChannelMsg('fatal error: deadlock waiting on empty channel receive <-ch');
      soundService.playAlert();
      return;
    }
    setIsDeadlocked(false);
    const val = channelBuffer[0];
    setChannelBuffer((prev) => prev.slice(1));
    setChannelMsg(`Received payload ${val} from <-ch`);
    soundService.playClick(260, 0.03);
  };

  const allocatedCount = memoryHeap.filter((b) => b.allocated).length;

  return (
    <section id="systems-lab" className="py-20 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase font-mono mb-2">
              05. Interactive Systems Workbench
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Systems Lab & Hardware Simulation
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Live in-browser simulations of high-concurrency Go streaming, PostGIS GiST spatial indexing, SIMD vector unrolling, and memory allocation.
          </p>
        </div>

        {/* Flagship Stress-Test & Concurrency Benchmark Lab */}
        <StressTestBenchmarkLab />

        {/* 2x2 Interactive Lab Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Lab 1: Vector-Vanguard SIMD Benchmark */}
          <div className="rounded-2xl bg-[#0f1118] border border-white/[0.1] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-white font-display font-bold">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Vector-Vanguard · SIMD Benchmark Suite</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">40,000 Iterations</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Measures live in-browser performance delta between a standard scalar Euclidean distance loop and a
              SIMD-style 4-way loop unrolled vector calculation over 128-dimension float buffers.
            </p>

            {/* Benchmark Runner Box */}
            <div className="rounded-xl bg-[#07080c] border border-white/[0.08] p-4 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={runVectorBenchmark}
                  disabled={isBenchmarking}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isBenchmarking ? 'animate-spin' : ''}`} />
                  <span>{isBenchmarking ? 'Evaluating Buffers...' : 'Run Live Benchmark'}</span>
                </button>

                {benchmarkResults && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Measured Speedup:</span>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      {benchmarkResults.speedup} Faster
                    </span>
                  </div>
                )}
              </div>

              {/* Benchmark Results Display */}
              {benchmarkResults ? (
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-slate-500 text-[11px]">Scalar Baseline</div>
                    <div className="text-white font-bold text-sm mt-0.5">{benchmarkResults.jsTime} ms</div>
                    <div className="text-[10px] text-slate-500 mt-1">Single-index branch overhead</div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                    <div className="text-emerald-400 text-[11px]">4-Way Loop Unrolled</div>
                    <div className="text-emerald-300 font-bold text-sm mt-0.5">{benchmarkResults.optTime} ms</div>
                    <div className="text-[10px] text-emerald-400/80 mt-1">75% branch checks eliminated</div>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-mono text-slate-500 text-center py-4">
                  Click "Run Live Benchmark" to execute performance profiling in real time.
                </div>
              )}
            </div>
          </div>

          {/* Lab 2: Bloom Filter Playground */}
          <div className="rounded-2xl bg-[#0f1118] border border-white/[0.1] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-white font-display font-bold">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Deterministic Bloom Filter Bitset</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">32-Bit Array · 3 Hashes</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Test membership in a zero-false-negative probabilistic bitset. Hashing a key maps to 3 bit positions.
            </p>

            {/* Bit array display */}
            <div className="rounded-xl bg-[#07080c] border border-white/[0.08] p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Bit Array (0..31):</span>
                <span>Active Bits: {bloomArray.filter((b) => b === 1).length} / 32</span>
              </div>

              <div className="grid grid-cols-8 sm:grid-cols-16 gap-1">
                {bloomArray.map((bit, idx) => (
                  <div
                    key={idx}
                    className={`h-7 rounded flex items-center justify-center text-[10px] font-mono transition-colors ${
                      bit === 1
                        ? 'bg-indigo-600 text-white font-bold shadow-xs shadow-indigo-500/50'
                        : 'bg-[#12151f] text-slate-600'
                    }`}
                    title={`Index ${idx}: ${bit}`}
                  >
                    {bit}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <input
                  type="text"
                  value={bloomInput}
                  onChange={(e) => setBloomInput(e.target.value)}
                  placeholder="token_key"
                  className="w-full sm:flex-1 px-3 py-1.5 text-xs bg-[#0b0c12] border border-white/[0.1] rounded-lg text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleBloomInsert}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Insert Key
                  </button>
                  <button
                    onClick={handleBloomCheck}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors whitespace-nowrap"
                  >
                    Check Match
                  </button>
                </div>
              </div>

              {/* Match Feedback */}
              {bloomMatch !== null && (
                <div
                  className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                    bloomMatch
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {bloomMatch ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>
                    {bloomMatch
                      ? `Key "${bloomInput}" is likely present in filter (or false positive)`
                      : `Key "${bloomInput}" is 100% NOT in filter (Zero false negatives)`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Lab 3: 64-Byte Cache-Line Memory Allocator */}
          <div className="rounded-2xl bg-[#0f1118] border border-white/[0.1] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-white font-display font-bold">
                <HardDrive className="w-4 h-4 text-indigo-400" />
                <span>64-Byte Cache-Line Heap Allocator</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">2KB Contiguous Arena</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Visualizes 32 contiguous memory blocks corresponding to 64-byte L1 CPU cache lines. Demonstrates allocation
              pointers, fragmentation, and garbage compaction.
            </p>

            <div className="rounded-xl bg-[#07080c] border border-white/[0.08] p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Heap Allocation Map:</span>
                <span>
                  {allocatedCount} / 32 Blocks Allocated ({allocatedCount * 64} Bytes)
                </span>
              </div>

              {/* Blocks */}
              <div className="grid grid-cols-8 sm:grid-cols-16 gap-1">
                {memoryHeap.map((block) => (
                  <div
                    key={block.id}
                    className={`h-7 rounded flex items-center justify-center text-[9px] font-mono transition-colors ${
                      block.allocated
                        ? 'bg-indigo-500 text-white font-semibold'
                        : 'bg-[#12151f] text-slate-600 border border-white/[0.03]'
                    }`}
                    title={`Block 0x${(0x0400 + block.id * 64).toString(16).toUpperCase()}: ${
                      block.allocated ? 'Allocated (64B)' : 'Free'
                    }`}
                  >
                    64B
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={allocateMemoryBlock}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                  >
                    malloc(64)
                  </button>
                  <button
                    onClick={freeMemoryBlock}
                    className="px-3 py-1.5 text-xs text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors"
                  >
                    free()
                  </button>
                  <button
                    onClick={compactHeap}
                    className="px-3 py-1.5 text-xs text-indigo-400 hover:text-white bg-indigo-600/10 hover:bg-indigo-600/20 rounded-lg transition-colors"
                  >
                    Compact GC
                  </button>
                </div>

                <span className="text-[11px] font-mono text-slate-400">
                  Last Malloc: <strong className="text-emerald-400">{lastMalloc}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Lab 4: Go Concurrency & Channel Hub */}
          <div className="rounded-2xl bg-[#0f1118] border border-white/[0.1] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-white font-display font-bold">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Go Concurrency & Channel Ring Buffer</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">make(chan int, 2)</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Simulates synchronized Goroutine communication. Sending to a full channel buffer or reading from an empty one
              illustrates channel blocking and deadlock prevention.
            </p>

            <div className="rounded-xl bg-[#07080c] border border-white/[0.08] p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Channel Buffer [Capacity: {channelCapacity}]:</span>
                <span>Items Queued: {channelBuffer.length}</span>
              </div>

              {/* Buffer Slots */}
              <div className="flex items-center gap-3">
                {[0, 1].map((slotIdx) => {
                  const val = channelBuffer[slotIdx];
                  const hasVal = val !== undefined;
                  return (
                    <div
                      key={slotIdx}
                      className={`flex-1 h-12 rounded-lg border flex items-center justify-center font-mono text-xs transition-all ${
                        hasVal
                          ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300 font-bold'
                          : 'bg-[#12151f] border-dashed border-white/[0.1] text-slate-600'
                      }`}
                    >
                      {hasVal ? `Payload #${val}` : 'Slot Empty'}
                    </div>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleSendToChannel}
                  className="flex-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors font-mono"
                >
                  ch &lt;- val (Send)
                </button>
                <button
                  onClick={handleReceiveFromChannel}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors font-mono"
                >
                  &lt;-ch (Receive)
                </button>
              </div>

              {/* Status Message */}
              {channelMsg && (
                <div
                  className={`p-2 rounded text-[11px] font-mono ${
                    isDeadlocked
                      ? 'bg-rose-950/40 border border-rose-800/40 text-rose-300'
                      : 'bg-white/[0.02] border border-white/[0.04] text-slate-300'
                  }`}
                >
                  {channelMsg}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
