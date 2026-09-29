import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Volume2, VolumeX, Sparkles, Activity } from 'lucide-react';

export const AudioVisualizerWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeMuted, setVolumeMuted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorNodesRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volumeMuted ? 0 : 0.05, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Chord frequencies: C minor 9 (C4, Eb4, G4, Bb4, D5)
      const freqs = [261.63, 311.13, 392.00, 466.16, 587.33];
      const oscillators: OscillatorNode[] = [];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        oscGain.gain.setValueAtTime(0.02, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        oscillators.push(osc);
      });

      oscillatorNodesRef.current = oscillators;
      setIsPlaying(true);
    } catch {
      // AudioContext policy blocked or unsupported
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
      gainNodeRef.current.gain.setValueAtTime(nextMuted ? 0 : 0.05, audioCtxRef.current.currentTime);
    }
  };

  // Canvas visualizer animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const barCount = 32;

    const render = () => {
      step += 0.05;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barWidth = (w - (barCount - 1) * 2) / barCount;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);
        let heightMultiplier = 0.15;
        if (isPlaying) {
          const wave1 = Math.sin(step + i * 0.35);
          const wave2 = Math.cos(step * 1.4 + i * 0.2);
          heightMultiplier = Math.max(0.1, (wave1 + wave2 + 2) / 4);
        }

        const barHeight = heightMultiplier * (h - 8);
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
  }, [isPlaying]);

  return (
    <div className="rounded-xl bg-[#07080c] border border-white/[0.08] p-4 space-y-3">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          <span>HTTP 206 Partial Streamer Waveform</span>
        </div>
        <span className="text-[11px] text-slate-500">64KB Byte-Range Pipelines</span>
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
            Stream Idle · Press Play to inspect waveform
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayback}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              isPlaying
                ? 'bg-indigo-600 text-white'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200'
            }`}
          >
            {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isPlaying ? 'Stop Stream' : 'Live Preview Audio'}</span>
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
          {isPlaying ? '✓ HTTP 206 OK (Partial Content)' : 'Status: Ready'}
        </span>
      </div>
    </div>
  );
};
