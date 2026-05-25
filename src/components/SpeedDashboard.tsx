import React, { useState, useEffect } from "react";
import { Gauge, Zap, Flame, Cpu, ShieldAlert, Award } from "lucide-react";

interface SpeedDashboardProps {
  warpFactor: number;
  setWarpFactor: (val: number) => void;
  neonPower: number;
  setNeonPower: (val: number) => void;
}

export default function SpeedDashboard({
  warpFactor,
  setWarpFactor,
  neonPower,
  setNeonPower,
}: SpeedDashboardProps) {
  const [speedVal, setSpeedVal] = useState<number>(1240 * warpFactor);
  const [tachometer, setTachometer] = useState<number>(4200 * warpFactor * 0.8);
  const [isOverdrive, setIsOverdrive] = useState<boolean>(false);
  const [thermals, setThermals] = useState<number>(45);

  // Synchronize speed numerical values based on warpFactor
  useEffect(() => {
    let targetSpeed = warpFactor * 1240 + Math.random() * 80;
    let targetRPM = warpFactor * 4200 * 0.85 + Math.random() * 200;
    
    // Animate smoothly to target values
    const interval = setInterval(() => {
      setSpeedVal((prev) => {
        const diff = targetSpeed - prev;
        return Math.floor(prev + diff * 0.15);
      });
      setTachometer((prev) => {
        const diff = targetRPM - prev;
        return Math.floor(prev + diff * 0.15);
      });
      setThermals((prev) => {
        const base = 40 + warpFactor * 11;
        const jitter = Math.sin(Date.now() / 1000) * 1.5;
        return Math.floor(base + jitter);
      });
    }, 60);

    return () => clearInterval(interval);
  }, [warpFactor]);

  const handleGearSelect = (gear: number) => {
    setWarpFactor(gear);
    if (gear === 5) {
      setIsOverdrive(true);
    } else {
      setIsOverdrive(false);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
      {/* Visual background atmospheric mesh */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-semibold font-mono text-white/80 uppercase tracking-widest italic font-bold">
            Quantum Speed Engine Dash
          </h4>
        </div>
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          SYS-MONITOR ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Sub-Panel 1: The Radial Needle Simulation Meter */}
        <div className="md:col-span-12 lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white/[0.015] rounded-3xl border border-white/5 relative">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Curved Gauge SVG Indicator */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="65"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="408"
                strokeDashoffset="102" // 3/4 circle
                strokeLinecap="round"
              />
              <circle
                cx="80"
                cy="80"
                r="65"
                stroke={isOverdrive ? "#ff00ea" : "#00f3ff"}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="408"
                strokeDashoffset={408 - (warpFactor / 5) * 306} // dynamic based on speed ratio
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>

            {/* Speeds display in absolute center */}
            <div className="text-center z-10">
              <span className="text-4xl font-mono font-black italic tracking-tighter text-white block">
                {speedVal.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase font-bold block mt-1">
                KM/S GLIDE
              </span>
            </div>
          </div>

          <div className="w-full mt-4 flex justify-between text-[11px] font-mono text-white/40 px-2 select-none">
            <span>DOCK (0)</span>
            <span>WARP LEV ({warpFactor})</span>
            <span>MAX ({isOverdrive ? "OVER" : "5.0"})</span>
          </div>
        </div>

        {/* Sub-Panel 2: Gear Selector and Stats Grid */}
        <div className="md:col-span-12 lg:col-span-7 flex flex-col gap-6">
          {/* Dynamic Gear Selection Matrix */}
          <div>
            <label className="text-xs font-mono text-white/50 block mb-2 tracking-wider">
              Select Dimension Warp Drive Gear:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((gear) => (
                <button
                  key={gear}
                  onClick={() => handleGearSelect(gear)}
                  className={`py-3 rounded-xl border font-mono text-sm font-bold transition-all duration-300 relative overflow-hidden cursor-pointer ${
                    warpFactor === gear
                      ? gear === 5
                        ? "bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-pink-500 text-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.25)]"
                        : "bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      : "bg-white/[0.015] border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                  }`}
                >
                  G-{gear}
                  {gear === 5 && (
                    <span className="absolute top-0 right-1 text-[8px] font-bold text-pink-400 animate-pulse">
                      ⚡
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Realtime metrics dashboard */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.015] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">
                  Reactor RPM
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {(tachometer / 1000).toFixed(1)}k <span className="text-xs text-amber-400">rad/s</span>
                </span>
              </div>
            </div>

            <div className="bg-white/[0.015] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
              <Flame className="w-5 h-5 text-rose-500 flex-shrink-0 animate-pulse" />
              <div>
                <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">
                  Temp Sign
                </span>
                <span className={`text-sm font-mono font-bold ${thermals > 85 ? "text-rose-400" : "text-white"}`}>
                  {thermals}°C {thermals > 85 && "ALERT"}
                </span>
              </div>
            </div>
          </div>

          {/* Underlight Neon power adjusting sliders */}
          <div className="p-4 bg-white/[0.025] border border-white/5 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-white/60 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Underlight Glow Power:
              </span>
              <span className="text-cyan-400 font-bold">{neonPower}% MW</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={neonPower}
              onChange={(e) => setNeonPower(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
