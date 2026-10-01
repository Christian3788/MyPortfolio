import React, { useState } from 'react';
import { Trophy, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Sparkles, HelpCircle, Code2 } from 'lucide-react';
import { soundService } from '../services/sound';

interface PeerDefenseMicroChallengeProps {
  onOpenFullChallenge?: () => void;
}

export const PeerDefenseMicroChallenge: React.FC<PeerDefenseMicroChallengeProps> = ({
  onOpenFullChallenge,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const question = {
    title: 'Zone01 Rapid Code Audit: Concurrency Race Condition',
    scenario:
      'In a high-throughput Go media server, multiple goroutines stream audio chunks using a shared slice buffer. Under 500 concurrent listeners, the service intermittently corrupts byte output.',
    codeSnippet: `// ❌ Vulnerable Go Routine Handler (Shared State Bug)
var sharedBuf = make([]byte, 64*1024)

func HandleStream(w http.ResponseWriter, r *http.Request) {
    // ⚠️ CRITICAL: Concurrent calls overwrite sharedBuf memory simultaneously!
    n, _ := file.Read(sharedBuf)
    w.Write(sharedBuf[:n])
}`,
    options: [
      {
        id: 0,
        text: 'Allocate a new 64KB buffer inside every request handler with make([]byte, 64*1024)',
        correct: false,
        critique:
          'While safe from data races, allocating 64KB per request triggers severe garbage collector pressure under 10k connections.',
      },
      {
        id: 1,
        text: 'Utilize sync.Pool to reuse pre-allocated byte slices across goroutines without heap allocations',
        correct: true,
        critique:
          'Correct! Zone01 Invariant Defended: sync.Pool recycles buffers across goroutines, eliminating both data races and GC pauses.',
      },
      {
        id: 2,
        text: 'Wrap the entire file.Read call with a global sync.Mutex lock',
        correct: false,
        critique:
          'A global mutex serializes all streaming traffic, causing socket starvation and catastrophic throughput collapse.',
      },
    ],
  };

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);

    if (question.options[idx].correct) {
      soundService.playSuccess();
    } else {
      soundService.playAlert();
    }
  };

  const handleReset = () => {
    soundService.playClick(200, 0.02);
    setSelectedOption(null);
    setAnswered(false);
  };

  const isCorrect = selectedOption !== null && question.options[selectedOption].correct;

  return (
    <div className="rounded-2xl bg-white border border-slate-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 sm:p-8 space-y-6 relative overflow-hidden">
      {/* Top subtle blue aura */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-300 shadow-2xs">
            <Trophy className="w-4 h-4 text-amber-600" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                Interactive Audit of the Day
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-[#0059e8] font-bold border border-blue-200">
                1-MIN CHALLENGE
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium mt-1">
              Defend algorithmic and concurrency correctness before the Zone01 peer board.
            </p>
          </div>
        </div>

        {onOpenFullChallenge && (
          <button
            onClick={() => {
              soundService.playClick(240, 0.02);
              onOpenFullChallenge();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold transition-all shadow-2xs cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Launch Full 5-Question Quiz</span>
          </button>
        )}
      </div>

      {/* Scenario Explanation Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
        <span className="font-bold text-slate-950 font-mono">Scenario: </span>
        <span>{question.scenario}</span>
      </div>

      {/* Code Snippet Box (High-Contrast Solid Dark Terminal) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-700 font-semibold px-1">
          <div className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-[#0059e8]" />
            <span>streamer.go · Target Handler</span>
          </div>
          <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
            Vulnerable Snippet
          </span>
        </div>

        <div className="rounded-xl bg-[#0b0f19] border border-slate-800 p-4 font-mono text-xs text-slate-100 overflow-x-auto shadow-inner">
          <pre className="leading-relaxed">
            <span className="text-emerald-400 font-medium">// ❌ Vulnerable Go Routine Handler (Shared State Bug)</span>{'\n'}
            <span className="text-sky-300 font-bold">var</span> sharedBuf = make([]<span className="text-amber-300">byte</span>, 64*1024){'\n\n'}
            <span className="text-sky-300 font-bold">func</span> <span className="text-yellow-300 font-bold">HandleStream</span>(w http.ResponseWriter, r *http.Request) {'{'}{'\n'}
            {'    '}<span className="text-amber-400 font-bold bg-amber-950/60 px-1 py-0.5 rounded border border-amber-700/50">// ⚠️ CRITICAL: Concurrent calls overwrite sharedBuf memory simultaneously!</span>{'\n'}
            {'    '}n, _ := file.Read(sharedBuf){'\n'}
            {'    '}w.Write(sharedBuf[:n]){'\n'}
            {'}'}
          </pre>
        </div>
      </div>

      {/* Interactive Options */}
      <div className="space-y-2.5">
        <div className="text-xs font-mono text-slate-900 uppercase font-bold tracking-wider">
          Select Your Architectural Solution:
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let btnStyle = 'bg-white hover:bg-blue-50/80 border-slate-300 hover:border-[#0059e8] text-slate-900 shadow-2xs';

            if (answered) {
              if (opt.correct) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/40 font-semibold shadow-xs';
              } else if (isSelected && !opt.correct) {
                btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-500/40 font-semibold shadow-xs';
              } else {
                btnStyle = 'bg-slate-50 border-slate-200 text-slate-600 opacity-60';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                    answered && opt.correct
                      ? 'bg-emerald-600 text-white'
                      : answered && isSelected && !opt.correct
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 text-slate-800 font-bold'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed font-sans text-slate-900 font-medium">{opt.text}</span>

                {answered && opt.correct && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {answered && isSelected && !opt.correct && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Explanation & Feedback */}
      {answered && (
        <div
          className={`p-4 rounded-xl border space-y-3 animate-in fade-in duration-200 ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
              : 'bg-rose-50 border-rose-300 text-rose-950 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-current/15">
            <div className="flex items-center gap-2 font-mono font-bold text-xs">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-900">Defense Approved: Peer Review Board Sign-Off</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-rose-900">Defense Critique: Invariant Violated</span>
                </>
              )}
            </div>

            <button
              onClick={handleReset}
              className="text-[11px] font-mono font-bold underline hover:opacity-80 cursor-pointer"
            >
              Try Again
            </button>
          </div>

          <p className="text-xs font-sans leading-relaxed font-medium">
            {question.options[selectedOption!].critique}
          </p>

          {isCorrect && onOpenFullChallenge && (
            <div className="pt-2 border-t border-emerald-300/60 flex items-center justify-between">
              <span className="text-xs font-sans text-emerald-900 font-semibold">
                Ready for the full 5-question PostGIS &amp; Concurrency test?
              </span>
              <button
                onClick={() => {
                  soundService.playClick(260, 0.02);
                  onOpenFullChallenge();
                }}
                className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-950 hover:text-emerald-700 underline cursor-pointer"
              >
                <span>Take Full Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
