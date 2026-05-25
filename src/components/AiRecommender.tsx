import React, { useState } from "react";
import { Vehicle } from "../types";
import { Sparkles, Brain, Cpu, Disc, Calendar, ArrowRight, Activity, Globe } from "lucide-react";

interface AiRecommenderProps {
  onRecommendationReceived: (veh: Vehicle) => void;
  onViewInShowcase: (veh: Vehicle) => void;
}

export default function AiRecommender({
  onRecommendationReceived,
  onViewInShowcase,
}: AiRecommenderProps) {
  // Questionnaire States
  const [driveStyle, setDriveStyle] = useState<string>("Autonomous Lounge");
  const [preferTerrain, setPreferTerrain] = useState<string>("Orbital Highways");
  const [fuelSource, setFuelSource] = useState<string>("Dark Matter Reactor");
  const [visualTone, setVisualTone] = useState<string>("Cyber Stealth");

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>("");
  const [recommendedVehicle, setRecommendedVehicle] = useState<Vehicle | null>(null);
  const [apiSource, setApiSource] = useState<string>("");

  const drivingStyles = [
    "Sub-warp High Velocity",
    "Autonomous Lounge & Comfort",
    "Kinetic Offroad Drifting",
    "Interstellar Interceptor Precision",
  ];

  const terrainOptions = [
    "Orbital Skyways & Low-G Highways",
    "Molten Magma Dunes & Extreme Elements",
    "Sub-oceanic Deep Pressures",
    "Hyper-Grid Digital Race Tracks",
  ];

  const fuelOptions = [
    "Dark Matter Reactor Core",
    "Solar Fusion Sphere Collectors",
    "Compressed Hydrogen Plasmas",
    "Quantum Vacuum Fluctuations",
  ];

  const visualToneAuras = [
    "Cyber Stealth (Vantablack mesh with neon accents)",
    "Cosmic Lounge (Dynamic liquid steel chrome luxury)",
    "Hyper Drive (Aggressive glowing core fighter build)",
  ];

  const triggerLoaderStages = () => {
    const stages = [
      "Accessing Gemini High-Dimensional API Core...",
      "Tuning sub-atomic speed matrices for driving style...",
      "Configuring plasma reactor stability constraints...",
      "Mapping holographic aura signature layers...",
      "Rendering recommended futuristic chassis vector mesh..."
    ];
    
    let current = 0;
    setLoadingStage(stages[current]);
    
    const interval = setInterval(() => {
      current++;
      if (current < stages.length) {
        setLoadingStage(stages[current]);
      } else {
        clearInterval(interval);
      }
    }, 900);

    return () => clearInterval(interval);
  };

  const getRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecommendedVehicle(null);
    const cancelInterval = triggerLoaderStages();

    try {
      const resp = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driveStyle,
          preferTerrain,
          fuelSource,
          visualTone,
        }),
      });

      const data = await resp.json();
      cancelInterval();

      if (data.success) {
        // Create an ID for the recommendation
        const vehWithId: Vehicle = {
          ...data.vehicle,
          id: `rec-${Math.random().toString(36).substring(7)}`,
          // Standardize visualTone for TS matching
          visualTone: data.vehicle.visualTone?.toLowerCase().includes("lounge") 
            ? "Cosmic Lounge" 
            : data.vehicle.visualTone?.toLowerCase().includes("stealth") 
            ? "Cyber Stealth" 
            : "Hyper Drive",
          // Curate dynamic wireframe color based on visual style
          imageColor: data.vehicle.visualTone?.toLowerCase().includes("lounge") 
            ? "#ff00ea" 
            : data.vehicle.visualTone?.toLowerCase().includes("stealth") 
            ? "#00f3ff" 
            : "#ffdd00",
          year: "2092",
          accelerationTime: parseFloat(data.vehicle.specs?.acceleration) || 0.65,
        };

        setRecommendedVehicle(vehWithId);
        setApiSource(data.source);
        onRecommendationReceived(vehWithId);
      }
    } catch (err) {
      console.error("Failed to query recommendation engine:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
      {/* Visual top border indicator */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />

      {/* Title */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 bg-white/5 border border-white/10 rounded-xl">
          <Brain className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h4 className="text-base font-extrabold font-sans text-white tracking-tight flex items-center gap-2 italic">
            AI Quantum Recommender <span className="text-xs font-mono font-medium text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20 tracking-widest uppercase">Gemini 3.5-Flash</span>
          </h4>
          <p className="text-xs font-sans text-white/40 mt-1">
            Synthesize your driving profiles to conjure your ultimate personalized futuristic supercar.
          </p>
        </div>
      </div>

      {!recommendedVehicle && !loading && (
        <form onSubmit={getRecommendations} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Field 1: Drive Style */}
            <div>
              <label className="text-xs font-mono text-white/50 block mb-2 uppercase tracking-widest font-bold">
                1. Driving Style Preference:
              </label>
              <select
                value={driveStyle}
                onChange={(e) => setDriveStyle(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-sm font-sans text-slate-200 outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition duration-300 cursor-pointer"
              >
                {drivingStyles.map((item) => (
                  <option key={item} value={item} className="bg-[#0f0f15]">
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 2: Prefer Terrain */}
            <div>
              <label className="text-xs font-mono text-white/50 block mb-2 uppercase tracking-widest font-bold">
                2. Intended Transit Terrain:
              </label>
              <select
                value={preferTerrain}
                onChange={(e) => setPreferTerrain(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-sm font-sans text-slate-200 outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition duration-300 cursor-pointer"
              >
                {terrainOptions.map((item) => (
                  <option key={item} value={item} className="bg-[#0f0f15]">
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 3: Fuel Catalysts */}
            <div>
              <label className="text-xs font-mono text-white/50 block mb-2 uppercase tracking-widest font-bold">
                3. Propulsion Energy Catalyst:
              </label>
              <select
                value={fuelSource}
                onChange={(e) => setFuelSource(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-sm font-sans text-slate-200 outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition duration-300 cursor-pointer"
              >
                {fuelOptions.map((item) => (
                  <option key={item} value={item} className="bg-[#0f0f15]">
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 4: Visual Tone Aura */}
            <div>
              <label className="text-xs font-mono text-white/50 block mb-2 uppercase tracking-widest font-bold">
                4. Visual Chassis Tone & Aura:
              </label>
              <select
                value={visualTone}
                onChange={(e) => setVisualTone(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-sm font-sans text-slate-200 outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition duration-300 cursor-pointer"
              >
                {visualToneAuras.map((item) => (
                  <option key={item} value={item} className="bg-[#0f0f15]">
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-cyan-400 text-black py-4 rounded-xl text-xs font-mono font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
          >
            <Sparkles className="w-4 h-4 text-yellow-500 animate-spin" />
            Synthesize AI Spec Grid
          </button>
        </form>
      )}

      {/* Full-Screen Cyber AI loader overlay */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="relative w-16 h-16 mb-4">
            <span className="absolute inset-0 border-4 border-cyan-500/10 rounded-full" />
            <span className="absolute inset-0 border-4 border-t-transparent border-l-transparent border-r-cyan-400 border-b-cyan-400 rounded-full animate-spin" />
            <Disc className="w-7 h-7 text-purple-400 absolute top-4.5 left-4.5 animate-pulse" />
          </div>
          <h5 className="text-sm font-mono text-cyan-400 font-bold tracking-widest mb-1 animate-pulse">
            QUANTUM SYNTHESIS ENGAGED
          </h5>
          <p className="text-xs text-white/40 font-mono tracking-wide max-w-xs">{loadingStage}</p>
        </div>
      )}

      {/* Recommended Output Reveal */}
      {recommendedVehicle && (
        <div className="bg-white/[0.015] border border-white/10 rounded-3xl p-6 relative overflow-hidden transition-all duration-500 animate-fade-in">
          {/* Aesthetic background glow corresponding to chassis light matches */}
          <div 
            style={{ backgroundColor: recommendedVehicle.imageColor }} 
            className="absolute top-0 right-0 w-32 h-32 opacity-15 filter blur-[80px] rounded-full pointer-events-none" 
          />

          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-white/5">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Synthesis Matches Complete
              </span>
              <h5 className="text-2xl font-black italic tracking-tighter text-white mt-1 uppercase">
                {recommendedVehicle.name}
              </h5>
              <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/5 mt-1.5 inline-block uppercase">
                Type: {recommendedVehicle.model}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/40 block uppercase tracking-widest">Estimated Valuation</span>
              <span className="text-2xl font-mono font-bold text-cyan-400 tracking-tight">{recommendedVehicle.price}</span>
            </div>
          </div>

          <p className="text-sm text-white/70 font-sans leading-relaxed mb-6">
            {recommendedVehicle.description}
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0d0d0d]/40 p-4 rounded-2xl border border-white/5 mb-5 text-[11px] font-mono">
            <div>
              <span className="text-white/40 block uppercase tracking-wider">ACCELERATION</span>
              <span className="text-cyan-400 font-bold tracking-tight text-xs">{recommendedVehicle.specs.acceleration}</span>
            </div>
            <div>
              <span className="text-white/40 block uppercase tracking-wider">THRUSTER PROPULSION</span>
              <span className="text-white font-medium">{recommendedVehicle.power}</span>
            </div>
            <div>
              <span className="text-white/40 block uppercase tracking-wider">AUTOPILOT INTELLIGENCE</span>
              <span className="text-white font-medium">{recommendedVehicle.specs.coPilots}</span>
            </div>
            <div>
              <span className="text-white/40 block uppercase tracking-wider">WARP CAPACITY</span>
              <span className="text-white font-medium">{recommendedVehicle.speed}</span>
            </div>
          </div>

          {/* Personalized match explanation */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-6">
            <h6 className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Core Resonance Signature:
            </h6>
            <p className="text-xs font-sans text-white/80 leading-relaxed italic">
              "{recommendedVehicle.reason}"
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-between items-center text-xs font-mono">
            <span className="text-[10px] text-white/30 uppercase flex items-center gap-1 font-bold">
              <Activity className="w-3.5 h-3.5 text-cyan-400" /> API: {apiSource === "gemini-ai" ? "Gemini Neural Core" : "Profile Hybrid Cache"}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setRecommendedVehicle(null)}
                className="px-4 py-2 bg-[#0d0d0d] hover:bg-white hover:text-black border border-white/10 rounded-xl text-white/60 hover:text-white transition duration-200 cursor-pointer font-bold uppercase tracking-widest text-[10px]"
              >
                Synthesize Another
              </button>
              <button
                onClick={() => onViewInShowcase(recommendedVehicle)}
                className="px-5 py-2.5 bg-cyan-400 text-black rounded-xl font-bold transition duration-200 flex items-center gap-1 cursor-pointer uppercase tracking-widest text-[10px] hover:bg-white"
              >
                Inspect in 3D <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
