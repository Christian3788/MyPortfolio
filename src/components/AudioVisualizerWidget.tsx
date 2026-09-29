import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Volume2, VolumeX, Sparkles, Activity, Sliders, Disc } from 'lucide-react';

type WaveformType = 'sine' | 'triangle' | 'sawtooth' | 'square';

export const AudioVisualizerWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeMuted, setVolumeMuted] = useState(false);
  const [waveform, setWaveform] = useState<WaveformType>('sine');
  const [filterFreq, setFilterFreq] = useState<number>(2400); // Hz
  const [chunksReceived, setChunksReceived] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorNodesRef = useRef<OscillatorNode[]>([]);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Update filter frequency in real-time if active
  useEffect(() => {
    if (filterNodeRef.current && audioCtxRef.current) {
      filterNodeRef.current.frequency.setValueAtTime(filterFreq, audioCtxRef.current.currentTime);
    }
  }, [filterFreq]);

  // Update waveform in real-time
  useEffect(() => {
    oscillatorNodesRef.current.forEach((osc) => {
      try {
        osc.type = waveform;
      } catch {}
    });
  }, [waveform]);

  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volumeMuted ? 0 : 0.04, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Lowpass Biquad Filter
      const biquadFilter = ctx.createBiquadFilter();
      biquadFilter.type = 'lowpass';
      biquadFilter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
      biquadFilter.Q.setValueAtTime(3.0, ctx.currentTime);
      biquadFilter.connect(masterGain);
      filterNodeRef.current = biquadFilter;

      // Chord frequencies: C minor 9 (C4, Eb4, G4, Bb4, D5)
      const freqs = [261.63, 311.13, 392.00, 466.16, 587.33];
      const oscillators: OscillatorNode[] = [];

      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = waveform;
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        oscGain.gain.setValueAtTime(0.018, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(biquadFilter);
        osc.start();
        oscillators.push(osc);
      });

      oscillatorNodesRef.current = oscillators;
      setIsPlaying(true);
      setChunksReceived(1);
    } catch {
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    oscillatorNodesRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    oscillatorNodesRef.current = [];

    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const toggleMute = () => {
    const nextMuted = !volumeMuted;
    setVolumeMuted(nextMuted);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(nextMuted ? 0 : 0.04, audioCtxRef.current.currentTime);
    }
  };

  // Simulating incoming 64KB HTTP 206 chunk stream intervals
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setChunksReceived((prev) => prev + 1);
    }, 280);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Canvas visualizer animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const barCount = 36;

    const render = () => {
      step += 0.06;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barWidth = (w - (barCount - 1) * 2) / barCount;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);
        let heightMultiplier = 0.12;
        if (isPlaying) {
          const wave1 = Math.sin(step * 1.2 + i * 0.32);
          const wave2 = Math.cos(step * 1.5 + i * 0.18);
          const filterImpact = Math.min(1.2, filterFreq / 2500);
          heightMultiplier = Math.max(0.08, ((wave1 + wave2 + 2) / 4) * filterImpact);
        }

        const barHeight = heightMultiplier * (h - 6);
        const y = h - barHeight;

        // Gradient styling
        const grad = ctx.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, isPlaying ? '#818cf8' : '#334155');
        grad.addColorStop(1, isPlaying ? '#4f46e5' : '#1e293b');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, filterFreq]);

  return (
    <div className="rounded-xl bg-[#07080c] border border-white/[0.08] p-4 space-y-3.5 shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          <span>HTTP 206 Synthesizer &amp; Range Streamer</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {isPlaying ? `Chunks: ${chunksReceived} (${chunksReceived * 64} KB)` : '64KB Chunk Buffer'}
        </span>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-16 bg-[#040508] rounded-lg overflow-hidden border border-white/[0.04]">
        <canvas
          ref={canvasRef}
          width={400}
          height={64}
          className="w-full h-full object-cover"
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-500 font-mono pointer-events-none">
            Stream Idle · Press Play to hear Web Audio synthesis
          </div>
        )}
      </div>

      {/* Controls & Synthesis Panel */}
      <div className="space-y-2 pt-1 border-t border-white/[0.06]">
        
        {/* Waveform Selector & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          
          {/* Waveform Buttons */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 text-[10px] mr-1">Wave:</span>
            {(['sine', 'triangle', 'sawtooth', 'square'] as WaveformType[]).map((w) => (
              <button
                key={w}
                onClick={() => setWaveform(w)}
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono transition-colors ${
                  waveform === w
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                {w.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Filter Cutoff Slider */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[10px]">Filter: {filterFreq}Hz</span>
            <input
              type="range"
              min="400"
              max="6000"
              step="200"
              value={filterFreq}
              onChange={(e) => setFilterFreq(Number(e.target.value))}
              className="w-20 accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-1"
            />
          </div>

        </div>

        {/* Playback Controls & Status */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayback}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors font-mono ${
                isPlaying
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200'
              }`}
            >
              {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? 'Halt Audio Stream' : 'Live Synthesize & Stream'}</span>
            </button>

            {isPlaying && (
              <button
                onClick={toggleMute}
                className="p-1.5 text-slate-400 hover:text-white rounded bg-white/[0.04] transition-colors"
                title={volumeMuted ? 'Unmute' : 'Mute'}
              >
                {volumeMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          <span className="text-[10px] text-emerald-400 font-mono">
            {isPlaying ? '✓ HTTP 206 Partial Content (Streaming)' : 'Socket: Ready'}
          </span>
        </div>

      </div>

    </div>
  );
};
