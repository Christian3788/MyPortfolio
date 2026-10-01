import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Trophy, Code2, Terminal, Sparkles, Check, HelpCircle } from 'lucide-react';
import { soundService } from '../services/sound';

interface ChallengeScenario {
  id: string;
  title: string;
  domain: string;
  codeSnippet: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  zone01Insight: string;
}

const SCENARIOS: ChallengeScenario[] = [
  {
    id: 'concurrency',
    title: 'Go Goroutine Leak & Deadlock in Partial Streamer',
    domain: 'Go Concurrency / Memory Safety',
    codeSnippet: `func StreamAudioChunk(ctx context.Context, w io.Writer, src io.Reader) error {
    errChan := make(chan error) // Unbuffered
    go func() {
        _, err := io.Copy(w, src)
        errChan <- err // May block forever if parent exited
    }()

    select {
    case <-ctx.Done():
        return ctx.Err() // Exits early; goroutine above hangs indefinitely!
    case err := <-errChan:
        return err
    }
}`,
    question: 'Why does this streaming handler cause memory to leak under high client cancellation rates?',
    options: [
      {
        id: 'A',
        text: 'The unbuffered channel blocks the worker goroutine forever when ctx.Done() returns early, preventing garbage collection.',
        isCorrect: true,
      },
      {
        id: 'B',
        text: 'Go goroutines cannot access variables passed by value across closure boundaries.',
        isCorrect: false,
      },
      {
        id: 'C',
        text: 'io.Copy allocates a new TCP socket per invocation that stays in TIME_WAIT state.',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'The select statement deadlocks because channels require explicit close() calls before select.',
        isCorrect: false,
      },
    ],
    explanation: 'Unbuffered channels require both sender and receiver to be ready simultaneously. When the context is cancelled (e.g. client disconnects or scrubs the audio player), the parent select returns ctx.Err() immediately. The background goroutine then blocks forever trying to send to errChan, leaking 2KB+ of stack memory and all closed references.',
    zone01Insight: "Christian's Defended Solution at Zone01: Allocate a buffered channel `make(chan error, 1)` so the background goroutine can write without blocking, even if the parent function has already returned. This reduced idle goroutine counts by 98% in stress tests.",
  },
  {
    id: 'postgis',
    title: 'PostGIS Sequential Scan vs. GiST Spatial Indexing',
    domain: 'Database / Spatial GIS Optimization',
    codeSnippet: `-- Slow query attempting 500m proximity search:
EXPLAIN ANALYZE
SELECT id, title, geom
FROM spatial_assets
WHERE ST_Distance(geom, ST_SetSRID(ST_Point(34.75, -0.09), 4326)) < 0.005;

-- Execution Plan Output:
-- Seq Scan on spatial_assets (cost=0.00..4821.50 rows=12 width=72)
-- Filter: (ST_Distance(geom, ...) < 0.005)
-- Rows Removed by Filter: 154,820
-- Execution Time: 118.42 ms`,
    question: 'Why is this query performing an expensive sequential scan across all 150,000 rows instead of using the GiST R-Tree index?',
    options: [
      {
        id: 'A',
        text: 'PostGIS indexes are disabled when coordinates cross the equator in Kenya.',
        isCorrect: false,
      },
      {
        id: 'B',
        text: 'ST_Distance calculates exact Euclidean distance for every row and cannot use bounding-box index filtering.',
        isCorrect: true,
      },
      {
        id: 'C',
        text: 'The table requires a full VACUUM FULL before GiST trees can accept point geometries.',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'ST_Point returns latitude before longitude, causing a projection parse fault.',
        isCorrect: false,
      },
    ],
    explanation: '`ST_Distance(...) < distance` cannot utilize GiST spatial bounding box operators (&&). The database engine must evaluate the mathematical distance function against every individual row in the table, resulting in a full sequential scan of 118ms.',
    zone01Insight: "Christian's Defended Solution at Zone01: Use `ST_DWithin(geom, ST_SetSRID(ST_Point(34.75, -0.09), 4326)::geography, 500)`. ST_DWithin automatically leverages the GiST R-Tree index to discard 99.9% of distant points in the first index pass, slashing query latency from 118ms down to 3.12ms.",
  },
  {
    id: 'memory',
    title: 'Zero-Allocation 64KB TCP Buffer Pool',
    domain: 'Systems Programming / Garbage Collector Tuning',
    codeSnippet: `// High-load stream without buffer pooling
func HandleStream(w http.ResponseWriter, r *http.Request) {
    buf := make([]byte, 64*1024) // 64KB heap allocation on every seek!
    for {
        n, err := audioSource.Read(buf)
        if n > 0 {
            w.Write(buf[:n])
        }
        if err != nil { break }
    }
}`,
    question: 'Under 10,000 concurrent streaming audio playback clients, why does Go GC pause time spike to 40ms?',
    options: [
      {
        id: 'A',
        text: 'Allocating 64KB on each request generates gigabytes of short-lived heap objects, forcing frequent GC mark-and-sweep cycles.',
        isCorrect: true,
      },
      {
        id: 'B',
        text: 'HTTP 206 responses disable TCP window scaling at the Linux kernel level.',
        isCorrect: false,
      },
      {
        id: 'C',
        text: 'The Go runtime prohibits slices larger than 32KB in asynchronous handlers.',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'http.ResponseWriter buffers all chunk bytes in physical RAM until connection close.',
        isCorrect: false,
      },
    ],
    explanation: 'Allocating 64KB byte slices inside high-frequency request handlers rapidly fills the nursery generation of the Go heap. At 10,000 concurrent streaming clients, this produces hundreds of megabytes of garbage per second, triggering constant garbage collector stop-the-world phases and latency spikes.',
    zone01Insight: "Christian's Defended Solution at Zone01: Implemented `sync.Pool` with `io.CopyBuffer` to recycle 64KB byte slices across goroutines. This eliminated 100% of buffer allocations per seek, reducing heap memory by 78% and dropping GC pause time below 1.2ms.",
  },
];

interface PeerReviewChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PeerReviewChallengeModal: React.FC<PeerReviewChallengeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answeredMap, setAnsweredMap] = useState<Record<string, { choice: string; isCorrect: boolean }>>({});

  if (!isOpen) return null;

  const current = SCENARIOS[currentIdx];
  const isAnswered = !!answeredMap[current.id];

  const handleSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    soundService.playClick(240, 0.02);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswered) return;
    const choiceObj = current.options.find((o) => o.id === selectedOption);
    const isCorrect = choiceObj?.isCorrect ?? false;

    if (isCorrect) {
      soundService.playSuccess();
      setScore((prev) => prev + 1);
    } else {
      soundService.playAlert();
    }

    setAnsweredMap((prev) => ({
      ...prev,
      [current.id]: { choice: selectedOption, isCorrect },
    }));
    setHasSubmitted(true);
  };

  const handleNext = () => {
    soundService.playClick(200, 0.02);
    if (currentIdx < SCENARIOS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(answeredMap[SCENARIOS[currentIdx + 1]?.id]?.choice || null);
      setHasSubmitted(!!answeredMap[SCENARIOS[currentIdx + 1]?.id]);
    }
  };

  const handleReset = () => {
    soundService.playClick(180, 0.02);
    setCurrentIdx(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setAnsweredMap({});
  };

  const answeredCount = Object.keys(answeredMap).length;
  const isFinished = answeredCount === SCENARIOS.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0059e8]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zone01 Kisumu · Peer Code Defense Challenge</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              Test Your Systems Engineering Knowledge
            </h2>
            <p className="text-xs text-slate-700 font-mono font-medium">
              3 real architectural scenarios defended before peer review panels. Can you spot the invariant violations?
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score & Scenario Nav Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-mono">
          <div className="flex items-center gap-2">
            {SCENARIOS.map((sc, idx) => {
              const ans = answeredMap[sc.id];
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    setCurrentIdx(idx);
                    setSelectedOption(ans?.choice || null);
                    setHasSubmitted(!!ans);
                    soundService.playClick(200, 0.02);
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                    currentIdx === idx
                      ? 'bg-[#0059e8] text-white border-blue-600 shadow-xs'
                      : ans
                      ? ans.isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Scenario 0{idx + 1}</span>
                  {ans && (
                    <span className="ml-1.5">
                      {ans.isCorrect ? '✓' : '✗'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Score: {score} / {SCENARIOS.length}</span>
          </div>
        </div>

        {/* Current Scenario Card */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-mono text-[#0059e8] font-bold uppercase tracking-wider">
                {current.domain}
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display mt-0.5">
                {currentIdx + 1}. {current.title}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-600 font-medium shrink-0">
              Pass Rate at Zone01: 34%
            </span>
          </div>

          {/* Code Snippet Box */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-slate-200 shadow-inner overflow-x-auto">
            <pre className="text-slate-300 leading-relaxed whitespace-pre font-mono text-[11px]">
              {current.codeSnippet}
            </pre>
          </div>

          {/* Question */}
          <div className="text-sm font-bold text-slate-900 font-display">
            {current.question}
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2.5">
            {current.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const ans = answeredMap[current.id];
              let optionStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300';

              if (ans) {
                if (option.isCorrect) {
                  optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs';
                } else if (isSelected && !option.isCorrect) {
                  optionStyle = 'bg-rose-50 border-rose-300 text-rose-950';
                } else {
                  optionStyle = 'bg-slate-50 border-slate-200 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-blue-50 border-[#0059e8] text-[#0059e8] font-semibold shadow-xs';
              }

              return (
                <button
                  key={option.id}
                  disabled={isAnswered}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-mono font-bold text-[11px] ${
                    isSelected ? 'bg-[#0059e8] text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {option.id}
                  </span>
                  <span className="leading-relaxed flex-1">{option.text}</span>
                  {ans && option.isCorrect && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Submit / Next Action */}
          <div className="pt-2 flex items-center justify-between">
            {!isAnswered ? (
              <button
                disabled={!selectedOption}
                onClick={handleSubmitAnswer}
                className="px-5 py-2.5 rounded-lg bg-[#0059e8] hover:bg-[#0048c4] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold font-mono transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Submit Defense Answer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                {currentIdx < SCENARIOS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-lg bg-[#0059e8] hover:bg-[#0048c4] text-white text-xs font-semibold font-mono transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next Scenario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>All Scenarios Completed! Final Score: {score} / 3</span>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Restart</span>
                </button>
              </div>
            )}
          </div>

          {/* Explanation & Zone01 Defense Outcome (Appears upon submit) */}
          {isAnswered && (
            <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-200/90 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0059e8]">
                <Sparkles className="w-4 h-4 text-[#0059e8]" />
                <span>Technical Architecture Breakdown</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-normal">
                {current.explanation}
              </p>
              <div className="p-3 rounded-lg bg-white border border-blue-200 space-y-1 text-xs text-slate-900">
                <div className="font-bold text-[#0059e8] font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Christian's Zone01 Peer Review Justification:</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {current.zone01Insight}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-700">
          <div className="text-slate-700">
            Zone01 Kisumu Peer-Defended Standards · Zero Compromise
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer font-medium"
          >
            Close Challenge
          </button>
        </div>
      </div>
    </div>
  );
};
