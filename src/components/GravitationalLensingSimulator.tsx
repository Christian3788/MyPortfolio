import React, { useRef, useEffect, useState } from 'react';
import { Atom, Move, RefreshCw, Sparkles, Sliders, Info, Zap } from 'lucide-react';

interface Star {
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface AccretionParticle {
  angle: number;
  distance: number;
  speed: number;
  size: number;
  hue: number;
}

export const GravitationalLensingSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lensPos, setLensPos] = useState({ x: 250, y: 80 });
  const [mass, setMass] = useState<number>(4.2); // Solar masses
  const [showAccretion, setShowAccretion] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState(false);
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<AccretionParticle[]>([]);
  const animRef = useRef<number | null>(null);

  // Generate starfield once
  useEffect(() => {
    const stars: Star[] = [];
    const colors = ['#ffffff', '#e0e7ff', '#c7d2fe', '#fef08a', '#bae6fd', '#fed7aa'];
    for (let i = 0; i < 110; i++) {
      stars.push({
        x: Math.random() * 600,
        y: Math.random() * 200,
        radius: Math.random() * 1.5 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    starsRef.current = stars;

    // Generate orbiting accretion disk particles
    const particles: AccretionParticle[] = [];
    for (let i = 0; i < 48; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: 18 + Math.random() * 32,
        speed: 0.02 + (1 / (15 + Math.random() * 20)) * 0.4,
        size: Math.random() * 1.6 + 0.6,
        hue: 200 + Math.random() * 50,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Continuous animation loop for orbiting matter and lensing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Deep space void
      ctx.fillStyle = '#04050a';
      ctx.fillRect(0, 0, w, h);

      // Celestial coordinate grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Einstein radius scaled to mass parameter: theta_E ~ sqrt(M)
      const einsteinRadius = 18 + mass * 6.5;
      const einsteinRadiusSq = einsteinRadius * einsteinRadius;

      // 1. Deflect background stars via General Relativity equation
      starsRef.current.forEach((star) => {
        const dx = star.x - lensPos.x;
        const dy = star.y - lensPos.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        // Inside event horizon
        if (dist < 8 + mass * 0.8) return;

        // Gravitational deflection vector: theta = 4GM / (c^2 * r)
        const deflection = einsteinRadiusSq / (distSq + 24);
        const defX = star.x + dx * deflection * 0.48;
        const defY = star.y + dy * deflection * 0.48;

        ctx.beginPath();
        ctx.arc(defX, defY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = dist < einsteinRadius * 1.4 ? 6 : 1;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 2. Render Relativistic Accretion Disk (Keplerian orbits with Doppler boost)
      if (showAccretion) {
        particlesRef.current.forEach((p) => {
          p.angle += p.speed * (mass / 3);
          const px = lensPos.x + Math.cos(p.angle) * p.distance;
          const py = lensPos.y + Math.sin(p.angle) * (p.distance * 0.38); // Inclination foreshortening

          // Relativistic Doppler beaming: approaching particles appear brighter and bluer
          const isApproaching = Math.sin(p.angle) > 0;
          const brightness = isApproaching ? 0.95 : 0.35;

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 90%, ${isApproaching ? '75%' : '45%'}, ${brightness})`;
          ctx.shadowColor = `hsl(${p.hue}, 90%, 65%)`;
          ctx.shadowBlur = isApproaching ? 5 : 1;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // 3. Einstein Ring / Photon Sphere boundary
      ctx.beginPath();
      ctx.arc(lensPos.x, lensPos.y, einsteinRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 4. Black Hole Event Horizon (Schwarzschild radius)
      const rs = 8 + mass * 1.1;
      const grad = ctx.createRadialGradient(lensPos.x, lensPos.y, 1, lensPos.x, lensPos.y, rs + 6);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(0.75, '#000000');
      grad.addColorStop(0.9, 'rgba(15, 23, 42, 0.8)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.beginPath();
      ctx.arc(lensPos.x, lensPos.y, rs + 6, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // 5. Photon Ring Inner Border
      ctx.beginPath();
      ctx.arc(lensPos.x, lensPos.y, rs, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(199, 210, 254, 0.85)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [lensPos, mass, showAccretion]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    updatePos(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      updatePos(e);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updatePos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(30, Math.min(570, (e.clientX - rect.left) * (600 / rect.width)));
    const y = Math.max(30, Math.min(170, (e.clientY - rect.top) * (200 / rect.height)));
    setLensPos({ x, y });
  };

  const resetPosition = () => {
    setLensPos({ x: 300, y: 100 });
    setMass(4.2);
  };

  // Schwarzschild radius formula: Rs = 2GM/c^2
  const calcRsKm = (mass * 2.95).toFixed(1);
  const calcEinsteinThetaArcsec = (mass * 1.84).toFixed(2);

  return (
    <div className="rounded-xl bg-white border border-slate-200/90 p-4 sm:p-5 space-y-4 shadow-sm">
      
      {/* Header with Title & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-900">
          <Atom className="w-4 h-4 text-[#0059e8]" />
          <span className="font-semibold text-slate-900">General Relativity · Gravitational Lensing Canvas</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-700 font-medium">
            Singularity at ({Math.round(lensPos.x)}, {Math.round(lensPos.y)})
          </span>
          <button
            onClick={resetPosition}
            className="p-1.5 rounded text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Reset Mass Coordinates"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Simulation Canvas */}
      <div className="relative w-full rounded-lg overflow-hidden border border-slate-300 cursor-grab active:cursor-grabbing shadow-inner bg-black">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-44 object-cover block"
        />

        {/* Floating Canvas Overlays */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/20 text-[10px] text-white font-mono">
          <Move className="w-3 h-3 text-[#0059e8]" />
          <span>Drag mass to bend light rays in real time</span>
        </div>

        <div className="absolute bottom-2 right-2 z-10 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-[#0059e8]/50 text-[10px] text-blue-200 font-mono">
          <span>θ_E = {calcEinsteinThetaArcsec}″ · R_s = {calcRsKm} km</span>
        </div>
      </div>

      {/* Physics Controls & Mathematical Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center text-xs font-mono pt-1">
        
        {/* Mass Slider */}
        <div className="sm:col-span-6 space-y-1.5">
          <div className="flex justify-between text-slate-800 font-semibold">
            <span>Stellar Mass (M_☉):</span>
            <span className="text-slate-900 font-bold">{mass.toFixed(1)} M_☉</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="10.0"
            step="0.2"
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="w-full accent-[#0059e8] bg-slate-200 rounded-lg cursor-pointer h-2"
          />
        </div>

        {/* Accretion Disk Toggle */}
        <div className="sm:col-span-6 flex items-center justify-between sm:justify-end gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-slate-800 hover:text-slate-900 font-semibold">
            <input
              type="checkbox"
              checked={showAccretion}
              onChange={(e) => setShowAccretion(e.target.checked)}
              className="accent-[#0059e8] rounded cursor-pointer w-4 h-4"
            />
            <span className="text-[11px]">Accretion Disk Doppler Boost</span>
          </label>
        </div>

      </div>

      {/* Formula & Method Note */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
        <div className="text-slate-900 font-bold">Relativistic Ray-Tracing Formulation:</div>
        <div className="text-slate-800 font-medium">
          $\hat&#123;\alpha&#125; = \frac&#123;4GM&#125;&#123;c^2 b&#125;$ · Einstein Ring Radius: $\theta_E = \sqrt&#123;\frac&#123;4GM&#125;&#123;c^2&#125; \frac&#123;D_&#123;LS&#125;&#125;&#123;D_L D_S&#125;&#125;$
        </div>
        <div className="text-slate-700 text-[10px] font-medium">
          Simulates null geodesic bending around a static Schwarzschild metric with Keplerian accretion velocities.
        </div>
      </div>

    </div>
  );
};
