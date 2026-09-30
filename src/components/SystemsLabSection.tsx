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
    <section id="systems-lab" className="py-20 border-t border-slate-200/90 bg-[#f8fafd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#0059e8] uppercase font-mono mb-2">
              02. Production Benchmarks &amp; Systems Lab
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              Systems Lab &amp; Hardware Simulation
            </h2>
          </div>
          <p className="text-sm text-slate-700 font-medium max-w-md">
            Live in-browser simulations of high-concurrency Go streaming, PostGIS GiST spatial indexing, SIMD vector unrolling, and memory allocation.
          </p>
        </div>

        {/* Flagship Stress-Test & Concurrency Benchmark Lab */}
        <StressTestBenchmarkLab />

        {/* 2x2 Interactive Lab Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Lab 1: Vector-Vanguard SIMD Benchmark */}
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,89,232,0.06)] hover:shadow-[0_12px_36px_-6px_rgba(0,89,232,0.1)] transition-all p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-display font-bold">
                <Zap className="w-4 h-4 text-[#0059e8]" />
                <span>Vector-Vanguard · SIMD Benchmark Suite</span>
              </div>
              <span className="text-[11px] font-mono text-slate-700 font-medium">40,000 Iterations</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              Measures live in-browser performance delta between a standard scalar Euclidean distance loop and a
              SIMD-style 4-way loop unrolled vector calculation over 128-dimension float buffers.
            </p>

            {/* Benchmark Runner Box */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={runVectorBenchmark}
                  disabled={isBenchmarking}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isBenchmarking ? 'animate-spin' : ''}`} />
                  <span>{isBenchmarking ? 'Evaluating Buffers...' : 'Run Live Benchmark'}</span>
                </button>

                {benchmarkResults && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-700 font-medium">Measured Speedup:</span>
                    <span className="text-sm font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      {benchmarkResults.speedup} Faster
                    </span>
                  </div>
                )}
              </div>

              {/* Benchmark Results Display */}
              {benchmarkResults ? (
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <div className="text-slate-700 font-medium text-[11px]">Scalar Baseline</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">{benchmarkResults.jsTime} ms</div>
                    <div className="text-[10px] text-slate-600 font-medium mt-1">Single-index branch overhead</div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 shadow-2xs">
                    <div className="text-emerald-900 text-[11px] font-bold">4-Way Loop Unrolled</div>
                    <div className="text-emerald-950 font-bold text-sm mt-0.5">{benchmarkResults.optTime} ms</div>
                    <div className="text-[10px] text-emerald-800 font-medium mt-1">75% branch checks eliminated</div>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-mono text-slate-700 font-medium text-center py-4">
                  Click "Run Live Benchmark" to execute performance profiling in real time.
                </div>
              )}
            </div>
          </div>

          {/* Lab 2: Bloom Filter Playground */}
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,89,232,0.06)] hover:shadow-[0_12px_36px_-6px_rgba(0,89,232,0.1)] transition-all p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-display font-bold">
                <Cpu className="w-4 h-4 text-[#0059e8]" />
                <span>Deterministic Bloom Filter Bitset</span>
              </div>
              <span className="text-[11px] font-mono text-slate-700 font-medium">32-Bit Array · 3 Hashes</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              Test membership in a zero-false-negative probabilistic bitset. Hashing a key maps to 3 bit positions.
            </p>

            {/* Bit array display */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-700">
                <span className="font-medium">Bit Array (0..31):</span>
                <span className="font-bold text-slate-900">Active Bits: {bloomArray.filter((b) => b === 1).length} / 32</span>
              </div>

              <div className="grid grid-cols-8 sm:grid-cols-16 gap-1">
                {bloomArray.map((bit, idx) => (
                  <div
                    key={idx}
                    className={`h-7 rounded flex items-center justify-center text-[10px] font-mono transition-colors ${
                      bit === 1
                        ? 'bg-[#0059e8] text-white font-bold shadow-xs'
                        : 'bg-white text-slate-600 font-medium border border-slate-200'
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
                  className="w-full sm:flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono placeholder-slate-500 focus:outline-none focus:border-[#0059e8]"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleBloomInsert}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-lg transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
                  >
                    Insert Key
                  </button>
                  <button
                    onClick={handleBloomCheck}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
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
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-rose-50 border-rose-300 text-rose-800'
                  }`}
                >
                  {bloomMatch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
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
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,89,232,0.06)] hover:shadow-[0_12px_36px_-6px_rgba(0,89,232,0.1)] transition-all p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-display font-bold">
                <HardDrive className="w-4 h-4 text-[#0059e8]" />
                <span>64-Byte Cache-Line Heap Allocator</span>
              </div>
              <span className="text-[11px] font-mono text-slate-700 font-medium">2KB Contiguous Arena</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              Visualizes 32 contiguous memory blocks corresponding to 64-byte L1 CPU cache lines. Demonstrates allocation
              pointers, fragmentation, and garbage compaction.
            </p>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-700">
                <span className="font-medium">Heap Allocation Map:</span>
                <span className="font-bold text-slate-900">
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
                        ? 'bg-[#0059e8] text-white font-semibold shadow-2xs'
                        : 'bg-white text-slate-600 font-medium border border-slate-200'
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
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    malloc(64)
                  </button>
                  <button
                    onClick={freeMemoryBlock}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                  >
                    free()
                  </button>
                  <button
                    onClick={compactHeap}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0059e8] hover:text-white bg-blue-50 hover:bg-[#0059e8] border border-blue-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Compact GC
                  </button>
                </div>

                <span className="text-[11px] font-mono text-slate-700">
                  Last Malloc: <strong className="text-emerald-800 font-bold">{lastMalloc}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Lab 4: Go Concurrency & Channel Hub */}
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,89,232,0.06)] hover:shadow-[0_12px_36px_-6px_rgba(0,89,232,0.1)] transition-all p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-display font-bold">
                <Terminal className="w-4 h-4 text-[#0059e8]" />
                <span>Go Concurrency &amp; Channel Ring Buffer</span>
              </div>
              <span className="text-[11px] font-mono text-slate-700 font-medium">make(chan int, 2)</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              Simulates synchronized Goroutine communication. Sending to a full channel buffer or reading from an empty one
              illustrates channel blocking and deadlock prevention.
            </p>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-700">
                <span className="font-medium">Channel Buffer [Capacity: {channelCapacity}]:</span>
                <span className="font-bold text-slate-900">Items Queued: {channelBuffer.length}</span>
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
                          ? 'bg-blue-50 border-[#0059e8]/40 text-[#0059e8] font-bold shadow-2xs'
                          : 'bg-white border-dashed border-slate-300 text-slate-600 font-medium'
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
                  className="flex-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-lg transition-colors font-mono shadow-2xs cursor-pointer"
                >
                  ch &lt;- val (Send)
                </button>
                <button
                  onClick={handleReceiveFromChannel}
                  className="flex-1 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors font-mono cursor-pointer"
                >
                  &lt;-ch (Receive)
                </button>
              </div>

              {/* Status Message */}
              {channelMsg && (
                <div
                  className={`p-2 rounded text-[11px] font-mono ${
                    isDeadlocked
                      ? 'bg-rose-50 border border-rose-200 text-rose-800'
                      : 'bg-white border border-slate-200 text-slate-700'
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
