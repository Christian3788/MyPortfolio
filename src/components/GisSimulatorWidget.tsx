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
    <div className="rounded-xl bg-white border border-slate-200/90 p-4 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <Database className="w-3.5 h-3.5 text-[#0059e8]" />
          <span>PostGIS GiST Spatial Engine Simulator</span>
        </div>
        <button
          onClick={() => setShowSql(!showSql)}
          className="text-xs text-[#0059e8] hover:text-[#0048c4] flex items-center gap-1 cursor-pointer font-medium"
        >
          <Code2 className="w-3 h-3" />
          <span>{showSql ? 'Hide SQL' : 'View SQL Query'}</span>
        </button>
      </div>

      {/* Coordinate Canvas */}
      <div
        onClick={handleCanvasClick}
        className="relative w-full h-36 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden cursor-crosshair group select-none shadow-inner"
      >
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415525_1px,transparent_1px),linear-gradient(to_bottom,#33415525_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Hazard Polygons */}
        <div className="absolute top-4 left-8 w-28 h-20 rounded-[40%_60%_70%_30%] bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-[10px] text-rose-300 font-mono pointer-events-none">
          Flood Hazard Zone
        </div>
        <div className="absolute bottom-3 right-12 w-32 h-16 rounded-[60%_40%_30%_70%] bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-[10px] text-amber-300 font-mono pointer-events-none">
          Urban Heat Island
        </div>

        {/* Selected Radius Ring */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0059e8]/80 bg-[#0059e8]/15 pointer-events-none transition-all duration-150"
          style={{
            left: `${selectedCoord.x}px`,
            top: `${selectedCoord.y}px`,
            width: `${(radiusMeters / 10000) * 120}px`,
            height: `${(radiusMeters / 10000) * 120}px`,
          }}
        />

        {/* Pin */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[#0059e8]"
          style={{ left: `${selectedCoord.x}px`, top: `${selectedCoord.y}px` }}
        >
          <MapPin className="w-4 h-4 fill-[#0059e8] text-white drop-shadow-md" />
        </div>

        {/* Helper Hint */}
        <div className="absolute bottom-2 left-2 text-[10px] text-slate-700 font-mono font-medium pointer-events-none">
          Click anywhere to trigger ST_DWithin spatial intersect
        </div>
      </div>

      {/* SQL Preview Box */}
      {showSql && (
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-200">
          <span className="text-slate-300 font-bold">-- PostGIS Query Execution</span>
          <br />
          SELECT id, hazard_level FROM urban_vulnerability_layers
          <br />
          WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint({lng}, {lat}), 4326)::geography, {radiusMeters});
        </div>
      )}

      {/* Controls & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Toggle GiST Index */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="text-[11px]">
            <span className="text-slate-700 block font-mono font-semibold">GiST R-Tree Index</span>
            <span className={`font-bold ${useGistIndex ? 'text-emerald-700' : 'text-amber-800'}`}>
              {useGistIndex ? 'ENABLED (Optimal)' : 'DISABLED (Seq Scan)'}
            </span>
          </div>
          <button
            onClick={() => setUseGistIndex(!useGistIndex)}
            className="text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            {useGistIndex ? (
              <ToggleRight className="w-6 h-6 text-[#0059e8]" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-500" />
            )}
          </button>
        </div>

        {/* Radius Slider */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-700 font-medium">Radius (ST_DWithin)</span>
            <span className="text-slate-900 font-bold">{radiusMeters / 1000}km</span>
          </div>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={radiusMeters}
            onChange={(e) => setRadiusMeters(Number(e.target.value))}
            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0059e8]"
          />
        </div>

        {/* Benchmark Result */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-700 block font-mono font-medium">Query Execution Time</span>
            <span className={`text-sm font-bold font-mono ${useGistIndex ? 'text-emerald-700' : 'text-rose-700'}`}>
              {queryTime}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-700 block font-mono font-medium">Scan Strategy</span>
            <span className="text-[11px] text-slate-900 font-mono font-bold">
              {useGistIndex ? 'Index Scan' : 'Seq Scan'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
