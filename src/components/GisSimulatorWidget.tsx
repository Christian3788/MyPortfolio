import React, { useState } from 'react';
import { Database, MapPin, Gauge, ToggleLeft, ToggleRight, Sparkles, Code2 } from 'lucide-react';

export const GisSimulatorWidget: React.FC = () => {
  const [useGistIndex, setUseGistIndex] = useState(true);
  const [radiusMeters, setRadiusMeters] = useState(5000);
  const [selectedCoord, setSelectedCoord] = useState<{ x: number; y: number }>({ x: 180, y: 75 });
  const [showSql, setShowSql] = useState(false);

  // Lat / Lng simulation around Kisumu, Kenya (-0.0917, 34.7680)
  const lat = (-0.0917 + (selectedCoord.y - 75) * 0.001).toFixed(4);
  const lng = (34.7680 + (selectedCoord.x - 180) * 0.001).toFixed(4);

  // Query performance simulation
  const queryTime = useGistIndex ? '3.12ms' : '118.40ms';
  const polygonsScanned = useGistIndex ? '14 bounding leaves' : '45,200 polygons (Full Seq Scan)';

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
    const y = Math.max(20, Math.min(rect.height - 20, e.clientY - rect.top));
    setSelectedCoord({ x, y });
  };

  return (
    <div className="rounded-xl bg-[#07080c] border border-white/[0.08] p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>PostGIS GiST Spatial Engine Simulator</span>
        </div>
        <button
          onClick={() => setShowSql(!showSql)}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          <Code2 className="w-3 h-3" />
          <span>{showSql ? 'Hide SQL' : 'View SQL Query'}</span>
        </button>
      </div>

      {/* Coordinate Canvas */}
      <div
        onClick={handleCanvasClick}
        className="relative w-full h-36 bg-[#040508] rounded-lg border border-white/[0.06] overflow-hidden cursor-crosshair group select-none"
      >
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Hazard Polygons */}
        <div className="absolute top-4 left-8 w-28 h-20 rounded-[40%_60%_70%_30%] bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-[10px] text-rose-400 font-mono pointer-events-none">
          Flood Hazard Zone
        </div>
        <div className="absolute bottom-3 right-12 w-32 h-16 rounded-[60%_40%_30%_70%] bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[10px] text-amber-400 font-mono pointer-events-none">
          Urban Heat Island
        </div>

        {/* Selected Radius Ring */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400/60 bg-indigo-500/10 pointer-events-none transition-all duration-150"
          style={{
            left: `${selectedCoord.x}px`,
            top: `${selectedCoord.y}px`,
            width: `${(radiusMeters / 10000) * 120}px`,
            height: `${(radiusMeters / 10000) * 120}px`,
          }}
        />

        {/* Pin */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none text-indigo-400"
          style={{ left: `${selectedCoord.x}px`, top: `${selectedCoord.y}px` }}
        >
          <MapPin className="w-4 h-4 fill-indigo-500 drop-shadow-md" />
        </div>

        {/* Helper Hint */}
        <div className="absolute bottom-2 left-2 text-[10px] text-slate-500 font-mono pointer-events-none">
          Click anywhere to trigger ST_DWithin spatial intersect
        </div>
      </div>

      {/* SQL Preview Box */}
      {showSql && (
        <div className="p-2.5 rounded bg-black/50 border border-white/[0.04] text-[11px] font-mono text-slate-300">
          <span className="text-slate-500">-- PostGIS Query Execution</span>
          <br />
          SELECT id, hazard_level FROM urban_vulnerability_layers
          <br />
          WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint({lng}, {lat}), 4326)::geography, {radiusMeters});
        </div>
      )}

      {/* Controls & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Toggle GiST Index */}
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
          <div className="text-[11px]">
            <span className="text-slate-400 block font-mono">GiST R-Tree Index</span>
            <span className={`font-semibold ${useGistIndex ? 'text-emerald-400' : 'text-amber-400'}`}>
              {useGistIndex ? 'ENABLED (Optimal)' : 'DISABLED (Seq Scan)'}
            </span>
          </div>
          <button
            onClick={() => setUseGistIndex(!useGistIndex)}
            className="text-slate-300 hover:text-white"
          >
            {useGistIndex ? (
              <ToggleRight className="w-6 h-6 text-indigo-500" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-500" />
            )}
          </button>
        </div>

        {/* Radius Slider */}
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Radius (ST_DWithin)</span>
            <span className="text-white font-semibold">{radiusMeters / 1000}km</span>
          </div>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={radiusMeters}
            onChange={(e) => setRadiusMeters(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Benchmark Result */}
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 block font-mono">Query Execution Time</span>
            <span className={`text-sm font-bold font-mono ${useGistIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
              {queryTime}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block font-mono">Scan Strategy</span>
            <span className="text-[11px] text-slate-300 font-mono">
              {useGistIndex ? 'Index Scan' : 'Seq Scan'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
