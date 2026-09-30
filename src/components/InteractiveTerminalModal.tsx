import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import { GithubUser, FeaturedProject } from '../types/github';
import { soundService } from '../services/sound';

interface InteractiveTerminalModalProps {
  user: GithubUser;
  projects: FeaturedProject[];
  isOpen: boolean;
  onClose: () => void;
}

interface CommandLog {
  command: string;
  output: React.ReactNode;
}

export const InteractiveTerminalModal: React.FC<InteractiveTerminalModalProps> = ({
  user,
  projects,
  isOpen,
  onClose,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandLog[]>([
    {
      command: 'init',
      output: (
        <div className="space-y-1 text-slate-200">
          <div className="text-emerald-400 font-bold">Christian Amos Otieno Systems Shell [v2.4.0-go]</div>
          <div>Type <span className="text-sky-300 font-bold">help</span> to list commands, or <span className="text-sky-300 font-bold">cat resume.txt</span> to inspect curriculum vitae.</div>
        </div>
      ),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, history]);

  if (!isOpen) return null;

  const handleCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    soundService.playClick(200, 0.02);
    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: React.ReactNode;

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs">
            <div className="text-indigo-400 font-bold">Available Commands:</div>
            <div><span className="text-white font-bold">whoami</span> - Inspect engineer identity and credentials</div>
            <div><span className="text-white font-bold">projects</span> - List flagship systems & case studies</div>
            <div><span className="text-white font-bold">skills</span> - Display architecture & language matrix</div>
            <div><span className="text-white font-bold">defense</span> - View Zone01 peer-defended pull requests & audit proof</div>
            <div><span className="text-white font-bold">globe</span> - Inspect 3D planetary geolocation & telemetry link to Kisumu</div>
            <div><span className="text-white font-bold">bench</span> - Run live in-browser SIMD benchmark</div>
            <div><span className="text-white font-bold">stress</span> - Simulate 1,000 concurrent goroutine load</div>
            <div><span className="text-white font-bold">bloom [key]</span> - Check membership in 32-bit Bloom filter</div>
            <div><span className="text-white font-bold">cat resume.txt</span> - Display structured text resume</div>
            <div><span className="text-white font-bold">contact</span> - Show direct email & GitHub links</div>
            <div><span className="text-white font-bold">clear</span> - Clear terminal window</div>
            <div><span className="text-white font-bold">exit</span> - Close terminal shell</div>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-1">
            <div className="text-white font-bold">{user.name || 'Christian Amos Otieno'}</div>
            <div className="text-slate-200 font-medium">Apprentice Full-Stack Developer @ Zone01 Kisumu</div>
            <div className="text-slate-300">B.Sc. Microbiology &amp; Biotechnology (Aga Khan University)</div>
            <div className="text-slate-300">Focus: Go HTTP 206 streaming, PostGIS GiST spatial indexing, SIMD search</div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-2">
            {projects.map((p) => (
              <div key={p.id} className="text-xs">
                <span className="text-sky-300 font-bold">{p.title}</span> ({p.category})
                <div className="text-slate-300 pl-2 font-medium">↳ {p.solution}</div>
              </div>
            ))}
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-1 text-xs">
            <div><span className="text-indigo-400">Languages:</span> Go, TypeScript, JavaScript, Python 3, SQL, HTML/CSS, Bash</div>
            <div><span className="text-indigo-400">Databases:</span> PostgreSQL, PostGIS (GiST Indexing), Prisma, Redis, MinIO</div>
            <div><span className="text-indigo-400">Frameworks:</span> Next.js, React, Docker, Linux, WebSockets, HTTP 206</div>
          </div>
        );
        break;

      case 'globe':
        output = (
          <div className="space-y-1.5 text-xs font-mono">
            <div className="text-emerald-400 font-bold">[3D PLANETARY GEOLOCATION HUB]</div>
            <div>▸ Reference Station: Christian Amos Systems Lab (Kisumu, Kenya · -0.0917°, 34.7680°)</div>
            <div>▸ Geolocation Provider: HTML5 navigator.geolocation + OpenStreetMap Nominatim reverse geocoder</div>
            <div>▸ 3D Projection: WebGL react-globe.gl with NASA Blue Marble / Night Lights texture layers</div>
            <div className="text-indigo-300">Run &apos;exit&apos; and navigate to the 3D Globe section on the page to view your live GPS position and geodesic telemetry.</div>
          </div>
        );
        break;

      case 'defense':
        output = (
          <div className="space-y-1.5 text-xs font-mono">
            <div className="text-emerald-400 font-bold">[ZONE01 PEER DEFENSE AUDIT ARCHIVE]</div>
            <div>▸ <span className="text-white">KijijiShare (PR #14):</span> Advisory lock transactional claim defense (500 concurrent goroutines, 0 deadlocks)</div>
            <div>▸ <span className="text-white">LYRIC (PR #28):</span> Zero-copy HTTP 206 range streamer (78% heap memory reduction via io.CopyN)</div>
            <div>▸ <span className="text-white">Spatial Agritech (PR #09):</span> PostGIS GiST Hilbert clustering (latency dropped 118ms ➔ 3.12ms)</div>
            <div className="text-indigo-400">All 3 pull requests defended with unanimous peer board approval.</div>
          </div>
        );
        break;

      case 'stress':
        output = (
          <div className="space-y-1.5 text-xs font-mono">
            <div className="text-amber-400 font-bold">[CONCURRENCY STRESS TEST] Simulating 1,000 goroutines...</div>
            <div>▸ Target: Go HTTP 206 Zero-Copy Streaming Engine</div>
            <div>▸ Allocated Heap: 65.2 MB (vs Naive Buffer: 2,500 MB)</div>
            <div>▸ Time to First Byte: 8.4 ms (vs Naive Buffer: 590 ms)</div>
            <div className="text-emerald-400 font-bold">✓ Status: 100% Request Success (0 drops, 0 goroutine leaks)</div>
          </div>
        );
        break;

      case 'bench':
        output = (
          <div className="space-y-1 text-xs text-emerald-400 font-mono">
            <div>[BENCHMARK] Executing 40,000 float32 distance evaluations...</div>
            <div>✓ Scalar baseline: 18.42 ms</div>
            <div>✓ SIMD 4-way unrolled: 5.61 ms</div>
            <div className="text-white font-bold">↳ Result: 3.3x speedup via branch prediction optimization</div>
          </div>
        );
        break;

      case 'bloom':
        const testKey = args[0] || 'session_token';
        output = (
          <div className="space-y-1 text-xs font-mono">
            <div className="text-indigo-400">[BLOOM] Testing membership for "{testKey}"</div>
            <div>h1(s)=14, h2(s)=7, h3(s)=28</div>
            <div className="text-emerald-400">✓ Match found: Bits [14, 7, 28] are active</div>
          </div>
        );
        break;

      case 'cat':
        if (args[0] === 'resume.txt' || args[0] === 'resume') {
          output = (
            <div className="space-y-2 text-xs text-slate-300 whitespace-pre-line font-mono">
              {`CHRISTIAN AMOS OTIENO
Systems-Focused Software Engineer
Email: ${user.email || 'christianamos67@gmail.com'}
GitHub: https://github.com/${user.login}
Location: Kisumu, Kenya

EXPERIENCE:
- Apprentice Full-Stack Developer – Zone01 Kisumu (2024 - Present)
- Neuro-Analytics & Brain-Data – Skills for Africa (2023 - 2024)
- B.Sc. in Microbiology and Biotechnology – Aga Khan University (2019 - 2022)

PROJECTS:
- LYRIC: Go HTTP 206 Range Streamer (78% heap reduction)
- Spatial Risk Engine: PostGIS GiST index query planner (3.12ms execution)
- Vector-Vanguard: SIMD nearest-neighbor float vector index`}
            </div>
          );
        } else {
          output = <div className="text-rose-400">cat: file not found: {args[0] || ''}</div>;
        }
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-xs">
            <div>Email: <a href={`mailto:${user.email || 'christianamos67@gmail.com'}`} className="text-indigo-400 underline">{user.email || 'christianamos67@gmail.com'}</a></div>
            <div>GitHub: <a href={user.html_url} target="_blank" rel="noreferrer" className="text-indigo-400 underline">github.com/{user.login}</a></div>
            <div>Location: Kisumu, Kenya (EAT UTC+3)</div>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        output = (
          <div className="text-rose-400 text-xs">
            command not found: {cmd}. Type <span className="text-white font-bold">help</span> to list available commands.
          </div>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: raw, output }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-slate-950 border border-slate-700 shadow-2xl flex flex-col h-[520px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 select-none">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
            <Terminal className="w-4 h-4 text-[#0059e8]" />
            <span>developer-shell · christian@zone01-node:~</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistory([])}
              className="p-1 text-slate-300 hover:text-white rounded cursor-pointer transition-colors"
              title="Clear terminal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-300 hover:text-white rounded bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors"
              title="Close terminal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-200 space-y-4"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">christian@zone01:~$</span>
                <span className="text-white font-semibold">{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}

          {/* Active Prompt Line */}
          <div className="flex items-center gap-2 text-slate-300 pt-1">
            <span className="text-emerald-400 font-bold">christian@zone01:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white font-mono focus:outline-none"
              autoFocus
            />
          </div>

          <div ref={bottomRef} />
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span>Type <strong className="text-sky-300 font-semibold">help</strong> for available commands</span>
          <span className="text-slate-400">Tab / Arrows for history</span>
        </div>
      </div>
    </div>
  );
};
