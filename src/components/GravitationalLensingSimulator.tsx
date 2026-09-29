import React, { useRef, useEffect, useState } from 'react';
import { Atom, Move, RefreshCw } from 'lucide-react';

interface Star {
  x: number;
  y: number;
  radius: number;
  color: string;
}

export const GravitationalLensingSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lensPos, setLensPos] = useState({ x: 250, y: 75 });
  const [isDragging, setIsDragging] = useState(false);
  const starsRef = useRef<Star[]>([]);

  // Generate starfield once
  useEffect(() => {
    const stars: Star[] = [];
    const colors = ['#ffffff', '#e0e7ff', '#c7d2fe', '#fef08a', '#bae6fd'];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * 500,
        y: Math.random() * 160,
        radius: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    starsRef.current = stars;
  }, []);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Deep space background
    ctx.fillStyle = '#04050a';
    ctx.fillRect(0, 0, w, h);

    // Render background grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
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

    const einsteinRadius = 36;
    const einsteinRadiusSq = einsteinRadius * einsteinRadius;

    // Deflect and draw each star
    starsRef.current.forEach((star) => {
      const dx = star.x - lensPos.x;
      const dy = star.y - lensPos.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      if (dist < 4) return; // Inside event horizon

      // Gravitational deflection vector: theta = 4GM / (c^2 * r)
      const deflection = (einsteinRadiusSq / (distSq + 20));
      const defX = star.x + dx * deflection * 0.45;
      const defY = star.y + dy * deflection * 0.45;

      ctx.beginPath();
      ctx.arc(defX, defY, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.shadowColor = star.color;
      ctx.shadowBlur = dist < einsteinRadius * 1.5 ? 6 : 1;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Einstein Ring / Photon Sphere boundary
    ctx.beginPath();
    ctx.arc(lensPos.x, lensPos.y, einsteinRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Event Horizon (Black hole core)
    const grad = ctx.createRadialGradient(lensPos.x, lensPos.y, 2, lensPos.x, lensPos.y, 14);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(0.8, '#000000');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.beginPath();
    ctx.arc(lensPos.x, lensPos.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle accretion glow
    ctx.beginPath();
    ctx.arc(lensPos.x, lensPos.y, 16, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [lensPos]);

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
    const x = Math.max(20, Math.min(rect.width - 20, (e.clientX - rect.left) * (500 / rect.width)));
    const y = Math.max(20, Math.min(rect.height - 20, (e.clientY - rect.top) * (160 / rect.height)));
    setLensPos({ x, y });
  };

  return (
    <div className="rounded-xl bg-[#07080c] border border-white/[0.08] p-4 space-y-3">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Atom className="w-3.5 h-3.5 text-indigo-400" />
          <span>Schwarzschild Gravitational Lensing Simulator</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Move className="w-3 h-3 text-slate-500" />
          <span>Drag mass ({Math.round(lensPos.x)}, {Math.round(lensPos.y)})</span>
        </div>
      </div>

      <div className="relative w-full rounded-lg overflow-hidden border border-white/[0.06] cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          width={500}
          height={160}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-36 object-cover block"
        />
        <div className="absolute bottom-2 left-2 text-[10px] text-slate-500 font-mono pointer-events-none">
          Click and drag the central gravitational singularity to bend background star trajectories
        </div>
      </div>
    </div>
  );
};
