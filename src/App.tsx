import React, { useState } from "react";
import { PRELOADED_VEHICLES } from "./data";
import { Vehicle } from "./types";
import ThreeCarShowcase from "./components/ThreeCarShowcase";
import SpeedDashboard from "./components/SpeedDashboard";
import AiRecommender from "./components/AiRecommender";
import LiveAuctions from "./components/LiveAuctions";
import VehicleCompare from "./components/VehicleCompare";
import BookingForm from "./components/BookingForm";
import { Cpu, Film, Hammer, Calendar, Scale, Sparkles, Orbit, Compass, Clock, ShieldCheck, Zap } from "lucide-react";

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(PRELOADED_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(PRELOADED_VEHICLES[0]);
  
  // Custom states shared between ThreeCarShowcase and SpeedDashboard
  const [neonPower, setNeonPower] = useState<number>(80);
  const [warpFactor, setWarpFactor] = useState<number>(2);

  const [activeTab, setActiveTab] = useState<"showroom" | "ai" | "auctions" | "compare" | "booking">("showroom");
  const [purchaseNotice, setPurchaseNotice] = useState<{ price: number; name: string } | null>(null);

  // When AI recomends a new futuristic car, append it to list so others can compare or showcase it
  const handleNewAiRecommendation = (newVeh: Vehicle) => {
    setVehicles((prev) => {
      if (prev.some((v) => v.name === newVeh.name)) return prev;
      return [newVeh, ...prev];
    });
    setSelectedVehicle(newVeh);
  };

  const handlePurchaseConfirmed = (price: number, veh: Vehicle) => {
    setPurchaseNotice({ price, name: veh.name });
    setTimeout(() => {
      setPurchaseNotice(null);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f7] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white pb-12 antialiased relative">
      {/* Background cinematic mesh layout */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-cyan-500/10 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-purple-600/10 blur-[160px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
      </div>

      {/* Cyber Grid pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.006)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.006)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none z-0" />

      {/* Dynamic Purchase ticker alert */}
      {purchaseNotice && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-black/90 border border-emerald-500/50 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.25)] backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/40">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Quantum Grid Confirmation</span>
              <p className="text-xs font-sans text-white font-medium mt-0.5">
                Stripe cleared: <strong>{purchaseNotice.name}</strong> secured for <strong>{purchaseNotice.price.toLocaleString()} µ</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header section with Dynamic System time */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-10">
          <div>
            <h1 className="text-2xl font-black font-sans tracking-tighter italic text-white">
              AUTO<span className="text-cyan-400">VERSE</span>
            </h1>
            <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase block mt-0.5">
              Omni-Stellar Hypercar Matrix
            </span>
          </div>
          <div className="hidden md:flex space-x-6 text-[11px] uppercase tracking-[0.2em] font-bold text-white/50">
            <span>Market</span>
            <span className="text-white/20">|</span>
            <span>Est. 2077</span>
          </div>
        </div>

        {/* Dynamic wallet balance and information */}
        <div className="flex items-center space-x-8">
          <div className="text-right">
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Wallet Credits Balance</div>
            <div className="text-sm font-mono text-cyan-400 font-bold">Ξ 452.84M</div>
          </div>
          <div className="w-10 h-10 rounded-full border border-cyan-400/50 flex items-center justify-center bg-cyan-400/10 shadow-[0_0_15px_rgba(34,211,238,0.25)]">
            <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Cinematic tabs control bar */}
      <nav className="relative z-10 max-w-7xl w-full mx-auto px-6 mt-6 select-none">
        <div className="bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl flex flex-wrap gap-1 md:gap-2 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("showroom")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono tracking-widest font-bold uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "showroom"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                : "bg-transparent text-white/50 hover:text-white border border-transparent"
            }`}
          >
            <Film className="w-4 h-4" /> Showroom & Engine
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono tracking-widest font-bold uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "ai"
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                : "bg-transparent text-white/50 hover:text-white border border-transparent"
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" /> AI Generator
          </button>
          <button
            onClick={() => setActiveTab("auctions")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono tracking-widest font-bold uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "auctions"
                ? "bg-pink-500/10 text-pink-400 border border-pink-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]"
                : "bg-transparent text-white/50 hover:text-white border border-transparent"
            }`}
          >
            <Hammer className="w-4 h-4" /> Live Auctions
          </button>
          <button
            onClick={() => setActiveTab("compare")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono tracking-widest font-bold uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "compare"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                : "bg-transparent text-white/50 hover:text-white border border-transparent"
            }`}
          >
            <Scale className="w-4 h-4" /> Spec Matrix
          </button>
          <button
            onClick={() => setActiveTab("booking")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono tracking-widest font-bold uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "booking"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                : "bg-transparent text-white/50 hover:text-white border border-transparent"
            }`}
          >
            <Calendar className="w-4 h-4" /> Flight Bookings
          </button>
        </div>
      </nav>

      {/* Primary layout container */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 mt-8 flex-grow">
        
        {/* TAB 1: SHOWROOM */}
        {activeTab === "showroom" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left side: Vehicle selection column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4 font-bold">
                  Select Active Spaceship:
                </h3>

                <div className="space-y-3.5">
                  {vehicles.map((v) => {
                    const isActive = selectedVehicle.id === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicle(v)}
                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer relative ${
                          isActive
                            ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                            : "bg-white/[0.015] border-white/5 hover:border-cyan-500/30"
                        }`}
                      >
                        {/* Selected overlay neon line */}
                        {isActive && (
                          <div
                            style={{ backgroundColor: v.imageColor }}
                            className="absolute top-0 bottom-0 left-0 w-[3px] rounded-l"
                          />
                        )}

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">
                              {v.model}
                            </span>
                            <h4 className="text-base font-extrabold text-white mt-1 italic tracking-tight">
                              {v.name}
                            </h4>
                          </div>
                          <span
                            style={{ color: v.imageColor }}
                            className="text-xs font-mono font-bold"
                          >
                            {v.price}
                          </span>
                        </div>

                        <p className="text-[11px] text-white/60 mt-2 line-clamp-2 leading-relaxed font-sans">
                          {v.description}
                        </p>

                        <div className="flex justify-between text-[9px] font-mono text-white/40 items-center mt-3 pt-3 border-t border-white/5">
                          <span>SPEED: {v.speed}</span>
                          <span style={{ color: v.imageColor }} className="font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3" /> ACTIVE SHOW
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right side: Three.js and Dashboard speed settings */}
            <div className="lg:col-span-8 flex flex-col space-y-6">
              {/* Artistic Display Header with huge metallic outlines in theme styles */}
              <div className="space-y-2 mb-2 animate-fade-in h-32 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 border border-cyan-500/30 bg-cyan-500/5 rounded-full w-fit">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-cyan-400">Featured Active Hypercar</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none uppercase">
                  {selectedVehicle.name.split(" ")[0]} <span className="text-transparent stroke-cyan-400" style={{ WebkitTextStroke: "1px rgba(34,211,238,0.5)" }}>
                    {selectedVehicle.name.split(" ").slice(1).join(" ") || "POWERUNIT"}
                  </span>
                </h1>
              </div>

              <ThreeCarShowcase
                selectedVehicle={selectedVehicle}
                neonPower={neonPower}
                warpFactor={warpFactor}
              />
              <SpeedDashboard
                warpFactor={warpFactor}
                setWarpFactor={setWarpFactor}
                neonPower={neonPower}
                setNeonPower={setNeonPower}
              />
            </div>
          </div>
        )}

        {/* TAB 2: AI RECOMMENDATIONS */}
        {activeTab === "ai" && (
          <div className="animate-fade-in space-y-6">
            <AiRecommender
              onRecommendationReceived={handleNewAiRecommendation}
              onViewInShowcase={(veh) => {
                setSelectedVehicle(veh);
                setActiveTab("showroom");
              }}
            />
            {/* Static tip overlay */}
            <div className="p-4 bg-white/[0.015] border border-white/10 rounded-2xl text-xs font-sans text-white/40 flex items-center gap-3">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse flex-shrink-0" />
              <span>
                <strong>System Information:</strong> Custom AI models generated using the Gemini interface will automatically resolve inside the <strong>Showroom Selector</strong> list above, allowing full real-time interactive 3D customizations.
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE AUCTIONS */}
        {activeTab === "auctions" && (
          <div className="animate-fade-in">
            <LiveAuctions onVehiclePurchase={handlePurchaseConfirmed} />
          </div>
        )}

        {/* TAB 4: VEHICLE COMPARISON */}
        {activeTab === "compare" && (
          <div className="animate-fade-in">
            <VehicleCompare externalSelected={selectedVehicle} />
          </div>
        )}

        {/* TAB 5: TEST DRIVE BOOKINGS */}
        {activeTab === "booking" && (
          <div className="animate-fade-in">
            <BookingForm vehicles={vehicles} />
          </div>
        )}

      </main>

      {/* Futuristic Artistic Flair signature Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
        <div>System Sector: <span className="text-cyan-400 font-bold">Optimal</span></div>
        <div className="flex gap-6">
          <a href="#terms" className="hover:text-cyan-400 transition-colors">Terms of Ownership</a>
          <a href="#licensing" className="hover:text-cyan-400 transition-colors">Crypto Licensing</a>
          <a href="#transport" className="hover:text-cyan-400 transition-colors">Global Transport Matrix</a>
        </div>
        <div>© 2077 AutoVerse Systems</div>
      </footer>
    </div>
  );
}
