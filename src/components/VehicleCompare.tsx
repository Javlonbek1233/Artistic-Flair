import React, { useState } from "react";
import { Vehicle } from "../types";
import { PRELOADED_VEHICLES } from "../data";
import { Check, Columns, Sparkles, Scale, RefreshCw } from "lucide-react";

interface VehicleCompareProps {
  externalSelected?: Vehicle | null;
}

export default function VehicleCompare({ externalSelected }: VehicleCompareProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    externalSelected ? [PRELOADED_VEHICLES[0].id, externalSelected.id] : [PRELOADED_VEHICLES[0].id, PRELOADED_VEHICLES[1].id]
  );

  // Sync external selections if provided
  React.useEffect(() => {
    if (externalSelected && !selectedIds.includes(externalSelected.id)) {
      setSelectedIds((prev) => {
        if (prev.length >= 3) {
          return [prev[1], prev[2], externalSelected.id];
        } else {
          return [...prev, externalSelected.id];
        }
      });
    }
  }, [externalSelected]);

  const toggleSelection = (vId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(vId)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter((id) => id !== vId);
      }
      if (prev.length >= 3) {
        // Shift out the first selection to keep max 3
        return [...prev.slice(1), vId];
      }
      return [...prev, vId];
    });
  };

  const getVehiclesToCompare = () => {
    const list = PRELOADED_VEHICLES.filter((v) => selectedIds.includes(v.id));
    if (externalSelected && selectedIds.includes(externalSelected.id) && !list.some(v => v.id === externalSelected.id)) {
      list.push(externalSelected);
    }
    return list;
  };

  const comparedVehicles = getVehiclesToCompare();

  // Custom helper to render clean percentage bars
  const renderSpecBar = (label: string, val: number, max: number, color: string) => {
    const percentage = Math.min((val / max) * 100, 100);
    return (
      <div className="space-y-1.5 mt-2">
        <div className="flex justify-between text-[11px] font-mono text-white/40">
          <span>{label}</span>
          <span className="font-bold" style={{ color }}>
            {percentage.toFixed(0)}% Rating
          </span>
        </div>
        <div className="w-full h-1 bg-[#050505] rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
      {/* Absolute aura lights */}
      <div className="absolute top-0 left-12 w-32 h-32 bg-cyan-500/10 rounded-full filter blur-[80px]" />

      {/* Title */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
        <div>
          <h4 className="text-base font-extrabold font-sans text-white tracking-tight flex items-center gap-2 italic">
            <Scale className="w-5 h-5 text-cyan-400" /> Quantum Matrix Comparison
          </h4>
          <p className="text-xs font-sans text-white/40 mt-1">
            Compare warp capacity, quantum engine load efficiency, and co-pilot neural specs.
          </p>
        </div>
        <span className="text-[10px] font-mono text-white/40 bg-[#0d0d0d] border border-white/10 px-3 py-1.5 rounded-xl uppercase tracking-widest font-bold">
          Compare up to 3 cars
        </span>
      </div>

      {/* Step A: Selection list */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white/[0.015] p-3.5 rounded-2xl border border-white/5 max-h-32 overflow-y-auto">
        {PRELOADED_VEHICLES.map((v) => {
          const isSelected = selectedIds.includes(v.id);
          return (
            <button
              key={v.id}
              onClick={() => toggleSelection(v.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 border flex items-center gap-1.5 cursor-pointer font-bold ${
                isSelected
                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                  : "bg-[#0d0d0d] border-white/5 text-white/40 hover:border-white/20 hover:text-white"
              }`}
            >
              {isSelected ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
              {v.name}
            </button>
          );
        })}
        {externalSelected && (
          <button
            key={externalSelected.id}
            onClick={() => toggleSelection(externalSelected.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 border flex items-center gap-1.5 cursor-pointer font-bold ${
              selectedIds.includes(externalSelected.id)
                ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                : "bg-[#0d0d0d] border-white/5 text-white/40 hover:border-white/20 hover:text-white"
            }`}
          >
            {selectedIds.includes(externalSelected.id) ? (
              <Check className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            )}
            [AI Synth] {externalSelected.name}
          </button>
        )}
      </div>

      {/* Step B: Comparison Side-by-Side Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {comparedVehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white/[0.015] border border-white/10 rounded-3xl p-5 flex flex-col justify-between relative"
          >
            <div 
              style={{ backgroundColor: v.imageColor }} 
              className="absolute top-0 right-0 w-20 h-20 opacity-[0.05] filter blur-[50px] rounded-full pointer-events-none" 
            />

            <div>
              {/* Card top */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  {v.model}
                </span>
                <span className="text-[10px] font-mono font-bold text-white/55 px-2 py-0.5 bg-[#050505] rounded border border-white/5">
                  {v.year}
                </span>
              </div>

              {/* Vehicle Title */}
              <h5 className="text-xl font-sans font-black uppercase text-white mb-1.5 italic tracking-tighter">{v.name}</h5>
              <span className="text-lg font-mono font-bold" style={{ color: v.imageColor }}>
                {v.price}
              </span>

              {/* Quantitative spec comparisons mapping */}
              <div className="mt-4 space-y-3.5 pb-4 border-b border-white/5">
                {/* 1. Velocity (Warp/Mach speed multiplier) */}
                {renderSpecBar(
                  "Velocity Index (Warp / Mach)",
                  v.speed.includes("Mach") ? parseFloat(v.speed.split(" ")[1]) * 18 : 65,
                  100,
                  v.imageColor
                )}

                {/* 2. Acceleration Quotient (the lower the seconds, the higher the rating) */}
                {renderSpecBar(
                  "Hyper acceleration Rating",
                  100 - (v.accelerationTime * 40),
                  100,
                  v.imageColor
                )}

                {/* 3. Autopilot IQ */}
                {renderSpecBar(
                  "Autonomous Pilot IQ Core",
                  v.specs.coPilots.includes("Ares") ? 98 : v.specs.coPilots.includes("Elysia") ? 92 : 88,
                  100,
                  v.imageColor
                )}
              </div>

              {/* Textual spec comparison detail logs */}
              <div className="mt-4 space-y-3 text-[11px] font-mono select-none">
                <div>
                  <span className="text-white/30 block uppercase tracking-wider">PROPULSION CORE</span>
                  <span className="text-slate-300 font-medium">{v.power}</span>
                </div>
                <div>
                  <span className="text-white/30 block uppercase tracking-wider">TOTAL EXPEDITION RANGE</span>
                  <span className="text-slate-300 font-medium">{v.range}</span>
                </div>
                <div>
                  <span className="text-white/30 block uppercase tracking-wider">NAVIGATION SYSTEM</span>
                  <span className="text-slate-300 font-medium">{v.specs.coPilots}</span>
                </div>
                <div>
                  <span className="text-white/30 block uppercase tracking-wider">DRIVING MODE SUSPENSION</span>
                  <span className="text-slate-300 font-medium">{v.specs.driveMode}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleSelection(v.id)}
              className="w-full py-2 mt-5 bg-[#0d0d0d] hover:bg-white hover:text-black border border-white/10 text-white/50 text-[10px] font-mono rounded-xl transition cursor-pointer"
            >
              Remove comparison
            </button>
          </div>
        ))}

        {/* Filler panel for comparison placeholders */}
        {comparedVehicles.length < 3 && (
          <div className="bg-white/[0.005] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-6 h-auto min-h-[350px] border-2">
            <Columns className="w-8 h-8 text-white/10 mb-2 animate-pulse" />
            <h6 className="text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider">
              [EMPTY SLATE MODEL]
            </h6>
            <p className="text-[10px] font-sans text-white/30 max-w-[180px] mt-1.5 leading-relaxed">
              Select an additional spaceship or chassis template from the top list row to compare specifications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
